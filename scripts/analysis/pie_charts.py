"""
Pie Chart Visualization for Mont Mbam Land Cover
This script creates pie charts showing land cover composition for each time period.
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os
from pathlib import Path
import seaborn as sns

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

def create_pie_charts(df):
    """Create pie charts showing land cover composition for each time period."""
    # Get unique years
    years = sorted(df['Year'].unique())
    
    # Create a figure with subplots
    fig, axes = plt.subplots(1, len(years), figsize=(20, 6))
    
    # Create pie chart for each year
    for i, year in enumerate(years):
        # Get data for this year
        year_data = df[df['Year'] == year]
        
        # Create pie chart
        wedges, texts, autotexts = axes[i].pie(
            year_data['Area (hectares)'],
            labels=None,
            autopct='%1.1f%%',
            startangle=90,
            colors=[land_cover_colors[lc] for lc in year_data['Land Cover Type']]
        )
        
        # Make the percentage labels more readable
        for autotext in autotexts:
            autotext.set_fontsize(8)
            autotext.set_color('white')
        
        # Add title
        axes[i].set_title(f'Land Cover in {year}')
    
    # Add a single legend for all subplots
    fig.legend(
        [plt.Rectangle((0, 0), 1, 1, fc=land_cover_colors[lc]) for lc in land_cover_colors],
        land_cover_colors.keys(),
        loc='lower center',
        bbox_to_anchor=(0.5, -0.15),
        ncol=4
    )
    
    # Adjust layout and save
    plt.tight_layout()
    plt.subplots_adjust(bottom=0.25)
    plt.savefig(output_dir / 'land_cover_pie_charts.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print(f"Pie charts saved to {output_dir / 'land_cover_pie_charts.png'}")

def main():
    """Main function to run the analysis."""
    print("Loading land cover data...")
    df = load_data()
    
    print("Generating pie charts...")
    create_pie_charts(df)
    
    print("Pie chart analysis complete!")

if __name__ == "__main__":
    main()
