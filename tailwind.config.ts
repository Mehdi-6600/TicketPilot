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
        // پایه گرم‌تر با تهرنگ آبی خیلی ملایم
        surface: {
          DEFAULT: "#EBEFF5",   // قبلاً #EDF0F5
          light: "#F3F6FA",     // قبلاً #F5F7FA
          dark: "#DDE3EB",      // قبلاً #E1E6ED
        },
        pastel: {
          lavender: "#E7E2F3",
          pink: "#F3E2EA",
          blue: "#DEE8F3",
          peach: "#F3E6D8",
          mint: "#DEEEE3",
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
        // سایه‌های تیره‌تر
        raised:
          "7px 7px 16px rgba(140, 155, 178, 0.55), -7px -7px 16px rgba(255, 255, 255, 0.95)",
        "raised-sm":
          "4px 4px 10px rgba(140, 155, 178, 0.5), -4px -4px 10px rgba(255, 255, 255, 0.9)",
        inset:
          "inset 5px 5px 10px rgba(140, 155, 178, 0.5), inset -5px -5px 10px rgba(255, 255, 255, 0.95)",
        "inset-sm":
          "inset 3px 3px 7px rgba(140, 155, 178, 0.45), inset -3px -3px 7px rgba(255, 255, 255, 0.9)",
        pressed:
          "inset 4px 4px 8px rgba(140, 155, 178, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9)",
        "ios-blue": "0 4px 14px rgba(0, 122, 255, 0.4)",
        "ios-green": "0 4px 14px rgba(52, 199, 89, 0.4)",
        "ios-orange": "0 4px 14px rgba(255, 149, 0, 0.4)",
        "ios-red": "0 4px 14px rgba(255, 59, 48, 0.4)",
      },
      backgroundImage: {
        // پس‌زمینه گرم‌تر — سفید با تهرنگ آبی
        "surface-base":
          "linear-gradient(135deg, #EEF2F7 0%, #E5EBF3 100%)",
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
