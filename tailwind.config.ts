import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#07111f",
        slate: "#0f1b2d",
        mist: "#f3f6fb",
        line: "#d8e1ee",
        brand: "#163a63",
        accent: "#f97316",
        critical: "#dc2626",
        positive: "#16a34a",
        neutral: "#64748b"
      },
      boxShadow: {
        panel: "0 18px 45px -24px rgba(15, 23, 42, 0.35)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(249,115,22,0.18), transparent 26%), radial-gradient(circle at top right, rgba(22,58,99,0.24), transparent 34%), linear-gradient(135deg, #07111f 0%, #10233b 52%, #163a63 100%)"
      }
    }
  },
  plugins: []
};

export default config;
