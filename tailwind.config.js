import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#111217",
        panel: "#181b1f",
        elevated: "#22252b",
        input: "#111217",
        borderWeak: "rgba(204, 204, 220, 0.07)",
        borderMedium: "rgba(204, 204, 220, 0.15)",
        borderStrong: "rgba(204, 204, 220, 0.25)",
        textStrong: "#e6e6f0",
        textDefault: "#ccccdc",
        textSecondary: "rgba(204, 204, 220, 0.78)",
        textMuted: "rgba(204, 204, 220, 0.62)",
        grafanaBlue: "#3d71d9",
        grafanaBlueText: "#6e9fff",
        grafanaOrange: "#ff8833",
        statusGood: "#0ca30c",
        statusGoodText: "#73bf69",
        statusWarning: "#fab219",
        statusSerious: "#ec835a",
        statusCritical: "#d03b3b",
        statusCriticalText: "#ff7383",
      },
      borderRadius: {
        grafana: "4px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Menlo", "Consolas", "monospace"],
      },
    },
  },
  plugins: [typography],
};
