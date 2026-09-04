import { createBrowserClient } from '@supabase/ssr';

// Use inside Client Components. Reads the anon key + URL that Next.js
// inlines at build time via the NEXT_PUBLIC_ prefix.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
