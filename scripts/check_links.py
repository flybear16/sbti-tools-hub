#!/usr/bin/env python3
"""
死链检测脚本
用法: python scripts/check_links.py [--all]
  --all   检测所有工具（默认只检测链接异常的）
输出: JSON 格式结果，可被 cron job 捕获
"""

import asyncio
import aiohttp
import argparse
import json
import os
import sys
from datetime import datetime, timezone
from urllib.parse import urlparse

# Supabase
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

# 模拟数据（无 Supabase 时使用）
MOCK_TOOLS = [
    {"id": "1", "slug": "sbti-official", "url": "https://example.com/sbti-official"},
    {"id": "2", "slug": "sbti-quick", "url": "https://example.com/sbti-quick"},
    {"id": "3", "slug": "sbti-hidden", "url": "https://example.com/sbti-hidden"},
    {"id": "4", "slug": "mbti-reborn", "url": "https://example.com/mbti-reborn"},
    {"id": "5", "slug": "16types-fun", "url": "https://example.com/16types-fun"},
    {"id": "6", "slug": "career-decoder", "url": "https://example.com/career-decoder"},
    {"id": "7", "slug": "love-matcher", "url": "https://example.com/love-matcher"},
    {"id": "8", "slug": "sbti-en", "url": "https://example.com/sbti-en"},
]

CHECK_TIMEOUT = 10  # 秒


async def check_url(session: aiohttp.ClientSession, tool_id: str, url: str) -> dict:
    """检测单个 URL 是否可用"""
    result = {
        "tool_id": tool_id,
        "url": url,
        "is_available": False,
        "status_code": None,
        "error_msg": None,
        "checked_at": datetime.now(timezone.utc).isoformat(),
    }
    try:
        async with session.head(url, allow_redirects=True, timeout=aiohttp.ClientTimeout(total=CHECK_TIMEOUT)) as resp:
            result["status_code"] = resp.status
            # 2xx 或 3xx 都算可用
            result["is_available"] = 200 <= resp.status < 400
    except asyncio.TimeoutError:
        result["error_msg"] = "TIMEOUT"
    except aiohttp.ClientError as e:
        result["error_msg"] = str(e)
    except Exception as e:
        result["error_msg"] = f"UNEXPECTED:{e}"
    return result


async def fetch_tools_from_supabase() -> list:
    """从 Supabase 获取所有工具"""
    import httpx
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
    }
    resp = httpx.get(
        f"{SUPABASE_URL}/rest/v1/tools?select=id,url,slug&status=neq.rejected",
        headers=headers,
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json()


async def record_check_in_supabase(session: aiohttp.ClientSession, check_result: dict):
    """将检测结果写入 Supabase"""
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }
    payload = {
        "tool_id": check_result["tool_id"],
        "url": check_result["url"],
        "is_available": check_result["is_available"],
        "status_code": check_result["status_code"],
        "error_msg": check_result["error_msg"],
    }
    async with session.post(
        f"{SUPABASE_URL}/rest/v1/link_checks",
        headers=headers,
        json=payload,
    ) as resp:
        # 忽略响应状态，主要记录
        pass


async def update_tool_availability(session: aiohttp.ClientSession, tool_id: str, is_available: bool):
    """更新工具可用性"""
    import httpx
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }
    httpx.patch(
        f"{SUPABASE_URL}/rest/v1/tools?id=eq.{tool_id}",
        headers=headers,
        json={
            "is_available": is_available,
            "last_checked_at": "now()",
        },
        timeout=10,
    )


async def main():
    parser = argparse.ArgumentParser(description="检测测评链接是否可用")
    parser.add_argument("--all", action="store_true", help="检测所有工具（默认只检测未标记为不可用的）")
    parser.add_argument("--quiet", action="store_true", help="减少输出")
    args = parser.parse_args()

    # 获取工具列表
    if SUPABASE_URL and SUPABASE_SERVICE_KEY:
        try:
            tools = await fetch_tools_from_supabase()
            if not args.quiet:
                print(f"✓ 从 Supabase 获取到 {len(tools)} 个工具", file=sys.stderr)
        except Exception as e:
            print(f"✗ Supabase 连接失败，使用模拟数据: {e}", file=sys.stderr)
            tools = MOCK_TOOLS
    else:
        if not args.quiet:
            print("⚠ 未配置 Supabase，使用模拟数据", file=sys.stderr)
        tools = MOCK_TOOLS

    # 过滤（--all 时检测所有）
    to_check = tools if args.all else [t for t in tools if t.get("is_available", True)]

    if not to_check:
        if not args.quiet:
            print("没有需要检测的工具", file=sys.stderr)
        print(json.dumps({"status": "ok", "checked": 0, "unavailable": 0}))
        return

    # 并发检测（限制并发数为 5）
    semaphore = asyncio.Semaphore(5)
    connector = aiohttp.TCPConnector(limit=10)
    timeout = aiohttp.ClientTimeout(total=CHECK_TIMEOUT)

    async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
        async def sem_check(tool):
            async with semaphore:
                return await check_url(session, tool["id"], tool["url"])

        results = await asyncio.gather(*[sem_check(t) for t in to_check], return_exceptions=True)

    # 汇总
    unavailable = [r for r in results if isinstance(r, dict) and not r["is_available"]]
    checked = [r for r in results if isinstance(r, dict)]
    errors = [r for r in results if isinstance(r, Exception)]

    # 写入数据库
    if SUPABASE_URL and SUPABASE_SERVICE_KEY:
        for result in checked:
            try:
                await record_check_in_supabase(session, result)
                await update_tool_availability(session, result["tool_id"], result["is_available"])
            except Exception as e:
                print(f"  写入失败 [{result['tool_id']}]: {e}", file=sys.stderr)

    # 输出结果
    output = {
        "status": "ok",
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "total": len(tools),
        "checked": len(checked),
        "available": len(checked) - len(unavailable),
        "unavailable": len(unavailable),
        "errors": len(errors),
        "unavailable_tools": [
            {"tool_id": r["tool_id"], "url": r["url"], "error": r.get("error_msg") or f"HTTP {r.get('status_code')}"}
            for r in unavailable
        ],
    }

    print(json.dumps(output, ensure_ascii=False, indent=2))

    if unavailable and not args.quiet:
        print("\n⚠ 以下链接不可用:", file=sys.stderr)
        for t in unavailable:
            print(f"  - {t['url']}: {t.get('error_msg') or f'HTTP {t.get('status_code')}'}", file=sys.stderr)


if __name__ == "__main__":
    asyncio.run(main())
