import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                deep: {
                    bg: "#101014",         // Main background (approximate match to image)
                    sidebar: "#0a0a0c",    // Darker sidebar
                    input: "#2a2a2f",      // Input/card background
                    accent: "#4d6bfe",     // Blue accent button
                    text: "#e3e3e8",       // Primary text
                    subtext: "#a0a0a5",    // Secondary text
                    button: "#2d2d32"      // Secondary buttons
                },
                gpt: {
                    bg: "#101014",
                    text: "#e3e3e8",
                }
            },
            fontFamily: {
                sans: ['Söhne', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-in': 'slideIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(-20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
            }
        },
    },
    plugins: [],
};
export default config;
