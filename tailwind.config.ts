import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  safelist: [
    "plush-card",
    "plush-card-sm",
    "plush-card-lg",
    "plush-card-sky",
    "plush-card-powder",
    "plush-card-cream",
    "plush-card-navy",
    "plush-input",
    "plush-input-sm",
    "plush-select",
    "plush-textarea",
    "btn-plush",
    "btn-plush-blue",
    "btn-plush-navy",
    "btn-plush-success",
    "btn-plush-warning",
    "btn-plush-danger",
    "btn-plush-soft",
    "btn-plush-icon",
    "plush-section-title",
    "plush-link",
    "plush-stagger",
    "animate-puff-in",
    "animate-pulse-fast",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vazirmatn", "system-ui", "sans-serif"],
      },
      colors: {
        navy: {
          DEFAULT: "#0F1B3D",
          deep: "#0A1330",
          soft: "#182650",
          mid: "#243765",
        },
        blue: {
          DEFAULT: "#4B82C3",
          soft: "#6FAED6",
          sky: "#8BC8E8",
          powder: "#BFE5F4",
          mist: "#DCEBF7",
          haze: "#E8F1FA",
        },
        cream: {
          DEFAULT: "#F7F5EF",
          warm: "#FFFDF8",
          soft: "#FBF9F3",
        },
        surface: {
          DEFAULT: "#E4EBF3",
          light: "#EEF3F9",
          soft: "#F3F6FB",
          dark: "#CFD9E5",
          deep: "#B9C6D5",
        },
        puff: {
          sky: "#D7E5F5",
          powder: "#C9DDF0",
          cloud: "#E8F0FA",
          mist: "#DDEAF6",
          ice: "#C5DAEE",
        },
        status: {
          success: "#7BB892",
          successSoft: "#D9EBDF",
          warning: "#E0A567",
          warningSoft: "#F6E6D2",
          danger: "#D77A7A",
          dangerSoft: "#F4D9D9",
          info: "#7AA3CC",
          infoSoft: "#DCE7F3",
        },
        ink: {
          DEFAULT: "#0F1B3D",
          soft: "#243765",
          muted: "#5A6B85",
          faint: "#94A3B8",
          onNavy: "#F7F5EF",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        "4xl": "2.5rem",
        "5xl": "3rem",
      },
      boxShadow: {
        plush:
          "0 2px 4px rgba(15, 27, 61, 0.04), 0 8px 20px rgba(15, 27, 61, 0.08), 0 16px 40px rgba(75, 130, 195, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -2px 4px rgba(15, 27, 61, 0.04)",
        "plush-sm":
          "0 1px 2px rgba(15, 27, 61, 0.05), 0 4px 10px rgba(15, 27, 61, 0.07), 0 8px 20px rgba(75, 130, 195, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.85), inset 0 -1px 2px rgba(15, 27, 61, 0.03)",
        "plush-lg":
          "0 4px 8px rgba(15, 27, 61, 0.06), 0 16px 32px rgba(15, 27, 61, 0.10), 0 32px 64px rgba(75, 130, 195, 0.14), inset 0 2px 0 rgba(255, 255, 255, 0.95), inset 0 -3px 6px rgba(15, 27, 61, 0.05)",
        "plush-inset":
          "inset 0 4px 8px rgba(15, 27, 61, 0.08), inset 0 2px 4px rgba(15, 27, 61, 0.06), inset 0 -2px 3px rgba(255, 255, 255, 0.85)",
        "plush-inset-sm":
          "inset 0 3px 6px rgba(15, 27, 61, 0.07), inset 0 1px 2px rgba(15, 27, 61, 0.05), inset 0 -1px 2px rgba(255, 255, 255, 0.8)",
        "plush-pressed":
          "inset 0 3px 6px rgba(15, 27, 61, 0.10), inset 0 1px 3px rgba(15, 27, 61, 0.08), inset 0 -1px 2px rgba(255, 255, 255, 0.7)",
        "glow-blue":
          "0 6px 20px rgba(75, 130, 195, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(15, 27, 61, 0.15)",
        "glow-success":
          "0 6px 20px rgba(123, 184, 146, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(15, 27, 61, 0.15)",
        "glow-warning":
          "0 6px 20px rgba(224, 165, 103, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(15, 27, 61, 0.15)",
        "glow-danger":
          "0 6px 20px rgba(215, 122, 122, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(15, 27, 61, 0.15)",
        "plush-navy":
          "0 4px 12px rgba(15, 27, 61, 0.30), inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -2px 6px rgba(0, 0, 0, 0.25)",
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
        "puff-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "pulse-fast": "pulse-fast 1.2s ease-in-out infinite",
        "fade-in-up": "fade-up 250ms ease-out",
        "puff-in": "puff-in 220ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
