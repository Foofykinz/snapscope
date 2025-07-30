# SnapScope PRD Clarifying Questions

## Technical Platform & Architecture
1. **Target platform(s)**: iOS only, Android only, or both? This affects the tech stack choice (React Native, Flutter, native development, etc.)
    - Both iOS and Android, using React Native & Expo.
2. **Minimum OS versions** to support?
    - The top 80% iOS and Android versions
3. **Backend requirements**: Is this purely client-side, or do we need a backend for user accounts, photo list management, or analytics?
    - Supabase should be the backend for this app to manage user accounts.

## Photo Capture & Quality
4. **Blur detection threshold**: What level of blur is acceptable? Should this be configurable?
5. **Photo resolution/compression**: Any specific requirements for file size or quality?
    - good quality JPG is ok to use.
6. **Camera overlay details**: How prominent should the overlay be? Any specific UI/UX requirements?
    - It should be clearly visible but not interfere with the view of the app. It should be somewhat transparent.
7. **Photo metadata**: Should we embed EXIF data (GPS, timestamp, device info)?
    - Yes, embed EXIF data for GPS, timestamp and the user who took the photo.

## Data Management
8. **Local storage limits**: How many jobs/photos should we support offline?
    - up to 100 photos for now
9. **Google Drive integration**:
   - Should photos be organized in specific folder structures?
   - Do we need to handle Google account switching?
   - What about other cloud providers (Dropbox, OneDrive)?

## Carrier/Firm Configuration
10. **Photo list format**: How are custom photo lists defined? JSON? Database?
11. **List management**: Can users create/edit lists in the app, or are they pre-configured?
12. **Default photo lists**: Should there be standard templates for common inspection types?

## User Experience
13. **Job resumption**: If a user exits mid-inspection, exactly what state should be preserved?
14. **Export format**: Individual photos, ZIP file, PDF report, or all options?
15. **Photo re-ordering**: Can users rearrange photos after capture?
16. **Damage photo limits**: Maximum number of damage photos per inspection?

## Business Logic
17. **User authentication**: Is this needed, or is the app completely anonymous?
18. **Analytics/telemetry**: What usage data should we track?
19. **Offline mode specifics**: How do we handle carrier/firm list updates when offline?
20. **File naming convention**: Specific format for exported photos (e.g., `{JobName}_{PhotoType}_{Index}.jpg`)?
