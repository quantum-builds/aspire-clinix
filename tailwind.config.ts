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
        menuBar: "rgba(201, 188, 169, 1)",
        footerBackground: "#1D120C",
        grey100: "rgba(172, 172, 172, 1)",
        golden50: "rgba(236, 232, 227, 1)",
        grey101: "rgba(170, 170, 170, 1)",
        textColor: "#423C36",
        formBackground: "#DAD7D3",
        bookATreatment: "#AAAAAA",
        bookATreatmentBackground: "#C9BCA9",
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
