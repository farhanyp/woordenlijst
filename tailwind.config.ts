import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "#e6f4f7",
          100: "#b3e0e8",
          200: "#80ccd9",
          300: "#4db8ca",
          400: "#1aa4bb",
          500: "#005983", // Main primary
          600: "#004a6f",
          700: "#003b5b",
          800: "#002c47",
          900: "#001d33",
        },
        secondary: {
          50: "#e8f6f8",
          100: "#c3e7ec",
          200: "#9ed8e0",
          300: "#79c9d4",
          400: "#54bac8",
          500: "#0D7C96", // Main secondary
          600: "#0a6578",
          700: "#084e5a",
          800: "#05373c",
          900: "#03201e",
        },
        accent: {
          50: "#e8f4f4",
          100: "#c2dfde",
          200: "#9ccac8",
          300: "#76b5b2",
          400: "#50a09c",
          500: "#2B7A78", // Main accent
          600: "#226260",
          700: "#1a4a48",
          800: "#113230",
          900: "#091a18",
        },
        info: {
          50: "#e1f5fe",
          100: "#b3e5fc",
          200: "#81d4fa",
          300: "#4fc3f7",
          400: "#29b6f6",
          500: "#17A2B8", // Main info
          600: "#0288d1",
          700: "#0277bd",
          800: "#01579b",
          900: "#004c8c",
        },
        link: {
          DEFAULT: "#1976D2",
          hover: "#1565C0",
        },
        hero: {
          bg: "#88d6df",
          overlay: "#005983",
        },
        button: {
          primary: "#182B49",
          secondary: "#2B4A5A",
        },
        text: {
          primary: "#212529",
          secondary: "#6c757d",
          muted: "#9CA3AF",
        },
        floating: "#3a5f77"
      },
      fontFamily: {
        'primary': ['schoolboek', 'var(--font-open-sans)', 'Helvetica', 'Arial', 'Verdana', 'sans-serif'],
        'sans': ['schoolboek', 'var(--font-open-sans)', 'Helvetica', 'Arial', 'Verdana', 'sans-serif'],
      },
      animation: {
        'float': 'float linear infinite',
        'float-alt': 'floatAlt linear infinite',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg) translateY(0px)' },
          '25%': { transform: 'translate(-50%, -50%) rotate(90deg) translateY(-20px)' },
          '50%': { transform: 'translate(-50%, -50%) rotate(180deg) translateY(0px)' },
          '75%': { transform: 'translate(-50%, -50%) rotate(270deg) translateY(20px)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg) translateY(0px)' },
        },
        floatAlt: {
          '0%': { transform: 'translate(-50%, -50%) scale(1) translateX(0px)' },
          '33%': { transform: 'translate(-50%, -50%) scale(1.1) translateX(15px)' },
          '66%': { transform: 'translate(-50%, -50%) scale(0.9) translateX(-15px)' },
          '100%': { transform: 'translate(-50%, -50%) scale(1) translateX(0px)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;