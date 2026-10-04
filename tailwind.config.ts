import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vazirmatn", "system-ui", "sans-serif"],
      },
      colors: {
        // ==== Plush palette (navy → blue → powder → cream) ====
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
        // Base surfaces (plush cream-blue)
        surface: {
          DEFAULT: "#E4EBF3",
          light: "#EEF3F9",
          soft: "#F3F6FB",
          dark: "#CFD9E5",
          deep: "#B9C6D5",
        },
        // Puffy tints
        puff: {
          sky: "#D7E5F5",
          powder: "#C9DDF0",
          cloud: "#E8F0FA",
          mist: "#DDEAF6",
          ice: "#C5DAEE",
        },
        // Status colors (soft, controlled)
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
        // ==== Plush raised (puffy 3D) ====
        plush:
          "0 2px 4px rgba(15, 27, 61, 0.04), 0 8px 20px rgba(15, 27, 61, 0.08), 0 16px 40px rgba(75, 130, 195, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -2px 4px rgba(15, 27, 61, 0.04)",
        "plush-sm":
          "0 1px 2px rgba(15, 27, 61, 0.05), 0 4px 10px rgba(15, 27, 61, 0.07), 0 8px 20px rgba(75, 130, 195, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.85), inset 0 -1px 2px rgba(15, 27, 61, 0.03)",
        "plush-lg":
          "0 4px 8px rgba(15, 27, 61, 0.06), 0 16px 32px rgba(15, 27, 61, 0.10), 0 32px 64px rgba(75, 130, 195, 0.14), inset 0 2px 0 rgba(255, 255, 255, 0.95), inset 0 -3px 6px rgba(15, 27, 61, 0.05)",
        // ==== Plush inset (recessed) ====
        "plush-inset":
          "inset 0 4px 8px rgba(15, 27, 61, 0.08), inset 0 2px 4px rgba(15, 27, 61, 0.06), inset 0 -2px 3px rgba(255, 255, 255, 0.85)",
        "plush-inset-sm":
          "inset 0 3px 6px rgba(15, 27, 61, 0.07), inset 0 1px 2px rgba(15, 27, 61, 0.05), inset 0 -1px 2px rgba(255, 255, 255, 0.8)",
        // ==== Pressed (tactile) ====
        "plush-pressed":
          "inset 0 3px 6px rgba(15, 27, 61, 0.10), inset 0 1px 3px rgba(15, 27, 61, 0.08), inset 0 -1px 2px rgba(255, 255, 255, 0.7)",
        // ==== Colored glows (very soft) ====
        "glow-blue":
          "0 6px 20px rgba(75, 130, 195, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(15, 27, 61, 0.15)",
        "glow-success":
          "0 6px 20px rgba(123, 184, 146, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(15, 27, 61, 0.15)",
        "glow-warning":
          "0 6px 20px rgba(224, 165, 103, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(15, 27, 61, 0.15)",
        "glow-danger":
          "0 6px 20px rgba(215, 122, 122, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(15, 27, 61, 0.15)",
        // ==== Navy deep button ====
        "plush-navy":
          "0 4px 12px rgba(15, 27, 61, 0.30), inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -2px 6px rgba(0, 0, 0, 0.25)",
      },
      backgroundImage: {
        "plush-bg":
          "radial-gradient(120% 80% at 20% 0%, #E8F1FA 0%, #DDEAF6 35%, #CFD9E5 75%, #C5D3E2 100%)",
        "plush-surface":
          "linear-gradient(160deg, #F0F5FB 0%, #DDE7F2 60%, #D2DEEB 100%)",
        "plush-cream":
          "linear-gradient(160deg, #FFFDF8 0%, #F7F5EF 60%, #EDEAE0 100%)",
        "plush-sky":
          "linear-gradient(160deg, #E1EDF9 0%, #CFE0F0 60%, #BFD5E8 100%)",
        "plush-powder":
          "linear-gradient(160deg, #D7E5F5 0%, #C9DDF0 60%, #B8D0E8 100%)",
        "plush-navy":
          "linear-gradient(160deg, #243765 0%, #182650 50%, #0F1B3D 100%)",
        "plush-blue":
          "linear-gradient(160deg, #6FAED6 0%, #4B82C3 60%, #3A6BA8 100%)",
        "plush-success":
          "linear-gradient(160deg, #A8D3B8 0%, #7BB892 60%, #5EA07B 100%)",
        "plush-warning":
          "linear-gradient(160deg, #EFC99E 0%, #E0A567 60%, #C98D4F 100%)",
        "plush-danger":
          "linear-gradient(160deg, #E9A5A5 0%, #D77A7A 60%, #BE5F5F 100%)",
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
        "fade-in-up": "fade-in-up 250ms ease-out",
        "puff-in": "puff-in 220ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
