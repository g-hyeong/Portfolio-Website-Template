import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        'surface-secondary': "var(--surface-secondary)",
        foreground: "var(--foreground)",
        'foreground-secondary': "var(--foreground-secondary)",
        'foreground-muted': "var(--foreground-muted)",
        
        // 오팔 색상 시스템
        opal: {
          primary: "var(--opal-primary)",
          'primary-hover': "var(--opal-primary-hover)",
          'primary-light': "var(--opal-primary-light)",
          accent: "var(--opal-accent)",
          'accent-light': "var(--opal-accent-light)",
        },
        
        // Border & Semantic colors
        border: "var(--border)",
        'border-secondary': "var(--border-secondary)",
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        
        // Glassmorphism colors
        glass: {
          background: "var(--glass-background)",
          'background-secondary': "var(--glass-background-secondary)",
          'background-tertiary': "var(--glass-background-tertiary)",
          border: "var(--glass-border)",
          overlay: "var(--glass-overlay)",
          'modal-background': "var(--glass-modal-background)",
          'modal-border': "var(--glass-modal-border)",
        },
      },
      boxShadow: {
        'light': 'var(--shadow-light)',
        'medium': 'var(--shadow-medium)',
        'heavy': 'var(--shadow-heavy)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'opal-shimmer': 'opalShimmer 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        opalShimmer: {
          '0%': { background: 'linear-gradient(45deg, var(--opal-primary), var(--opal-accent))' },
          '100%': { background: 'linear-gradient(45deg, var(--opal-accent), var(--opal-primary-light))' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
} satisfies Config; 