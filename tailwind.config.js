/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./context/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F0EEE6",
        "canvas-dim": "#E7E3D8",
        ink: "#17140F",
        paper: "#FFFFFF",
        cobalt: "#2C46E0",
        "cobalt-dim": "#1F35B0",
        stamp: "#C1432E",
        khaki: "#8A8370",
        line: "rgba(23,20,15,.16)",
      },
      fontFamily: {
        display: ["'Archivo Black'", "Arial Black", "sans-serif"],
        body: ["Inter", "-apple-system", "sans-serif"],
        mono: ["'Space Mono'", "'Courier New'", "monospace"],
      },
    },
  },
  plugins: [],
};
