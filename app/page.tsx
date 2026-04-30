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
  const [isSidebarOpen, setSidebarOpen] = useState(false); // NEW: For mobile toggle

  const [sessions, setSessions] = useState([
    { 
      id: '1', 
      title: 'Percakapan Baru', 
      messages: [{ role: 'assistant', content: 'Assalamu’alaikum. Ada hal yang ingin dikonsultasikan hari ini?' }] 
    }
  ]);
  const [activeSessionId, setActiveSessionId] = useState('1');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
        setIsAuthLoading(false);
      }
    };
    checkUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const isInitialState = activeSession.messages.length === 1;

  const quickPrompts = [
    { label: "Tentang Sabar", icon: "🌱" },
    { label: "Mencari Ketenangan", icon: "🌊" },
    { label: "Urusan Rezeki", icon: "💰" },
    { label: "Keluarga", icon: "🏠" }
  ];

  const saveToLibrary = async (content: string, messageId: string) => {
    setIsSaving(messageId);
    const { error } = await supabase
      .from('library_items')
      .insert([{
          title: `Refleksi Chat ${new Date().toLocaleDateString('id-ID')}`,
          content: content,
          category: 'AI Reflection',
          user_id: user?.id 
      }]);
    if (error) { alert("Gagal menyimpan: " + error.message); setIsSaving(null); } 
    else { setTimeout(() => setIsSaving(null), 1500); }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const currentInput = input;
    
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return { 
          ...s, 
          title: isInitialState ? (currentInput.substring(0, 30)) : s.title,
          messages: [...s.messages, { role: 'user', content: currentInput }] 
        };
      }
      return s;
    }));

    setInput('');
    setIsLoading(true);

    try {
      // Logic for the brain
      const aiReflection = await getStagedReflection(currentInput);
      setSessions(prev => prev.map(s => s.id === activeSessionId ? {
        ...s, messages: [...s.messages, { role: 'assistant', content: aiReflection }]
      } : s));
    } catch (error) {
      console.error("AI Error:", error);
      setSessions(prev => prev.map(s => s.id === activeSessionId ? {
        ...s, messages: [...s.messages, { role: 'assistant', content: 'Maaf, Taskin sedang beristirahat sejenak.' }]
      } : s));
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A78BFA] animate-pulse">Memverifikasi Identitas...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-white text-[#1E1B4B] overflow-hidden font-sans">
      
      {/* --- MOBILE HEADER (NEW) --- */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#EDE9FE] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#582CBE] rounded-lg flex items-center justify-center text-white font-bold">T</div>
          <span className="font-serif font-bold text-lg">TASKIN</span>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-[#582CBE]">
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* --- SIDEBAR (Responsive) --- */}
      <aside className={`
        ${isSidebarOpen ? "fixed inset-0 z-50 flex" : "hidden"} 
        md:relative md:flex md:w-64 bg-[#F9FAFB] flex-col shrink-0 border-r border-[#EDE9FE]
      `}>
        <div className="w-64 bg-[#F9FAFB] h-full flex flex-col">
          <div className="p-6 shrink-0 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-[#582CBE] rounded-[12px] flex items-center justify-center text-white font-bold">T</div>
               <span className="font-serif font-bold text-xl tracking-tight">TASKIN</span>
            </div>
            {/* Close button for mobile inside sidebar */}
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400">✕</button>
          </div>

          <div className="px-6 space-y-1.5">
            <button 
              onClick={() => {
                const newId = Date.now().toString();
                setSessions([{ id: newId, title: 'Percakapan Baru', messages: [{ role: 'assistant', content: 'Assalamu’alaikum.' }] }, ...sessions]);
                setActiveSessionId(newId);
                setSidebarOpen(false); // Close menu on mobile
              }}
              className="flex items-center gap-3 w-full p-2.5 rounded-xl text-xs font-semibold text-[#1E1B4B] hover:bg-[#F3F4F6] transition-all"
            >
              + Chat baru
            </button>
            <Link href="/library" className="flex items-center gap-3 w-full p-2.5 rounded-xl text-xs font-semibold hover:bg-[#F3F4F6]">Koleksi Saya</Link>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
            <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest">Riwayat</p>
            {sessions.map(s => (
              <button key={s.id} onClick={() => { setActiveSessionId(s.id); setSidebarOpen(false); }}
                className={`w-full text-left p-2.5 rounded-xl text-[11px] truncate ${activeSessionId === s.id ? 'bg-white shadow-sm text-[#582CBE]' : 'text-[#6B7280]'}`}
              >
                {s.title}
              </button>
            ))}
          </div>

          <div className="p-6 border-t border-[#EDE9FE]/30">
            <button onClick={handleLogout} className="w-full p-2.5 rounded-xl text-xs font-bold text-[#EF4444] hover:bg-red-50">Keluar</button>
          </div>
        </div>
        {/* Backdrop for mobile */}
        <div className="flex-1 bg-black/20 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      </aside>

      {/* --- MAIN INTERFACE --- */}
      <main className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
        <header className="px-6 md:px-10 py-5 flex justify-between items-center shrink-0 border-b border-[#F9FAFB]">
           <h2 className="text-[10px] font-bold text-[#A78BFA] uppercase tracking-[0.3em]">Taskin Spiritual AI</h2>
           <div className="flex items-center gap-3">
             <span className="hidden md:block text-[10px] font-bold text-[#1E1B4B]">{user?.email}</span>
             <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-[#582CBE] to-[#A78BFA] shadow-md"></div>
           </div>
        </header>

        <div className={`flex-1 overflow-y-auto px-6 md:px-10 flex flex-col no-scrollbar ${isInitialState ? 'justify-start pt-[5vh] md:pt-[10vh]' : 'justify-start pt-10 pb-40'}`}>
          <div className="w-full max-w-3xl mx-auto">
            {isInitialState ? (
              <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700">
                <div className="space-y-1">
                  <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1E1B4B] leading-tight">
                    Assalamu’alaikum, {user?.email?.split('@')[0] || 'Ananda'}.
                  </h1>
                </div>

                <div className="bg-[#F9FAFB] rounded-3xl border border-[#EDE9FE] p-3 shadow-sm">
                  <textarea value={input} onChange={(e) => setInput(e.target.value)}
                    placeholder="Tanyakan Taskin AI..."
                    className="w-full bg-transparent px-4 md:px-6 py-4 text-base md:text-lg outline-none min-h-[120px] resize-none"
                  />
                  <div className="flex justify-between items-center px-4 pb-2">
                    <button onClick={handleSend} disabled={!input.trim() || isLoading} className="ml-auto p-3 bg-[#582CBE] text-white rounded-2xl">
                      {isLoading ? "..." : "Send"}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 md:gap-3">
                  {quickPrompts.map((chip) => (
                    <button key={chip.label} onClick={() => setInput(chip.label)} className="px-4 py-2 bg-white border rounded-full text-[10px] font-bold">
                      {chip.icon} {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8 md:space-y-12 pb-20">
                {activeSession.messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 md:gap-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#582CBE] flex items-center justify-center text-white shrink-0">✨</div>}
                    <div className={`max-w-[90%] md:max-w-[85%] ${msg.role === 'user' ? 'bg-[#F3F4F6] px-4 md:px-6 py-3 md:py-4 rounded-2xl' : 'text-[#1E1B4B]'}`}>
                      <div className={msg.role === 'assistant' ? "font-serif text-lg md:text-xl whitespace-pre-wrap" : "text-sm md:text-base"}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- STICKY FOOTER --- */}
        {!isInitialState && (
          <footer className="absolute bottom-0 left-0 w-full px-4 md:px-10 pb-6 md:pb-10 pt-4 bg-gradient-to-t from-white via-white to-transparent">
            <div className="max-w-3xl mx-auto">
               <div className="bg-white rounded-2xl border border-[#EDE9FE] p-2 shadow-2xl">
                  <div className="flex items-center">
                    <textarea value={input} onChange={(e) => setInput(e.target.value)}
                      placeholder="Apa lagi yang mengganjal?"
                      className="w-full bg-transparent px-4 py-2 outline-none resize-none min-h-[44px]"
                      rows={1}
                    />
                    <button onClick={handleSend} disabled={!input.trim() || isLoading} className="p-3 bg-[#582CBE] text-white rounded-xl">
                      {isLoading ? "..." : "Send"}
                    </button>
                  </div>
               </div>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
}