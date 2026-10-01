import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vazirmatn", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          600: "#2563EB",
        },
        ios: {
          blue: "#2563EB",
          green: "#34C759",
          orange: "#FF9500",
          red: "#FF3B30",
          gray: "#8E8E93",
          grayLight: "#E2E8F0",
        },
        ink: {
          DEFAULT: "#1E293B",
          soft: "#334155",
          muted: "#64748B",
        },
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "6px 6px 12px rgba(163, 177, 198, 0.4), -6px -6px 12px rgba(255, 255, 255, 0.9)",
        "soft-sm": "4px 4px 10px rgba(163, 177, 198, 0.3), -4px -4px 10px rgba(255, 255, 255, 0.9)",
        inset: "inset 4px 4px 8px rgba(163, 177, 198, 0.35), inset -4px -4px 8px rgba(255, 255, 255, 0.9)",
      },
      backgroundImage: {
        "app-soft": "linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
