import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/lib/env";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export async function getStagedReflection(prompt: string) {
  // Using the 1.5-flash model for speed and efficiency (MVP style)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemInstruction = `
    Anda adalah Taskin AI, asisten spiritual yang bijaksana. 
    Tugas Anda adalah mendengarkan kegelisahan pengguna dan memberikan refleksi singkat (max 3-4 kalimat).
    Gunakan pendekatan yang menenangkan, berikan perspektif hikmah, 
    dan selipkan satu pesan pendek yang menguatkan dari nilai-nilai spiritual.
    Sapa pengguna sebagai 'Muhammad'.
  `;

  const result = await model.generateContent([systemInstruction, prompt]);
  const response = await result.response;
  return response.text();
}