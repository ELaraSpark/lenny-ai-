#!/usr/bin/env node

/**
 * Vercel deployment helper script
 * Run this script with: node deploy-to-vercel.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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
    console.log('⚠️ No environment file found. Creating .env.production from vercel.json...');
    // Create a basic .env.production file from vercel.json env values
    try {
      const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
      if (vercelConfig.env) {
        const envContent = Object.entries(vercelConfig.env)
          .map(([key, value]) => `${key}=${value}`)
          .join('\n');
        fs.writeFileSync('.env.production', envContent);
        console.log('✅ Created .env.production file from vercel.json configuration');
        hasValidEnv = true;
      }
    } catch (error) {
      console.log('⚠️ Could not create environment file from vercel.json:', error.message);
    }
    
    if (!hasValidEnv) {
      console.error('❌ No environment configuration found. Deployment may fail without proper environment variables.');
    }
  }

  // Clean up any previous build artifacts
  console.log('🧹 Cleaning up previous build artifacts...');
  try {
    execSync('npm run clean', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️ Clean command failed, continuing anyway...');
    // Create clean directory if it doesn't exist
    if (fs.existsSync('dist')) {
      try {
        if (process.platform === 'win32') {
          execSync('rmdir /s /q dist', { stdio: 'inherit' });
        } else {
          execSync('rm -rf dist', { stdio: 'inherit' });
        }
      } catch (e) {
        console.log('⚠️ Could not remove dist directory, continuing anyway...');
      }
    }
    // Create dist directory
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }
  }

  // Build the project
  console.log('🔨 Building project...');
  execSync('npm run build:vercel', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');

  // Ensure _redirects is in the dist folder
  if (fs.existsSync('public/_redirects') && !fs.existsSync('dist/_redirects')) {
    fs.copyFileSync('public/_redirects', 'dist/_redirects');
    console.log('✅ Copied _redirects file to dist folder');
  }

  // Deploy to Vercel
  console.log('🚀 Deploying to Vercel...');
  execSync('vercel --prod', { stdio: 'inherit' });
  
  console.log('🎉 Deployment completed successfully!');
  console.log('Visit your deployed application at the URL shown above');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}