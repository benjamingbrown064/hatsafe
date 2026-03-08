import type { Config } from "tailwindcss";
const { heroui } = require("@heroui/react");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutrals (Zebi-style)
        'bg-primary': '#FAFAFA',
        'bg-secondary': '#FFFFFF',
        'bg-tertiary': '#F5F5F5',
        
        'text-primary': '#1A1A1A',
        'text-secondary': '#525252',
        'text-tertiary': '#A3A3A3',
        
        'border-subtle': '#E5E5E5',
        'border-medium': '#D4D4D4',
        
        // Accent (Safety Yellow - HatSafe Brand)
        accent: {
          DEFAULT: '#FFC107',
          hover: '#F5B700',
          light: '#FFF9E6',
          border: '#FFE699',
        },
        
        // Status
        success: {
          DEFAULT: '#10B981',
          bg: '#ECFDF5',
        },
        warning: {
          DEFAULT: '#F59E0B',
          bg: '#FFFBEB',
        },
        error: {
          DEFAULT: '#EF4444',
          bg: '#FEF2F2',
        },
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '14px',
        'xl': '18px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'md': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'lg': '0 4px 16px rgba(0, 0, 0, 0.08)',
      },
      fontSize: {
        'xs': ['12px', '16px'],
        'sm': ['13px', '20px'],
        'base': ['15px', '24px'],
        'lg': ['18px', '28px'],
        'xl': ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '36px'],
      },
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '600',
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: '#FFC107',
            foreground: '#1A1A1A',
          },
          warning: {
            DEFAULT: '#FFC107',
            foreground: '#1A1A1A',
          },
        },
      },
    },
  })],
};

export default config;
