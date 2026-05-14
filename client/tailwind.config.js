/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5DA296',
          container: '#4a857b',
          on: '#ffffff',
        },
        secondary: {
          DEFAULT: '#735c00',
          container: '#fed65b',
          on: '#ffffff',
        },
        background: '#f9f9ff',
        surface: {
          DEFAULT: '#f9f9ff',
          variant: '#e1e2ea',
        },
        'on-surface': {
          DEFAULT: '#191c21',
          variant: '#424752',
        },
        'admin-blue': {
          DEFAULT: '#003F87',
          dark: '#002B5C',
          light: '#EBF2FF',
        }
      },
      fontFamily: {
        heading: ['Almarai', 'sans-serif'],
        body: ['Cairo', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'premium': '0 4px 20px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
