import React, { createContext, useContext, useState, useEffect } from 'react';

// Define color themes
export interface ColorTheme {
  name: string;
  id: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export const colorThemes: ColorTheme[] = [
  {
    name: "Clinical",
    id: "clinical",
    description: "Clean and professional with calming blue tones",
    colors: {
      primary: "#0077b6",
      secondary: "#48cae4",
      accent: "#90e0ef",
      background: "#f8f9fa"
    }
  },
  {
    name: "Surgical",
    id: "surgical",
    description: "Precise and focused with teal accents",
    colors: {
      primary: "#2a9d8f",
      secondary: "#e9c46a",
      accent: "#f4a261",
      background: "#f8f9fa"
    }
  },
  {
    name: "Pediatric",
    id: "pediatric",
    description: "Friendly and approachable with warm colors",
    colors: {
      primary: "#ff9f1c",
      secondary: "#ffbf69",
      accent: "#cbf3f0",
      background: "#f8f9fa"
    }
  },
  {
    name: "Cardiology",
    id: "cardiology",
    description: "Vibrant and energetic with red tones",
    colors: {
      primary: "#ef476f",
      secondary: "#ffd166",
      accent: "#06d6a0",
      background: "#f8f9fa"
    }
  },
  {
    name: "Neurology",
    id: "neurology",
    description: "Deep and thoughtful with purple accents",
    colors: {
      primary: "#7209b7",
      secondary: "#3a0ca3",
      accent: "#4cc9f0",
      background: "#f8f9fa"
    }
  },
  {
    name: "Classic",
    id: "classic",
    description: "Traditional medical green palette with orange accent",
    colors: {
      primary: "#2d6a4f",
      secondary: "#40916c",
      accent: "#E09F5A", // Changed to orange accent
      background: "#FDFBF5" // Updated background to beige
    }
  },
  {
    name: "Medical Professional",
    id: "medical-professional",
    description: "Modern medical teal palette with pink and yellow accents",
    colors: {
      primary: "#00838F", // Teal primary color
      secondary: "#FF6B8B", // Pink secondary color
      accent: "#FFD166", // Yellow accent color
      background: "#F9FCFD" // Light neutral background
    }
  }
];

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  colorTheme: string;
  setColorTheme: (themeId: string) => void;
  getThemeById: (id: string) => ColorTheme | undefined;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage if available, otherwise use defaults
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as ThemeMode) || 'light';
  });
  
  // Use medical-professional theme as default
  const [colorTheme, setColorThemeState] = useState<string>('medical-professional');

  // Apply theme mode to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  // Function to convert hex to HSL
  const hexToHSL = (hex: string): string => {
    // Remove the # if present
    hex = hex.replace(/^#/, '');
    
    // Parse the hex values
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;
    
    // Find the min and max values to compute the lightness
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    
    // Calculate the lightness
    let l = (max + min) / 2;
    
    // Calculate the saturation
    let s = 0;
    if (max !== min) {
      s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
    }
    
    // Calculate the hue
    let h = 0;
    if (max !== min) {
      if (max === r) {
        h = (g - b) / (max - min) + (g < b ? 6 : 0);
      } else if (max === g) {
        h = (b - r) / (max - min) + 2;
      } else {
        h = (r - g) / (max - min) + 4;
      }
      h /= 6;
    }
    
    // Convert to degrees and round to integers
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    return `${h} ${s}% ${l}%`;
  };

  // Apply color theme to CSS variables
  useEffect(() => {
    const selectedTheme = colorThemes.find(theme => theme.id === colorTheme);
    if (selectedTheme) {
      const root = document.documentElement;
      
      // Apply the theme colors to CSS variables as HSL values
      root.style.setProperty('--primary', hexToHSL(selectedTheme.colors.primary));
      root.style.setProperty('--secondary', hexToHSL(selectedTheme.colors.secondary));
      root.style.setProperty('--accent', hexToHSL(selectedTheme.colors.accent));
      // Removed the line setting --background dynamically to allow index.css default to apply
      
      // Save to localStorage
      localStorage.setItem('colorTheme', colorTheme);
    }
  }, [colorTheme]);

  // Wrapper functions to set theme with localStorage persistence
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  const setColorTheme = (themeId: string) => {
    setColorThemeState(themeId);
  };

  // Helper function to get theme by ID
  const getThemeById = (id: string) => {
    return colorThemes.find(theme => theme.id === id);
  };

  return (
    <ThemeContext.Provider value={{ 
      themeMode, 
      setThemeMode, 
      colorTheme, 
      setColorTheme,
      getThemeById
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
