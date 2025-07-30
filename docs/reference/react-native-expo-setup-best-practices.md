# React Native Expo Setup Best Practices

## Overview

This document outlines best practices for setting up a scalable and maintainable React Native Expo project from scratch, based on current industry standards and recommendations for 2024-2025.

## 1. Project Structure & Organization

### Recommended Structure

Use a feature-based organization for better scalability:

```
src/
  assets/         # images, fonts, icons
  api/            # API logic and network requests
  components/     # reusable UI components
  hooks/          # custom hooks
  contexts/       # React contexts (state management)
  navigation/     # navigation setup
  screens/        # each screen as a folder
  services/       # business/domain logic
  utils/          # generic utilities
  types/          # shared TypeScript types
  constants/      # constants and configuration
  styles/         # global styles
  tests/          # unit and integration tests
```

### File Naming Conventions

- **PascalCase** for components and screens
- **camelCase** for utilities and services
- **Co-locate** related files (components with their styles/tests)
- **Index files** for clean imports

### Screen Organization

```
screens/
  Camera/
    CameraScreen.tsx
    CameraScreen.styles.ts
    CameraScreen.test.tsx
    components/
      CameraOverlay.tsx
      CameraControls.tsx
    hooks/
      useCameraPermissions.ts
```

## 2. TypeScript Configuration

### Base Configuration

Extend the official React Native TypeScript configuration:

```json
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/screens/*": ["screens/*"],
      "@/services/*": ["services/*"]
    }
  },
  "include": ["src/**/*", "App.tsx"],
  "exclude": ["node_modules", "dist", "build"]
}
```

### Type Organization

- **Centralized types**: `/src/types` for shared interfaces
- **Component-level types**: Define at the top of component files
- **API types**: Generate from OpenAPI specs when possible

## 3. State Management

### Recommended: Zustand

**Why Zustand:**

- Lightweight (2.9kb)
- Minimal boilerplate
- Excellent TypeScript support
- Great performance
- Easy testing

```typescript
// stores/jobStore.ts
import { create } from 'zustand';
import { Job } from '@/types';

interface JobState {
  jobs: Job[];
  currentJob: Job | null;
  addJob: (job: Job) => void;
  setCurrentJob: (job: Job) => void;
}

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  currentJob: null,
  addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
  setCurrentJob: (job) => set({ currentJob: job }),
}));
```

### Alternative: Redux Toolkit

Use for complex applications requiring:

- Time-travel debugging
- Extensive middleware ecosystem
- Team familiarity with Redux patterns

### Context API Usage

**Only use for:**

- Theme/localization (infrequently changing)
- Authentication state
- Simple, read-mostly data

**Avoid for:**

- Frequently updated state
- Complex state logic
- Performance-critical updates

## 4. Navigation Architecture

### Recommended: Expo Router

**Benefits:**

- File-based routing (convention over configuration)
- Better performance
- Improved developer experience
- Built-in TypeScript support

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="camera" options={{ title: 'Camera' }} />
    </Stack>
  )
}
```

### Alternative: React Navigation

Use when you need:

- Highly customized navigation patterns
- Complex nested navigators
- Existing codebase migration

## 5. Testing Framework Setup

### Unit & Integration Testing

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "preset": "jest-expo",
    "setupFilesAfterEnv": ["<rootDir>/src/tests/setup.ts"],
    "testMatch": ["**/__tests__/**/*.(ts|tsx)", "**/*.(test|spec).(ts|tsx)"],
    "collectCoverageFrom": ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/tests/**/*"]
  }
}
```

### Component Testing

```typescript
// src/tests/setup.ts
import '@testing-library/jest-native/extend-expect';
import { jest } from '@jest/globals';

// Mock expo modules
jest.mock('expo-camera', () => ({
  Camera: 'Camera',
  CameraType: {},
}));
```

### E2E Testing

**Recommended: Maestro** (easier setup)

```yaml
# .maestro/test_camera_flow.yaml
appId: com.snapscope.app
---
- launchApp
- tapOn: 'Camera'
- assertVisible: 'Take Photo'
- tapOn: 'Take Photo'
- assertVisible: 'Photo captured'
```

**Alternative: Detox** (more mature, complex setup)

## 6. CI/CD Pipeline

### GitHub Actions with EAS

```yaml
# .github/workflows/build.yml
name: Build and Deploy
on:
  push:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Setup Expo
        uses: expo/expo-github-action@v7
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build app
        run: eas build --platform all --non-interactive
```

### EAS Configuration

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "distribution": "store"
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890"
      },
      "android": {
        "serviceAccountKeyPath": "../path/to/api-key.json",
        "track": "internal"
      }
    }
  }
}
```

## 7. Code Quality Tools

### ESLint Configuration

```json
{
  "extends": ["expo", "@react-native-community", "airbnb-typescript", "prettier"],
  "rules": {
    "react/require-default-props": "off",
    "react/jsx-props-no-spreading": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  }
}
```

### Prettier Configuration

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true
}
```

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write", "git add"]
  }
}
```

## 8. Environment Configuration

### Environment Variables

```typescript
// src/config/env.ts
const config = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  APP_ENV: process.env.EXPO_PUBLIC_APP_ENV || 'development',
};

export default config;
```

### Multiple Environments

```bash
# .env.development
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_APP_ENV=development

# .env.staging
EXPO_PUBLIC_API_URL=https://staging-api.snapscope.com
EXPO_PUBLIC_APP_ENV=staging

# .env.production
EXPO_PUBLIC_API_URL=https://api.snapscope.com
EXPO_PUBLIC_APP_ENV=production
```

## 9. Monorepo Considerations

### Yarn Workspaces Setup

```json
{
  "name": "snapscope-monorepo",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "yarn workspace @snapscope/mobile start",
    "build": "yarn workspaces run build"
  }
}
```

### Metro Configuration

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Monorepo support
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
```

## 10. Performance Optimization Setup

### Bundle Analysis

```json
{
  "scripts": {
    "analyze": "npx expo export --dump-assetmap",
    "bundle-size": "npx bundletool-js analyze-bundle app.aab"
  }
}
```

### Image Optimization

```typescript
// src/components/OptimizedImage.tsx
import { Image } from 'expo-image'

interface OptimizedImageProps {
  source: string
  width?: number
  height?: number
}

export const OptimizedImage = ({ source, width, height }: OptimizedImageProps) => (
  <Image
    source={{ uri: source }}
    style={{ width, height }}
    contentFit="cover"
    cachePolicy="memory-disk"
    placeholder={{ blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' }}
  />
)
```

### Performance Monitoring

```typescript
// src/services/performance.ts
import { Performance } from 'react-native-performance';

export const trackPerformance = (screenName: string) => {
  const startTime = Performance.now();

  return () => {
    const endTime = Performance.now();
    console.log(`${screenName} render time: ${endTime - startTime}ms`);
  };
};
```

## Best Practices Summary

1. **Start with TypeScript strict mode** - Catch errors early
2. **Use feature-based folder structure** - Better scalability
3. **Choose Zustand for state management** - Simple and performant
4. **Implement Expo Router** - Better DX and performance
5. **Set up testing from day one** - Prevent technical debt
6. **Configure CI/CD with EAS** - Automated builds and deployments
7. **Use code quality tools** - Consistent code style
8. **Plan for multiple environments** - Separate dev/staging/prod
9. **Consider monorepo structure** - Code sharing opportunities
10. **Monitor performance continuously** - Optimize user experience

## Common Pitfalls to Avoid

- ❌ **Not configuring TypeScript strict mode**
- ❌ **Using Context API for frequently changing state**
- ❌ **Ignoring bundle size optimization**
- ❌ **Not setting up testing infrastructure early**
- ❌ **Hardcoding configuration values**
- ❌ **Not planning for multiple app variants**
- ❌ **Skipping performance monitoring setup**
- ❌ **Not considering offline-first architecture**
- ❌ **Mixing business logic with UI components**
- ❌ **Not planning for native module integration**
