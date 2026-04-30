import { NextResponse } from "next/server";
import { env } from "@/lib/env"; // Import from your validator for consistency

export async function POST(req: Request) {
  // Use the key name your lib/env.ts expects
  const apiKey = env.GEMINI_API_KEY; 
  
  if (!apiKey) return NextResponse.json({ error: "Missing API Key" }, { status: 500 });

  try {
    // We use 'prompt' to match the fetch call in your app/page.tsx
    const { prompt } = await req.json();

    // 2026 STABLE LIST: Prioritizing the newest Gemini 3 Flash
    const attempts = [
      { id: "gemini-3-flash", url: "v1" },
      { id: "gemini-2.0-flash", url: "v1beta" },
      { id: "gemini-1.5-flash-latest", url: "v1" },
      { id: "gemini-1.5-flash", url: "v1beta" }
    ];

    let successResponse = null;

    for (const attempt of attempts) {
      console.log(`🔎 Hunting for model: ${attempt.id} on ${attempt.url}...`);
      
      const API_URL = `https://generativelanguage.googleapis.com/${attempt.url}/models/${attempt.id}:generateContent?key=${apiKey}`;

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Anda adalah TASKIN AI dengan gaya bicara Ustadz Adi Hidayat yang sangat tenang, runut, dan mendalam. Sapa pengguna sebagai 'Ananda'. Berikan nasihat spiritual yang bijak untuk masalah ini: ${prompt}` }] }]
          })
        });

        const data = await response.json();

        if (response.ok && data.candidates) {
          console.log(`🎯 SUCCESS! Found active path: ${attempt.id}`);
          successResponse = data.candidates[0].content.parts[0].text;
          break; 
        } else {
          console.warn(`❌ Model ${attempt.id} failed: ${data.error?.message || "Unknown error"}`);
        }
      } catch (e) {
        continue;
      }
    }

    if (!successResponse) {
      throw new Error("Google AI is still processing your request. Please try again in 30 seconds.");
    }

    return NextResponse.json({ text: successResponse });

  } catch (error: any) {
    console.error("🔴 HUNTER ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}