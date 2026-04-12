---
title: "MVP Fast Launch: Pure Static Mock Data Before Database Infrastructure"
date: 2026-04-13
category: docs/solutions/best-practices
module: Frontend Data Layer
problem_type: best_practice
component: development_workflow
severity: medium
applies_when:
  - Building MVP with 2-week time constraint
  - Adding Supabase/Firebase/Parse before runtime credentials are configured
  - Dual-mode data layer (mock + real DB) that ships with mock enabled
tags: [mvp, supabase, mock-data, architecture, fast-launch]
---

# MVP Fast Launch: Pure Static Mock Data Before Database Infrastructure

## Context

When building an MVP with a hard deadline (e.g., 2-week SEO capture window), the instinct to "add database infrastructure early" creates hidden costs. A dual-mode data layer (Supabase+Mock) that ships with the mock branch active accumulates untested dead code, complex branching logic, and a larger refactoring surface than a pure mock approach.

The SBTI 导航站 MVP added Supabase infrastructure including:
- `@supabase/supabase-js` dependency
- `supabase.ts` client with `isSupabaseConfigured()` checks
- Database access layer with dual-mode functions
- API routes for `/api/reviews` and `/api/clicks`
- `ReviewForm` and `ReviewList` components
- Supabase schema with 4 tables (tools, reviews, tool_clicks, link_checks)

All of it was dead code at ship time — the Supabase instance was never provisioned.

## Guidance

**For MVP with a fast-launch window: ship pure static mock data first. Add database infrastructure only when runtime credentials exist.**

### The dual-mode trap

The pattern `if (!isSupabaseConfigured()) return mock;` looks safe but creates problems:

1. **The mock branch is always taken** — the production branch is never exercised until go-live
2. **Dead code accumulates** — Supabase client, schema, API routes, review components all ship but are never tested in the real environment
3. **Refactoring surface is large** — removing dual-mode later requires touching db.ts, types, components, API routes, schema, and dependencies simultaneously
4. **Confusing for future devs** — the codebase looks database-backed but isn't

### The pure mock approach

```typescript
// ✅ Right for MVP: pure mock, no branching
import { MOCK_TOOLS } from './mock-data'
import type { Tool } from './types'

export async function getTools(): Promise<Tool[]> {
  return MOCK_TOOLS.filter(t => t.status === 'approved')
}
```

### The dual-mode approach (avoid for MVP)

```typescript
// ❌ Wrong for MVP: branching logic never tested in production
import { supabaseAdmin, isSupabaseConfigured } from './supabase'

export async function getTools(): Promise<Tool[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_TOOLS.filter(t => t.status === 'approved')
  }
  const { data, error } = await supabaseAdmin!.from('tools').select('*')
  // ... 50 more lines of dual-mode code
}
```

## Why This Matters

- **Speed**: Pure mock requires 1 file (`db.ts` as mock wrapper) + mock data. Dual-mode requires 10+ files and creates migration/refactoring work
- **Reliability**: No untested database code paths at launch
- **Scope**: Removing dead Supabase code in v1.1 takes 20 minutes. Removing it from a production system with real data takes days
- **Complexity**: Dual-mode doubles the code paths that need testing

## When to Apply

- **Apply when**: Launch window is < 3 weeks, no live Supabase credentials exist, core value is content/SEO not user-generated data
- **Defer when**: Auth is required, users must persist state, real data volume exceeds mock capacity, third-party integrations depend on the database

## Examples

### Before (dual-mode — problematic for MVP)

```
src/
├── lib/
│   ├── supabase.ts        ← never tested in production
│   ├── db.ts              ← complex branching, 100+ lines
│   ├── mock-data.ts
│   └── types.ts          ← 3 unused interfaces
├── components/
│   ├── ReviewForm.tsx     ← depends on unconfigured Supabase
│   └── ReviewList.tsx
└── app/api/
    ├── reviews/route.ts   ← dead endpoint
    └── clicks/route.ts   ← dead endpoint
```

### After (pure mock — right for MVP)

```
src/
├── lib/
│   ├── db.ts              ← 50 lines, pure mock wrapper
│   ├── mock-data.ts
│   └── types.ts          ← only Tool and Article interfaces
└── components/
    └── (no Supabase-dependent components)
```

## Related

- **Restore Supabase in v1.1**: Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`, re-add `supabase.ts`, restore review components and API routes
- **Schema location**: Archived in git history at `supabase/schema.sql` (deleted in this refactor)
