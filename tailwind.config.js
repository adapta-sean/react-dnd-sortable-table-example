/** @type {import('tailwindcss').Config} */
import flowbite from "flowbite/plugin";

module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "node_modules/flowbite-react/lib/esm/**/*.js",

    ],
    theme: {
        extend: {},
    },
    plugins: [
        flowbite,
    ],
};