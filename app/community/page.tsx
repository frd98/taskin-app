'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function Community() {
  const supabase = createClient();
  
  // --- STATE ---
  const [shares, setShares] = useState<any[]>([]);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- FORM STATE ---
  const [newPost, setNewPost] = useState({
    user_name: 'Muhammad', 
    category: 'Sabar',
    problem: '',
    solution: ''
  });

  // --- FETCH DATA ---
  const fetchPosts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('hikmah_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setShares(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // --- SUBMIT POST (WITH DEBUGGING) ---
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.problem || !newPost.solution) {
      alert("Mohon isi kegelisahan dan solusi Anda.");
      return;
    }

    console.log("Mengirim data ke Supabase...", newPost);

    const { error } = await supabase
      .from('hikmah_posts')
      .insert([
        {
          user_name: newPost.user_name,
          category: newPost.category,
          problem: newPost.problem,
          solution: newPost.solution,
        }
      ]);

    if (error) {
      // Ini akan memberi tahu kita jika RLS (security) memblokir post
      console.error("Gagal mengirim hikmah:", error.message);
      alert("Gagal mengirim: " + error.message);
    } else {
      console.log("Hikmah berhasil dikirim!");
      setNewPost({ ...newPost, problem: '', solution: '' });
      setIsModalOpen(false);
      fetchPosts(); // Refresh daftar agar post baru muncul
    }
  };

  return (
    <div className="flex h-screen w-full bg-white text-[#1E1B4B] overflow-hidden font-sans m-0 p-0">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#F9FAFB] flex flex-col shrink-0 border-r border-[#EDE9FE] h-full">
        <div className="p-6 shrink-0">
          <Link href="/" className="flex items-center gap-3 mb-10 group">
             <div className="w-10 h-10 bg-[#582CBE] rounded-[12px] flex items-center justify-center text-white font-bold text-lg shadow-sm">T</div>
             <span className="font-serif font-bold text-xl tracking-tight text-[#1E1B4B]">TASKIN</span>
          </Link>

          <div className="space-y-1.5">
            <Link href="/" className="flex items-center gap-3 w-full p-2.5 rounded-xl text-xs font-semibold text-[#6B7280] hover:bg-[#F3F4F6] transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Chat baru
            </Link>
            <Link href="/library" className="flex items-center gap-3 w-full p-2.5 rounded-xl text-xs font-semibold text-[#6B7280] hover:bg-[#F3F4F6] transition-all">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1-2-2h10a2 2 0 0 1 2 2v16z"/></svg>
               Koleksi Saya
            </Link>
            <Link href="/community" className="flex items-center gap-3 w-full p-2.5 rounded-xl text-xs font-semibold bg-white shadow-sm text-[#582CBE]">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
               Majelis Hikmah
            </Link>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-full bg-white relative">
        <header className="px-10 py-6 flex justify-between items-center shrink-0 border-b border-[#F9FAFB]">
           <div>
             <h1 className="font-serif font-bold text-xl text-[#1E1B4B]">Majelis Hikmah</h1>
             <p className="text-[10px] text-[#A78BFA] font-bold uppercase tracking-[0.2em] mt-1">Saling menguatkan dalam perjalanan iman</p>
           </div>
           <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-[#582CBE] text-white text-[11px] font-bold rounded-lg shadow-lg transition-transform active:scale-95"
           >
             Bagikan Pengalaman
           </button>
        </header>

        <div className="flex-1 overflow-y-auto px-10 py-8 no-scrollbar bg-[#FAFAFB]/50">
          <div className="max-w-3xl mx-auto space-y-8">
            {isLoading ? (
              <div className="text-center py-20 text-[#A78BFA] text-xs font-bold animate-pulse tracking-widest uppercase">Memuat Hikmah...</div>
            ) : shares.length > 0 ? (
              shares.map((share) => (
                <div key={share.id} className="bg-white border border-[#EDE9FE] rounded-[2rem] overflow-hidden shadow-sm transition-all hover:shadow-md">
                  <div className="p-8 pb-4">
                    <div className="flex justify-between items-center mb-4 text-[10px] font-bold text-[#9CA3AF]">
                      <span className="text-[#582CBE] uppercase tracking-widest bg-[#F5F3FF] px-3 py-1 rounded-full">{share.category}</span>
                      <span>Oleh {share.user_name} • {new Date(share.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] mb-2">Kegelisahan:</h3>
                    <p className="text-sm leading-relaxed text-[#1E1B4B]/70 italic mb-6">"{share.problem}"</p>
                    
                    <div className="p-6 bg-[#F5F3FF]/50 rounded-[1.5rem] border-l-4 border-[#582CBE]">
                      <h3 className="text-[10px] font-black text-[#582CBE] uppercase tracking-[0.2em] mb-2">Titik Terang:</h3>
                      <p className="text-sm leading-relaxed text-[#1E1B4B] font-medium">{share.solution}</p>
                    </div>
                  </div>

                  <div className="px-8 py-4 bg-[#F9FAFB]/50 flex items-center gap-6 border-t border-[#F1F0FB]">
                    <button className="flex items-center gap-2 text-[#A78BFA] hover:text-[#582CBE] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                      <span className="text-[11px] font-bold">{share.likes_count || 0} Diamini</span>
                    </button>
                    <button 
                      onClick={() => setExpandedPost(expandedPost === share.id ? null : share.id)}
                      className="flex items-center gap-2 text-[#A78BFA] hover:text-[#582CBE] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      <span className="text-[11px] font-bold">Dukungan</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <p className="text-sm text-[#A78BFA] italic">Belum ada hikmah yang dibagikan. Mari menjadi cahaya pertama.</p>
              </div>
            )}
          </div>
        </div>

        {/* --- SHARE MODAL --- */}
        {isModalOpen && (
          <div className="absolute inset-0 bg-[#1E1B4B]/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif font-bold text-xl text-[#1E1B4B]">Bagikan Hikmah Anda</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-[#9CA3AF] hover:text-[#1E1B4B]">✕</button>
              </div>
              <form onSubmit={handlePostSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest block mb-2">Kegelisahan yang Dialami:</label>
                  <textarea 
                    className="w-full bg-[#F9FAFB] border border-[#EDE9FE] rounded-2xl p-4 text-sm outline-none focus:border-[#582CBE] transition-all min-h-[100px]"
                    placeholder="Apa yang sedang membebani hati Anda?"
                    value={newPost.problem}
                    onChange={(e) => setNewPost({...newPost, problem: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-[#582CBE] uppercase tracking-widest block mb-2">Titik Terang / Solusi:</label>
                  <textarea 
                    className="w-full bg-[#F5F3FF] border border-[#EDE9FE] rounded-2xl p-4 text-sm outline-none focus:border-[#582CBE] transition-all min-h-[100px]"
                    placeholder="Bagaimana Taskin atau refleksi pribadi membantu Anda?"
                    value={newPost.solution}
                    onChange={(e) => setNewPost({...newPost, solution: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-4 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-xs font-bold text-[#9CA3AF]">Batal</button>
                  <button type="submit" className="px-8 py-2 bg-[#582CBE] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#582CBE]/20">Publikasikan</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}