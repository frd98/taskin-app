'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function Library() {
  const supabase = createClient();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLibrary = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('library_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

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
            <Link href="/library" className="flex items-center gap-3 w-full p-2.5 rounded-xl text-xs font-semibold bg-white shadow-sm text-[#582CBE]">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
               Koleksi Saya
            </Link>
            <Link href="/community" className="flex items-center gap-3 w-full p-2.5 rounded-xl text-xs font-semibold text-[#6B7280] hover:bg-[#F3F4F6] transition-all">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
               Majelis Hikmah
            </Link>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-full bg-white relative">
        <header className="px-10 py-6 border-b border-[#F9FAFB]">
           <div>
             <h1 className="font-serif font-bold text-xl text-[#1E1B4B]">Koleksi Saya</h1>
             <p className="text-[10px] text-[#A78BFA] font-bold uppercase tracking-[0.2em] mt-1">Refleksi AI yang Anda Simpan</p>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto px-10 py-8 no-scrollbar bg-[#FAFAFB]/50">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-20 text-[#A78BFA] text-xs font-bold animate-pulse tracking-widest uppercase">Membuka Koleksi...</div>
            ) : items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="bg-white border border-[#EDE9FE] rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[9px] font-black text-[#582CBE] uppercase tracking-widest bg-[#F5F3FF] px-2.5 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <h2 className="font-serif font-bold text-[#1E1B4B] text-base mb-2 group-hover:text-[#582CBE] transition-colors">{item.title}</h2>
                    <p className="text-xs leading-relaxed text-[#1E1B4B]/70 line-clamp-4 italic">
                      "{item.content}"
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-[#F9FAFB] flex justify-between items-center">
                    <span className="text-[9px] font-bold text-[#9CA3AF]">{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                    <button className="text-[10px] font-bold text-[#582CBE] hover:underline">Baca Selengkapnya</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-sm text-[#A78BFA] italic">Simpan refleksi dari chat AI untuk melihatnya di sini.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}