# Data Sources and Metadata

## Field Data
### GPS Points
- **Source**: Voice of Nature field surveys
- **Format**: [To be specified]
- **Collection Date**: [To be specified]
- **Coordinate System**: [To be specified]
- **Attributes**: [To be specified]

## Remote Sensing Data

### Land Cover
- **Source**: ESA WorldCover 2020/2021
- **Resolution**: 10m
- **URL**: https://esa-worldcover.org/
- **Format**: GeoTIFF
- **Classes**: 11 land cover classes according to UN-LCCS classification

### Forest Loss
- **Source**: Hansen Global Forest Change v1.9
- **Time Period**: 2000-2022
- **Resolution**: 30m
- **URL**: https://glad.earthengine.app/view/global-forest-change
- **Variables**: 
  - Tree canopy cover for year 2000
  - Forest loss year
  - Forest gain during 2000-2012
  - Forest loss drivers

### Fire Frequency
- **Source**: MODIS Burned Area Product (MCD64A1)
- **Time Period**: 2000-present
- **Resolution**: 500m
- **Temporal Resolution**: Monthly
- **URL**: https://lpdaac.usgs.gov/products/mcd64a1v006/

### Digital Elevation Model
- **Source**: SRTM 1 Arc-Second Global
- **Resolution**: 30m
- **URL**: https://earthexplorer.usgs.gov/
- **Format**: GeoTIFF
- **Vertical Accuracy**: ~16m

## Additional Datasets
[To be added as new datasets are incorporated into the analysis]

## Data Processing Notes
- All spatial data will be processed to the same coordinate system: [To be specified]
- Analysis extent will be defined by: [To be specified]
- Temporal coverage: [To be specified]

## Quality Control
- Data quality checks performed: [To be specified]
- Known limitations: [To be specified]
- Validation methods: [To be specified] 