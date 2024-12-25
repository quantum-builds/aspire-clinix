import type { Config } from "tailwindcss";
import scrollbar from "tailwind-scrollbar";
import scrollbarHide from "tailwind-scrollbar-hide";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        feeGuide: " #ECE8E3",
        feeguidedark: "#DCD4C9",
        menuBar: "#C9BCA9",
        footerBackground: "#1D120C",
      },
      fontFamily: {
        opus: ["var(--font-opus)"],
        gillSans: ["var(--font-gill-sans)"],
      },
    },
  },
  plugins: [scrollbar, scrollbarHide],
};
export default config;
