/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Digital Brutalism: Strict black/white palette
                dark: {
                    bg: '#000000',
                    text: '#FFFFFF',
                    border: '#333333',
                },
                bright: {
                    bg: '#FFFFFF',
                    text: '#000000',
                    border: '#E5E5E5',
                },
                // Accent for destructive actions
                danger: '#FF0000',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['Roboto Mono', 'monospace'],
            },
            borderRadius: {
                // Maximum 4px for brutalist aesthetic
                none: '0',
                sm: '2px',
                DEFAULT: '4px',
                // Override larger radii
                md: '4px',
                lg: '4px',
                xl: '4px',
                '2xl': '4px',
                '3xl': '4px',
            },
            boxShadow: {
                // No soft shadows - brutalism
                none: 'none',
            },
        },
    },
    plugins: [],
}
