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
        // Core surfaces
        background: "#131313",
        surface: "#131313",
        "surface-dim": "#131313",
        "surface-container-lowest": "#0e0e0e",
        "surface-container-low": "#1c1b1b",
        "surface-container": "#201f1f",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353534",
        "surface-variant": "#353534",
        "surface-bright": "#3a3939",
        "surface-tint": "#ffb4ab",

        // Primary
        primary: "#ffb4ab",
        "primary-container": "#b91c1c",
        "primary-fixed": "#ffdad6",
        "primary-fixed-dim": "#ffb4ab",
        "on-primary": "#690005",
        "on-primary-container": "#ffcdc7",
        "on-primary-fixed": "#410002",
        "on-primary-fixed-variant": "#93000b",
        "inverse-primary": "#b91c1c",

        // Secondary
        secondary: "#ffb3ad",
        "secondary-container": "#a40217",
        "secondary-fixed": "#ffdad7",
        "secondary-fixed-dim": "#ffb3ad",
        "on-secondary": "#68000a",
        "on-secondary-container": "#ffaea8",
        "on-secondary-fixed": "#410004",
        "on-secondary-fixed-variant": "#930013",

        // Tertiary
        tertiary: "#ffb95f",
        "tertiary-container": "#855300",
        "tertiary-fixed": "#ffddb8",
        "tertiary-fixed-dim": "#ffb95f",
        "on-tertiary": "#472a00",
        "on-tertiary-container": "#ffd099",
        "on-tertiary-fixed": "#2a1700",
        "on-tertiary-fixed-variant": "#653e00",

        // Neutral / on-surface
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#e4beb9",
        "on-background": "#e5e2e1",
        "inverse-surface": "#e5e2e1",
        "inverse-on-surface": "#313030",
        outline: "#ab8985",
        "outline-variant": "#5b403d",

        // Error
        error: "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",

        // Semantic status colors (spreadsheet)
        "status-paid": "#22c55e",
        "status-pending": "#eab308",
        "status-late": "#ef4444",
        "status-exempt": "#6b7280",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
      spacing: {
        gutter: "24px",
        "container-max-width": "1280px",
        "margin-desktop": "64px",
        "margin-mobile": "16px",
        unit: "4px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Montserrat", "sans-serif"],
        "body-md": ["Inter"],
        "body-lg": ["Inter"],
        "label-bold": ["Inter"],
        "headline-md": ["Montserrat"],
        "display-lg": ["Montserrat"],
        "display-lg-mobile": ["Montserrat"],
      },
      fontSize: {
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-bold": [
          "14px",
          { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "700" },
        ],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "700" }],
        "display-lg": [
          "48px",
          {
            lineHeight: "1.1",
            letterSpacing: "-0.02em",
            fontWeight: "900",
          },
        ],
        "display-lg-mobile": [
          "32px",
          {
            lineHeight: "1.2",
            letterSpacing: "-0.01em",
            fontWeight: "900",
          },
        ],
      },
    },
  },
  plugins: [],
};
export default config;
