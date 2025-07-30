# 📸 SnapScope

> **Lightning-fast vehicle damage documentation that actually works in the field**

[![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

## 🚀 40% Faster Vehicle Assessments. Zero Internet Required.

SnapScope transforms how insurance adjusters document vehicle damage. No more juggling cameras, clipboards, and laptops. Just guided photo capture, automatic labeling, and instant professional reports—all from your phone.

### 🎯 The Problem

Insurance adjusters waste hours on:

- 📝 Hand-written spec sheets after photo shoots
- 🏷️ Manual photo labeling (and inevitable mislabeling)
- 📁 Organizing hundreds of photos per day
- 🔄 Re-shoots due to missed angles or blur
- 📤 Compiling and formatting assessment packages

### 💡 The Solution

SnapScope provides:

- **Guided capture** with visual overlays for perfect shots every time
- **Automatic labeling** that survives file transfers
- **Blur detection** to catch issues before you leave the scene
- **Instant exports** in industry-standard formats
- **100% offline** functionality for real field conditions

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Camera**: react-native-vision-camera with ML Kit
- **Storage**: SQLite for offline-first architecture
- **Language**: TypeScript for type safety
- **State**: React Context (keeping it simple for MVP)

## ✨ Key Features

### 📱 For Adjusters

- **Smart Photo Guides**: Visual overlays show exact framing for each required shot
- **Carrier Templates**: Pre-loaded photo requirements for major insurance carriers
- **Damage Mode**: Quick labeling for unexpected damage photos
- **Instant Preview**: Review shots immediately with pinch-to-zoom
- **Glove-Friendly**: Large touch targets designed for field conditions

### 🏢 For IA Firms

- **Standardized Output**: Consistent file naming and organization
- **Compliance Built-in**: Never miss required photos again
- **Export Flexibility**: Save to device, Google Drive, or direct share
- **Custom Templates**: Add your own carrier requirements

### 🔧 Technical Highlights

- **Offline-First**: Full functionality without internet
- **8MP+ Capture**: High-resolution photos with EXIF preservation
- **GPS Metadata**: Automatic location tagging (10m accuracy)
- **Smart Compression**: 85% JPEG quality balances size and clarity
- **Fast Performance**: <2s app launch, <1s photo capture

## 🚦 Getting Started

> **Note**: SnapScope is currently in active development. The codebase is being built following a phased approach.

### Prerequisites

```bash
# Install Node.js 18+ and npm
# Install React Native development environment
# iOS: Xcode 14+
# Android: Android Studio with SDK 31+
```

### Installation (Coming Soon)

```bash
# Clone the repository
git clone https://github.com/yourusername/snapscope.git
cd snapscope

# Install dependencies
npm install

# iOS setup
cd ios && pod install && cd ..

# Start development
npm start
```

## 📋 Development Roadmap

### ✅ Phase 1: Foundation (Weeks 1-2)

- Local database architecture
- Navigation system
- UI component library
- Offline storage

### 🚧 Phase 2: Core Features (Weeks 3-6)

- VIN scanner integration
- 9-position photo guide
- GPS & timestamp metadata
- Photo review system

### 📅 Phase 3: Polish (Weeks 6-8)

- Damage annotation
- Export generation
- Sharing integrations

### 🔮 Phase 4: Field Testing (Weeks 9-10)

- Sunlight mode
- Performance optimization
- Device compatibility

## 🏗️ Architecture

SnapScope follows a feature-based architecture optimized for offline-first operation:

```
src/
├── features/           # Feature modules
│   ├── assessment/     # Assessment workflow
│   ├── camera/         # Photo capture
│   ├── export/         # Report generation
│   └── storage/        # Local data management
├── shared/            # Shared components
├── services/          # Business logic
└── navigation/        # App routing
```

## 🤝 Contributing

We're building SnapScope to solve real problems for real adjusters. Your input matters!

1. Check out our [detailed documentation](docs/index.md)
2. Review the [architecture decisions](docs/reference/architecture-decision-record/)
3. Follow the [phased development plan](dev_tasks_overview.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Built for the field. Designed for efficiency. Made for adjusters.</strong>
</p>

<p align="center">
    Questions? Reach out at <a href="mailto:hi@snapscope.app" />
</p>
