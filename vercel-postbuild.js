// vercel-postbuild.js
// This script performs post-build operations for Vercel deployment
// It copies necessary files to the dist folder in a cross-platform way

import fs from 'fs';
import path from 'path';

console.log('🛠️ Running Vercel post-build operations...');

// Function to copy a file if it exists
function copyFileIfExists(source, destination) {
  try {
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, destination);
      console.log(`✅ Copied ${source} to ${destination}`);
      return true;
    } else {
      console.log(`⚠️ Source file not found: ${source}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error copying ${source} to ${destination}:`, error);
    return false;
  }
}

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  console.error('❌ Error: dist directory does not exist');
  process.exit(1);
}

// Copy _redirects file if it exists
copyFileIfExists('public/_redirects', 'dist/_redirects');

// Copy other important files from public to dist if needed
const otherImportantFiles = [
  'favicon.ico',
  'og-image.png',
  'placeholder.svg'
];

for (const file of otherImportantFiles) {
  copyFileIfExists(`public/${file}`, `dist/${file}`);
}

// Ensure agents and illustrations directories are copied if they exist
const directories = [
  { src: 'public/agents', dest: 'dist/agents' },
  { src: 'public/illustrations', dest: 'dist/illustrations' },
  { src: 'public/logos', dest: 'dist/logos' }
];

for (const dir of directories) {
  if (fs.existsSync(dir.src)) {
    if (!fs.existsSync(dir.dest)) {
      fs.mkdirSync(dir.dest, { recursive: true });
    }
    
    const files = fs.readdirSync(dir.src);
    for (const file of files) {
      copyFileIfExists(path.join(dir.src, file), path.join(dir.dest, file));
    }
  }
}

// Add SPA routing fix to index.html if needed
try {
  const indexPath = 'dist/index.html';
  if (fs.existsSync(indexPath)) {
    // Check if we need to add base tag for SPA routing
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    if (!indexContent.includes('<base href="/"')) {
      const updatedContent = indexContent.replace(
        '<head>',
        '<head>\n    <base href="/">'
      );
      fs.writeFileSync(indexPath, updatedContent);
      console.log('✅ Added base href tag to index.html for proper SPA routing');
    }
  }
} catch (error) {
  console.error('❌ Error modifying index.html:', error);
}

console.log('✅ Vercel post-build operations completed successfully!');