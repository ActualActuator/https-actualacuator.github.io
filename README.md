# Hard Drive Collection Database

A public web-based database for cataloging and displaying your hard drive collection.

## Features

- **Automatic Sorting**: Drives are automatically sorted by:
  1. Manufacturer (A-Z)
  2. Capacity (Low to High)
  3. Model Number (A-Z)
- **Search Functionality**: Search drives by manufacturer, model, capacity, type, or notes
- **Statistics**: View total number of drives and combined storage capacity
- **Responsive Design**: Works on desktop and mobile devices
- **Public Website**: Hosted via GitHub Pages

## How to Add Your Drives

Edit the `drives.json` file and add entries in the following format:

```json
{
    "manufacturer": "Brand Name",
    "model": "Model Number",
    "capacity": "2",
    "type": "HDD",
    "rpm": "7200",
    "interface": "SATA III",
    "notes": "Any additional notes about the drive"
}
```

### Field Descriptions

- **manufacturer**: The brand/manufacturer of the drive (e.g., "Seagate", "Western Digital")
- **model**: The model number or name of the drive
- **capacity**: Storage capacity in TB (numeric value)
- **type**: Type of drive - "HDD", "SSD", "NVMe", etc.
- **rpm**: (Optional) Rotations per minute for HDDs
- **interface**: (Optional) Connection type (e.g., "SATA III", "NVMe", "USB")
- **notes**: (Optional) Any additional information about the drive

## Accessing Your Site

Your hard drive collection database will be available at:
```
https://actualactuator.github.io
```

## File Structure

- `index.html` - Main HTML structure
- `styles.css` - Website styling and design
- `script.js` - JavaScript for sorting, searching, and displaying drives
- `drives.json` - Your hard drive collection database
- `README.md` - This file

## Example Entry

```json
{
    "manufacturer": "Samsung",
    "model": "870 QVO",
    "capacity": "1",
    "type": "SSD",
    "interface": "SATA III",
    "notes": "Purchased in 2023, excellent condition"
}
```

## Tips

- Capacity values should be numeric (just the number, no units)
- The website automatically calculates total capacity and displays in TB or PB
- The search is case-insensitive and searches across all fields
- Remove the example drives from `drives.json` and replace with your actual collection

---

Happy cataloging! 🎉
