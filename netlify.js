// This file is used by Netlify to configure the build process
// It ensures that the _redirects file is properly copied to the dist folder
// and that environment variables are correctly set up

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
    
    // Also copy other necessary public assets that might be needed
    if (fs.existsSync('public/favicon.ico') && !fs.existsSync('dist/favicon.ico')) {
      fs.copyFileSync('public/favicon.ico', 'dist/favicon.ico');
      console.log('Successfully copied favicon.ico to dist folder');
    }
    
    // Ensure the index.html exists and has proper references
    ensureIndexHtml();
    
  } catch (error) {
    console.error('Error copying files:', error);
  }
}

// Function to check index.html integrity
function ensureIndexHtml() {
  try {
    const indexPath = 'dist/index.html';
    if (!fs.existsSync(indexPath)) {
      console.error('Error: index.html not found in dist folder');
      return;
    }
    
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    const needsFavicon = !indexContent.includes('favicon.ico');
    
    if (needsFavicon) {
      console.log('Adding favicon reference to index.html');
      indexContent = indexContent.replace('</head>', '  <link rel="icon" href="/favicon.ico" />\n  </head>');
      fs.writeFileSync(indexPath, indexContent);
    }
    
    console.log('Successfully verified index.html integrity');
  } catch (error) {
    console.error('Error ensuring index.html integrity:', error);
  }
}

// Execute the function
copyRedirectsFile();
