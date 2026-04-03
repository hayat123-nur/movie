module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "light-100": "var(--color-light-100)",
        "light-200": "var(--color-light-200)",
        "gray-100": "var(--color-gray-100)",
        "dark-100": "var(--color-dark-100)",
      },
      screens: {
        xs: "480px",
      },
      backgroundImage: {
        "hero-pattern": "var(--background-image-hero-pattern)",
      },
    },
  },
  plugins: [],
};
