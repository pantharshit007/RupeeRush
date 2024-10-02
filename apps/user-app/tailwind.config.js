/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        richPurple: {
          "200": "#ffb2ff",
          "300": "#df92ff",
          "400": "#ba72ff",
          "500": "#9652ff",
          "600": "#7132f5",
          "700": "#520bea",
        }
      }
    },
  },
  plugins: [],
}

