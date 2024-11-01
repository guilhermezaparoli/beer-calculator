import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        white: "#FFFFFF",
        orange300: "#F2A23F",
        redTrash: "#EF3A3A",
        

      },
      backgroundColor: {
        gray500: "#424141",
        gray300: "#676460",
      }
    },
  },
  plugins: [],
};
export default config;
