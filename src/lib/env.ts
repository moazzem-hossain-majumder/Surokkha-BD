export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Supabase now issues "publishable" keys (sb_publishable_...) as the modern
  // replacement for the legacy anon JWT key; both are safe for the browser and
  // work identically here. Accept either env var name so a project created
  // with the new key naming (NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) doesn't
  // silently fail just because it's not named NEXT_PUBLIC_SUPABASE_ANON_KEY.
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}
