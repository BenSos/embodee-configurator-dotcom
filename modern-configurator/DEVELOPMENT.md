# Development Guide

## Quick Start

1. **Setup Development Environment**
   ```bash
   npm run dev-setup
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   - Main app: http://localhost:3000
   - Iframe test: http://localhost:3001

## Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run dev:host` - Start development server accessible from network
- `npm run dev-setup` - Setup development environment

### Building
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run build:analyze` - Build with bundle analysis
- `npm run build:pipeline` - Complete build pipeline
- `npm run build:pipeline:dev` - Development build pipeline

### Testing
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm run quality-check` - Run all quality checks

### Utilities
- `npm run clean` - Clean build directory
- `npm run validate` - Run all validation checks
- `npm run prepare` - Prepare for commit (runs validate)

## Project Structure

```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── test/               # Test utilities and setup
└── assets/             # Static assets

scripts/                # Build and development scripts
.github/workflows/      # CI/CD workflows
```

## Development Workflow

### 1. Feature Development
1. Create feature branch from `develop`
2. Make changes following coding standards
3. Run quality checks: `npm run quality-check`
4. Commit with conventional commit messages
5. Push and create pull request

### 2. Code Quality Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Comprehensive linting rules
- **Prettier**: Consistent code formatting
- **Testing**: Unit tests for all components
- **Accessibility**: JSX a11y rules enforced

### 3. Build Process
- **Development**: Fast builds with source maps
- **Production**: Optimized builds with minification
- **Analysis**: Bundle size analysis available
- **Validation**: Pre and post-build validation

## Environment Configuration

### Development
- Uses `env.development` file
- Debug mode enabled
- Hot reload enabled
- Source maps enabled

### Production
- Uses `env.production` file
- Debug mode disabled
- Optimized builds
- Minified assets

## Testing

### Running Tests
```bash
# Run all tests
npm run test

# Run tests once
npm run test:run

# Run with coverage
npm run test:coverage

# Run with UI
npm run test:ui
```

### Test Structure
- Unit tests: `*.test.ts` or `*.test.tsx`
- Test utilities: `src/test/setup.ts`
- Mock files: `src/test/__mocks__/`

## Deployment

### Staging
- Automatic deployment on `main` branch
- Quality checks must pass
- Build artifacts uploaded

### Production
- Manual deployment process
- Full quality validation
- Performance monitoring

## Troubleshooting

### Common Issues

1. **TypeScript Errors**
   ```bash
   npm run type-check
   ```

2. **Linting Issues**
   ```bash
   npm run lint:fix
   ```

3. **Build Failures**
   ```bash
   npm run clean
   npm run build
   ```

4. **Test Failures**
   ```bash
   npm run test:run
   ```

### Getting Help
- Check console output for detailed error messages
- Run `npm run quality-check` for comprehensive validation
- Review CI/CD logs for build issues
