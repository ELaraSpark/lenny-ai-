#!/usr/bin/env node

/**
 * Vercel deployment helper script
 * Run this script with: node deploy-to-vercel.js
 */

const { execSync } = require('child_process');

console.log('🚀 Starting Vercel deployment for Leny-ai2...');

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

  // Build the project
  console.log('🔨 Building project...');
  execSync('npm run build:vercel', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');

  // Deploy to Vercel
  console.log('🚀 Deploying to Vercel...');
  execSync('vercel --prod', { stdio: 'inherit' });
  
  console.log('🎉 Deployment completed successfully!');
  console.log('Visit your deployed application at the URL shown above');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}