import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}", 
    "./components/**/*.{ts,tsx}", 
    "./app/**/*.{ts,tsx}", 
    "./src/**/*.{ts,tsx}"
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Enhanced Color System
      colors: {
        border: "hsl(var(--glass-border))",
        input: "rgba(255, 255, 255, 0.08)",
        ring: "hsl(var(--emerald-500))",
        
        background: {
          DEFAULT: "hsl(var(--background))",
          secondary: "hsl(var(--background-secondary))",
          tertiary: "hsl(var(--background-tertiary))",
          accent: "hsl(var(--background-accent))",
        },
        
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
          secondary: "hsl(var(--foreground-secondary))",
          muted: "hsl(var(--foreground-muted))",
          subtle: "hsl(var(--foreground-subtle))",
        },
        
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          primary: "rgba(255, 255, 255, 0.08)",
          secondary: "rgba(255, 255, 255, 0.12)",
          tertiary: "rgba(255, 255, 255, 0.16)",
          border: "rgba(255, 255, 255, 0.18)",
          hover: "rgba(255, 255, 255, 0.20)",
        },
        
        emerald: {
          50: "hsl(var(--emerald-50))",
          100: "hsl(var(--emerald-100))",
          200: "hsl(var(--emerald-200))",
          300: "hsl(var(--emerald-300))",
          400: "hsl(var(--emerald-400))",
          500: "hsl(var(--emerald-500))",
          600: "hsl(var(--emerald-600))",
          700: "hsl(var(--emerald-700))",
          800: "hsl(var(--emerald-800))",
          900: "hsl(var(--emerald-900))",
          DEFAULT: "hsl(var(--emerald-500))",
          light: "hsl(var(--emerald-400))",
          dark: "hsl(var(--emerald-600))",
        },
        
        accent: {
          amber: "hsl(var(--amber))",
          rose: "hsl(var(--rose))",
          violet: "hsl(var(--violet))",
          cyan: "hsl(var(--cyan))",
        },
        
        primary: {
          DEFAULT: "hsl(var(--emerald-500))",
          foreground: "hsl(var(--foreground))",
          50: "hsl(var(--emerald-50))",
          100: "hsl(var(--emerald-100))",
          200: "hsl(var(--emerald-200))",
          300: "hsl(var(--emerald-300))",
          400: "hsl(var(--emerald-400))",
          500: "hsl(var(--emerald-500))",
          600: "hsl(var(--emerald-600))",
          700: "hsl(var(--emerald-700))",
          800: "hsl(var(--emerald-800))",
          900: "hsl(var(--emerald-900))",
        },
        
        secondary: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          foreground: "hsl(var(--foreground))",
        },
        
        destructive: {
          DEFAULT: "hsl(var(--rose))",
          foreground: "hsl(var(--foreground))",
        },
        
        muted: {
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          foreground: "hsl(var(--foreground-muted))",
        },
        
        accent: {
          DEFAULT: "rgba(255, 255, 255, 0.12)",
          foreground: "hsl(var(--foreground))",
        },
        
        popover: {
          DEFAULT: "rgba(255, 255, 255, 0.12)",
          foreground: "hsl(var(--foreground))",
        },
        
        card: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          foreground: "hsl(var(--foreground))",
        },
      },

      // Enhanced Border Radius System
      borderRadius: {
        'none': '0px',
        'sm': 'var(--radius-sm)',
        'base': 'var(--radius-base)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        'full': 'var(--radius-full)',
      },

      // Modern Typography Scale
      fontSize: {
        'xs': ['var(--font-size-xs)', { lineHeight: '1.4' }],
        'sm': ['var(--font-size-sm)', { lineHeight: '1.5' }],
        'base': ['var(--font-size-base)', { lineHeight: '1.6' }],
        'lg': ['var(--font-size-lg)', { lineHeight: '1.6' }],
        'xl': ['var(--font-size-xl)', { lineHeight: '1.5' }],
        '2xl': ['var(--font-size-2xl)', { lineHeight: '1.4' }],
        '3xl': ['var(--font-size-3xl)', { lineHeight: '1.3' }],
        '4xl': ['var(--font-size-4xl)', { lineHeight: '1.2' }],
        '5xl': ['var(--font-size-5xl)', { lineHeight: '1.1' }],
        '6xl': ['var(--font-size-6xl)', { lineHeight: '1' }],
        
        // Fluid Typography
        'fluid-sm': 'var(--font-size-fluid-sm)',
        'fluid-base': 'var(--font-size-fluid-base)',
        'fluid-lg': 'var(--font-size-fluid-lg)',
        'fluid-xl': 'var(--font-size-fluid-xl)',
        'fluid-2xl': 'var(--font-size-fluid-2xl)',
        'fluid-3xl': 'var(--font-size-fluid-3xl)',
      },

      // Enhanced Spacing System
      spacing: {
        'px': 'var(--space-px)',
        '0': 'var(--space-0)',
        '0.5': 'var(--space-0-5)',
        '1': 'var(--space-1)',
        '1.5': 'var(--space-1-5)',
        '2': 'var(--space-2)',
        '2.5': 'var(--space-2-5)',
        '3': 'var(--space-3)',
        '3.5': 'var(--space-3-5)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '7': 'var(--space-7)',
        '8': 'var(--space-8)',
        '9': 'var(--space-9)',
        '10': 'var(--space-10)',
        '11': 'var(--space-11)',
        '12': 'var(--space-12)',
        '14': 'var(--space-14)',
        '16': 'var(--space-16)',
        '20': 'var(--space-20)',
        '24': 'var(--space-24)',
        '28': 'var(--space-28)',
        '32': 'var(--space-32)',
      },

      // Modern Shadow System
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        'glass': 'var(--shadow-glass)',
        'glass-lg': 'var(--shadow-glass-lg)',
        'glow-emerald': 'var(--glow-emerald)',
        'glow-cosmic': 'var(--glow-cosmic)',
        'none': '0 0 #0000',
      },

      // Advanced Gradients
      backgroundImage: {
        'gradient-cosmic': 'var(--gradient-cosmic)',
        'gradient-emerald': 'var(--gradient-emerald)',
        'gradient-glass': 'var(--gradient-glass)',
        'gradient-bg': 'var(--gradient-bg)',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
        'mesh': 'radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 1) 0px, transparent 0%), radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 1) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 1) 0px, transparent 50%), radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 1) 0px, transparent 50%), radial-gradient(at 97% 96%, hsla(38, 60%, 74%, 1) 0px, transparent 50%), radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 1) 0px, transparent 50%), radial-gradient(at 79% 53%, hsla(343, 68%, 79%, 1) 0px, transparent 50%)',
      },

      // Enhanced Animation System
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "slide-out": "slide-out 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "scale-out": "scale-out 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 4s ease-in-out infinite alternate",
        "shimmer": "shimmer 2s infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "bounce-subtle": "bounce-subtle 1s ease-in-out infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
      },

      // Modern Keyframes
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-in": {
          from: { transform: "translateY(16px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "slide-out": {
          from: { transform: "translateY(0)", opacity: "1" },
          to: { transform: "translateY(-16px)", opacity: "0" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "scale-out": {
          from: { transform: "scale(1)", opacity: "1" },
          to: { transform: "scale(0.95)", opacity: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-10px) rotate(1deg)" },
          "66%": { transform: "translateY(-5px) rotate(-1deg)" },
        },
        "glow": {
          from: { boxShadow: "var(--glow-emerald)" },
          to: { boxShadow: "var(--glow-cosmic)" },
        },
        "shimmer": {
          "0%": { left: "-100%" },
          "100%": { left: "100%" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--emerald-500) / 0.3)" },
          "50%": { boxShadow: "0 0 30px hsl(var(--emerald-500) / 0.6)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },

      // Enhanced Timing Functions
      transitionTimingFunction: {
        'in': 'var(--ease-in)',
        'out': 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
        'back': 'var(--ease-back)',
        'bounce': 'var(--ease-bounce)',
        'elastic': 'var(--ease-elastic)',
        'smooth': 'var(--ease-smooth)',
      },

      // Duration Scale
      transitionDuration: {
        '75': 'var(--duration-75)',
        '100': 'var(--duration-100)',
        '150': 'var(--duration-150)',
        '200': 'var(--duration-200)',
        '300': 'var(--duration-300)',
        '500': 'var(--duration-500)',
        '700': 'var(--duration-700)',
        '1000': 'var(--duration-1000)',
      },

      // Z-index Scale
      zIndex: {
        'below': 'var(--z-below)',
        'base': 'var(--z-base)',
        'docked': 'var(--z-docked)',
        'dropdown': 'var(--z-dropdown)',
        'sticky': 'var(--z-sticky)',
        'banner': 'var(--z-banner)',
        'overlay': 'var(--z-overlay)',
        'modal': 'var(--z-modal)',
        'popover': 'var(--z-popover)',
        'skip-link': 'var(--z-skip-link)',
        'toast': 'var(--z-toast)',
        'tooltip': 'var(--z-tooltip)',
      },

      // Modern Backdrop Blur
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'base': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },

      // Enhanced Blur Scale
      blur: {
        'xs': '2px',
        'sm': '4px',
        'base': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },

      // Modern Screen Sizes
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        'tall': { 'raw': '(min-height: 800px)' },
        'short': { 'raw': '(max-height: 600px)' },
      },

      // Aspect Ratios
      aspectRatio: {
        'auto': 'auto',
        'square': '1 / 1',
        'video': '16 / 9',
        'photo': '4 / 3',
        'golden': '1.618 / 1',
        'ultra': '21 / 9',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Add a custom plugin for modern utilities
    function({ addUtilities, theme }: any) {
      const newUtilities = {
        // Modern Glassmorphism Utilities
        '.glass-modern': {
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: 'var(--shadow-glass)',
        },
        '.glass-elevated': {
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.20)',
          boxShadow: 'var(--shadow-glass-lg)',
        },
        '.glass-subtle': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px) saturate(150%)',
          WebkitBackdropFilter: 'blur(16px) saturate(150%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        },
        
        // Background Gradient Utilities
        '.bg-gradient-animated': {
          background: 'var(--gradient-bg-animated)',
          backgroundAttachment: 'fixed',
          animation: 'gradient-shift 8s ease-in-out infinite',
        },
        '.bg-gradient-mesh': {
          background: 'var(--gradient-bg-mesh)',
          backgroundAttachment: 'fixed',
        },
        '.bg-gradient-aurora': {
          background: 'var(--gradient-aurora)',
          backgroundAttachment: 'fixed',
          animation: 'aurora-flow 12s ease-in-out infinite',
        },
        '.bg-gradient-depth': {
          background: 'var(--gradient-depth)',
          backgroundAttachment: 'fixed',
        },
        
        // Text Gradient Utilities
        '.text-gradient': {
          background: 'var(--gradient-cosmic)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
        '.text-gradient-emerald': {
          background: 'var(--gradient-emerald)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
        '.text-gradient-aurora': {
          background: 'var(--gradient-aurora)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
        
        // Gradient Borders
        '.border-gradient': {
          position: 'relative',
          border: '1px solid transparent',
          backgroundClip: 'padding-box',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '0',
            padding: '1px',
            background: 'var(--gradient-cosmic)',
            borderRadius: 'inherit',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
          },
        },
        '.border-gradient-emerald': {
          position: 'relative',
          border: '1px solid transparent',
          backgroundClip: 'padding-box',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '0',
            padding: '1px',
            background: 'var(--gradient-emerald)',
            borderRadius: 'inherit',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
          },
        },
        
        // Modern Scrollbar
        '.scrollbar-modern': {
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            border: '2px solid transparent',
            backgroundClip: 'content-box',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255, 255, 255, 0.3)',
            backgroundClip: 'content-box',
          },
        },
        
        // Safe Area Utilities
        '.safe-top': {
          paddingTop: 'env(safe-area-inset-top)',
        },
        '.safe-bottom': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
        '.safe-left': {
          paddingLeft: 'env(safe-area-inset-left)',
        },
        '.safe-right': {
          paddingRight: 'env(safe-area-inset-right)',
        },
        
        // Modern Focus Styles
        '.focus-modern': {
          outline: '2px solid hsl(var(--emerald-500))',
          outlineOffset: '2px',
        },
      }
      
      addUtilities(newUtilities)
    }
  ],
} satisfies Config;