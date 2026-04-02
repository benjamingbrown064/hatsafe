import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Monolith Editorial tokens
        'surface': '#F9F9F9',
        'surface-low': '#F3F3F3',
        'surface-card': '#FFFFFF',
        'on-surface': '#1A1C1C',
        'on-surface-2': '#474747',
        'on-surface-muted': '#A3A3A3',
        'outline': '#C6C6C6',
        // Brand — Safety Yellow
        'brand': '#FFC107',
        'brand-hover': '#F5B700',
        'brand-text': '#1A1C1C',
        // Status (safety-critical, minimal use)
        'status-valid': '#1A1C1C',
        'status-expiring': '#474747',
        'status-expired': '#1A1C1C',
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '4px',
        md: '6px',
        lg: '6px',
        xl: '6px',
        '2xl': '6px',
        full: '9999px',
      },
      boxShadow: {
        DEFAULT: '0px 20px 40px rgba(0,0,0,0.04)',
        sm: '0px 20px 40px rgba(0,0,0,0.04)',
        md: '0px 20px 40px rgba(0,0,0,0.04)',
        lg: '0px 20px 40px rgba(0,0,0,0.04)',
        card: '0px 20px 40px rgba(0,0,0,0.04)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'headline': ['1.75rem', { lineHeight: '1.2', fontWeight: '700' }],
        'title': ['1rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        'label': ['0.6875rem', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.08em' }],
      },
    },
  },
  plugins: [],
};

export default config;
