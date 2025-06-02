# Figures Directory

This directory contains all the figures used in the Mont Mbam Central Area CCDC Land Cover Analysis Report. These visualizations were generated from the analysis of land cover changes, forest loss, and fire disturbance patterns in the central survey area.

## Figure List

1. **land_cover_2024.png** - Figure 1: Survey-calibrated CCDC land cover classification for the central Mont Mbam survey area (2024)
   - Shows the current land cover distribution across the 18,054 hectare central survey area

2. **land_cover_pie_charts.png** - Figure 2: Land cover composition comparison between 1987, 2000, 2010, and 2024
   - Comparative pie charts showing the distribution of land cover classes across four time periods

3. **land_cover_change.png** - Figure 3: Spatial distribution of land cover changes in the central survey area (1987-2024)
   - Map showing where land cover changes occurred between 1987 and 2024

4. **small_area_cumulative_forest_loss.png** - Figure 4: Cumulative forest loss in the central survey area (2001-2024)
   - Graph showing the cumulative forest loss based on Hansen Global Forest Change data

5. **small_area_annual_burned_area.png** - Figure 5: Annual burned area in the central survey area (2000-2024)
   - Graph showing the annual area burned based on MODIS MCD64A1 data

6. **fire_frequency.png** - Figure 6: Fire frequency map of the central survey area (2000-2024)
   - Map showing the number of times each area has burned during the study period

7. **small_area_landcover_2024.png** - Figure 7: Survey-calibrated CCDC land cover map of the central survey area (2024)
   - Detailed land cover map showing the current state of the landscape

## Data Sources

These figures were generated from the following data sources:
- Landsat Collection 2 Surface Reflectance imagery (1987-2024) for CCDC land cover classification
- Hansen Global Forest Change dataset (2001-2024) for forest loss analysis
- MODIS MCD64A1 Burned Area product (2000-2024) for fire disturbance analysis

## Generation Scripts

The figures were generated using the following scripts:
- `scripts/python_scripts/process_hansen_data.py` - Forest loss graphs
- `scripts/python_scripts/create_burned_area_graph.py` - Fire analysis visualizations
- `scripts/gee_scripts/fire_frequency_analysis.js` - Fire frequency map
- `scripts/gee_scripts/landcover_change_transition_1987_2024.js` - Land cover change map
- `scripts/gee_scripts/ccdc_classification_with_accuracy.js` - Land cover classification maps
