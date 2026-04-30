'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (type: 'LOGIN' | 'SIGNUP') => {
    setLoading(true);
    setMessage('');

    const { error } = type === 'LOGIN' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(error.message);
    } else {
      if (type === 'SIGNUP') {
        setMessage('Cek email Anda untuk konfirmasi (jika diaktifkan) atau silakan Login.');
      } else {
        router.push('/'); // Redirect to home after login
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB] p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl border border-[#EDE9FE] p-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#582CBE] rounded-[15px] flex items-center justify-center text-white font-bold text-xl shadow-lg mx-auto mb-6">T</div>
          <h1 className="font-serif font-bold text-3xl text-[#1E1B4B]">Selamat Datang</h1>
          <p className="text-xs text-[#A78BFA] font-bold uppercase tracking-widest">Perjalanan Hikmah Anda Dimulai di Sini</p>
        </div>

        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full bg-[#F9FAFB] border border-[#EDE9FE] rounded-2xl px-6 py-4 text-sm outline-none focus:border-[#582CBE] transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full bg-[#F9FAFB] border border-[#EDE9FE] rounded-2xl px-6 py-4 text-sm outline-none focus:border-[#582CBE] transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {message && <p className="text-[10px] text-center font-bold text-[#582CBE] uppercase">{message}</p>}

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => handleAuth('LOGIN')}
            disabled={loading}
            className="w-full py-4 bg-[#582CBE] text-white rounded-2xl font-bold text-sm shadow-lg shadow-[#582CBE]/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
          <button 
            onClick={() => handleAuth('SIGNUP')}
            disabled={loading}
            className="w-full py-4 bg-white text-[#582CBE] border border-[#582CBE] rounded-2xl font-bold text-sm active:scale-95 transition-all disabled:opacity-50"
          >
            Daftar Akun Baru
          </button>
        </div>
      </div>
    </div>
  );
}