import { GoogleGenerativeAI } from "@google/generative-ai";

// Using the public key name we set in Vercel
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  console.error("Critical: NEXT_PUBLIC_GEMINI_API_KEY is missing!");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export async function getStagedReflection(prompt: string) {
  try {
    // UPDATED FOR 2026: Switching from the deprecated 1.5 to 2.5 Flash
    // This model is Generally Available and recognized by the API
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini connection failed:", error);
    // Fallback message for the UI
    return "Maaf, Taskin sedang melakukan kalibrasi sistem. Silakan coba sesaat lagi.";
  }
}