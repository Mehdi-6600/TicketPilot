import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vazirmatn", "system-ui", "sans-serif"],
      },
      colors: {
        ios: {
          blue: "#007AFF",
          green: "#34C759",
          orange: "#FF9500",
          red: "#FF3B30",
          gray: "#8E8E93",
          grayLight: "#C7C7CC",
        },
        surface: {
          DEFAULT: "#E9EEF5",
          light: "#F1F5FA",
          dark: "#D8DEE7",
        },
        pastel: {
          lavender: "#E5E0F2",
          pink: "#F2E0E9",
          blue: "#DBE5F2",
          peach: "#F2E4D4",
          mint: "#DBEDE1",
        },
        ink: {
          DEFAULT: "#1F2937",
          soft: "#374151",
          muted: "#6B7280",
          faint: "#9CA3AF",
        },
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        raised:
          "8px 8px 18px rgba(120, 135, 160, 0.6), -8px -8px 18px rgba(255, 255, 255, 1)",
        "raised-sm":
          "5px 5px 12px rgba(120, 135, 160, 0.55), -5px -5px 12px rgba(255, 255, 255, 0.95)",
        inset:
          "inset 5px 5px 11px rgba(120, 135, 160, 0.55), inset -5px -5px 11px rgba(255, 255, 255, 1)",
        "inset-sm":
          "inset 3px 3px 8px rgba(120, 135, 160, 0.5), inset -3px -3px 8px rgba(255, 255, 255, 0.95)",
        pressed:
          "inset 4px 4px 9px rgba(120, 135, 160, 0.65), inset -4px -4px 9px rgba(255, 255, 255, 0.9)",
        "ios-blue": "0 4px 14px rgba(0, 122, 255, 0.4)",
        "ios-green": "0 4px 14px rgba(52, 199, 89, 0.4)",
        "ios-orange": "0 4px 14px rgba(255, 149, 0, 0.4)",
        "ios-red": "0 4px 14px rgba(255, 59, 48, 0.4)",
      },
      backgroundImage: {
        "surface-base":
          "linear-gradient(135deg, #EAF0F7 0%, #DEE5EF 100%)",
      },
      keyframes: {
        "pulse-fast": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(1.4)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-fast": "pulse-fast 1.2s ease-in-out infinite",
        "fade-in-up": "fade-in-up 250ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
