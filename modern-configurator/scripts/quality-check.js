#!/usr/bin/env node

/**
 * Quality check script
 * Runs all quality checks and validation
 */

const { execSync } = require('child_process');
const chalk = require('chalk');

console.log(chalk.blue('🔍 Running quality checks...\n'));

const checks = [
  {
    name: 'TypeScript Type Check',
    command: 'npm run type-check',
    critical: true
  },
  {
    name: 'ESLint',
    command: 'npm run lint',
    critical: true
  },
  {
    name: 'Prettier Format Check',
    command: 'npm run format:check',
    critical: false
  },
  {
    name: 'Unit Tests',
    command: 'npm run test:run',
    critical: true
  },
  {
    name: 'Build Test',
    command: 'npm run build',
    critical: true
  }
];

let passed = 0;
let failed = 0;
let warnings = 0;

for (const check of checks) {
  try {
    console.log(chalk.yellow(`⏳ Running ${check.name}...`));
    execSync(check.command, { stdio: 'pipe' });
    console.log(chalk.green(`✅ ${check.name} passed`));
    passed++;
  } catch (error) {
    if (check.critical) {
      console.log(chalk.red(`❌ ${check.name} failed`));
      failed++;
    } else {
      console.log(chalk.yellow(`⚠️  ${check.name} failed (non-critical)`));
      warnings++;
    }
  }
  console.log('');
}

// Summary
console.log(chalk.blue('📊 Quality Check Summary:'));
console.log(chalk.green(`✅ Passed: ${passed}`));
if (warnings > 0) {
  console.log(chalk.yellow(`⚠️  Warnings: ${warnings}`));
}
if (failed > 0) {
  console.log(chalk.red(`❌ Failed: ${failed}`));
}

if (failed > 0) {
  console.log(chalk.red('\n❌ Quality checks failed! Please fix the issues above.'));
  process.exit(1);
} else if (warnings > 0) {
  console.log(chalk.yellow('\n⚠️  Quality checks passed with warnings.'));
} else {
  console.log(chalk.green('\n🎉 All quality checks passed!'));
}
