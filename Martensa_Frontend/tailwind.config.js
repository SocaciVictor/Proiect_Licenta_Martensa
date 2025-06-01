/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./modules/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}", // your React/Next files
    "./globals.css",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#28a745", // verde pentru accente și butoane
        dark: "#212529", // negru spre gri închis pentru text și iconițe
        white: "#FFFFFF", // fundal alb
      },
    },
  },
  plugins: [],
};
