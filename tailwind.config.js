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
            blur: {
              xs: '2px',
            },
            keyframes: {
              'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
              'slide-in': {
                  '0%': { transform: 'translateX(100%)', opacity: '0' },
                  '100%': { transform: 'translateX(0)', opacity: '1' }
                },
                'slide-down': {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(0)' },
                },
                'marquee': {
                  '0%': { transform: 'translateX(100%)' },
                  '100%': { transform: 'translateX(-100%)' }
                },
                'gradient': {
                  '0%': { backgroundPosition: '0% 50%' },
                  '50%': { backgroundPosition: '-100% 50%' },
                  '100%': { backgroundPosition: '0% 50%' }
                }
              },
              animation: {
                'fade-in': 'fade-in 0.5s ease-out',
                'slide-in': 'slide-in 0.3s ease-out',
                'slide-down': 'slide-down 0.5s ease-out',
                'marquee': 'marquee 20s linear infinite',
                'gradient': 'gradient 8s ease infinite'
              },
              transitionProperty: {
                'blur': 'filter',
            },
        },
    },
    variants: {
        extend:{
          backgroundColor: ['active'],
          transform: ['hover', 'focus'],
        },
    },
    plugins: [
      forms,
      require('@tailwindcss/aspect-ratio')
    ],
}