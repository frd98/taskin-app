import { GoogleGenerativeAI } from "@google/generative-ai";

import { env, validateEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

async function runConnectionChecks() {
  validateEnv();

  const supabase = createAdminClient();
  const { error: supabaseError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1,
  });

  if (supabaseError) {
    return {
      ok: false,
      supabaseMessage: `Failed: ${supabaseError.message}`,
      geminiMessage: "Skipped",
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(
      "Reply with exactly one word: success",
    );
    const text = result.response.text().trim();

    if (!text.toLowerCase().includes("success")) {
      return {
        ok: false,
        supabaseMessage: "Success",
        geminiMessage: `Unexpected response: ${text || "empty"}`,
      };
    }

    return {
      ok: true,
      supabaseMessage: "Success",
      geminiMessage: "Success",
    };
  } catch (error) {
    return {
      ok: false,
      supabaseMessage: "Success",
      geminiMessage: `Failed: ${
        error instanceof Error ? error.message : "Unknown Gemini error"
      }`,
    };
  }
}

export default async function TestConnectionPage() {
  const result = await runConnectionChecks();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6 py-16">
      <section className="glass-card w-full rounded-3xl p-8">
        <h1 className="text-3xl font-semibold text-slate-900">Test Connection</h1>
        <p className="mt-2 text-slate-600">
          Temporary runtime check for Supabase and Gemini.
        </p>

        <div className="mt-8 space-y-4 rounded-2xl border border-white/70 bg-white/80 p-6">
          <p className="text-lg">
            Overall:{" "}
            <span
              className={
                result.ok
                  ? "font-semibold text-emerald-700"
                  : "font-semibold text-rose-700"
              }
            >
              {result.ok ? "Success" : "Failed"}
            </span>
          </p>
          <p className="text-slate-700">Supabase: {result.supabaseMessage}</p>
          <p className="text-slate-700">Gemini: {result.geminiMessage}</p>
        </div>
      </section>
    </main>
  );
}
