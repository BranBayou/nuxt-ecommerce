/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{vue,js,ts}", "./nuxt.config.{js,ts}"],
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        "ink-soft": "#1F1F1F",
        paper: "#EBEBEB",
        tile: "#F4F4F6",
        field: "#D9D9D9",
        line: "#D3D3D3",
        muted: "#5E5E5E",
        accent: "#000E8A",
        sale: "#B42318",
      },
      fontFamily: {
        sans: ["Archivo", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        label: "0.04em",
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out both',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { 'background-position': '-200px 0' },
          '100%': { 'background-position': 'calc(200px + 100%) 0' },
        },
      },
    },
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2.5rem" },
      screens: { "2xl": "1440px" },
    },
  },
};
