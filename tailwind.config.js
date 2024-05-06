/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#000000",
        headline: "#FFFFFF",
        secondary: "#E3E3E3",
        normal: "#FFFFFF",
        gradient: "",
      },
    },

    fontFamily: {Geist: "Geist, sans-serif", Inter: ["Inter var", "sans-serif"]},
  },
  plugins: [require("daisyui")],
}
