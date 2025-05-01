// vercel-postbuild.js
// This script performs post-build operations for Vercel deployment
// It copies necessary files to the dist folder in a cross-platform way

const fs = require('fs');
const path = require('path');

console.log('🛠️ Running Vercel post-build operations...');

// Function to copy a file if it exists
function copyFileIfExists(source, destination) {
  try {
    if (fs.existsSync(source)) {
      // Ensure the destination directory exists
      const destDir = path.dirname(destination);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
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

// Function to recursively copy a directory
function copyDirectory(source, destination) {
  try {
    if (!fs.existsSync(source)) {
      console.log(`⚠️ Source directory not found: ${source}`);
      return false;
    }

    // Create the destination directory if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    // Read all items in the source directory
    const items = fs.readdirSync(source);
    
    // Copy each item
    for (const item of items) {
      const srcPath = path.join(source, item);
      const destPath = path.join(destination, item);
      
      const stats = fs.statSync(srcPath);
      
      if (stats.isDirectory()) {
        // Recursively copy subdirectories
        copyDirectory(srcPath, destPath);
      } else {
        // Copy files
        fs.copyFileSync(srcPath, destPath);
      }
    }
    
    console.log(`✅ Copied directory ${source} to ${destination}`);
    return true;
  } catch (error) {
    console.error(`❌ Error copying directory ${source} to ${destination}:`, error);
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

// Copy other important files from public to dist
const otherImportantFiles = [
  'favicon.ico',
  'og-image.png',
  'placeholder.svg'
];

for (const file of otherImportantFiles) {
  copyFileIfExists(path.join('public', file), path.join('dist', file));
}

// Ensure agents, illustrations, and logos directories are copied
const directories = [
  { src: 'public/agents', dest: 'dist/agents' },
  { src: 'public/illustrations', dest: 'dist/illustrations' },
  { src: 'public/logos', dest: 'dist/logos' }
];

for (const dir of directories) {
  if (fs.existsSync(dir.src)) {
    copyDirectory(dir.src, dir.dest);
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