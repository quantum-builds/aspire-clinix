import type { Config } from "tailwindcss";
import scrollbar from "tailwind-scrollbar";
import scrollbarHide from "tailwind-scrollbar-hide";
const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        feeGuide: "#ECE8E3",
        trueBlack: "#382F26",
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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        dashboardBarBackground: "var(--dasboard-bar-background)",
        dashboardBackground: "var(--dashboard-background)",
        dashboardTextBlack: "var(--dashboard-text-black)",
        green: "var(--green)",
        lightBlack: "var(--light-black)",
        gray: "var(--gray)",
        lightGray:"var(--light-gray)",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        inter: ["InterVariable", "sans-serif"],
        opus: ["var(--font-opus)"],
        gillSans: ["var(--font-gill-sans)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [scrollbar, scrollbarHide, require("tailwindcss-animate")],
};
export default config;
