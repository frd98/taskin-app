'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getStagedReflection } from '@/lib/gemini';

export default function Home() {
  const supabase = createClient();
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [sessions, setSessions] = useState([
    { id: '1', title: 'Percakapan Baru', messages: [{ role: 'assistant', content: 'Assalamu’alaikum. Ada hal yang ingin dikonsultasikan?' }] }
  ]);
  const [activeSessionId, setActiveSessionId] = useState('1');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/login');
      else { setUser(user); setIsAuthLoading(false); }
    };
    checkUser();
  }, [router, supabase]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const isInitialState = activeSession.messages.length === 1;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const currentInput = input;
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, { role: 'user', content: currentInput }] } : s));
    setInput('');
    setIsLoading(true);
    try {
      const aiReflection = await getStagedReflection(currentInput);
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, { role: 'assistant', content: aiReflection }] } : s));
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  if (isAuthLoading) return <div className="h-screen flex items-center justify-center">Memuat...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-white text-[#1E1B4B] overflow-hidden">
      
      {/* MOBILE HEADER - Only shows on phones */}
      <header className="md:hidden flex items-center justify-between p-4 border-b bg-white z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#582CBE] rounded-lg flex items-center justify-center text-white font-bold">T</div>
          <span className="font-serif font-bold text-lg">TASKIN</span>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-[#582CBE] text-2xl">
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* SIDEBAR - Fixed on Desktop, Overlay on Mobile */}
      <aside className={`
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 fixed md:relative inset-y-0 left-0 w-64 bg-[#F9FAFB] border-r transition-transform duration-300 ease-in-out z-30 md:z-auto flex flex-col
      `}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#582CBE] rounded-xl flex items-center justify-center text-white font-bold">T</div>
            <span className="font-serif font-bold text-xl">TASKIN</span>
          </div>
          <nav className="space-y-2">
            <button onClick={() => { setActiveSessionId(Date.now().toString()); setSidebarOpen(false); }} className="w-full text-left p-2.5 rounded-xl text-xs font-semibold hover:bg-slate-100">+ Chat Baru</button>
            <Link href="/library" className="block p-2.5 rounded-xl text-xs font-semibold hover:bg-slate-100">Koleksi Saya</Link>
          </nav>
        </div>
        <div className="flex-1 overflow-y-auto px-6">
           <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Riwayat</p>
           {sessions.map(s => (
             <button key={s.id} onClick={() => { setActiveSessionId(s.id); setSidebarOpen(false); }} className="w-full text-left text-xs p-2 mb-1 truncate">{s.title}</button>
           ))}
        </div>
      </aside>

      {/* BACKDROP - Click to close menu on mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar">
          <div className="max-w-2xl mx-auto pt-[5vh]">
            
            {isInitialState ? (
              <div className="space-y-8">
                <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">Assalamu’alaikum. Ada yang ingin dibahas?</h1>
                <div className="bg-[#F9FAFB] rounded-3xl border p-4 shadow-sm">
                  <textarea 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tanyakan Taskin AI..."
                    className="w-full bg-transparent p-2 text-lg outline-none min-h-[120px] resize-none"
                  />
                  <div className="flex justify-end">
                    <button onClick={handleSend} disabled={isLoading} className="bg-[#582CBE] text-white px-6 py-2 rounded-2xl font-bold">
                      {isLoading ? "..." : "Kirim"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-10 pb-32">
                {activeSession.messages.map((msg, i) => (
                  <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-slate-100' : 'text-xl font-serif'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* STICKY INPUT (Mobile Footer) */}
        {!isInitialState && (
          <div className="absolute bottom-0 left-0 w-full p-4 md:p-10 bg-gradient-to-t from-white pt-10">
            <div className="max-w-2xl mx-auto bg-white border rounded-2xl p-2 shadow-xl flex items-center">
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-3 outline-none" 
                placeholder="Tulis pesan..."
              />
              <button onClick={handleSend} className="bg-[#582CBE] text-white p-3 rounded-xl">➤</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}