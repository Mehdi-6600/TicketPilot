import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vazirmatn", "system-ui", "sans-serif"],
      },
      colors: {
        // iOS System Colors (Sharp)
        ios: {
          blue: "#007AFF",
          green: "#34C759",
          orange: "#FF9500",
          red: "#FF3B30",
          gray: "#8E8E93",
          grayLight: "#C7C7CC",
        },
        // Pastel palette for cards
        pastel: {
          lavender: "#EDE9FE",
          lavenderLight: "#F5F3FF",
          pink: "#FCE7F3",
          pinkLight: "#FDF2F8",
          blue: "#DBEAFE",
          blueLight: "#EFF6FF",
          peach: "#FED7AA",
          peachLight: "#FFF7ED",
          mint: "#D1FAE5",
          mintLight: "#ECFDF5",
        },
        // Text colors
        ink: {
          DEFAULT: "#1E1B4B",
          soft: "#4C1D95",
          muted: "#64748B",
        },
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(30, 27, 75, 0.06)",
        card: "0 2px 12px rgba(30, 27, 75, 0.08), 0 1px 3px rgba(30, 27, 75, 0.04)",
        "card-hover":
          "0 8px 28px rgba(30, 27, 75, 0.12), 0 2px 6px rgba(30, 27, 75, 0.06)",
        "inner-soft":
          "inset 0 2px 6px rgba(30, 27, 75, 0.06), inset 0 1px 2px rgba(30, 27, 75, 0.04)",
        glow: "0 0 20px rgba(139, 92, 246, 0.25)",
      },
      backgroundImage: {
        "app-gradient":
          "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 25%, #FCE7F3 55%, #DBEAFE 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
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
