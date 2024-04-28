/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "base-bg": "#232946",
        "secondary-bg": "#b8c1ec",
        "headline": "#fffffe",
        "header": "#fffffed7",
        "normal-text": "#b8c1ec",
        "table-header": "#121629",
        "table-body": "#232946",
        "button":"#eebbc3"
      },
    },

    fontFamily: {Geist: "Geist, sans-serif"},
  },
  plugins: [require("daisyui")],
}
