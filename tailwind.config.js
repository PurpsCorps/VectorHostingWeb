/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
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