import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vazirmatn", "system-ui", "sans-serif"],
      },
      colors: {
        // پالت نرم از تصویر مرجع
        soft: {
          cobalt: "#2563EB",   // آبی اصلی
          sky: "#3B82F6",
          mist: "#E0E7FF",     // آبی خیلی روشن
          ivory: "#F8FAFC",    // سفید مایل به آبی خیلی کم
          charcoal: "#1E293B",
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
        // سایه برجسته (raised) برای کارت و آیکون
        raised:
          "8px 8px 16px rgba(148, 163, 184, 0.25), -8px -8px 16px rgba(255, 255, 255, 0.9)",
        "raised-sm":
          "4px 4px 10px rgba(148, 163, 184, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.85)",
        "raised-lg":
          "12px 12px 24px rgba(148, 163, 184, 0.28), -12px -12px 24px rgba(255, 255, 255, 0.95)",

        // سایه فرورفته (inset) برای اینپوت‌ها
        inset:
          "inset 6px 6px 12px rgba(148, 163, 184, 0.25), inset -6px -6px 12px rgba(255, 255, 255, 0.9)",
        "inset-sm":
          "inset 3px 3px 6px rgba(148, 163, 184, 0.2), inset -3px -3px 6px rgba(255, 255, 255, 0.85)",

        // سایه‌های قبلی (اگر هنوز استفاده می‌کنی نگه دار)
        soft: "0 4px 20px rgba(30, 41, 59, 0.06)",
        card: "0 2px 12px rgba(30, 41, 59, 0.08)",
      },
      backgroundImage: {
        // پس‌زمینه سفید با فیلتر آبی خیلی ملایم
        "app-soft":
          "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 50%, #F8FAFC 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
