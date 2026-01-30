/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: 'rgb(var(--background) / <alpha-value>)',
                foreground: 'rgb(var(--foreground) / <alpha-value>)',
                border: 'rgb(var(--border) / <alpha-value>)',
                muted: {
                    DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
                    foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
                },
                accent: {
                    DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
                    foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
                },
            },
            boxShadow: {
                'soft': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                'soft-md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                'soft-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            },
        },
    },
};
