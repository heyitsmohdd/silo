/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: 'class',
    theme: {
        extend: {
            boxShadow: {
                'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
                'soft-md': '0 4px 12px rgba(0, 0, 0, 0.08)',
                'soft-lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
            },
        },
    },
};
