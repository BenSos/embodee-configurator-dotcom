#!/usr/bin/env node

/**
 * Build pipeline script
 * Handles the complete build process with validation and optimization
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const mode = process.argv[2] || 'production';
const isDev = mode === 'development';

console.log(`🏗️  Starting ${mode} build pipeline...\n`);

// Step 1: Clean previous build
console.log('🧹 Cleaning previous build...');
try {
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  console.log('✅ Clean completed\n');
} catch (error) {
  console.error('❌ Clean failed:', error.message);
  process.exit(1);
}

// Step 2: Type checking
console.log('🔍 Running type check...');
try {
  execSync('npm run type-check', { stdio: 'inherit' });
  console.log('✅ Type check passed\n');
} catch (error) {
  console.error('❌ Type check failed');
  process.exit(1);
}

// Step 3: Linting
console.log('🧹 Running linter...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ Linting passed\n');
} catch (error) {
  console.error('❌ Linting failed');
  process.exit(1);
}

// Step 4: Testing (only for production)
if (!isDev) {
  console.log('🧪 Running tests...');
  try {
    execSync('npm run test:run', { stdio: 'inherit' });
    console.log('✅ Tests passed\n');
  } catch (error) {
    console.error('❌ Tests failed');
    process.exit(1);
  }
}

// Step 5: Build
console.log(`🔨 Building for ${mode}...`);
try {
  const buildCommand = isDev ? 'npm run build:dev' : 'npm run build';
  execSync(buildCommand, { stdio: 'inherit' });
  console.log('✅ Build completed\n');
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// Step 6: Post-build validation
console.log('🔍 Running post-build type check...');
try {
  execSync('npm run type-check:build', { stdio: 'inherit' });
  console.log('✅ Post-build validation passed\n');
} catch (error) {
  console.warn('⚠️  Post-build validation failed, but continuing...\n');
}

// Step 7: Build analysis (only for production)
if (!isDev) {
  console.log('📊 Generating build analysis...');
  try {
    execSync('npm run build:analyze', { stdio: 'inherit' });
    console.log('✅ Build analysis completed\n');
  } catch (error) {
    console.warn('⚠️  Build analysis failed, but continuing...\n');
  }
}

// Step 8: Build summary
console.log('📋 Build Summary:');
console.log(`  Mode: ${mode}`);
console.log(`  Output: dist/`);
console.log(`  Assets: dist/assets/`);
if (fs.existsSync('dist/bundle-analysis.html')) {
  console.log(`  Analysis: dist/bundle-analysis.html`);
}
console.log(`  Size: ${getDirSize('dist')} bytes`);

console.log('\n🎉 Build pipeline completed successfully!');

function getDirSize(dirPath) {
  let totalSize = 0;
  try {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        totalSize += getDirSize(filePath);
      } else {
        totalSize += stats.size;
      }
    }
  } catch (error) {
    return 0;
  }
  return totalSize;
}
