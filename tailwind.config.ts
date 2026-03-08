import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // HatSafe brand colors
        primary: {
          DEFAULT: '#FFC107', // Safety yellow
          50: '#FFFBEA',
          100: '#FFF4C4',
          200: '#FFE98A',
          300: '#FFE050',
          400: '#FFC107', // Main brand yellow
          500: '#FFA000',
          600: '#FF8F00',
          700: '#FF6F00',
          800: '#E65100',
          900: '#BF360C',
        },
        secondary: {
          DEFAULT: '#1A1A1A', // Deep black
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#ABABAB',
          400: '#7A7A7A',
          500: '#525252',
          600: '#3D3D3D',
          700: '#2B2B2B',
          800: '#1A1A1A', // Main brand black
          900: '#0A0A0A',
        },
        // Status colors for compliance tracking
        status: {
          valid: '#10B981', // Green - documents valid
          expiring: '#F59E0B', // Amber - expiring soon
          expired: '#EF4444', // Red - expired
          missing: '#6B7280', // Grey - missing
        },
      },
      borderRadius: {
        'sm': '6px',
        'DEFAULT': '10px',
        'lg': '14px',
        'xl': '20px',
      },
      spacing: {
        '18': '4.5rem', // 72px
        '22': '5.5rem', // 88px
      },
    },
  },
  plugins: [],
} satisfies Config;
