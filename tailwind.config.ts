import { join } from "path";
import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

export default {
    content: [join(__dirname, "src/**/*.{js,ts,jsx,tsx}")],
    theme: {
        extend: {
            screens: {
                xs: "300px", // Extra small (Custom)
                sm: "450px", // Small (Default)
                md: "800px", // Medium (Default)
                lg: "1000px", // Extra Large (Default)
                xl: "1200px", // Large (Default)
                "2xl": "1536px", // Very Large (Default)
                "3xl": "1800px", // Ultra-wide (Custom)
            },
            fontFamily: {
                "edge-of-the-galaxy": ["edge-of-the-galaxy"],
                "glacial-indifference": ["glacial-indifference"],
                h1: ["edge-of-the-galaxy"],
                h2: ["glacial-indifference"],
                "h2-bold": ["glacial-indifference"],
                h3: ["glacial-indifference"],
                // This is the default font used by tailwind
                sans: ["glacial-indifference", "Roboto", "sans-serif"],
            },
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
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
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            backgroundImage: {
                hero: "url('/hero/background.png')",
            },
        },
    },
    plugins: [tailwindAnimate],
} satisfies Config;
