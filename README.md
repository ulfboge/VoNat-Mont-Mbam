# VoNat-Mont-Mbam

A comprehensive geospatial analysis project focused on the Mont Mbam region, utilizing Google Earth Engine (GEE) and QGIS for spatial data processing, analysis, and visualization.

## Project Overview

This repository contains geospatial data, analysis tools, and documentation for the VoNat-Mont-Mbam project. The project aims to analyze and visualize environmental data in the Mont Mbam region, with a focus on land cover changes, fire disturbance patterns, and forest loss dynamics. The analysis combines remote sensing data from multiple sources with field observations to provide a comprehensive understanding of landscape dynamics in this ecologically important area.

## Main Outputs

The primary output of this project is the **Central Area CCDC Land Cover Analysis Report** (`docs/reports/Central_Area_CCDC_Report.md`), which provides a detailed analysis of:

1. Land cover composition and changes from 1987 to 2024
2. Forest loss patterns based on Hansen Global Forest Change data (2001-2024)
3. Fire disturbance trends using MODIS burned area data (2000-2024)
4. Survey-calibrated land cover classification for 2024

## Repository Structure

```
VoNat-Mont-Mbam/
├── archive/                # Archived files not relevant to the latest analysis
├── data/                   # Data directory
│   ├── raw/                # Raw data files
│   │   └── gps_points/     # GPS point data
│   └── data/               # Processed data files and analysis outputs (CSV)
│       └── suvey_area/     # Central survey area data files
├── docs/                   # Documentation
│   ├── figures/            # Figures used in the reports
│   ├── reports/            # Final reports
│   │   ├── Central_Area_CCDC_Report.md  # Main project report
│   │   └── Land_Cover_Change_Analysis_Report.md  # Supporting analysis
│   └── references/         # Reference materials
├── outputs/                # Analysis outputs
│   ├── local_training_analysis/  # Training data analysis outputs
│   ├── maps/               # Map outputs from GEE and QGIS
│   └── presentations/      # Presentation materials
├── qgis/                   # QGIS project files
├── scripts/                # Analysis scripts
│   ├── gee_scripts/        # Google Earth Engine JavaScript scripts
│   │   ├── ccdc_classification_with_accuracy.js  # CCDC classification script
│   │   ├── fire_frequency_analysis.js  # Fire analysis script
│   │   ├── landcover_change_transition_1987_2024.js  # Land cover transition analysis
│   │   └── vonat_landcover_forestloss_analysis.js  # Forest loss analysis
│   └── python_scripts/     # Python scripts for data processing
│       ├── create_burned_area_graph.py  # Fire analysis visualization
│       ├── process_hansen_data.py  # Forest loss data processing
│       └── small_area_analysis.py  # Central area analysis
├── LICENSE                 # MIT License
└── README.md              # This file
```

## Data Sources

- **Field Data**: GPS points collected during field surveys (287 points) used for classification training and validation
- **Study Area**: 
  - Main study area: Defined boundaries derived from [Momo Solefack et al., 2018](https://revuecangeotrop.ca/volume-8-numero-2/8799/)
  - Central survey area: Focused subset (18,054 hectares) encompassing field survey locations
- **Remote Sensing Data**:
  - Landsat Collection 2 Surface Reflectance imagery (1987-2024) for land cover classification using CCDC
  - Hansen Global Forest Change dataset (2001-2024) for forest loss analysis
  - MODIS MCD64A1 Burned Area product (2000-2024) for fire disturbance analysis
  - ESA WorldCover (2021) for reference land cover classification

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/ulfboge/VoNat-Mont-Mbam.git
   ```

2. Explore the Google Earth Engine scripts:
   - Navigate to `scripts/gee_scripts/`
   - Key scripts include:
     - `ccdc_classification_with_accuracy.js` - CCDC classification with field survey calibration
     - `fire_frequency_analysis.js` - Fire frequency and yearly burned area analysis
     - `landcover_change_transition_1987_2024.js` - Land cover transition analysis

3. Run Python analysis scripts:
   - Navigate to `scripts/python_scripts/`
   - Install required dependencies: `pandas`, `matplotlib`, `numpy`
   - Key scripts include:
     - `process_hansen_data.py` - Forest loss data processing and visualization
     - `create_burned_area_graph.py` - Fire analysis visualization

4. View the reports:
   - The main report is located at `docs/reports/Central_Area_CCDC_Report.md`
   - All figures referenced in the report are in the `docs/figures/` directory

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Key Analyses

### Land Cover Analysis
- Land cover classification for 1987, 2000, 2010, and 2024 using CCDC
- Survey-calibrated CCDC classification using 287 field survey points for improved local accuracy
- Focused analysis of the central survey area (18,054 hectares)
- Transition analysis between time periods (1987-2024)

### Forest Loss Analysis
- Analysis of Hansen Global Forest Change data (2001-2024)
- Annual and cumulative forest loss quantification
- Identification of acceleration in forest loss in recent years

### Fire Disturbance Analysis
- Analysis of MODIS MCD64A1 burned area data (2000-2024)
- Fire frequency mapping (number of times each area has burned)
- Annual burned area trends showing declining fire activity
- Spatial patterns of fire disturbance



## Contact

For questions or collaboration inquiries, please open an issue in the GitHub repository.