import type { Metadata } from "next";
import { Inter, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const arabic = Noto_Naskh_Arabic({ 
  subsets: ["arabic"], 
  weight: ['400', '700'],
  variable: "--font-arabic" 
});

export const metadata: Metadata = {
  title: "TASKIN | Bold Spiritual Guidance",
  description: "Modern Islamic Guidance for the Tech-Forward Generation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${arabic.variable} font-sans antialiased`}>
        <div className="relative min-h-screen">
          {/* Subtle Background Decoration */}
          <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-brand-indigo/5 blur-[120px]" />
          
          <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-brand-indigo flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">TASKIN</span>
              </div>
              <button className="btn-primary">Mulai</button>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}