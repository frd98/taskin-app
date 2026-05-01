import OpenAI from 'openai';

// 1. Get your SumoPod credentials from environment variables
const apiKey = process.env.NEXT_PUBLIC_SUMOPOD_API_KEY;
const baseURL = "https://ai.sumopod.com/"; // The standard endpoint for SumoPod AI

const aiClient = new OpenAI({
  apiKey: apiKey || "",
  baseURL: baseURL,
  dangerouslyAllowBrowser: true // Allows the browser to talk to SumoPod directly
});

export async function getStagedReflection(prompt: string) {
  try {
    // 2. We are using Qwen 3.6-plus for more spiritual warmth
    // To test GPT-4o, you just change the model string below to "gpt-4o"
    const response = await aiClient.chat.completions.create({
      model: "qwen-3.6-plus", 
      messages: [
        { 
          role: "system", 
          content: `Anda adalah Taskin, asisten spiritual islami modern. 
          Berikan bimbingan yang bijaksana, empatik, dan hanya berdasarkan Al-Qur'an dan Hadits. 
          Gunakan pendekatan yang menyejukkan dan hindari kesan menghakimi.` 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7, // Higher = more creative/poetic
    });

    return response.choices[0].message.content || "Maaf, Taskin sedang merenung.";
  } catch (error) {
    console.error("SumoPod Error:", error);
    return "Terjadi kendala saat menghubungkan ke pusat hikmah.";
  }
}