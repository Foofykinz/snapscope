# How to Configure Carrier Photo Lists

This guide shows you how to add, edit, and manage carrier-specific photo requirements in SnapScope.

## Prerequisites

- SnapScope app installed
- Access to Settings menu

## Add a New Carrier

1. Open SnapScope
2. Navigate to **Settings** from the Home Screen
3. Select **Manage Carriers/Firms**
4. Tap **"Add New Carrier"**
5. Enter carrier information:
   - Carrier name
   - Photo list name
6. Define the photo requirements (see below)
7. Tap **"Save"**

## Define Photo Requirements

For each required photo, specify:

- **Label**: Display name (e.g., "Front View")
- **Description**: Guidance text shown during capture
- **Order**: Sequence number
- **Required**: Whether this photo is mandatory

Example photo list:
```
1. VIN Plate - Required
2. Odometer - Required
3. Front View - Required
4. Rear View - Required
5. Driver Side - Required
6. Passenger Side - Required
7. Engine Bay - Optional
8. Interior Overview - Required
```

## Edit Existing Carrier Lists

1. Go to **Settings** → **Manage Carriers/Firms**
2. Select the carrier to edit
3. Modify photo requirements as needed
4. Tap **"Save Changes"**

## Delete a Carrier

1. Go to **Settings** → **Manage Carriers/Firms**
2. Swipe left on the carrier name
3. Tap **"Delete"**
4. Confirm deletion

## Import/Export Carrier Lists

### Export
1. Select a carrier
2. Tap **"Export"** 
3. Choose format (JSON)
4. Share or save the file

### Import
1. Tap **"Import Carrier List"**
2. Select the JSON file
3. Review the imported settings
4. Tap **"Confirm Import"**

## Best Practices

- Keep photo lists concise but comprehensive
- Use clear, descriptive labels
- Order photos in a logical inspection sequence
- Test new lists before deploying to users
- Maintain backup exports of custom lists

## Troubleshooting

**Carrier not appearing in New File screen**
- Ensure the carrier is marked as "Active"
- Check that at least one photo is defined

**Cannot edit carrier list**
- Some default carriers may be locked
- Create a duplicate to customize

## Related Topics

- [Create custom photo templates](./create-photo-templates.md)
- [Share carrier lists with team](./share-configurations.md)