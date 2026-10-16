import type { Config } from "tailwindcss";

// Colours live as RGB channels in app/globals.css (:root), so a palette is changed in one place.
const v = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["var(--font-nunito)", "system-ui", "sans-serif"] },
      colors: {
        ink: v("base"),
        sheet: v("sheet"),
        card: v("card"),
        disc: v("raise"),
        raise: v("raise"),
        line: v("line"),
        line2: v("line2"),
        line3: v("line3"),
        faint: v("faint"),
        muted: v("muted"),
        soft: v("soft"),
        white: v("text"),
        black: v("shadow"),
        paper: v("paper"),
        label: v("label"),
        amber: "#FFB84D",
        lav: "#B7A6FF",
        "lav-deep": "#2B2547",
        navy: "#1E2142",
      },
      maxWidth: { site: "1240px" },
      keyframes: {
        bob: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-4px)" } },
        halo: {
          "0%,100%": { boxShadow: "0 0 0 14px rgba(255,184,77,.12), 0 0 0 28px rgba(255,184,77,.05)" },
          "50%": { boxShadow: "0 0 0 18px rgba(255,184,77,.16), 0 0 0 36px rgba(255,184,77,.04)" },
        },
      },
      animation: { bob: "bob 3.2s ease-in-out infinite", halo: "halo 4s ease-in-out infinite" },
    },
  },
  plugins: [],
};
export default config;
