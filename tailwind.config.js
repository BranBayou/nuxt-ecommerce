/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{vue,js,ts}", "./components/**/*.{vue,js,ts}", "./layouts/**/*.{vue,js,ts}", "./pages/**/*.{vue,js,ts}", "./plugins/**/*.{js,ts}", "./nuxt.config.{js,ts}"],
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
  theme: {
    extend: {
      colors: {
        "dodgeroll-gold": {
          50: "#fff9eb",
          100: "#fdecc8",
          200: "#fbd88c",
          300: "#f9bd50",
          400: "#f79f1a",
          500: "#f1820f",
          600: "#d65f09",
          700: "#b13f0c",
          800: "#903210",
          900: "#762911",
          950: "#441204",
        },
        "dodgeroll-gold": "#F79F1A",
        "apple-green": "#046E1B",
        "dire-wolf": "#292727",
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeInUp: {
          'from': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        shimmer: {
          '0%': {
            'background-position': '-200px 0',
          },
          '100%': {
            'background-position': 'calc(200px + 100%) 0',
          },
        },
      },
    },
    fontFamily: {
      Montserrat: "Montserrat, sans-serif",
    },
    container: {
      center: true,
      padding: "2rem",
    },
  },
};