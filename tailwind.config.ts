import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B1F3A",
          700: "#13294B",
          500: "#1E3A5F",
          300: "#6B82A3",
          100: "#DCE3EE",
        },
        sello: { DEFAULT: "#B3122B", soft: "#FBE9EC" },
        paper: { DEFAULT: "#FBFAF6", line: "#E6E1D3" },
        marfil: "#F5F3EE",
        bronce: "#8A6D3B",
        ok: { DEFAULT: "#1E6F4A", soft: "#E4F2EA" },
        warn: { DEFAULT: "#8F5700", soft: "#FFF2DB" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        paper: "0 1px 0 #E6E1D3, 0 18px 40px -28px rgba(11,31,58,.45)",
        card: "0 1px 2px rgba(11,31,58,.06), 0 8px 24px -20px rgba(11,31,58,.25)",
      },
    },
  },
  plugins: [],
};

export default config;
