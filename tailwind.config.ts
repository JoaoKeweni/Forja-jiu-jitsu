import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#131313",
        surface: "#131313",
        "surface-container": "#201f1f",
        "surface-container-low": "#1c1b1b",
        "surface-container-high": "#2a2a2a",
        "surface-variant": "#353534",
        "surface-bright": "#3a3939",
        "surface-dim": "#131313",
        primary: "#ffb4ab",
        "primary-container": "#b91c1c",
        "on-primary-container": "#ffcdc7",
        secondary: "#ffb3ad",
        "secondary-container": "#a40217",
        tertiary: "#ffb95f",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#e4beb9",
        outline: "#ab8985",
        "outline-variant": "#5b403d",
        error: "#ffb4ab",
        "error-container": "#93000a",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
