import { useEffect, useState } from 'react';

const THEME_KEY = 'silo_theme';

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Hydrate from localStorage
        const savedTheme = localStorage.getItem(THEME_KEY);
        const prefersDark = savedTheme === 'dark' || savedTheme === null;

        setIsDark(prefersDark);
        document.documentElement.classList.toggle('light', !prefersDark);
    }, []);

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark';
        setIsDark(!isDark);
        localStorage.setItem(THEME_KEY, newTheme);
        document.documentElement.classList.toggle('light', newTheme === 'light');
    };

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-4 right-4 z-50 p-2 border-2 border-dark-border light:border-bright-border bg-dark-bg light:bg-bright-bg transition-all duration-75 hover:bg-dark-text hover:text-dark-bg light:hover:bg-bright-text light:hover:text-bright-bg"
            aria-label="Toggle theme"
        >
            {isDark ? (
                // Sun icon for dark mode
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                >
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
            ) : (
                // Moon icon for light mode
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            )}
        </button>
    );
};

export default ThemeToggle;
