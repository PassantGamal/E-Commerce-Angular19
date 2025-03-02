/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode:'selector',
  content: [
     "./src/**/*.{html,ts}",
     "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      
    },
    container:{
      center:true
    }
    ,
    
  },
  plugins: [require('flowbite/plugin')],
  
}

