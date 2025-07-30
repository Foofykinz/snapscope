# App Design Overview

1. *Animated Opening Screen*
    - Logo animation: Camera icon transitions into a file icon.
    - Branded: SnapScope name appears dynamically.
2. *Home Screen*
    - Options: New File, Manage Files, Settings
    - Clean, grid-based design with soft shadows and rounded corners.
3. *New File Wizard*
    - User enters: Vehicle type or Claim Number (this names the folder)
    - Selects: Carrier/Firm (custom photo list appears)
    - Opens *native camera* in 4:3 mode with overlay + live prompt
    - Optional: Blur detection + manual override
4. *Photo Capture*
    - Save with label (auto-named based on prompt)
    - *"Save & Next"* until all required photos are taken
    - Damage mode: User adds manual photo labels like *"CLF Fender Damage"*
    - Files saved to *local app storage* (offline) with option to:
    - Save to device gallery
    - Upload to Drive
5. *Manage Files*
    - Resume incomplete jobs
    - Export, delete, or re-label images
    - Local folder structure for offline work
6. *Settings*
    - Manage carriers/firms and photo lists
    - Dark/light mode
    - Drive integration toggle

## Security & Privacy
- Files stored *only* on user's device or their cloud account (Google Drive)
- No 3rd-party analytics
- No sensitive user data collected

## Tech Stack Goal:
- *React Native*
    - Local storage (e.g. AsyncStorage, expo-media-library)
- Google Drive API integration
- Possibly Firebase (only if lightweight auth/storage is ever needed)
