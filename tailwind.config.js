// tferdous17/codura/codura-landing-page-testing/tailwind.config.js
const {heroui} = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/components/navbar.js",
    // Adding standard content glob patterns for safety
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        // Animation to make elements float up/down slowly (from FloatingCode.tsx)
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        // Slower version of float for background elements
        'float-slow': {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "33%": { transform: "translateY(-20px) translateX(10px)" },
          "66%": { transform: "translateY(20px) translateX(-10px)" },
        },
        // Animation for blob-like elements to gently pulse/move
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)", opacity: "0.2" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)", opacity: "0.3" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)", opacity: "0.1" },
          "100%": { transform: "translate(0px, 0px) scale(1)", opacity: "0.2" },
        },
        // Reverse blob animation
        'blob-reverse': {
          "0%": { transform: "translate(0px, 0px) scale(1)", opacity: "0.2" },
          "33%": { transform: "translate(-30px, 50px) scale(0.9)", opacity: "0.3" },
          "66%": { transform: "translate(20px, -20px) scale(1.1)", opacity: "0.1" },
          "100%": { transform: "translate(0px, 0px) scale(1)", opacity: "0.2" },
        },
        
        // Slow pulse for the soft background glow (new required animation)
        'pulse-slow': {
          '0%, 100%': { opacity: '0.9' },
          '50%': { opacity: '0.6' },
        },
        // Slower spin animation for background gradients (new required animation)
        'spin-slow': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 20s ease-in-out infinite',
        blob: 'blob 15s infinite ease-in-out',
        'blob-reverse': 'blob-reverse 15s infinite ease-in-out reverse',
        'pulse-slow': 'pulse-slow 20s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin-slow 40s linear infinite', // 40 seconds duration
      },
      
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};