#!/usr/bin/env python3
"""
SEO 攻略文章生成脚本
为每个测评自动生成攻略文章，输出 markdown 文件
用法: python scripts/generate_articles.py
"""

import os
import json
from datetime import datetime

# 从 mock-data 中提取的工具信息（与 src/lib/mock-data.ts 保持同步）
TOOLS = [
    {
        "slug": "sbti-official",
        "name": "SBTI 官方原版",
        "icon": "🧠",
        "category": "SBTI",
        "questionCount": 48,
        "duration": 8,
        "tags": ["官方", "完整版", "中文"],
        "score": 4.8,
        "description": "SBTI官方出品，权威测评入口，完整版题目+详细报告",
    },
    {
        "slug": "sbti-quick",
        "name": "SBTI 快速版",
        "icon": "⚡",
        "category": "SBTI",
        "questionCount": 12,
        "duration": 3,
        "tags": ["快速", "免费", "中文"],
        "score": 4.5,
        "description": "精简版SBTI，12道题3分钟速测，随时随地测",
    },
    {
        "slug": "sbti-hidden",
        "name": "SBTI 隐藏人格版",
        "icon": "🌙",
        "category": "SBTI",
        "questionCount": 64,
        "duration": 12,
        "tags": ["隐藏人格", "深度分析", "爆红款"],
        "score": 4.9,
        "description": "深度挖掘隐藏人格，测完惊呼「原来我是这种人」",
    },
    {
        "slug": "mbti-reborn",
        "name": "MBTI 重燃版",
        "icon": "✨",
        "category": "MBTI",
        "questionCount": 60,
        "duration": 10,
        "tags": ["MBTI", "经典", "视觉精美"],
        "score": 4.6,
        "description": "MBTI经典复刻，全新视觉+AI增强分析",
    },
    {
        "slug": "16types-fun",
        "name": "16型人格趣味版",
        "icon": "🎮",
        "category": "趣味人格",
        "questionCount": 40,
        "duration": 7,
        "tags": ["趣味", "游戏化", "年轻"],
        "score": 4.4,
        "description": "游戏化测评体验，边玩边测，结果超准",
    },
    {
        "slug": "career-decoder",
        "name": "职业性格解码",
        "icon": "💼",
        "category": "职业测评",
        "questionCount": 50,
        "duration": 9,
        "tags": ["职业", "大五人格", "职场"],
        "score": 4.3,
        "description": "基于大五人格理论，精准定位适合你的职业方向",
    },
    {
        "slug": "love-matcher",
        "name": "情感匹配度测试",
        "icon": "💕",
        "category": "情感测评",
        "questionCount": 30,
        "duration": 5,
        "tags": ["情感", "情侣", "趣味"],
        "score": 4.2,
        "description": "测测你和TA的匹配度，情侣/暗恋都适用",
    },
    {
        "slug": "sbti-en",
        "name": "SBTI 英文国际版",
        "icon": "🌍",
        "category": "SBTI",
        "questionCount": 48,
        "duration": 8,
        "tags": ["英文", "国际版"],
        "score": 4.1,
        "description": "英文原版，原汁原味，适合想练英语的你",
    },
]


ARTICLE_TEMPLATE = """---
title: "{title}"
description: "{meta_description}"
---

# {title}

{intro_paragraph}

## 📋 这篇攻略会告诉你

- {bullet1}
- {bullet2}
- {bullet3}

## 🎯 {tool_name} 是什么

{what_is_it}

## 📝 题目示例（部分）

{question_samples}

## ⏱️ 做完需要多久

约 {duration} 分钟，共 {question_count} 道题。建议找一个不被打扰的时间段完成，结果会更准确。

## 🌟 {tool_name} 特色

{highlights}

## 💡 测完这些人格类型后还能做什么

测完 {tool_name} 后，你可能会对以下话题感兴趣：

- 了解你的性格优势在职场上如何发挥
- 探索与你有相似人格的人都在做什么工作
- 发现更多有趣的人格测试，如[SBTI隐藏人格版](/tools/sbti-hidden)
- 分享你的结果到社交媒体，看看朋友们怎么说

## 📊 数据参考

| 指标 | 数值 |
|------|------|
| 用户评分 | {score}/5.0 |
| 题目数量 | {question_count} 题 |
| 预计耗时 | {duration} 分钟 |
| 适合人群 | {audience} |

## ⚠️ 温馨提示

{tool_name} 仅供娱乐参考，测评结果不代表真实的职业选择或人生决策。请以开放心态看待结果，享受探索自我的过程。

---

*本文最后更新：{updated_at}*
"""


def generate_article(tool: dict) -> str:
    """为单个工具生成攻略文章"""

    category = tool["category"]
    name = tool["name"]
    slug = tool["slug"]
    duration = tool["duration"]
    qc = tool.get("question_count") or tool.get("questionCount", 0)
    score = tool["score"]
    tags = tool["tags"]

    title = f"【完整攻略】{name}怎么测？值得做吗？内附题目示例"

    meta_description = (
        f"全面了解{name}：测评流程、题目示例、结果解读。"
        f"用户评分{score}/5.0，约{qc}题/{duration}分钟。"
        f"想知道自己的人格类型？看看这篇完整攻略。"
    )

    # 根据分类生成不同内容
    if "SBTI" in category or tool["slug"].startswith("sbti"):
        intro = (
            f"SBTI（全称Stimulated Behavioral Type Indicator）是2026年现象级娱乐测评。"
            f"{name}是其中最{'受欢迎' if tool['score'] >= 4.8 else '有特色'}的版本之一，"
            f"已帮助数万名用户发现自己的隐藏人格。"
        )
        what_is = (
            f"{name}通过分析你在特定情境下的选择，"
            f"推导出你的行为偏好和潜在人格特征。不同于传统心理测试，"
            f"SBTI更注重「AI算法」和「娱乐化解读」，让结果既有趣又有参考价值。"
        )
        highlights = (
            "• 题目情境贴近年轻人生活场景，代入感强\n"
            "• AI算法分析，结果因人而异不套路\n"
            "• 配有详细结果报告，不只是简单的人格标签\n"
            "• 支持分享到社交媒体，与朋友对比结果"
        )
        audience = "所有对自我探索感兴趣的人群，尤其18-35岁年轻人"
        bullet1 = f"{name}的具体测评流程是怎样的"
        bullet2 = f"题目大概是什么样的（内附部分示例）"
        bullet3 = f"测完后能得到什么样的结果报告"
        q_samples = (
            "以下为题目类型示例（实际题目更多且有随机性）：\n\n"
            "**情境题**：深夜独自在家，你更倾向？\n"
            "A. 安静刷手机，享受独处时光\n"
            "B. 给朋友发消息，约线上聊天\n\n"
            "**偏好题**：工作中遇到复杂问题，你通常？\n"
            "A. 先整体分析，再逐步解决\n"
            "B. 凭直觉先动手，边做边调整"
        )
    elif "MBTI" in category:
        intro = f"{name}是MBTI（16型人格）的现代复刻版，在保留经典理论框架的基础上，融入了全新的视觉设计和AI增强分析功能。"
        what_is = f"{name}基于卡尔·荣格的心理学理论，将人的性格分为16种类型，每种类型都有其独特的行为模式和发展建议。"
        highlights = "• 全新视觉设计，界面更精美\n• AI辅助分析，结果更个性化\n• 详细的职业发展建议\n• 可与朋友对比结果"
        audience = "对MBTI感兴趣的所有人群，尤其职场人和学生"
        bullet1 = "MBTI与SBTI有什么区别"
        bullet2 = f"{name}的测评体验如何"
        bullet3 = "16型人格各自适合什么职业"
        q_samples = (
            "**判断题**：你认为自己更偏向？\n"
            "A. 理性思考，注重逻辑\n"
            "B. 情感判断，注重人际关系\n\n"
            "**场景题**：周末放假，你更喜欢？\n"
            "A. 安排好行程，井井有条\n"
            "B. 随性而为，看看会发生什么"
        )
    elif "职业" in category:
        intro = f"{name}基于大五人格理论，是目前最科学的职业性格测评之一，已帮助数千人找到适合自己的职业方向。"
        what_is = f"{name}从五个核心维度（开放性、责任心、外向性、宜人性、神经质）分析你的性格特征，并映射到匹配的职业类型。"
        highlights = "• 基于大五人格理论，科学可靠\n• 提供详细的职业匹配建议\n• 适合求职者和转行者\n• 附带发展建议和成长指南"
        audience = "求职者、应届毕业生、有职业转型需求的人群"
        bullet1 = f"{name}的题目设计逻辑是什么"
        bullet2 = "测评结果如何对应到具体职业"
        bullet3 = "测完后应该如何利用结果规划职业"
        q_samples = (
            "**自评题**：我通常能够坚持完成开始的任务\n"
            "A. 非常符合 B. 有点符合 C. 不太符合 D. 完全不符合\n\n"
            "**情境题**：团队项目中，你更倾向于？\n"
            "A. 主动承担领导角色\n"
            "B. 做好自己的部分，配合团队"
        )
    elif "情感" in category:
        intro = f"{name}专为情侣和单身人士设计，通过分析你们的互动模式和价值观契合度，给出关系建议。"
        what_is = f"{name}不仅适合情侣测试，也适合暗恋中的人了解自己在意什么样的伴侣。"
        highlights = "• 适合情侣和单身人士\n• 分析价值观契合度\n• 提供关系建议和沟通技巧"
        audience = "情侣、暗恋中的人群、单身想了解自己择偶偏好的人群"
        bullet1 = "测评会问哪些问题"
        bullet2 = "结果准确吗"
        bullet3 = "如何利用结果改善关系"
        q_samples = (
            "**价值观题**：你认为感情中最重要的是？\n"
            "A. 信任 B. 激情 C. 陪伴 D. 成长\n\n"
            "**行为题**：吵架时你通常？\n"
            "A. 先冷静，再沟通\n"
            "B. 当场说清楚"
        )
    else:  # 趣味人格
        intro = f"{name}是一款融合游戏化设计的趣味人格测试，让你在轻松愉快的体验中发现自己的人格特征。"
        what_is = f"{name}将传统人格测评的严谨性与趣味游戏机制结合，题目设置更活泼，结果也更有娱乐性。"
        highlights = "• 游戏化体验，边玩边测\n• 题目轻松有趣，不枯燥\n• 结果解读深入浅出\n• 适合朋友聚会一起玩"
        audience = "年轻人、学生、喜欢趣味测试的人群"
        bullet1 = f"{name}具体怎么测"
        bullet2 = "有什么特别的题目设计"
        bullet3 = "结果可以分享到哪些平台"
        q_samples = (
            "**趣味选择题**：如果你的性格是一种天气，你觉得自己像？\n"
            "A. 夏日暴雨，来得快去也快\n"
            "B. 春日暖阳，温和稳定\n\n"
            "**场景题**：朋友约你周末去一个新地方，你会？\n"
            "A. 提前查好攻略，准备充分\n"
            "B. 说走就走，随性探索"
        )

    return ARTICLE_TEMPLATE.format(
        title=title,
        meta_description=meta_description,
        tool_name=name,
        intro_paragraph=intro,
        what_is_it=what_is,
        highlights=highlights,
        bullet1=bullet1,
        bullet2=bullet2,
        bullet3=bullet3,
        question_samples=q_samples,
        duration=duration,
        question_count=qc,
        score=score,
        audience=audience,
        updated_at=datetime.now().strftime("%Y-%m-%d"),
    )


def main():
    output_dir = "/home/east/ws2026/sbti-tools/src/app/articles"

    for tool in TOOLS:
        article = generate_article(tool)
        filepath = os.path.join(output_dir, tool["slug"], "page.md")
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(article)
        print(f"✓ 生成: {filepath}")

    # 同时输出一个 JSON 索引，方便 Next.js 读取
    index = {t["slug"]: {"title": f"【完整攻略】{t['name']}怎么测？值得做吗？", "updated": datetime.now().isoformat()} for t in TOOLS}
    index_path = os.path.join(output_dir, "_index.json")
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
    print(f"\n✓ 生成索引: {index_path}")
    print(f"共 {len(TOOLS)} 篇攻略文章")


if __name__ == "__main__":
    main()
