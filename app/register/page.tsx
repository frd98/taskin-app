'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    } else {
      setMessage("Cek email Anda untuk link konfirmasi pendaftaran!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-[#EDE9FE]">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold text-[#1E1B4B]">Buat Akun Baru</h1>
          <p className="text-slate-500 mt-2">Mulai kelola hikmah dan tugasmu hari ini.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full px-4 py-3 rounded-xl bg-[#F3F4F6] border-none focus:ring-2 focus:ring-[#582CBE] outline-none" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="w-full px-4 py-3 rounded-xl bg-[#F3F4F6] border-none focus:ring-2 focus:ring-[#582CBE] outline-none" />

          {message && <p className={`text-sm text-center font-medium ${message.includes('Cek email') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}

          <button disabled={loading} className="w-full py-4 bg-[#582CBE] text-white rounded-2xl font-bold shadow-lg hover:bg-[#4c24a6]">
            {loading ? 'Mendaftarkan...' : 'Daftar Akun'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Sudah punya akun? <Link href="/login" className="text-[#582CBE] font-bold hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  );
}