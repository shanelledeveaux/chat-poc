// tailwind.config.ts
import { type Config } from "tailwindcss";
import typography from "@tailwindcss/postcss";
import forms from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            pre: {
              backgroundColor: "transparent",
              padding: 0,
            },
            code: {
              backgroundColor: "rgba(0,0,0,0.05)",
              padding: "0.2em 0.4em",
              borderRadius: "0.25rem",
            },
            blockquote: {
              borderLeftColor: "#c084fc",
              fontStyle: "italic",
            },
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        brand: {
          DEFAULT: "#6b21a8",
          light: "#c084fc",
        },
      },
    },
  },
  plugins: [forms],
};
export default config;
