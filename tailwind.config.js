/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6D28D9', // Vibrant purple for main actions
        secondary: '#F97316', // Energetic orange for accents
        dark: '#1E293B', // Deep slate for text and backgrounds
        light: '#F8FAFC', // Soft white for backgrounds
        success: '#10B981', // Green for success messages
        danger: '#EF4444', // Red for errors
        warning: '#F59E0B', // Amber for warnings
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        hover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}