'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getStagedReflection } from '@/lib/gemini';

export default function Home() {
  const supabase = createClient();
  const router = useRouter();
  
  // --- AUTH & IDENTITY STATE ---
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

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

  // --- CHECK AUTHENTICATION ON LOAD ---
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login'); // Redirect to login if not authenticated
      } else {
        setUser(user);
        setIsAuthLoading(false);
      }
    };
    checkUser();
  }, [router, supabase]);

  // --- LOGOUT FUNCTION ---
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

  // --- SAVE TO LIBRARY LOGIC ---
  const saveToLibrary = async (content: string, messageId: string) => {
    setIsSaving(messageId);
    
    const { error } = await supabase
      .from('library_items')
      .insert([
        {
          title: `Refleksi Chat ${new Date().toLocaleDateString('id-ID')}`,
          content: content,
          category: 'AI Reflection',
          user_id: user?.id // Associate with real user ID
        }
      ]);

    if (error) {
      alert("Gagal menyimpan: " + error.message);
      setIsSaving(null);
    } else {
      setTimeout(() => setIsSaving(null), 1500);
    }
  };

  // --- HANDLE SEND ---
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
      const aiReflection = await getStagedReflection(currentInput);

      setSessions(prev => prev.map(s => s.id === activeSessionId ? {
        ...s, messages: [...s.messages, { role: 'assistant', content: aiReflection }]
      } : s));
    } catch (error) {
      console.error("AI Error:", error);
      setSessions(prev => prev.map(s => s.id === activeSessionId ? {
        ...s, messages: [...s.messages, { role: 'assistant', content: 'Maaf, Taskin sedang beristirahat sejenak. Namun ingatlah, sesungguhnya setiap kesulitan datang bersama kemudahan.' }]
      } : s));
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent UI flash while checking auth
  if (isAuthLoading) {
    return <div className="flex h-screen w-full items-center justify-center bg-white text-[10px] font-bold uppercase tracking-[0.3em] text-[#A78BFA] animate-pulse">Memverifikasi Identitas...</div>;
  }

  return (
    <div className="flex h-screen w-full bg-white text-[#1E1B4B] overflow-hidden font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#F9FAFB] flex flex-col shrink-0 border-r border-[#EDE9FE]">
        <div className="p-6 shrink-0">
          <div className="flex items-center gap-3 mb-10">
             <div className="w-10 h-10 bg-[#582CBE] rounded-[12px] flex items-center justify-center text-white font-bold text-lg shadow-sm">T</div>
             <span className="font-serif font-bold text-xl tracking-tight text-[#1E1B4B]">TASKIN</span>
          </div>

          <div className="space-y-1.5">
            <button 
              onClick={() => {
                const newId = Date.now().toString();
                setSessions([{ id: newId, title: 'Percakapan Baru', messages: [{ role: 'assistant', content: 'Assalamu’alaikum. Ada yang ingin dibahas?' }] }, ...sessions]);
                setActiveSessionId(newId);
              }}
              className="flex items-center gap-3 w-full p-2.5 rounded-xl text-xs font-semibold text-[#1E1B4B] hover:bg-[#F3F4F6] transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Chat baru
            </button>
            <Link href="/library" className="flex items-center gap-3 w-full p-2.5 rounded-xl text-xs font-semibold text-[#1E1B4B] hover:bg-[#F3F4F6] transition-all">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
               Koleksi Saya
            </Link>
            <Link href="/community" className="flex items-center gap-3 w-full p-2.5 rounded-xl text-xs font-semibold text-[#1E1B4B] hover:bg-[#F3F4F6] transition-all">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
               Majelis Hikmah
            </Link>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-1 no-scrollbar border-t border-[#EDE9FE]/30">
          <p className="text-[9px] font-black text-[#9CA3AF] px-3 py-2 uppercase tracking-[0.2em]">Riwayat</p>
          {sessions.map(s => (
            <button 
              key={s.id}
              onClick={() => setActiveSessionId(s.id)}
              className={`w-full text-left p-2.5 rounded-xl text-[11px] font-medium truncate transition-all ${
                activeSessionId === s.id ? 'bg-white shadow-sm text-[#582CBE]' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-[#EDE9FE]/30">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-2.5 rounded-xl text-xs font-bold text-[#EF4444] hover:bg-red-50 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Keluar
          </button>
        </div>
      </aside>

      {/* --- MAIN INTERFACE --- */}
      <main className="flex-1 flex flex-col h-full bg-white relative">
        <header className="px-10 py-5 flex justify-between items-center shrink-0 border-b border-[#F9FAFB]">
           <h2 className="text-[10px] font-bold text-[#A78BFA] uppercase tracking-[0.3em]">Taskin Spiritual AI</h2>
           <div className="flex items-center gap-3">
             <span className="text-[10px] font-bold text-[#1E1B4B]">{user?.email}</span>
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#582CBE] to-[#A78BFA] border-2 border-white shadow-md"></div>
           </div>
        </header>

        <div className={`flex-1 overflow-y-auto px-10 flex flex-col no-scrollbar ${isInitialState ? 'justify-start pt-[10vh]' : 'justify-start pt-10 pb-40'}`}>
          <div className="w-full max-w-3xl mx-auto">
            
            {isInitialState ? (
              /* --- HERO VIEW --- */
              <div className="space-y-10 animate-in fade-in duration-700">
                <div className="space-y-1">
                  <h1 className="text-5xl font-serif font-bold text-[#1E1B4B] tracking-tight leading-tight">
                    Assalamu’alaikum, {user?.email?.split('@')[0] || 'Ananda'}.
                  </h1>
                  <h2 className="text-5xl font-serif font-bold text-[#9CA3AF] opacity-40 leading-tight">
                    Ada hal yang ingin dikonsultasikan?
                  </h2>
                </div>

                <div className="space-y-6 pt-4">
                    <div className="bg-[#F9FAFB] rounded-3xl border border-[#EDE9FE] p-3 focus-within:border-[#582CBE]/30 transition-all shadow-sm">
                      <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder="Tanyakan Taskin AI..."
                        className="w-full bg-transparent px-6 py-4 text-lg outline-none placeholder:text-[#9CA3AF] min-h-[140px] resize-none"
                      />
                      <div className="flex justify-between items-center px-4 pb-2">
                        <div className="flex gap-4">
                          <button className="flex items-center gap-1.5 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest hover:text-[#582CBE]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M11 11H7a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2z"/></svg>
                            Refleksi
                          </button>
                        </div>
                        <button 
                          onClick={handleSend}
                          disabled={!input.trim() || isLoading}
                          className={`p-3 bg-[#582CBE] text-white rounded-2xl shadow-xl transition-all active:scale-95 ${input.trim() ? 'opacity-100' : 'opacity-30'}`}
                        >
                          {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {quickPrompts.map((chip) => (
                        <button 
                          key={chip.label}
                          onClick={() => setInput(chip.label)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#EDE9FE] rounded-full text-[11px] font-bold text-[#4B5563] hover:border-[#582CBE] hover:bg-[#F5F3FF] transition-all shadow-sm"
                        >
                          <span>{chip.icon}</span>
                          {chip.label}
                        </button>
                      ))}
                    </div>
                </div>
              </div>
            ) : (
              /* --- ACTIVE CHAT --- */
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeSession.messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-10 h-10 rounded-xl bg-[#582CBE] flex items-center justify-center text-white shrink-0 shadow-md text-sm">
                        {isLoading && idx === activeSession.messages.length - 1 ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : "✨"}
                      </div>
                    )}
                    <div className={`max-w-[85%] ${
                      msg.role === 'user' 
                      ? 'bg-[#F3F4F6] px-6 py-4 rounded-[1.5rem] rounded-tr-none text-base' 
                      : 'text-[#1E1B4B] pt-2 flex flex-col gap-4'
                    }`}>
                      <div className={msg.role === 'assistant' ? "font-serif text-xl leading-relaxed whitespace-pre-wrap" : "font-medium"}>
                        {msg.content}
                      </div>
                      
                      {msg.role === 'assistant' && (
                        <button 
                          onClick={() => saveToLibrary(msg.content, `msg-${idx}`)}
                          className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] transition-all px-4 py-2 rounded-lg border border-[#EDE9FE] w-fit shadow-sm bg-white ${
                            isSaving === `msg-${idx}` ? 'text-green-500 border-green-100' : 'text-[#A78BFA] hover:text-[#582CBE] hover:border-[#582CBE]/20'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={isSaving === `msg-${idx}` ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                          {isSaving === `msg-${idx}` ? 'Tersimpan' : 'Simpan Hikmah'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && activeSession.messages[activeSession.messages.length - 1].role === 'user' && (
                  <div className="flex gap-6 justify-start animate-pulse">
                    <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] shrink-0"></div>
                    <div className="h-10 w-24 bg-[#F3F4F6] rounded-2xl"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* --- STICKY FOOTER --- */}
        {!isInitialState && (
          <footer className="absolute bottom-0 left-0 w-full px-10 pb-10 pt-4 bg-gradient-to-t from-white via-white to-transparent shrink-0">
            <div className="max-w-3xl mx-auto">
               <div className="bg-white rounded-2xl border border-[#EDE9FE] p-2 shadow-2xl shadow-[#582CBE]/10">
                  <div className="flex items-center px-2">
                    <textarea 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                      placeholder="Apa lagi yang mengganjal di hatimu?"
                      className="w-full bg-transparent px-4 py-4 text-base outline-none resize-none min-h-[56px] max-h-[150px]"
                      rows={1}
                    />
                    <button 
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="p-3 bg-[#582CBE] text-white rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-20 flex items-center justify-center"
                    >
                      {isLoading ? (
                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                      )}
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