# Python Analysis Scripts

This directory contains Python scripts for data analysis and visualization in the Mont Mbam project.

## Scripts Overview

### `create_fire_charts.py`
- **Purpose**: Generates charts visualizing fire disturbance patterns in the Mont Mbam region
- **Inputs**: CSV data files with yearly burned area statistics (2000-2024)
- **Outputs**: 
  - `yearly_burned_area.png`: Bar chart showing annual burned area with trend line
- **Dependencies**: pandas, matplotlib, seaborn, numpy

## Usage Instructions

1. Ensure Python 3.x is installed with the required dependencies:
   ```bash
   pip install pandas matplotlib seaborn numpy
   ```

2. Run scripts from the project root directory:
   ```bash
   python scripts/analysis/create_fire_charts.py
   ```

3. Output files will be saved to the appropriate directories in `outputs/charts_figures/`

## Data Requirements

- CSV files with analysis results in `data/data/` directory
- Proper directory structure for outputs

## Notes

- Scripts use absolute paths based on the project root directory
- Make sure all required directories exist before running the scripts
- For large datasets, scripts may require significant memory
