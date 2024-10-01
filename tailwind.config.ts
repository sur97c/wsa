// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme')

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
          light: "var(--primary-light)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          light: "var(--secondary-light)"
        },
      },
      fontSize: {
        lg: '24px',
        md: '18px',
        sm: '16px',
      },
      borderRadius: {
        'md': '4px',
      },
      boxShadow: {
        'bottom': '0 4px 6px -5px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
};

export default config;
