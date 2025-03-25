# QGIS Project Structure

## Project Organization
The QGIS project is organized into the following layer groups:

### 1. Base Data
- OpenStreetMap
- Satellite imagery (Bing/Google)
- Administrative boundaries

### 2. Field Data
- GPS points
- Survey routes
- Field observations

### 3. Environmental Layers
- Land cover classification
- Forest cover and loss
- Fire frequency
- Digital Elevation Model
- Derived layers (slope, aspect)

### 4. Analysis Results
- Classified regions
- Hot spots
- Change detection results

### 5. Infrastructure
- Roads
- Settlements
- Protected areas

## Project Settings
- **Project CRS**: [To be specified based on local UTM zone]
- **Measurement Units**: Meters
- **Project Home**: Set to the root of the data directory

## Layer Styling
- Style files (.qml) are stored alongside each layer
- Consistent color schemes used across related layers
- Transparency settings optimized for overlay analysis

## Print Layouts
- A4 landscape template for reports
- A0 template for large format printing
- Layout templates include:
  - Scale bar
  - North arrow
  - Legend
  - VoNat logo
  - Data sources

## Tips for Use
1. Always set the project home path when opening
2. Use relative paths for all data sources
3. Save style files with descriptive names
4. Regular backups of the project file 