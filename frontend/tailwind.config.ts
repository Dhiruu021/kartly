import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#f2efe9",
        card: "#fbfaf7",
        ink: {
          DEFAULT: "#1c1b18",
          soft: "#57544c",
          faint: "#7d796f",
        },
        line: "#e2ddd2",
        accent: {
          DEFAULT: "#2f47d0",
          soft: "#e2e6fa",
        },
        sand: "#ebe2d4",
        sage: "#dbe4d3",
        sky: "#dbe3ee",
        blush: "#efded7",
        butter: "#f1e7c6",
        stone: "#e5e2db",
        ok: {
          DEFAULT: "#23784b",
          soft: "#dcefe2",
        },
        warn: {
          DEFAULT: "#9a6512",
          soft: "#f6e8cc",
        },
        danger: "#b23a27",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-bricolage)", "var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        tile: "1.75rem", // 28px
      },
      boxShadow: {
        tile: "0 1px 0 rgba(28, 27, 24, 0.04), 0 14px 34px -20px rgba(28, 27, 24, 0.2)",
        lift: "0 28px 50px -26px rgba(28, 27, 24, 0.38)",
      },
    },
  },
  plugins: [],
};

export default config;
