import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Flattened names to prevent build errors
        "brand-indigo": "#4f46e5",
        "brand-cyan": "#06b6d4",
        "brand-amber": "#fbbf24",
        "brand-dark": "#1e1b4b",
        "surface-light": "#f8fafc",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        arabic: ["var(--font-arabic)"],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'soft': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
};
export default config;