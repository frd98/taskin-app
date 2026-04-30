type EnvKey =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "GEMINI_API_KEY";

// We use a simpler helper that doesn't crash the browser
function getEnv(value: string | undefined, key: string): string {
  if (!value || value.trim().length === 0) {
    // Only error out if we are on the server or if it's a critical public key
    if (typeof window === 'undefined' || key.startsWith('NEXT_PUBLIC_')) {
       console.error(`❌ Environment Variable Missing: ${key}`);
    }
    return '';
  }
  return value;
}

export const env = {
  // We write the names out fully here so Next.js can "see" them
  NEXT_PUBLIC_SUPABASE_URL: getEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  SUPABASE_SERVICE_ROLE_KEY: getEnv(process.env.SUPABASE_SERVICE_ROLE_KEY, "SUPABASE_SERVICE_ROLE_KEY"),
  GEMINI_API_KEY: getEnv(process.env.GEMINI_API_KEY, "GEMINI_API_KEY"),
};

// Keep this for compatibility, but we make it "quieter" on the client side
export function validateEnv() {
  if (typeof window === 'undefined') {
    if (!env.NEXT_PUBLIC_SUPABASE_URL) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
    if (!env.NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
}