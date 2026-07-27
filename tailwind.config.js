/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: "#fdf8ec",
          100: "#f9edc9",
          200: "#f2d888",
          300: "#eabf4d",
          400: "#e0a72e",
          500: "#c78a1e",
          600: "#a06b17",
          700: "#785014",
        },
        chili: {
          400: "#e0523a",
          500: "#c73f28",
          600: "#9c2f1c",
        },
        char: {
          950: "#0e0c0b",
          900: "#161311",
          850: "#1c1815",
          800: "#241f1a",
          700: "#302922",
          600: "#463c31",
          400: "#8a7c6b",
          200: "#d8cfc2",
          100: "#ece6db",
          50: "#f7f4ee",
        },
        sage: {
          400: "#7c9473",
          500: "#5f7a56",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        ticket: "2px",
      },
    },
  },
  plugins: [],
};
