/** @type {import('tailwindcss').Config} */
import preset from './vendor/filament/support/tailwind.config.preset'

export default {

    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
        './app/Filament/**/*.php',
        './resources/views/filament/**/*.blade.php',
        './vendor/filament/**/*.blade.php',
    ],
    theme: {
        extend: {
            animation: {
                'slow-spin': 'spin 20s linear infinite',
            }
        },
    },
    plugins: [],
}