"""
Fix Composition Changes Chart
This script creates a properly proportioned stacked bar chart for land cover composition changes.
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
data_dir = Path("data/data")
output_dir = Path("outputs/charts_figures/land_cover_analysis")
os.makedirs(output_dir, exist_ok=True)

# Define color palette for land cover types
land_cover_colors = {
    'Tree cover': '#1f6d07',
    'Shrubland': '#78a51c',
    'Grassland': '#dbd83e',
    'Cropland': '#e49635',
    'Built-up': '#cc0013',
    'Bare / sparse vegetation': '#fff3cf',
    'Water bodies': '#0053c4',
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

def create_composition_chart(df):
    """Create a horizontal stacked bar chart showing proportion of each land cover type for each time period."""
    # Pivot the data for plotting
    pivot_df = df.pivot(index='Year', columns='Land Cover Type', values='Area (hectares)')
    
    # Calculate the total area for each year
    totals = pivot_df.sum(axis=1)
    
    # Calculate percentages
    percent_df = pivot_df.div(totals, axis=0) * 100
    
    # Create the plot with a portrait orientation
    fig, ax = plt.subplots(figsize=(8, 6))
    
    # Get land cover types in order of largest to smallest (based on 2024 data)
    last_year = df[df['Year'] == 2024]
    lc_order = last_year.sort_values('Area (hectares)', ascending=False)['Land Cover Type'].tolist()
    
    # Rename some categories for consistency with report
    renamed_categories = {
        'Permanent water bodies': 'Water bodies',
        'Bare / sparse vegetation': 'Bare/sparse veg.'
    }
    
    # Create a color map for the renamed categories
    color_map = {}
    for lc_type in lc_order:
        if lc_type in renamed_categories:
            color_map[renamed_categories[lc_type]] = land_cover_colors[lc_type]
        else:
            color_map[lc_type] = land_cover_colors[lc_type]
    
    # Convert to horizontal bar chart format
    years = percent_df.index.tolist()
    years.reverse()  # Reverse to have earliest year at the bottom
    
    # Create horizontal stacked bar chart
    left = np.zeros(len(years))
    handles = []
    labels = []
    
    for lc_type in lc_order:
        # Get the display name
        display_name = renamed_categories.get(lc_type, lc_type)
        color = land_cover_colors[lc_type]
        
        # Get values for each year
        values = [percent_df.loc[year, lc_type] for year in years]
        
        # Plot horizontal bar
        bar = ax.barh(years, values, left=left, color=color, label=display_name)
        left += values
        
        # Store for custom legend
        handles.append(bar)
        labels.append(display_name)
    
    # Add labels and title
    ax.set_xlabel('Percentage (%)', fontsize=12)
    ax.set_ylabel('Year', fontsize=12)
    ax.set_title('Land Cover Composition (1987-2024)', fontsize=14)
    
    # Add percentage labels for major categories
    for i, year in enumerate(years):
        left = 0
        for lc_type in lc_order:
            value = percent_df.loc[year, lc_type]
            if value > 10:  # Only show labels for segments > 10%
                ax.text(left + value/2, i, f"{int(value)}%", 
                        ha='center', va='center', fontweight='bold', color='white')
            left += value
    
    # Create custom legend outside the plot
    legend_items = []
    for lc_type in lc_order:
        display_name = renamed_categories.get(lc_type, lc_type)
        color = land_cover_colors[lc_type]
        legend_items.append(plt.Rectangle((0,0), 1, 1, color=color, label=display_name))
    
    ax.legend(legend_items, [item.get_label() for item in legend_items], 
              loc='upper center', bbox_to_anchor=(0.5, -0.15), 
              ncol=3, fontsize=10)
    
    # Adjust layout and save
    plt.tight_layout()
    plt.savefig(output_dir / 'fig_composition_changes_1987_2024.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print(f"Composition changes chart saved to {output_dir / 'fig_composition_changes_1987_2024.png'}")

def main():
    """Main function to run the analysis."""
    print("Loading land cover data...")
    df = load_data()
    
    print("Generating composition changes chart...")
    create_composition_chart(df)
    
    print("Composition chart updated successfully!")

if __name__ == "__main__":
    main()
