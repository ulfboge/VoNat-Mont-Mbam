"""
Script to read and display the structure of a shapefile
"""

import os
import geopandas as gpd
import pandas as pd

# Path to the shapefile
shapefile_path = os.path.join('..', '..', 'qgis', 'vector', 'shapefile', 'sample_points_LC2024.shp')

# Read the shapefile
try:
    gdf = gpd.read_file(shapefile_path)
    
    # Print basic information
    print(f"Number of features: {len(gdf)}")
    print("\nColumns:")
    for col in gdf.columns:
        print(f"- {col}")
    
    # Print the first few rows
    print("\nFirst 5 rows:")
    print(gdf.head())
    
    # Print value counts for categorical columns (if any)
    print("\nValue counts for potential land cover column:")
    for col in gdf.columns:
        if gdf[col].dtype == 'object' or gdf[col].dtype == 'int64':
            if gdf[col].nunique() < 20:  # Only for columns with few unique values
                print(f"\n{col}:")
                print(gdf[col].value_counts())
    
    # Save to CSV for easier viewing
    csv_path = os.path.join('..', '..', 'results', 'shapefile_preview.csv')
    gdf.to_csv(csv_path, index=False)
    print(f"\nSaved preview to: {csv_path}")
    
except Exception as e:
    print(f"Error reading shapefile: {str(e)}")
