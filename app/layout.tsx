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
          {/* We kept your subtle background glow! */}
          <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-brand-indigo/5 blur-[120px]" />
          
          {/* 
            Senior Engineer Note: The <header> and "Mulai" button have been removed.
            This allows your Login and Dashboard pages to use their own layouts
            without visual interference.
          */}
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}