import defaultTheme from 'tailwindcss/defaultTheme'
import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                'slide-in': {
                  '0%': { transform: 'translateX(100%)', opacity: '0' },
                  '100%': { transform: 'translateX(0)', opacity: '1' }
                },
              },
              animation: {
                'slide-in': 'slide-in 0.3s ease-out'
              },
        },
    },
    plugins: [forms],
}