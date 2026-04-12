---
title: "feat: 简化架构快速上线"
type: refactor
status: completed
date: 2026-04-13
---

# 简化架构快速上线

## Overview

移除 Supabase 数据库依赖，改为纯静态 Mock 数据，实现"2周上线MVP"目标。数据库增删改查、API 路由、点击上报、评论功能全部暂时移除，仅保留首页展示和详情页浏览。

## Problem Frame

当前架构虽已实现 Supabase + Mock 双模式，但：
- Supabase 环境变量未配置时逻辑分支多，容易埋入 bug
- API 路由（reviews/clicks）增加了部署复杂度
- 数据库 schema 需要额外管理工作
- MVP 阶段不需要动态数据，纯静态页面足够

**目标**：砍掉一切非必要基础设施，专注 P0 功能快速上线。

## Scope Boundaries

**不包含（后续迭代）**：
- 用户评论功能（ReviewForm/ReviewList）
- 点击上报（api/clicks）
- 死链检测功能
- Supabase 数据库集成
- 动态数据管理

## Context & Research

### 当前架构

```
src/
├── lib/
│   ├── types.ts          # Tool, Review 类型定义
│   ├── mock-data.ts      # 8个测评的静态数据
│   ├── supabase.ts       # Supabase 客户端（要删除）
│   └── db.ts             # 数据库访问层（要简化）
├── components/
│   ├── ToolCard.tsx
│   ├── ToolCTA.tsx       # 有 api/clicks 调用（要移除）
│   ├── ReviewForm.tsx    # 依赖 Supabase（要移除）
│   ├── ReviewList.tsx    # 依赖 Supabase（要移除）
│   └── HomePageClient.tsx
├── app/
│   ├── page.tsx          # 首页
│   ├── tools/[slug]/     # 详情页
│   └── api/
│       ├── reviews/      # 评论 API（要删除）
│       └── clicks/       # 点击上报 API（要删除）
└── supabase/
    └── schema.sql        # 数据库 schema（要删除）
```

### 现有 Mock 数据

`src/lib/mock-data.ts` 已有 8 个测评的完整静态数据，覆盖 SBTI、MBTI、趣味人格、职业、情感 5 个分类。

## Key Technical Decisions

- **决策**：MVP 阶段使用纯静态 Mock 数据，删除所有 Supabase 相关代码
- **原因**：快速上线、零数据库运维成本、SEO 友好
- **后续**：v1.1 可通过 `NEXT_PUBLIC_SUPABASE_URL` 环境变量恢复数据库功能

## Implementation Units

- [ ] **Unit 1: 删除 Supabase 客户端和数据库访问层**

**Goal:** 删除 `supabase.ts`，简化 `db.ts` 为纯 Mock 数据封装

**Requirements:** R1（简化架构）

**Files:**
- Delete: `src/lib/supabase.ts`
- Modify: `src/lib/db.ts` — 移除 Supabase 相关逻辑，改为纯 Mock 封装

**Approach:**
- `db.ts` 中的 `isSupabaseConfigured()` 检查全部移除
- 所有函数直接调用 `mock-data.ts` 的函数
- 保留 `getTools()`, `getToolBySlug()`, `getHotTools()`, `getLatestTools()`, `getTopRatedTools()` 等接口不变

**Test scenarios:**
- Test expectation: none — 纯重构无功能变更

**Verification:**
- `src/app/page.tsx` 和 `src/app/tools/[slug]/page.tsx` 仍能正常渲染

---

- [ ] **Unit 2: 删除 API 路由**

**Goal:** 删除评论和点击上报 API，减少部署复杂度

**Requirements:** R1

**Files:**
- Delete: `src/app/api/reviews/route.ts`
- Delete: `src/app/api/clicks/route.ts`
- Delete: `src/app/api/` 目录（若为空）

**Approach:**
- MVP 不需要这些 API，直接删除

**Test scenarios:**
- Test expectation: none — 纯删除

**Verification:**
- `next build` 不报错

---

- [ ] **Unit 3: 删除评论相关组件**

**Goal:** 移除依赖 Supabase 的评论组件

**Requirements:** R1

**Files:**
- Delete: `src/components/ReviewForm.tsx`
- Delete: `src/components/ReviewList.tsx`

**Approach:**
- 详情页中的评论区整体移除（`isSupabaseConfigured()` 条件渲染）

**Test scenarios:**
- Test expectation: none — 纯删除

**Verification:**
- `src/app/tools/[slug]/page.tsx` 中不再引用 ReviewForm/ReviewList
- `next build` 不报错

---

- [ ] **Unit 4: 简化 ToolCTA 组件**

**Goal:** 移除 ToolCTA 中的点击上报逻辑

**Requirements:** R1

**Files:**
- Modify: `src/components/ToolCTA.tsx` — 移除 `logToolClick` 调用，简化为纯跳转按钮

**Approach:**
- ToolCTA 目前调用 `api/clicks` 记录点击，MVP 阶段移除
- 改为纯 `<a href={url} target="_blank">` 样式的主按钮

**Patterns to follow:**
- 保留现有的 UI 样式，只移除 JS 交互逻辑

**Test scenarios:**
- Happy path: 点击按钮能正常跳转外部链接

**Verification:**
- 详情页 CTA 按钮显示正常，点击能打开测评链接

---

- [ ] **Unit 5: 删除 Supabase schema 文件**

**Goal:** 移除数据库 schema 文档（不再需要）

**Requirements:** R1

**Files:**
- Delete: `supabase/schema.sql`（若存在）
- 检查 `supabase/` 目录是否还有其他文件

**Approach:**
- 直接删除整个 `supabase/` 目录

**Test scenarios:**
- Test expectation: none

**Verification:**
- 目录已删除

---

- [ ] **Unit 6: 清理 types.ts 中的冗余类型**

**Goal:** 移除 Review、ReviewSummary、LinkCheckResult 等不再使用的类型

**Requirements:** R1

**Files:**
- Modify: `src/lib/types.ts` — 移除 `Review`, `ReviewSummary`, `LinkCheckResult` 接口

**Approach:**
- `Tool` 类型保留
- `Article`、`CATEGORIES` 保留（SEO 文章和分类筛选用到）
- 删除 `Review`、`ReviewSummary`、`LinkCheckResult`

**Patterns to follow:**
- 保留必要的类型，删除死代码

**Test scenarios:**
- Test expectation: none — 清理无功能变更

**Verification:**
- `next build` 不报错
- `tsc --noEmit` 无错误

---

- [ ] **Unit 7: 验证构建和本地预览**

**Goal:** 确保简化后项目仍能正常构建和运行

**Requirements:** R1

**Dependencies:** Unit 1-6 完成

**Files:**
- 无文件变更

**Approach:**
- `pnpm build` 验证构建
- `pnpm dev` 启动本地服务器
- 手动访问首页和详情页确认功能正常

**Test scenarios:**
- Happy path: 首页加载，显示测评列表
- Happy path: 详情页加载，显示测评信息
- Happy path: 分类筛选正常工作
- Happy path: 排序功能正常工作

**Verification:**
- `pnpm build` 成功
- 浏览器访问 http://localhost:3000 正常显示

## System-Wide Impact

- **Interaction graph:** 移除 `ReviewForm` → `api/reviews`，`ToolCTA` → `api/clicks` 的调用链
- **Error propagation:** 不再有任何 API 调用，静态数据错误直接显示在页面上
- **State lifecycle risks:** 无状态，纯 SSR 渲染
- **API surface parity:** API 路由全删，对外无任何 API 契约
- **Integration coverage:** 无第三方集成
- **Unchanged invariants:** 页面 UI、Mock 数据内容完全不变

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| 评论功能被误删 | v1.1 会通过 `NEXT_PUBLIC_SUPABASE_URL` 恢复 |
| 静态数据不够用 | Mock 数据已覆盖 5 个分类 8 个测评，足够 MVP |
| SEO 影响 | 无影响，纯 SSR 渲染，SEO 友好 |

## Documentation / Operational Notes

- **Supabase 恢复**：v1.1 阶段，在 `.env.local` 设置 `NEXT_PUBLIC_SUPABASE_URL` 和 `SUPABASE_SERVICE_ROLE_KEY` 后，重新启用数据库功能
- **评论功能**：v1.1 恢复 `ReviewForm`/`ReviewList` 组件
- **schema 位置**：恢复时参考 git history 中的 `supabase/schema.sql`

## Sources & References

- **Origin document:** `SBTI导航站PRD.md`
- Related code: `src/lib/mock-data.ts`
