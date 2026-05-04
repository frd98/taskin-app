'use client';

import React, { useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';

// 1. We move the actual logic and UI into this internal component
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Detect if the middleware sent the user here for approval
  const isPendingApproval = searchParams.get('message') === 'pending';

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
        setMessage('Akun berhasil dibuat! Silakan tunggu persetujuan admin.'); 
      } else {
        router.push('/'); 
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

        {isPendingApproval && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 animate-pulse">
            <p className="text-[10px] text-center font-bold text-indigo-600 uppercase tracking-widest leading-relaxed">
              Akun Anda sedang dalam antrean peninjauan. <br /> 
              Mohon tunggu hingga Admin memberikan akses.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full bg-[#F9FAFB] border border-[#EDE9FE] rounded-2xl px-6 py-4 text-sm outline-none focus:border-[#582CBE] transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <div className="relative">
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password" 
              className="w-full bg-[#F9FAFB] border border-[#EDE9FE] rounded-2xl px-6 py-4 text-sm outline-none focus:border-[#582CBE] transition-all pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#582CBE] transition-colors"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
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

// 2. The main page component wraps the form in a Suspense boundary to fix the build error
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB] p-4 text-[#A78BFA] font-bold animate-pulse">
        Menyiapkan...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}