/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html", 
    "./src/**/*.{js,ts,jsx,tsx,vue}"
  ],
  theme: {
    screens: {
      'tablet': '640px',
      // => @media (min-width: 640px) { ... }

      'laptop': '1024px',
      // => @media (min-width: 1024px) { ... }

      'desktop': '1280px',
      // => @media (min-width: 1280px) { ... }
    },
    extend: {
      screens:{
     // print: {raw:print},
     // screen: {raw:screen}
    }
    },
  },
  plugins: [],
}





