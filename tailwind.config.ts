import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate"; // Import the animate plugin
import typography from "@tailwindcss/typography"; // Import the typography plugin

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
      colors: {
        // Shadcn UI default colors using CSS variables
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))", // Use CSS variable for primary (green)
          foreground: "hsl(var(--primary-foreground))",
          light: "#6366F1", // Lighter shade of primary for gradients
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // Use CSS variable for accent (orange)
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Friendly Innovation Palette
        'teal': '#00B8D9',
        'coral': '#FF5630',
        'yellow': '#FFAB00',
        'purple': '#6554C0',
        'green': '#36B37E',
        // Legacy colors
        'medical-green': '#4A9270',
        'warm-accent': '#E09F5A',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-x": "gradient-x 15s ease infinite",
        "fade-in-up": "fade-in-up 0.5s ease-out",
      },
      fontFamily: {
        sans: ["Inter var", "Inter", "system-ui", "sans-serif"],
        display: ["SF Pro Display", "Inter", "system-ui", "sans-serif"],
        handwritten: ['Caveat', 'cursive'], // Add handwritten font
      },
      // Add other extensions like boxShadow, backgroundImage if they were present
    },
  },
  plugins: [tailwindcssAnimate, typography],
  // Safelist classes needed for dynamic colors
  safelist: [
    // Friendly Innovation Palette
    'bg-[#00B8D9]', 'text-[#00B8D9]', // Vibrant Teal
    'bg-[#FF5630]', 'text-[#FF5630]', // Energetic Coral
    'bg-[#FFAB00]', 'text-[#FFAB00]', // Sunshine Yellow
    'bg-[#6554C0]', 'text-[#6554C0]', // Playful Purple
    'bg-[#36B37E]', 'text-[#36B37E]', // Fresh Green
    
    // Legacy colors
    'bg-[#4A9270]', 'text-[#4A9270]', // Medical Green
    'bg-[#E09F5A]', 'text-[#E09F5A]', // Warm Orange
    
    // Named color classes
    'bg-teal', 'text-teal',
    'bg-coral', 'text-coral',
    'bg-yellow', 'text-yellow',
    'bg-purple', 'text-purple',
    'bg-green', 'text-green',
  ],
} satisfies Config;
