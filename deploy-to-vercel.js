#!/usr/bin/env node

/**
 * Vercel deployment helper script
 * Run this script with: node deploy-to-vercel.js
 */

const { execSync } = require('child_process');
<<<<<<< HEAD
=======
const fs = require('fs');
>>>>>>> ff82be1893e89089ffb163272ddbabefbad88bdc

console.log('🚀 Starting Vercel deployment for Lenny AI...');

try {
  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    console.log('✅ Vercel CLI is installed');
  } catch (error) {
    console.log('⚠️ Vercel CLI not found. Installing...');
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI installed successfully');
  }

<<<<<<< HEAD
=======
  // Check if environment variables are properly configured
  console.log('🔍 Checking environment configuration...');
  const envFiles = ['.env', '.env.production'];
  let hasValidEnv = false;
  
  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      console.log(`✅ Found ${envFile} file`);
      hasValidEnv = true;
      break;
    }
  }
  
  if (!hasValidEnv) {
    console.log('⚠️ No environment file found. Creating .env.production from template...');
    // Copy from the existing environment file with the unusual name
    if (fs.existsSync('cUserssnymaDocumentsGitHubLeny-ai2.env')) {
      fs.copyFileSync('cUserssnymaDocumentsGitHubLeny-ai2.env', '.env.production');
      console.log('✅ Created .env.production file');
    } else {
      console.error('❌ No environment template found. Deployment may fail without proper environment variables.');
    }
  }

  // Clean up any previous build artifacts
  console.log('🧹 Cleaning up previous build artifacts...');
  try {
    execSync('npm run clean', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️ Clean command failed, continuing anyway...');
  }

>>>>>>> ff82be1893e89089ffb163272ddbabefbad88bdc
  // Build the project
  console.log('🔨 Building project...');
  execSync('npm run build:vercel', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');

<<<<<<< HEAD
=======
  // Ensure _redirects is in the dist folder
  if (fs.existsSync('public/_redirects') && !fs.existsSync('dist/_redirects')) {
    fs.copyFileSync('public/_redirects', 'dist/_redirects');
    console.log('✅ Copied _redirects file to dist folder');
  }

>>>>>>> ff82be1893e89089ffb163272ddbabefbad88bdc
  // Deploy to Vercel
  console.log('🚀 Deploying to Vercel...');
  execSync('vercel --prod', { stdio: 'inherit' });
  
  console.log('🎉 Deployment completed successfully!');
  console.log('Visit your deployed application at the URL shown above');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}