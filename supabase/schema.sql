-- ============================================================
-- SBTI Tools Hub — Supabase Schema
-- ============================================================

-- 启用 UUID 生成
create extension if not exists "pgcrypto";

-- ============================================================
-- Table: tools（测评工具，替代 mock-data）
-- ============================================================
create table if not exists public.tools (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  icon        text not null default '🧠',
  cover_image text not null,
  description text not null,
  long_description text,
  tags        text[] not null default '{}',
  category    text not null check (category in ('sbti','mbti','fun-personality','career','relationship')),
  question_count int not null default 0,
  duration    int not null default 5,
  audience    text[] not null default '{}',
  url         text not null,
  is_sbti     boolean not null default false,
  is_hidden   boolean not null default false,
  score       numeric(2,1) not null default 0 check (score >= 0 and score <= 5),
  review_count int not null default 0,
  view_count  int not null default 0,
  click_count int not null default 0,
  status      text not null default 'pending' check (status in ('pending','approved','rejected')),
  is_available boolean not null default true,
  last_checked_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 自动更新 updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tools_updated_at
  before update on public.tools
  for each row execute function public.handle_updated_at();

-- RLS
alter table public.tools enable row level security;
create policy "Public read approved tools"
  on public.tools for select
  using (status = 'approved');
create policy "Service role full access"
  on public.tools for all
  using (auth.role() = 'service_role');

-- ============================================================
-- Table: reviews（用户评价）
-- ============================================================
create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  tool_id    uuid not null references public.tools(id) on delete cascade,
  score      int not null check (score >= 1 and score <= 5),
  comment    text not null,
  ip_hash    text,  -- 简单反作弊：hash(ip+user_agent)
  created_at timestamptz not null default now()
);

-- 评价后自动更新 tools 表的评分和评价数
create or replace function public.update_tool_review_stats()
returns trigger as $$
declare
  new_avg numeric(2,1);
  new_count int;
begin
  -- 重新计算平均分
  select round(avg(score)::numeric, 1), count(*)
  into new_avg, new_count
  from public.reviews
  where tool_id = new.tool_id;

  update public.tools
  set score = coalesce(new_avg, 0),
      review_count = new_count
  where id = new.tool_id;

  return new;
end;
$$ language plpgsql security definer;

create trigger after_review_insert
  after insert on public.reviews
  for each row execute function public.update_tool_review_stats();

-- RLS
alter table public.reviews enable row level security;
create policy "Public read reviews"
  on public.reviews for select using (true);
create policy "Anyone can insert review"
  on public.reviews for insert with check (true);

-- ============================================================
-- Table: tool_clicks（点击日志，用于热度追踪）
-- ============================================================
create table if not exists public.tool_clicks (
  id         uuid primary key default gen_random_uuid(),
  tool_id    uuid not null references public.tools(id) on delete cascade,
  referer    text,
  utm_source text,
  ip_hash    text,
  created_at timestamptz not null default now()
);

-- 每天汇总到 tools.click_count
create or replace function public.aggregate_daily_clicks()
returns trigger as $$
begin
  update public.tools
  set click_count = (
    select count(*)::int from public.tool_clicks
    where tool_id = new.tool_id
      and created_at > now() - interval '30 days'
  )
  where id = new.tool_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger after_click_insert
  after insert on public.tool_clicks
  for each row execute function public.aggregate_daily_clicks();

-- RLS
alter table public.tool_clicks enable row level security;
create policy "Public can log clicks"
  on public.tool_clicks for insert with check (true);
create policy "Service role read"
  on public.tool_clicks for select using (auth.role() = 'service_role');

-- ============================================================
-- Table: link_checks（死链检测记录）
-- ============================================================
create table if not exists public.link_checks (
  id          uuid primary key default gen_random_uuid(),
  tool_id     uuid not null references public.tools(id) on delete cascade,
  url         text not null,
  is_available boolean,
  status_code int,
  error_msg   text,
  checked_at  timestamptz not null default now()
);

-- 检测后更新 tools 的可用性
create or replace function public.update_tool_availability()
returns trigger as $$
begin
  update public.tools
  set is_available = new.is_available,
      last_checked_at = new.checked_at
  where id = new.tool_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger after_link_check
  after insert on public.link_checks
  for each row execute function public.update_tool_availability();

-- ============================================================
-- 初始数据：从 mock-data 导入（手动执行一次即可）
-- ============================================================
-- INSERT INTO public.tools (name, slug, icon, cover_image, description, tags, category,
--   question_count, duration, audience, url, is_sbti, is_hidden, score, review_count, view_count, status)
-- VALUES ...
