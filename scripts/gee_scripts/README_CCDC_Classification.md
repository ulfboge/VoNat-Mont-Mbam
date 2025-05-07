# CCDC Classification for Mont Mbam

This document explains the Continuous Change Detection and Classification (CCDC) process used for the Mont Mbam project.

## Input Assets

The following Google Earth Engine assets were used for the CCDC classification:

1. **Training Data**: `projects/ee-komba/assets/vonat/gcps_Mt_Mbam_training`
   - Ground control points created using stratified sampling from ESA WorldCover
   - Contains `landcover` property with class values and `year` property set to 2021

2. **Study Area**: `projects/ee-komba/assets/vonat/Mt_Mbam`
   - Feature collection defining the Mont Mbam region boundary
   - The area of interest (AOI) was derived from the research article: [Momo Solefack, M. C., Chabrerie, O., Gallet-Moron, E., Nkongmeneck, B.-A., Leumbe, O. N., & Decocq, G. (2018). Analyse de la dynamique de déforestation par télédétection couplée aux modèles d'équations structurelles : exemple de la forêt du mont Mbam (Cameroun). Revue Canadienne de Géographie Tropicale, 5(2), 8799](https://revuecangeotrop.ca/volume-8-numero-2/8799/)
   - This source was recommended by VoNat's director

3. **CCDC Segments**: `projects/ee-komba/assets/vonat/ccdc_temporal_segmentation_mt_mbam_1986_2025`
   - Time series model segments from 1986 to 2025
   - Created using Landsat data with the CCDC algorithm

## Classification Parameters

### Classifier
- **Algorithm**: Random Forest
- **Number of Trees**: 300

### CCDC Model Parameters
The following bands and coefficients were used in the classification:

#### Spectral Bands:
- [x] BLUE
- [x] GREEN
- [x] RED
- [x] NIR
- [x] SWIR1
- [x] SWIR2

#### Coefficients:
- [x] INTP (Intercept)
- [x] SLP (Slope)
- [x] COS (Cosine harmonic)
- [x] SIN (Sine harmonic)
- [x] COS2 (Second-order cosine harmonic)
- [x] SIN2 (Second-order sine harmonic)
- [x] COS3 (Third-order cosine harmonic)
- [x] SIN3 (Third-order sine harmonic)
- [x] RMSE (Root Mean Square Error)

#### Ancillary Inputs:
- [x] ELEVATION
- [x] ASPECT
- [x] DEM_SLOPE
- [x] RAINFALL
- [x] TEMPERATURE

## Running the Classification

To run the classification:

1. Open the `classify_app.js` script in Google Earth Engine Code Editor
2. Set the following parameters:
   - Input Type: "Image Collection"
   - Input path: `projects/ee-komba/assets/vonat/ccdc_temporal_segmentation_mt_mbam_1986_2025`
   - Date Format: "Fractional Years (1)"
   - Training Strategy: "Within Output Extent"
   - Training Data Path: `projects/ee-komba/assets/vonat/gcps_Mt_Mbam_training`
   - Training Attribute: `landcover`
   - Training Year: `2021`
   - Region Selection Method: Use `projects/ee-komba/assets/vonat/Mt_Mbam`
   - Classifier: "Random Forest"
   - Select the spectral bands, coefficients, and ancillary inputs as shown above

3. Click "Run Classification" to start the process

The classification will be exported as an asset named "classification_segments" that can be used for further analysis or visualization.

## References

Arévalo, P., Bullock, E.L., Woodcock, C.E., Olofsson, P., 2020. A Suite of Tools for Continuous Land Change Monitoring in Google Earth Engine. Front. Clim. 2. https://doi.org/10.3389/fclim.2020.576740
