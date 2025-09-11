/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A1F44',
        accent: '#17C3B2',
        background: '#F5F6FA',
        muted: '#6B7280',
        success: '#22C55E',
        danger: '#EF4444',
        border: '#E5E7EB',
        foreground: '#111827',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '1024px',
        'lg': '1280px',
      },
    },
  },
}