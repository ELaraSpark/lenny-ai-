// This file is used by Netlify to configure the build process
// It ensures that the _redirects file is properly copied to the dist folder

import fs from 'fs';
import path from 'path';

// Function to copy _redirects file to dist folder
function copyRedirectsFile() {
  try {
    // Check if dist folder exists
    if (!fs.existsSync('dist')) {
      console.error('Error: dist folder does not exist');
      return;
    }

    // Check if _redirects file exists in public folder
    if (!fs.existsSync('public/_redirects')) {
      console.error('Error: public/_redirects file does not exist');
      return;
    }

    // Copy _redirects file to dist folder
    fs.copyFileSync('public/_redirects', 'dist/_redirects');
    console.log('Successfully copied _redirects file to dist folder');
  } catch (error) {
    console.error('Error copying _redirects file:', error);
  }
}

// Execute the function
copyRedirectsFile();
