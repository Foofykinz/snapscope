# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Github Repository: [SnapScope](git@github.com:Foofykinz/snapscope.git) - the primary branch is `trunk`

SnapScope is a React Native mobile application for insurance adjusters and vehicle inspectors to streamline photo documentation. The project is currently in the planning phase with comprehensive documentation but no code implementation yet.

## Technology Stack

- **Framework**: React Native (ADR-0001)
- **Backend**: Supabase (ADR-0002)
- **Database**: PostgreSQL (via Supabase)
- **Language**: TypeScript/JavaScript
- **Camera**: react-native-vision-camera
- **State Management**: React Context API (MVP)

## Development Phases

The implementation follows a phased approach as outlined in PLAN.md:

1. **Phase 1**: Basic Navigation and UI
2. **Phase 2**: Camera Integration with Overlays
3. **Phase 3**: File Management and Storage
4. **Phase 4**: Export and Cloud Integration
5. **Phase 5**: Settings and Carrier Management

## Key Architecture Decisions

- **ADR-0001**: React Native chosen for cross-platform native performance and camera access
- **ADR-0002**: Supabase selected for backend services (auth, database, storage)
- **Offline-First**: All data stored locally, sync optional
- **No Analytics**: Privacy-focused, no third-party tracking

## Data Models

Core entities defined in docs/reference/data-models.md:

- **Job**: Container for inspection session
- **Photo**: Individual photos with metadata and blur detection
- **Carrier**: Configuration for photo requirements
- **PhotoPrompt**: Defines required photos per carrier

## MVP Features

- Guided photo capture with overlay prompts
- Automatic blur detection with manual override
- Carrier-specific photo requirements
- Manual damage photo labeling
- Local job management
- Export to device gallery or Google Drive

## Documentation Structure

Uses Diátaxis framework:

- `docs/tutorials/`: Step-by-step user guides
- `docs/how-to/`: Task-oriented instructions
- `docs/reference/`: Technical specifications
- `docs/explanation/`: PRD and conceptual docs

## Development Commands

As this is a greenfield project, typical React Native commands will apply once initialized:

```bash
# Project setup (to be implemented)
npx react-native init SnapScope --template react-native-template-typescript
cd SnapScope
npm install

# Development
npx react-native start
npx react-native run-ios
npx react-native run-android

# Testing (once configured)
npm test
npm run test:e2e

# Type checking
npx tsc --noEmit

# Linting (once configured)
npm run lint
```

## Implementation Guidelines

When implementing features:

1. Follow the phased approach in PLAN.md
2. Implement offline-first - all features must work without internet
3. Use TypeScript for type safety
4. Follow React Native best practices for performance
5. Ensure camera functionality works on both iOS and Android
6. Test blur detection thoroughly across devices
7. Keep UI simple and field-friendly (large buttons, clear navigation)

## Supabase Integration

When setting up Supabase:

1. Configure authentication with email/password
2. Set up PostgreSQL schema matching data models
3. Implement Row Level Security (RLS) policies
4. Use Supabase Storage for temporary photo caching (if needed)
5. Keep all permanent data local-only per requirements
