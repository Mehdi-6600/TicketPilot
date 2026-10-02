import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vazirmatn", "system-ui", "sans-serif"],
      },
      colors: {
        // iOS System Colors
        ios: {
          blue: "#007AFF",
          green: "#34C759",
          orange: "#FF9500",
          red: "#FF3B30",
          gray: "#8E8E93",
          grayLight: "#C7C7CC",
        },
        // Neumorphic base
        surface: {
          DEFAULT: "#EDF0F5",
          light: "#F5F7FA",
          dark: "#E1E6ED",
        },
        // Pastel tints
        pastel: {
          lavender: "#E9E4F5",
          pink: "#F5E4EC",
          blue: "#E0E9F5",
          peach: "#F5E9DC",
          mint: "#E0F0E5",
        },
        // Text
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
        // کارت برجسته
        raised:
          "6px 6px 14px rgba(163, 177, 198, 0.45), -6px -6px 14px rgba(255, 255, 255, 0.9)",
        "raised-sm":
          "4px 4px 10px rgba(163, 177, 198, 0.4), -4px -4px 10px rgba(255, 255, 255, 0.85)",
        // اینپوت فرورفته
        inset:
          "inset 4px 4px 8px rgba(163, 177, 198, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.9)",
        "inset-sm":
          "inset 3px 3px 6px rgba(163, 177, 198, 0.35), inset -3px -3px 6px rgba(255, 255, 255, 0.85)",
        // کلیک (فشار)
        pressed:
          "inset 3px 3px 6px rgba(163, 177, 198, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.85)",
        // iOS button glow
        "ios-blue": "0 4px 14px rgba(0, 122, 255, 0.35)",
        "ios-green": "0 4px 14px rgba(52, 199, 89, 0.35)",
        "ios-orange": "0 4px 14px rgba(255, 149, 0, 0.35)",
        "ios-red": "0 4px 14px rgba(255, 59, 48, 0.35)",
      },
      backgroundImage: {
        // پس‌زمینه یکدست روشن (نئومورفیک)
        "surface-base":
          "linear-gradient(135deg, #EEF1F6 0%, #E8ECF2 100%)",
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
