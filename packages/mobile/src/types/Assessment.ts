/**
 * Core assessment data types for SnapScope
 */

export interface Assessment {
  id: string;
  vehicleId: string;
  carrierId: string;
  createdAt: string;
  updatedAt: string;
  status: AssessmentStatus;
  photos: Photo[];
  metadata: AssessmentMetadata;
}

export interface Photo {
  id: string;
  assessmentId: string;
  position: PhotoPosition;
  filePath: string;
  timestamp: string;
  gpsLocation?: GPSLocation;
  isBlurred: boolean;
  isRequired: boolean;
}

export interface AssessmentMetadata {
  adjusterId?: string;
  claimNumber?: string;
  policyNumber?: string;
  dateOfLoss?: string;
  notes?: string;
}

export interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
}

export type AssessmentStatus =
  | "draft"
  | "in_progress"
  | "completed"
  | "exported";

export type PhotoPosition =
  | "vin_plate"
  | "odometer"
  | "front"
  | "rear"
  | "left_side"
  | "right_side"
  | "front_left"
  | "front_right"
  | "rear_left"
  | "rear_right"
  | "interior"
  | "engine_bay"
  | "damage_detail";
