// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light", // You can keep other themes if you want
      {
        excel: {
          // Custom Excel theme
          primary: "#217346", // Dark green
          secondary: "#3db16e", // Medium green
          accent: "#9fcfb2", // Light green
          neutral: "#d5e2dc", // Off-white/gray
          "base-100": "#ffffff", // Pure white
          "base-200": "#f0f4f1", // Very light gray
          "base-300": "#d1d8d3", // Light Gray
          "base-content": "#1f2937", // Very dark gray (for text)
          info: "#2094f3",
          success: "#009485",
          warning: "#ff9900",
          error: "#ff5724",
        },
      },
    ],
    darkTheme: "dark", // You can set a default dark theme, if needed
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
};
