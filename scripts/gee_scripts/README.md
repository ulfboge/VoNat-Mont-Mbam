# Google Earth Engine Scripts

This directory contains JavaScript scripts for Google Earth Engine (GEE) used in the Mont Mbam analysis project.

## Scripts Overview

### `fire_frequency_analysis.js`
- **Purpose**: Analyzes fire frequency and patterns in the Mont Mbam region using MODIS MCD64A1 Burned Area product
- **Time Period**: 2000-2024
- **Outputs**:
  - Fire frequency map
  - Most recent burn year map
  - Yearly burned area statistics
  - Area by fire frequency statistics

### `hydribasins.js`
- **Purpose**: Generates hydrological network map showing rivers and streams in the Mont Mbam region
- **Data Source**: HydroSHEDS and HydroRIVERS datasets
- **Outputs**: Hydrological network map with major rivers labeled

### `landcover_change_transition_1987_2024.js`
- **Purpose**: Analyzes land cover transitions between 1987 and 2024
- **Method**: Uses CCDC-derived land cover classifications
- **Outputs**:
  - Transition matrices between time periods
  - Land cover change statistics
  - Transition heatmaps

### `VoNat_landcover_export.js` and `classify_app.js`
- **Purpose**: Land cover classification using Continuous Change Detection and Classification (CCDC)
- **Time Periods**: 1987, 2000, 2010, 2024
- **Outputs**: Land cover classification maps and statistics

### `stratified_gcp_sampling_mt_mbam.js`
- **Purpose**: Generates stratified random samples for ground control points (GCPs)
- **Usage**: For validation and accuracy assessment of land cover classification

## Usage Instructions

1. Open the Google Earth Engine Code Editor: https://code.earthengine.google.com/
2. Copy and paste the script content into the editor
3. Adjust parameters as needed (e.g., date ranges, study area)
4. Run the script to generate outputs
5. Export results to Google Drive or as assets in your GEE account

## Data Requirements

- Study area geometry (imported as an asset)
- Access to Earth Engine data catalog
- Sufficient Earth Engine quota for processing and exports

## Notes

- Some scripts may take significant time to process due to the computational intensity of the analyses
- For large exports, consider using the batch processing capabilities of Earth Engine
- See individual script comments for detailed parameter descriptions and customization options
