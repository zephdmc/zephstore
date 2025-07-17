/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
       backgroundImage: {
                'purplegradient': 'linear-gradient(to right, #4A2BA0, #A18AE2, #4A2BA0)',
                'purplegradientv': 'linear-gradient(to bottom, #4A2BA0, #A18AE2, #4A2BA0)',
                'purplegradientr': 'radial-gradient(circle, #4A2BA0, #A18AE2, #4A2BA0)',
            },
            colors: {
                'purpleDark1': '#4A2BA0',
                'purpleDark': '#4F2EAA',
                'purpleLight': '#A18AE2',
                'purpleDark2': '#380638',
              'purpleLighter': '#ba68c8',
              'white': '#FFFFFF'
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
