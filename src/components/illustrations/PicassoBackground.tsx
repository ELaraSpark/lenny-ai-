import React from 'react';
import { cn } from '@/lib/utils';

export interface PicassoBackgroundProps {
  pattern?: 'dots' | 'lines' | 'shapes' | 'medical' | 'abstractArt' | 'childishScribbles'; // Added new pattern
  color?: string;
  opacity?: number;
  className?: string;
  children?: React.ReactNode;
}

/**
 * PicassoBackground component for adding subtle Picasso-style background patterns
 * 
 * @param pattern - The pattern type to display (dots, lines, shapes, medical, abstractArt, childishScribbles)
 * @param color - Optional color class (e.g., 'text-medical-red', 'text-primary')
 * @param opacity - Opacity value between 0 and 100
 * @param className - Additional classes to apply
 * @param children - Child elements to render on top of the background
 */
export const PicassoBackground: React.FC<PicassoBackgroundProps> = ({
  pattern = 'abstractArt', // Default to abstractArt for more Picasso-like feel
  color = 'text-primary', // Use new primary color
  opacity = 10, // Slightly higher opacity
  className,
  children,
}) => {
  // Convert color class to a CSS variable or direct color value
  const colorValue = color.startsWith('text-') 
    ? `var(--${color.replace('text-', '')})` 
    : color;

  // Pattern SVG definitions
  const patterns = {
    dots: `
      <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
        <circle cx="2" cy="2" r="1" fill="currentColor" />
        <circle cx="10" cy="10" r="1" fill="currentColor" />
        <circle cx="18" cy="18" r="1" fill="currentColor" />
        <circle cx="18" cy="2" r="1" fill="currentColor" />
        <circle cx="2" cy="18" r="1" fill="currentColor" />
      </svg>
    `,
    lines: `
      <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 5 L20 5" stroke="currentColor" stroke-width="0.5" />
        <path d="M0 15 L20 15" stroke="currentColor" stroke-width="0.5" />
        <path d="M5 0 L5 20" stroke="currentColor" stroke-width="0.5" />
        <path d="M15 0 L15 20" stroke="currentColor" stroke-width="0.5" />
      </svg>
    `,
    shapes: `
      <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="10" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="0.5" />
        <circle cx="30" cy="10" r="5" fill="none" stroke="currentColor" stroke-width="0.5" />
        <path d="M10 30 L15 25 L20 30 L15 35 Z" fill="none" stroke="currentColor" stroke-width="0.5" />
        <path d="M25 25 C30 20, 35 20, 35 30" stroke="currentColor" fill="none" stroke-width="0.5" />
      </svg>
    `,
    medical: `
      <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 10 L30 10 L30 20 L40 20 L40 30 L30 30 L30 40 L20 40 L20 30 L10 30 L10 20 L20 20 Z" fill="none" stroke="currentColor" stroke-width="0.5" />
        <circle cx="10" cy="10" r="3" fill="none" stroke="currentColor" stroke-width="0.5" />
        <circle cx="40" cy="40" r="3" fill="none" stroke="currentColor" stroke-width="0.5" />
        <path d="M5 25 C10 15, 15 15, 20 25" stroke="currentColor" fill="none" stroke-width="0.5" />
        <path d="M30 25 C35 15, 40 15, 45 25" stroke="currentColor" fill="none" stroke-width="0.5" />
      </svg>
    `,
    abstractArt: `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <!-- Enhanced Picasso-style Face with overlapping elements -->
        <path d="M20 20 Q40 10 60 20 T100 20 Q80 40 60 60 T20 60 Z" fill="#4A9270" fill-opacity="0.3" /> 
        <path d="M50 30 Q70 20 90 30 T130 30 Q110 50 90 70 T50 70 Z" fill="#6AB187" fill-opacity="0.3" />
        <circle cx="45" cy="40" r="3" fill="#2D3C35" />
        <circle cx="85" cy="40" r="5" fill="#2D3C35" />
        <path d="M50 55 Q70 65 90 55" stroke="#2D3C35" stroke-width="1.5" fill="none" />
        
        <!-- Abstract Medical Symbol -->
        <path d="M140 40 L160 40 L160 60 L180 60 L180 80 L160 80 L160 100 L140 100 L140 80 L120 80 L120 60 L140 60 Z" 
              fill="#E09F5A" fill-opacity="0.2" stroke="#E09F5A" stroke-width="1" />
        
        <!-- Childish Flower -->
        <circle cx="40" cy="140" r="15" fill="#E09F5A" fill-opacity="0.3" />
        <circle cx="25" cy="125" r="10" fill="#6AB187" fill-opacity="0.3" />
        <circle cx="55" cy="125" r="10" fill="#6AB187" fill-opacity="0.3" />
        <circle cx="25" cy="155" r="10" fill="#6AB187" fill-opacity="0.3" />
        <circle cx="55" cy="155" r="10" fill="#6AB187" fill-opacity="0.3" />
        <path d="M40 110 L40 140" stroke="#4A9270" stroke-width="2" />

        <!-- Abstract Shapes with Transparency -->
        <rect x="120" y="120" width="40" height="40" rx="10" fill="#4A9270" fill-opacity="0.2" />
        <circle cx="160" cy="160" r="25" fill="#6AB187" fill-opacity="0.2" />
        <path d="M100 180 Q120 150 140 180 T180 180" stroke="#E09F5A" stroke-width="2" fill="none" />
        
        <!-- Childish Scribbles -->
        <path d="M10 90 C20 70, 40 110, 60 90 S80 110, 100 90" stroke="#4A9270" stroke-width="1.5" fill="none" />
        <path d="M110 10 C130 30, 150 10, 170 30" stroke="#E09F5A" stroke-width="1.5" fill="none" />
      </svg>
    `,
    childishScribbles: `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <!-- Simple wavy lines -->
        <path d="M10 10 C 20 20, 40 0, 50 10 S 70 0, 80 10" stroke="#4A9270" stroke-width="1" fill="none" stroke-linecap="round" />
        <path d="M10 30 C 20 40, 40 20, 50 30 S 70 20, 80 30" stroke="#6AB187" stroke-width="1" fill="none" stroke-linecap="round" />
        <path d="M10 50 C 20 60, 40 40, 50 50 S 70 40, 80 50" stroke="#E09F5A" stroke-width="1" fill="none" stroke-linecap="round" />
        
        <!-- Simple circles -->
        <circle cx="20" cy="70" r="5" fill="none" stroke="#4A9270" stroke-width="1" />
        <circle cx="50" cy="80" r="3" fill="#6AB187" fill-opacity="0.5" />
        <circle cx="80" cy="70" r="4" fill="none" stroke="#E09F5A" stroke-width="1" />

        <!-- Simple square -->
        <rect x="65" y="15" width="10" height="10" rx="2" fill="none" stroke="#4A9270" stroke-width="1" transform="rotate(15 70 20)" />
      </svg>
    `
  };

  // Create a data URL for the SVG pattern
  const patternSvg = patterns[pattern];
  const dataUrl = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(patternSvg)}")`;

  // Create the style object for the background
  const style = {
    backgroundImage: dataUrl,
    backgroundRepeat: 'repeat',
    backgroundSize: pattern === 'abstractArt' ? '200px 200px' : (pattern === 'medical' ? '100px 100px' : (pattern === 'childishScribbles' ? '100px 100px' : '40px 40px')), // Adjust size for patterns
    backgroundColor: '#FFFFFF',
    color: colorValue, // Used for stroke/fill="currentColor" in SVGs
    opacity: opacity / 100,
  };

  return (
    <div className={cn("relative", className)}>
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={style} 
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
