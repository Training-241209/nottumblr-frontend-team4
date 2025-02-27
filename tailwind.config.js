/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
      colors: {
        primary: '#6366f1', // Replace with your desired colors
        'primary-foreground': '#ffffff',
        muted: '#f4f4f5',
      },
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

