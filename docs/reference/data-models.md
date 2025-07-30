# Data Models Reference

## Core Data Structures

### Job

Represents a vehicle inspection session.

```typescript
interface Job {
  id: string;              // UUID
  name: string;            // User-provided name or claim number
  carrierId: string;       // Reference to Carrier
  photos: Photo[];         // Array of captured photos
  status: JobStatus;       // 'active' | 'completed' | 'exported'
  createdAt: Date;         // Timestamp of creation
  updatedAt: Date;         // Last modification
  userId: string;          // Supabase user ID
  metadata?: {
    vehicleInfo?: string;
    notes?: string;
  };
}
```

### Photo

Individual photo within a job.

```typescript
interface Photo {
  id: string;              // UUID
  jobId: string;           // Parent job reference
  type: PhotoType;         // 'required' | 'damage'
  label: string;           // Auto or manual label
  uri: string;             // Local file path or cloud URL
  order: number;           // Sequence in job
  metadata: {
    timestamp: Date;
    gpsCoordinates?: {
      latitude: number;
      longitude: number;
    };
    deviceInfo?: string;
    capturedBy: string;    // User ID
    blurScore?: number;    // 0-1, higher = more blur
    overrideBlur?: boolean;
  };
}
```

### Carrier

Carrier/firm configuration with photo requirements.

```typescript
interface Carrier {
  id: string;              // UUID
  name: string;            // Display name
  photoList: PhotoPrompt[];// Required photos
  isActive: boolean;       // Available for selection
  isDefault?: boolean;     // System default
  createdBy?: string;      // User ID if custom
  createdAt: Date;
  updatedAt: Date;
}
```

### PhotoPrompt

Defines a required photo in a carrier's list.

```typescript
interface PhotoPrompt {
  id: string;              // UUID
  label: string;           // "Front View"
  description: string;     // Guidance text
  order: number;           // Display sequence
  required: boolean;       // Mandatory or optional
  overlayImage?: string;   // Optional guide overlay
}
```

## Storage Schemas

### Local Storage (AsyncStorage)

```typescript
// User preferences
interface UserPreferences {
  theme: 'light' | 'dark';
  defaultCarrierId?: string;
  googleDriveEnabled: boolean;
  blurDetectionSensitivity: number; // 0-1
}

// Cached data
interface CachedData {
  carriers: Carrier[];
  lastSync: Date;
}
```

### File System Structure

```
/SnapScope/
  /jobs/
    /{jobId}/
      /photos/
        {photoId}.jpg
      metadata.json
  /exports/
    /{jobId}-{timestamp}.zip
```

## Supabase Database Schema

### Tables

#### users
- id: uuid (primary key)
- email: string
- created_at: timestamp
- updated_at: timestamp

#### jobs
- id: uuid (primary key)
- user_id: uuid (foreign key → users)
- name: string
- carrier_id: uuid (foreign key → carriers)
- status: enum
- metadata: jsonb
- created_at: timestamp
- updated_at: timestamp

#### photos
- id: uuid (primary key)
- job_id: uuid (foreign key → jobs)
- type: enum
- label: string
- cloud_url: string
- metadata: jsonb
- created_at: timestamp

#### carriers
- id: uuid (primary key)
- name: string
- photo_list: jsonb
- is_active: boolean
- is_default: boolean
- created_by: uuid (nullable, foreign key → users)
- created_at: timestamp
- updated_at: timestamp

## API Response Formats

### Job List Response
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "2019 Honda Civic - Claim #12345",
      "status": "completed",
      "photoCount": 12,
      "createdAt": "2024-01-20T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

### Photo Upload Response
```json
{
  "success": true,
  "photo": {
    "id": "photo-uuid",
    "cloudUrl": "https://drive.google.com/...",
    "thumbnail": "https://drive.google.com/..."
  }
}
```

## Enumerations

### JobStatus
- `active`: Currently being worked on
- `completed`: All photos captured
- `exported`: Exported to device/cloud

### PhotoType
- `required`: Part of carrier checklist
- `damage`: Additional damage documentation

### ExportFormat
- `individual`: Separate image files
- `zip`: Compressed archive
- `pdf`: PDF report (future)