#!/usr/bin/env node

/**
 * Vercel deployment helper script
 * Run with: node deploy.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log(`🚀 Starting deployment for Leny AI to Vercel...`);

try {
  // Ensure environment variables are properly set up
  console.log('🔍 Checking environment configuration...');
  ensureEnvironmentFiles();
  
  // Clean up previous build artifacts
  console.log('🧹 Cleaning up previous build artifacts...');
  try {
    execSync('npm run clean', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️ Clean command failed, continuing anyway...');
  }
  
  // Build for Vercel
  console.log(`🔨 Building for Vercel...`);
  execSync('npm run build:vercel', { stdio: 'inherit' });
  
  // Deploy to Vercel
  deployToVercel();
  
  console.log('🎉 Deployment completed successfully!');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}

function ensureEnvironmentFiles() {
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
    console.log('⚠️ No standard environment file found. Checking for alternatives...');
    
    // Check for the unusual environment file name
    if (fs.existsSync('cUserssnymaDocumentsGitHubLeny-ai2.env')) {
      console.log('📄 Found environment file with unusual name, copying to .env.production');
      fs.copyFileSync('cUserssnymaDocumentsGitHubLeny-ai2.env', '.env.production');
      console.log('✅ Created .env.production file');
    } else {
      console.error('❌ No environment file found! This may cause deployment issues.');
      
      // Create a template .env.production if none exists
      if (!fs.existsSync('.env.production')) {
        const envTemplate = 
`VITE_SUPABASE_URL=https://uahphakjrkwfhikyxpqt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaHBoYWtqcmt3Zmhpa3l4cHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MTk3NDMsImV4cCI6MjA2MDk5NTc0M30.iceEb5GvCBzE4wA7U92DxGJZuLt0m-RNcgqVKBIh0EA`;
        
        fs.writeFileSync('.env.production', envTemplate);
        console.log('✅ Created template .env.production file');
      }
    }
  }
}

function deployToVercel() {
  console.log('🚀 Deploying to Vercel...');
  
  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    console.log('✅ Vercel CLI is installed');
  } catch (error) {
    console.log('⚠️ Vercel CLI not found. Installing...');
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI installed successfully');
  }
  
  // Ensure _redirects is in the dist folder
  if (fs.existsSync('public/_redirects') && !fs.existsSync('dist/_redirects')) {
    fs.copyFileSync('public/_redirects', 'dist/_redirects');
    console.log('✅ Copied _redirects file to dist folder');
  }
  
  // Deploy to Vercel
  execSync('vercel --prod', { stdio: 'inherit' });
}