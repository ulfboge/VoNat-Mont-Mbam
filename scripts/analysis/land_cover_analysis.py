"""
Land Cover Analysis for Mont Mbam Region
This script analyzes land cover changes from 1987 to 2024 based on CCDC analysis results.
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os
import seaborn as sns
from matplotlib.colors import LinearSegmentedColormap
from pathlib import Path

# Set the style for plots
plt.style.use('ggplot')
sns.set_context("paper", font_scale=1.5)

# Define paths
data_dir = Path("../../data/data")
output_dir = Path("../../results/land_cover_analysis")
os.makedirs(output_dir, exist_ok=True)

# Define color palette for land cover types
land_cover_colors = {
    'Tree cover': '#1f6d07',
    'Shrubland': '#78a51c',
    'Grassland': '#dbd83e',
    'Cropland': '#e49635',
    'Built-up': '#cc0013',
    'Bare / sparse vegetation': '#fff3cf',
    'Permanent water bodies': '#0053c4',
    'Herbaceous wetland': '#55c1ff'
}

def load_data():
    """Load all land cover CSV files and combine them into a single DataFrame."""
    # List of CSV files to read
    csv_files = [
        "Land_Cover_Area_LC_1987-01-01.csv",
        "Land_Cover_Area_LC_2000-01-01.csv",
        "Land_Cover_Area_LC_2010-01-01.csv",
        "Land_Cover_Area_LC_2024-12-01.csv"
    ]
    
    # Read and combine data
    all_data = []
    for file in csv_files:
        df = pd.read_csv(data_dir / file)
        all_data.append(df)
    
    # Combine all data
    combined_df = pd.concat(all_data, ignore_index=True)
    
    # Extract year from the 'Year' column
    combined_df['Year'] = combined_df['Year'].str.extract(r'LC_(\d{4})')
    combined_df['Year'] = pd.to_numeric(combined_df['Year'])
    
    return combined_df

def plot_time_series(df):
    """Create a time series plot showing changes in each land cover type over time."""
    # Pivot the data for plotting
    pivot_df = df.pivot(index='Year', columns='Land Cover Type', values='Area (hectares)')
    
    # Create the plot
    fig, ax = plt.subplots(figsize=(12, 8))
    
    # Plot each land cover type
    for lc_type in pivot_df.columns:
        ax.plot(pivot_df.index, pivot_df[lc_type], marker='o', linewidth=2, 
                label=lc_type, color=land_cover_colors[lc_type])
    
    # Add labels and title
    ax.set_xlabel('Year')
    ax.set_ylabel('Area (hectares)')
    ax.set_title('Land Cover Changes in Mont Mbam Region (1987-2024)')
    
    # Add legend
    ax.legend(loc='center left', bbox_to_anchor=(1, 0.5))
    
    # Adjust layout and save
    plt.tight_layout()
    plt.savefig(output_dir / 'land_cover_time_series.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print(f"Time series plot saved to {output_dir / 'land_cover_time_series.png'}")

def main():
    """Main function to run all analyses."""
    print("Loading land cover data...")
    df = load_data()
    
    print("Generating time series plot...")
    plot_time_series(df)
    
    print("Analysis complete!")

if __name__ == "__main__":
    main()
