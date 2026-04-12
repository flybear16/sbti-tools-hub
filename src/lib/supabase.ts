import { createClient } from '@supabase/supabase-js'

// 环境变量检查
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 客户端（浏览器端使用，仅暴露 anon key）
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// 服务端管理客户端（拥有 service_role key，有完全访问权限）
// 仅在 .env.local 中设置，不暴露给浏览器
export const supabaseAdmin = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, {
    auth: { persistSession: false }
  })
})()

// 便捷检查：是否已配置 Supabase
export const isSupabaseConfigured = () => !!supabase && !!supabaseAdmin
