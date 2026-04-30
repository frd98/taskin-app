"use client";

import { useState } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";

export default function GuidePage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Maaf, sepertinya ada gangguan pada koneksi hikmah. Coba lagi ya." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh]">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-brand-indigo flex items-center justify-center shadow-lg shadow-brand-indigo/20">
          <Sparkles className="text-white h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">AI Guide Hikmah</h2>
          <p className="text-xs text-brand-indigo font-medium uppercase tracking-wider">Bersandar pada Al-Qur'an & Sunnah</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] glass-card p-5 ${
              msg.role === 'user' 
                ? 'bg-brand-indigo text-white rounded-tr-none' 
                : 'bg-white border-l-4 border-brand-indigo text-slate-700'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass-card p-4 bg-white flex items-center gap-2 text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Mencari hikmah...</span>
            </div>
          </div>
        )}
      </div>

      <div className="glass-card p-2 flex items-center gap-2 border-slate-200">
        <input 
          type="text"
          placeholder="Tanyakan sesuatu..."
          className="flex-1 bg-transparent px-4 py-3 outline-none text-slate-700"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button 
          onClick={handleSendMessage}
          disabled={isLoading}
          className="h-12 w-12 rounded-xl bg-brand-indigo flex items-center justify-center text-white hover:bg-brand-indigo/90 transition-all active:scale-95 disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}