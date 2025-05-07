"""
Stacked Bar Chart Visualization for Mont Mbam Land Cover
This script creates a stacked bar chart showing the proportion of each land cover type for each time period.
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

def create_stacked_bar_chart(df):
    """Create a stacked bar chart showing proportion of each land cover type for each time period."""
    # Pivot the data for plotting
    pivot_df = df.pivot(index='Year', columns='Land Cover Type', values='Area (hectares)')
    
    # Calculate the total area for each year
    totals = pivot_df.sum(axis=1)
    
    # Calculate percentages
    percent_df = pivot_df.div(totals, axis=0) * 100
    
    # Create the plot
    fig, ax = plt.subplots(figsize=(12, 8))
    
    # Get land cover types in order of largest to smallest (based on 2024 data)
    last_year = df[df['Year'] == 2024]
    lc_order = last_year.sort_values('Area (hectares)', ascending=False)['Land Cover Type'].tolist()
    
    # Create stacked bar chart
    bottom = np.zeros(len(percent_df))
    for lc_type in lc_order:
        ax.bar(percent_df.index, percent_df[lc_type], bottom=bottom, 
               label=lc_type, color=land_cover_colors[lc_type])
        bottom += percent_df[lc_type]
    
    # Add labels and title
    ax.set_xlabel('Year')
    ax.set_ylabel('Percentage (%)')
    ax.set_title('Land Cover Composition in Mont Mbam Region (1987-2024)')
    
    # Add legend
    ax.legend(loc='center left', bbox_to_anchor=(1, 0.5))
    
    # Add percentage labels
    for i, year in enumerate(percent_df.index):
        total = 0
        for lc_type in lc_order:
            value = percent_df.loc[year, lc_type]
            if value > 5:  # Only show labels for segments > 5%
                ax.text(i, total + value/2, f"{value:.1f}%", ha='center', va='center')
            total += value
    
    # Adjust layout and save
    plt.tight_layout()
    plt.savefig(output_dir / 'land_cover_stacked_bar.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print(f"Stacked bar chart saved to {output_dir / 'land_cover_stacked_bar.png'}")

def main():
    """Main function to run the analysis."""
    print("Loading land cover data...")
    df = load_data()
    
    print("Generating stacked bar chart...")
    create_stacked_bar_chart(df)
    
    print("Stacked bar chart analysis complete!")

if __name__ == "__main__":
    main()
