import React, { SVGProps } from 'react';

// Picasso-style Doctor
export const PicassoDoctor: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor" />
    <path d="M9 9c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v1h-6V9z" fill="currentColor" />
    <path d="M15 12v3c0 1.1-.9 2-2 2h-2c-1.1 0-2-.9-2-2v-3h6z" fill="currentColor" />
    <circle cx="8" cy="10" r="1" fill="currentColor" />
    <circle cx="16" cy="10" r="1" fill="currentColor" />
  </svg>
);

// Picasso-style Stethoscope
export const PicassoStethoscope: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M19 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .73.27 1.4.71 1.92L16 8.66V13c0 1.1-.9 2-2 2s-2-.9-2-2V7.16l3.35-3.35c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0L11 6.76V13c0 2.21 1.79 4 4 4s4-1.79 4-4V9.66l.29-.29c.73.52 1.4.79 2.13.79" fill="currentColor" />
    <path d="M9.32 11.68L8 13l-1.32-1.32C6.24 11.24 5.62 11 5 11s-1.24.24-1.68.68C2.76 12.24 2.5 12.86 2.5 13.5S2.76 14.76 3.2 15.2c.44.44 1.06.68 1.68.68.44 0 .88-.12 1.32-.36V19c0 .55.45 1 1 1s1-.45 1-1v-3.68c.44.36.88.48 1.32.48.62 0 1.24-.24 1.68-.68.44-.44.68-1.06.68-1.68 0-.62-.24-1.24-.68-1.68-.44-.44-1.06-.68-1.68-.68-.62 0-1.24.24-1.68.68" fill="currentColor" />
  </svg>
);

// Picasso-style Heart
export const PicassoHeart: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" fill="currentColor" />
    <path d="M11.99 7.75c-.69 0-1.25.56-1.25 1.25 0 .4.2.75.49.97V12c0 .55.45 1 1 1h.5c.55 0 1-.45 1-1v-2.03c.29-.22.49-.57.49-.97 0-.69-.56-1.25-1.25-1.25z" fill="currentColor" />
  </svg>
);

// Picasso-style Brain
export const PicassoBrain: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M15.5 8c.83 0 1.5-.67 1.5-1.5S16.33 5 15.5 5 14 5.67 14 6.5 14.67 8 15.5 8zm0 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S14 10.33 14 9.5 14.67 8 15.5 8zm-7-3C7.67 5 7 5.67 7 6.5S7.67 8 8.5 8 10 7.33 10 6.5 9.33 5 8.5 5zm0 6C7.67 11 7 11.67 7 12.5S7.67 14 8.5 14 10 13.33 10 12.5 9.33 11 8.5 11zM12 1C5.93 1 1 5.93 1 12s4.93 11 11 11 11-4.93 11-11S18.07 1 12 1zm0 20c-4.96 0-9-4.04-9-9s4.04-9 9-9 9 4.04 9 9-4.04 9-9 9zm5.5-11c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-2 5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-7 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" fill="currentColor" />
  </svg>
);

// Picasso-style Medical Chart
export const PicassoMedicalChart: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="currentColor" />
  </svg>
);

// Picasso-style Microscope
export const PicassoMicroscope: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M13.35 10.5l-2.12-2.12 2.47-2.47 2.12 2.12-2.47 2.47zm5.3-5.3l-2.12-2.12-1.77 1.77 2.12 2.12 1.77-1.77zm-5.3-2.12l-1.77 1.77 2.12 2.12 1.77-1.77-2.12-2.12zm-9.7 9.7c-1.1 1.1-1.1 2.9 0 4l2.83 2.83 4-4-2.83-2.83c-1.1-1.1-2.9-1.1-4 0zm12.73 6.73L19.73 23H4.27l3.35-3.35c.39.39.84.69 1.35.89v-2.23l-2.83-2.83L9.62 12l1.06 1.06-1.42 1.42 2.83 2.83 1.42-1.42 1.06 1.06-2.48 2.48v2.23c.51-.2.96-.5 1.35-.89L17.73 23h-1.35l-4.24-4.24-1.42 1.42-.71-.71 1.42-1.42z" fill="currentColor" />
  </svg>
);

// Picasso-style DNA
export const PicassoDNA: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M4 2h2v2c0 1.44.56 2.8 1.57 3.83.3.3.63.56.98.77-1.81-.74-3.25-2.23-3.66-4.09C4.68 3.85 4.38 3 3.7 3 2.76 3 2 3.76 2 4.7v3.58c0 3.96 2.45 7.53 6.22 8.95-.17-.18-.33-.36-.48-.55C5.39 14.27 4 11.57 4 8.7V8h2v.7c0 2.16.98 4.2 2.67 5.6.69.56 1.27 1.26 1.72 2.06.23.4.46.83.63 1.3l.23.66c.15.45.57.74 1.05.74.58 0 1.05-.48 1.05-1.07 0-.1-.02-.21-.05-.31l-.22-.66c-.22-.65-.53-1.25-.87-1.78-.17-.27-.38-.5-.56-.75-.6-.82-1.27-1.6-2.02-2.31C8.87 10.64 8 8.74 8 6.7V4h8v2.7c0 2.87-1.39 5.57-3.74 7.28-.15.19-.31.37-.48.55 3.77-1.42 6.22-4.99 6.22-8.95V4.7c0-.94-.76-1.7-1.7-1.7-.68 0-.98.85-1.19 1.51-.41 1.86-1.85 3.35-3.66 4.09.35-.21.68-.47.98-.77C13.44 6.8 14 5.44 14 4V2h2v2c0 1.44.56 2.8 1.57 3.83.71.71 1.28 1.55 1.71 2.47.5 1.05.81 2.21.81 3.4v1.61c-.4.15-.82.29-1.26.43-.19.06-.38.12-.58.17-.21.05-.43.1-.65.14-.22.04-.44.07-.67.1-.23.03-.46.04-.7.04-.24 0-.47-.01-.7-.04-.23-.03-.45-.06-.67-.1-.22-.04-.44-.09-.65-.14-.2-.05-.39-.11-.58-.17-.44-.14-.86-.28-1.26-.43V18h-2v-2.61c-.4-.15-.82-.29-1.26-.43-.19-.06-.38-.12-.58-.17-.21-.05-.43-.1-.65-.14-.22-.04-.44-.07-.67-.1-.23-.03-.46-.04-.7-.04-.24 0-.47.01-.7.04-.23.03-.45.06-.67.1-.22.04-.44.09-.65.14-.2.05-.39.11-.58.17-.44.14-.86.28-1.26.43V18H4v-2.7c0-1.19.31-2.35.81-3.4.43-.92 1-1.76 1.71-2.47C7.44 8.8 8 7.44 8 6V4H6V2z" fill="currentColor" />
  </svg>
);

// Picasso-style Healing - Abstract Spiral of Life
export const PicassoHealing: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Abstract spiral shape */}
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor" />
    
    {/* Inner spiral elements */}
    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="currentColor" />
    
    {/* Abstract energy waves */}
    <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="currentColor" />
    
    {/* Decorative elements */}
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="15" cy="9" r="1" fill="currentColor" />
    <circle cx="9" cy="15" r="1" fill="currentColor" />
    <circle cx="15" cy="15" r="1" fill="currentColor" />
    <circle cx="9" cy="9" r="1" fill="currentColor" />
  </svg>
);

// Picasso-style Chat
export const PicassoChat: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" fill="currentColor" />
    <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" fill="currentColor" />
  </svg>
);

// Picasso-style Agent
export const PicassoAgent: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83z" fill="currentColor" />
    <path d="M12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11z" fill="currentColor" />
  </svg>
);

// Picasso-style Template
export const PicassoTemplate: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" fill="currentColor" />
    <path d="M7 7h10v2H7zm0 4h5v2H7zm0 4h5v2H7zm7 0h3v2h-3zm0-4h3v2h-3z" fill="currentColor" />
  </svg>
);

// Picasso-style Empty
export const PicassoEmpty: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" fill="currentColor" />
    <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-6h-8v-2h8v2z" fill="currentColor" />
  </svg>
);

// Map of illustration names to components
export const illustrationMap = {
  doctor: PicassoDoctor,
  stethoscope: PicassoStethoscope,
  heart: PicassoHeart,
  brain: PicassoBrain,
  chart: PicassoMedicalChart,
  microscope: PicassoMicroscope,
  dna: PicassoDNA,
  healing: PicassoHealing,
  chat: PicassoChat,
  agent: PicassoAgent,
  template: PicassoTemplate,
  empty: PicassoEmpty,
};

// Type for illustration names
export type IllustrationName = keyof typeof illustrationMap;
