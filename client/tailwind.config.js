/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
       backgroundImage: {
                'purplegradient': 'linear-gradient(to right, #390039, #C1A5C1, #380638)',
                'purplegradientv': 'linear-gradient(to bottom, #390039, #C1A5C1, #380638)',
                'purplegradientr': 'radial-gradient(circle, #390039, #C1A5C1, #380638)',
            },
            colors: {
                'purpleDark1': '#770077',
                'purpleDark': '#390039',
                'purpleLight': '#C1A5C1',
                'purpleDark2': '#380638',
                // primary: {
                //     DEFAULT: '#4F46E5',
                //     light: '#6366F1',
                //     dark: '#4338CA',
                // },
                // secondary: {
                //     DEFAULT: '#10B981',
                //     light: '#34D399',
                //     dark: '#059669',
                // },
                // danger: {
                //     DEFAULT: '#380638',
                //     light: '#C1A5c1',
                //     dark: '#380638',
                // },
            },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ],
}
