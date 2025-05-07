# VoNat-Mont-Mbam

A comprehensive geospatial analysis project focused on the Mont Mbam region, utilizing Google Earth Engine (GEE) and QGIS for spatial data processing, analysis, and visualization.

## Project Overview

This repository contains geospatial data, analysis tools, and documentation for the VoNat-Mont-Mbam project. The project aims to analyze and visualize environmental data in the Mont Mbam region, with a focus on land cover changes, fire disturbance patterns, and physical characteristics. The analysis combines remote sensing data from multiple sources with field observations to provide a comprehensive understanding of landscape dynamics in this ecologically important area.

## Repository Structure

```
VoNat-Mont-Mbam/
├── data/                    # Data directory
│   ├── raw/                # Raw data files
│   │   └── gps_points/     # GPS point data
│   └── data/               # Processed data files and analysis outputs (CSV)
├── docs/                    # Documentation
│   ├── proposal/           # Project proposal documents
│   └── reports/            # Report outlines and final documents
├── metadata/               # Metadata documentation
├── outputs/                # Analysis outputs
│   ├── charts_figures/     # Charts and figures for reports
│   │   ├── current_land_cover/  # Land cover visualizations
│   │   ├── fire_analysis/       # Fire analysis visualizations
│   │   └── land_cover_analysis/ # Land cover change analysis
│   └── maps/               # Map outputs from GEE and QGIS
├── qgis/                   # QGIS project files
│   ├── project/           # QGIS project files
│   ├── style/             # QGIS style files
│   └── vector/            # Vector data
│       ├── geopackage/   # Geopackage files
│       └── kml/          # KML files
├── scripts/                # Analysis scripts
│   ├── analysis/          # Python analysis scripts
│   ├── gee_scripts/       # Google Earth Engine JavaScript scripts
│   └── python_scripts/    # Python scripts for data processing
├── CHANGELOG.md           # Record of changes and additions
├── CONTRIBUTING.md        # Contribution guidelines
├── LICENSE                # MIT License
└── README.md             # This file
```

## Data Sources

- **Field Data**: GPS points collected during field surveys (268 points)
- **Study Area**: Defined boundaries derived from [Momo Solefack et al., 2018](https://revuecangeotrop.ca/volume-8-numero-2/8799/)
- **Remote Sensing Data**:
  - Landsat imagery (1987-2024) for land cover classification using CCDC
  - MODIS MCD64A1 Burned Area product (2000-2024) for fire analysis
  - ESA WorldCover (2021) for current land cover classification
  - Hansen Global Forest Change dataset (2000-2023) for forest cover and loss
- **Elevation Data**: SRTM Digital Elevation Model
- **Hydrological Data**: HydroSHEDS and HydroRIVERS datasets

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/ulfboge/VoNat-Mont-Mbam.git
   ```

2. Open the QGIS project:
   - Navigate to `qgis/project/`
   - Open `VoNat.qgz` in QGIS

3. Explore the Google Earth Engine scripts:
   - Navigate to `scripts/gee_scripts/`
   - Scripts can be run in the Google Earth Engine Code Editor

4. Run Python analysis scripts:
   - Navigate to `scripts/analysis/`
   - Install required dependencies: `pandas`, `matplotlib`, `seaborn`, `numpy`
   - Run scripts using Python 3.x

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Key Analyses

### Land Cover Analysis
- Land cover classification for 1987, 2000, 2010, and 2024 using CCDC
- Transition analysis between time periods
- Comparison with ESA WorldCover and Hansen Global Forest Change datasets

### Fire Disturbance Analysis
- Fire frequency mapping (2000-2024)
- Most recent burn year analysis
- Temporal trends in burned area
- Relationship between fire patterns and land cover changes

### Physical Characteristics
- Elevation analysis
- Hydrological network mapping

## Contact

For questions or collaboration inquiries, please open an issue in the GitHub repository.