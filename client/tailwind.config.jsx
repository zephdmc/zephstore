module.exports = {
    content: [
        './index.html',
        './src/*/.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#4F46E5',
                    light: '#6366F1',
                    dark: '#4338CA',
                },
                secondary: {
                    DEFAULT: '#10B981',
                    light: '#34D399',
                    dark: '#059669',
                },
                danger: {
                    DEFAULT: '#EF4444',
                    light: '#F87171',
                    dark: '#DC2626',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
    ],
};