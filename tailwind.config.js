/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        chronicle: {
          bg: "#0b0b0e",
          surface: "#141419",
          elevated: "#1c1c24",
          border: "#262632",
          accent: "#8b5cf6",
          accentHover: "#7c3aed"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Inter", "system-ui", "-apple-system", "sans-serif"]
      }
    }
  },
  plugins: []
};
