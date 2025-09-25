#!/usr/bin/env node

/**
 * Development setup script
 * Ensures all dependencies are installed and environment is ready
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Embodee Configurator development environment...\n');

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully\n');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed\n');
}

// Check if .env file exists, if not create from example
if (!fs.existsSync('.env') && fs.existsSync('env.development')) {
  console.log('📝 Creating .env file from development template...');
  try {
    fs.copyFileSync('env.development', '.env');
    console.log('✅ .env file created\n');
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
  }
}

// Run type checking
console.log('🔍 Running type check...');
try {
  execSync('npm run type-check', { stdio: 'inherit' });
  console.log('✅ Type check passed\n');
} catch (error) {
  console.warn('⚠️  Type check failed, but continuing...\n');
}

// Run linting
console.log('🧹 Running linter...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ Linting passed\n');
} catch (error) {
  console.warn('⚠️  Linting failed, but continuing...\n');
}

console.log('🎉 Development environment setup complete!');
console.log('\nAvailable commands:');
console.log('  npm run dev          - Start development server');
console.log('  npm run build        - Build for production');
console.log('  npm run test         - Run tests');
console.log('  npm run lint         - Run linter');
console.log('  npm run format       - Format code');
console.log('  npm run validate     - Run all checks');
