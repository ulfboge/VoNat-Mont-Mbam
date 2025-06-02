# Scripts Directory

This directory contains the key scripts used for the Mont Mbam Central Area CCDC Land Cover Analysis. These scripts process remote sensing data, generate visualizations, and perform spatial analyses that support the findings presented in the Central Area CCDC Report.

## Key Scripts

### Google Earth Engine Scripts (`gee_scripts/`)

1. **ccdc_classification_with_accuracy.js**
   - Performs survey-calibrated CCDC (Continuous Change Detection and Classification) analysis
   - Integrates field survey data (287 points) to improve classification accuracy
   - Generates land cover maps for 1987, 2000, 2010, and 2024

2. **fire_frequency_analysis.js**
   - Analyzes MODIS MCD64A1 Burned Area data (2000-2024)
   - Calculates fire frequency (number of times each area has burned)
   - Generates yearly burned area statistics and fire frequency maps

3. **landcover_change_transition_1987_2024.js**
   - Creates a binary change raster showing where land cover changed between 1987-2024
   - Generates a transition code raster encoding transitions as (old_class*100 + new_class)
   - Calculates area statistics for each transition type
   - Exports results to CSV with columns for from_class, to_class, and area measurements

4. **vonat_landcover_forestloss_analysis.js**
   - Integrates land cover classification with Hansen Global Forest Change data
   - Analyzes forest loss patterns in relation to land cover types
   - Exports statistics on forest loss by land cover class

### Python Scripts (`python_scripts/`)

1. **process_hansen_data.py**
   - Processes Hansen Global Forest Change data for the central survey area
   - Calculates annual and cumulative forest loss
   - Generates forest loss bar chart and cumulative loss line graph
   - Identifies acceleration in forest loss in recent years

2. **create_burned_area_graph.py**
   - Processes MODIS burned area data for the central survey area
   - Creates annual burned area graph showing declining fire activity
   - Calculates statistics for different time periods (2000-2009, 2010-2016, 2017-2024)

3. **small_area_analysis.py**
   - Focuses analysis on the central survey area (18,054 hectares)
   - Processes land cover data for the four time periods
   - Generates statistics and visualizations for the central area

## Data Processing Workflow

1. **Land Cover Classification**
   - Field data collection → Survey point integration → CCDC classification → Accuracy assessment

2. **Land Cover Change Analysis**
   - Multi-temporal classification → Change detection → Transition analysis → Visualization

3. **Forest Loss Analysis**
   - Hansen data extraction → Annual loss calculation → Trend analysis → Visualization

4. **Fire Disturbance Analysis**
   - MODIS data processing → Fire frequency calculation → Temporal trend analysis → Visualization

## Usage Notes

- Google Earth Engine scripts should be run in the [Earth Engine Code Editor](https://code.earthengine.google.com/)
- Python scripts require the following dependencies: pandas, numpy, matplotlib
- All scripts are configured to read from and write to the appropriate project directories
