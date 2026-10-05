export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  // Supabase now issues "publishable" keys (sb_publishable_...) as the modern
  // replacement for the legacy anon JWT key; both are safe for the browser and
  // work identically here. Also support standard names injected by Vercel integration.
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}
