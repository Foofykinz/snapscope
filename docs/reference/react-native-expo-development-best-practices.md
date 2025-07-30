# React Native Expo Development Best Practices

## Overview

This document provides comprehensive best practices for React Native Expo mobile app development, covering performance optimization, security, offline-first patterns, and platform-specific considerations.

## 1. Component Architecture Patterns

### Functional Components with Hooks

**Best Practice**: Use functional components exclusively for new development

```typescript
// ✅ Good - Functional component with hooks
interface CameraScreenProps {
  onPhotoTaken: (photo: Photo) => void
}

export const CameraScreen: React.FC<CameraScreenProps> = ({ onPhotoTaken }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [camera, setCamera] = useState<Camera | null>(null)

  useEffect(() => {
    requestCameraPermissions()
  }, [])

  return (
    <View style={styles.container}>
      {/* Camera component */}
    </View>
  )
}

// ❌ Avoid - Class components for new code
class CameraScreen extends React.Component {
  // Outdated pattern
}
```

### Separation of Concerns

**Container/Presentational Pattern**:

```typescript
// Container component - handles logic
const CameraContainer: React.FC = () => {
  const { photos, addPhoto } = usePhotoStore()
  const { hasPermission, requestPermission } = useCameraPermissions()

  const handlePhotoCapture = useCallback(async (uri: string) => {
    const photo = await processPhoto(uri)
    addPhoto(photo)
  }, [addPhoto])

  return (
    <CameraView
      hasPermission={hasPermission}
      onPhotoCapture={handlePhotoCapture}
      onRequestPermission={requestPermission}
    />
  )
}

// Presentational component - pure UI
interface CameraViewProps {
  hasPermission: boolean | null
  onPhotoCapture: (uri: string) => void
  onRequestPermission: () => void
}

const CameraView: React.FC<CameraViewProps> = React.memo(({
  hasPermission,
  onPhotoCapture,
  onRequestPermission
}) => {
  // Pure UI logic only
  return (
    <View>
      {hasPermission ? (
        <CameraComponent onCapture={onPhotoCapture} />
      ) : (
        <PermissionPrompt onGrant={onRequestPermission} />
      )}
    </View>
  )
})
```

### Custom Hooks Pattern

Extract reusable logic into custom hooks:

```typescript
// hooks/useCameraPermissions.ts
export const useCameraPermissions = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const requestPermission = useCallback(async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return { hasPermission, requestPermission };
};
```

## 2. Performance Optimization Techniques

### React.memo and useMemo

```typescript
// Memoize expensive components
const PhotoList = React.memo(({ photos }: { photos: Photo[] }) => {
  const sortedPhotos = useMemo(
    () => photos.sort((a, b) => b.timestamp - a.timestamp),
    [photos]
  )

  return (
    <FlatList
      data={sortedPhotos}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PhotoItem photo={item} />}
      removeClippedSubviews
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  )
})

// Memoize expensive calculations
const BlurDetectionResult = ({ image }: { image: ImageData }) => {
  const blurScore = useMemo(() => {
    return calculateBlurScore(image) // Expensive operation
  }, [image.uri, image.width, image.height])

  return <Text>Blur Score: {blurScore}</Text>
}
```

### FlatList Optimization

```typescript
const OptimizedPhotoList: React.FC<{ photos: Photo[] }> = ({ photos }) => {
  const renderPhoto = useCallback(({ item }: { item: Photo }) => (
    <PhotoItem photo={item} />
  ), [])

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: PHOTO_ITEM_HEIGHT,
    offset: PHOTO_ITEM_HEIGHT * index,
    index,
  }), [])

  return (
    <FlatList
      data={photos}
      renderItem={renderPhoto}
      keyExtractor={(item) => item.id}
      getItemLayout={getItemLayout}
      removeClippedSubviews
      maxToRenderPerBatch={5}
      windowSize={10}
      initialNumToRender={10}
      updateCellsBatchingPeriod={50}
    />
  )
}
```

### New Architecture Adoption

Prepare for React Native's New Architecture:

```typescript
// Use Turbo Modules when available
import { NativeCameraModule } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const cameraModule = NativeCameraModule?.getConstants()
  ? NativeCameraModule
  : require('react-native-vision-camera');
```

## 3. Memory Management

### Proper Cleanup in useEffect

```typescript
const CameraScreen: React.FC = () => {
  useEffect(() => {
    let isActive = true;
    let camera: Camera | null = null;

    const initializeCamera = async () => {
      if (isActive) {
        camera = await Camera.initialize();
      }
    };

    initializeCamera();

    // Cleanup function
    return () => {
      isActive = false;
      if (camera) {
        camera.release();
        camera = null;
      }
    };
  }, []);

  // Component JSX
};
```

### Event Listener Cleanup

```typescript
const useDeviceOrientation = () => {
  const [orientation, setOrientation] = useState<Orientation>('portrait');

  useEffect(() => {
    const subscription = DeviceOrientationModule.addListener(
      'orientationDidChange',
      setOrientation,
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  return orientation;
};
```

### Image Memory Management

```typescript
// Use expo-image for automatic memory management
import { Image } from 'expo-image'

const PhotoThumbnail: React.FC<{ photo: Photo }> = ({ photo }) => (
  <Image
    source={{ uri: photo.thumbnailUri }}
    style={styles.thumbnail}
    cachePolicy="memory-disk"
    contentFit="cover"
    onError={() => {
      // Handle image loading errors
      console.warn(`Failed to load thumbnail: ${photo.id}`)
    }}
  />
)
```

## 4. Image and Asset Handling

### Image Optimization Strategy

```typescript
// services/imageService.ts
export const processPhoto = async (uri: string): Promise<ProcessedPhoto> => {
  // Resize for thumbnail
  const thumbnailUri = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 150, height: 150 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
  );

  // Compress full image
  const compressedUri = await ImageManipulator.manipulateAsync(uri, [], {
    compress: 0.8,
    format: ImageManipulator.SaveFormat.JPEG,
  });

  return {
    originalUri: uri,
    compressedUri: compressedUri.uri,
    thumbnailUri: thumbnailUri.uri,
    metadata: await getImageMetadata(uri),
  };
};
```

### Asset Management

```typescript
// constants/assets.ts
export const IMAGES = {
  LOGO: require('../assets/images/logo.png'),
  PLACEHOLDER: require('../assets/images/placeholder.png'),
  CAMERA_OVERLAY: require('../assets/images/overlay.png'),
} as const;

export const ICONS = {
  CAMERA: require('../assets/icons/camera.svg'),
  GALLERY: require('../assets/icons/gallery.svg'),
  SETTINGS: require('../assets/icons/settings.svg'),
} as const;
```

### Caching Strategy

```typescript
// services/cacheService.ts
export class CacheService {
  private static instance: CacheService;
  private cache = new Map<string, any>();

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  async getOrFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const data = await fetcher();
    this.cache.set(key, data);
    return data;
  }

  clear(): void {
    this.cache.clear();
  }
}
```

## 5. Native Module Integration

### Expo Development Build Setup

```json
{
  "plugins": [
    [
      "react-native-vision-camera",
      {
        "cameraPermissionText": "$(PRODUCT_NAME) needs access to your Camera to take photos of vehicle damage.",
        "enableMicrophonePermission": false
      }
    ]
  ]
}
```

### Platform-Specific Configuration

```typescript
// config/camera.ts
import { Platform } from 'react-native';

export const getCameraConfig = () => {
  const baseConfig = {
    enableHighQualityPhotos: true,
    enableDepthData: false,
  };

  if (Platform.OS === 'ios') {
    return {
      ...baseConfig,
      enablePortraitEffectsMatteDelivery: false,
      videoStabilizationMode: 'auto',
    };
  }

  return {
    ...baseConfig,
    focusMode: 'auto',
    exposureMode: 'auto',
  };
};
```

## 6. Cross-Platform Considerations

### Platform-Specific Styling

```typescript
// styles/platform.ts
import { Platform, StyleSheet } from 'react-native';

export const createPlatformStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.select({
        ios: 44, // Status bar height
        android: 0,
      }),
    },
    button: {
      ...Platform.select({
        ios: {
          borderRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          borderRadius: 4,
          elevation: 3,
        },
      }),
    },
  });
```

### Safe Area Handling

```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const CameraScreen: React.FC = () => {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Content */}
    </View>
  )
}
```

## 7. Security Best Practices

### Secure Storage

```typescript
// services/secureStorage.ts
import * as SecureStore from 'expo-secure-store';

export class SecureStorageService {
  static async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Failed to save to secure storage:', error);
      throw error;
    }
  }

  static async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Failed to read from secure storage:', error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Failed to remove from secure storage:', error);
    }
  }
}
```

### Data Validation

```typescript
// utils/validation.ts
import { z } from 'zod';

export const PhotoSchema = z.object({
  id: z.string().uuid(),
  uri: z.string().url(),
  timestamp: z.number().positive(),
  metadata: z.object({
    width: z.number().positive(),
    height: z.number().positive(),
    fileSize: z.number().positive(),
  }),
});

export const validatePhoto = (data: unknown): Photo => {
  return PhotoSchema.parse(data);
};
```

### API Security

```typescript
// services/apiClient.ts
class ApiClient {
  private baseURL: string;
  private authToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    return response.json();
  }
}
```

## 8. Offline-First Development Patterns

### SQLite Integration

```typescript
// services/database.ts
import * as SQLite from 'expo-sqlite';

export class DatabaseService {
  private db: SQLite.WebSQLDatabase;

  constructor() {
    this.db = SQLite.openDatabase('snapscope.db');
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          tx.executeSql(`
          CREATE TABLE IF NOT EXISTS jobs (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
          );
        `);

          tx.executeSql(`
          CREATE TABLE IF NOT EXISTS photos (
            id TEXT PRIMARY KEY,
            job_id TEXT NOT NULL,
            uri TEXT NOT NULL,
            thumbnail_uri TEXT,
            blur_score REAL,
            created_at INTEGER NOT NULL,
            FOREIGN KEY (job_id) REFERENCES jobs (id)
          );
        `);
        },
        reject,
        resolve,
      );
    });
  }

  async createJob(job: Job): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO jobs (id, title, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
          [job.id, job.title, job.status, job.createdAt, job.updatedAt],
          () => resolve(),
          (_, error) => reject(error),
        );
      });
    });
  }
}
```

### Sync Strategy

```typescript
// services/syncService.ts
export class SyncService {
  private isOnline = true;
  private pendingOperations: Operation[] = [];

  constructor() {
    NetInfo.addEventListener((state) => {
      this.isOnline = state.isConnected ?? false;
      if (this.isOnline) {
        this.processPendingOperations();
      }
    });
  }

  async syncData(operation: Operation): Promise<void> {
    if (this.isOnline) {
      try {
        await this.executeOperation(operation);
      } catch (error) {
        this.pendingOperations.push(operation);
        throw error;
      }
    } else {
      this.pendingOperations.push(operation);
    }
  }

  private async processPendingOperations(): Promise<void> {
    const operations = [...this.pendingOperations];
    this.pendingOperations = [];

    for (const operation of operations) {
      try {
        await this.executeOperation(operation);
      } catch (error) {
        this.pendingOperations.push(operation);
      }
    }
  }
}
```

## 9. Camera Integration Best Practices

### react-native-vision-camera Setup

```typescript
// components/CameraView.tsx
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera'
import { runOnJS } from 'react-native-reanimated'

export const CameraView: React.FC = () => {
  const devices = useCameraDevices()
  const device = devices.back

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'

    // Detect blur in real-time
    const blurScore = detectBlur(frame)
    runOnJS(updateBlurScore)(blurScore)
  }, [])

  if (!device) return <CameraUnavailable />

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      photo={true}
      frameProcessor={frameProcessor}
    />
  )
}
```

### Permission Handling

```typescript
// hooks/useCameraPermissions.ts
export const useCameraPermissions = () => {
  const [permissionStatus, setPermissionStatus] = useState<CameraPermissionStatus>();

  const requestPermission = useCallback(async () => {
    try {
      const permission = await Camera.requestCameraPermission();
      setPermissionStatus(permission);

      if (permission === 'denied') {
        Alert.alert(
          'Camera Permission Required',
          'SnapScope needs camera access to capture photos. Please enable camera permission in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => Linking.openSettings() },
          ],
        );
      }
    } catch (error) {
      console.error('Permission request failed:', error);
    }
  }, []);

  useEffect(() => {
    Camera.getCameraPermissionStatus().then(setPermissionStatus);
  }, []);

  return { permissionStatus, requestPermission };
};
```

## 10. File System and Local Storage

### File Organization

```typescript
// services/fileService.ts
import * as FileSystem from 'expo-file-system';

export class FileService {
  private static readonly JOBS_DIR = `${FileSystem.documentDirectory}jobs/`;
  private static readonly PHOTOS_DIR = `${FileSystem.documentDirectory}photos/`;

  static async initializeDirectories(): Promise<void> {
    const dirs = [this.JOBS_DIR, this.PHOTOS_DIR];

    for (const dir of dirs) {
      const dirInfo = await FileSystem.getInfoAsync(dir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      }
    }
  }

  static async savePhoto(jobId: string, photoUri: string): Promise<string> {
    const photoId = generateUUID();
    const filename = `${photoId}.jpg`;
    const destinationUri = `${this.PHOTOS_DIR}${jobId}/${filename}`;

    // Ensure job directory exists
    const jobDir = `${this.PHOTOS_DIR}${jobId}/`;
    const jobDirInfo = await FileSystem.getInfoAsync(jobDir);
    if (!jobDirInfo.exists) {
      await FileSystem.makeDirectoryAsync(jobDir, { intermediates: true });
    }

    await FileSystem.copyAsync({
      from: photoUri,
      to: destinationUri,
    });

    return destinationUri;
  }

  static async deleteJob(jobId: string): Promise<void> {
    const jobDir = `${this.PHOTOS_DIR}${jobId}/`;
    const jobDirInfo = await FileSystem.getInfoAsync(jobDir);

    if (jobDirInfo.exists) {
      await FileSystem.deleteAsync(jobDir);
    }
  }
}
```

### Storage Management

```typescript
// services/storageService.ts
export class StorageService {
  static async getStorageUsage(): Promise<StorageInfo> {
    const jobsDir = await FileSystem.getInfoAsync(FileService.JOBS_DIR);
    const photosDir = await FileSystem.getInfoAsync(FileService.PHOTOS_DIR);

    return {
      totalSize: (jobsDir.size || 0) + (photosDir.size || 0),
      availableSpace: await this.getAvailableSpace(),
      fileCount: await this.countFiles(),
    };
  }

  static async cleanupOldFiles(daysOld: number = 30): Promise<void> {
    const cutoffDate = Date.now() - daysOld * 24 * 60 * 60 * 1000;
    const files = await FileSystem.readDirectoryAsync(FileService.PHOTOS_DIR);

    for (const file of files) {
      const filePath = `${FileService.PHOTOS_DIR}${file}`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);

      if (fileInfo.modificationTime && fileInfo.modificationTime < cutoffDate) {
        await FileSystem.deleteAsync(filePath);
      }
    }
  }
}
```

## Best Practices Summary

### Do's ✅

- Use functional components with hooks exclusively
- Implement proper memory management and cleanup
- Use React.memo and useMemo for performance optimization
- Store sensitive data in SecureStore, not AsyncStorage
- Implement offline-first architecture with local SQLite
- Use expo-image for optimized image handling
- Handle permissions gracefully with clear user messaging
- Test on real devices for camera functionality
- Implement proper error boundaries
- Use TypeScript for type safety

### Don'ts ❌

- Don't use class components for new development
- Don't store large images in component state or AsyncStorage
- Don't ignore memory leaks from uncleaned listeners
- Don't assume camera or permissions are always available
- Don't hardcode platform-specific values
- Don't skip offline functionality planning
- Don't bundle secrets in the app
- Don't ignore the New Architecture migration
- Don't use Context API for frequently changing state
- Don't skip performance monitoring and profiling

## Common Pitfalls to Avoid

1. **Memory Leaks**: Not cleaning up camera resources, event listeners, or timers
2. **Permission Handling**: Assuming permissions are granted or not handling denials gracefully
3. **Platform Differences**: Not testing on both iOS and Android devices
4. **Image Management**: Storing full-resolution images in memory or state
5. **Offline Support**: Not planning for network interruptions or data conflicts
6. **Performance**: Not optimizing FlatList or implementing proper memoization
7. **Security**: Storing sensitive data in plain text or bundling secrets
8. **File System**: Poor file organization leading to storage issues
9. **State Management**: Using Context API for complex, frequently changing state
10. **Testing**: Not testing camera functionality on real devices

This guide provides a comprehensive foundation for building a robust, performant, and maintainable React Native Expo application following current industry best practices.
