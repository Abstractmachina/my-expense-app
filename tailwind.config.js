const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Palette. Values live as RGB channels in CSS variables in src/global.css (light and dark), so classes switch with the scheme and support opacity (e.g. /25).
        'bg-300': 'rgb(var(--bg-300) / <alpha-value>)',
        'bg-400': 'rgb(var(--bg-400) / <alpha-value>)',
        'bg-500': 'rgb(var(--bg-500) / <alpha-value>)',
        'fg-200': 'rgb(var(--fg-200) / <alpha-value>)',
        'fg-300': 'rgb(var(--fg-300) / <alpha-value>)',
        'fg-400': 'rgb(var(--fg-400) / <alpha-value>)',
        'fg-500': 'rgb(var(--fg-500) / <alpha-value>)',
        'primary-300': 'rgb(var(--primary-300) / <alpha-value>)',
        'primary-400': 'rgb(var(--primary-400) / <alpha-value>)',
        'primary-500': 'rgb(var(--primary-500) / <alpha-value>)',
        'secondary-300': 'rgb(var(--secondary-300) / <alpha-value>)',
        'secondary-400': 'rgb(var(--secondary-400) / <alpha-value>)',
        'secondary-500': 'rgb(var(--secondary-500) / <alpha-value>)',
        'tertiary-300': 'rgb(var(--tertiary-300) / <alpha-value>)',
        'tertiary-400': 'rgb(var(--tertiary-400) / <alpha-value>)',
        'tertiary-500': 'rgb(var(--tertiary-500) / <alpha-value>)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('tailwindcss-animate')],
};
