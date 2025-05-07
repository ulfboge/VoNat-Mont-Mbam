"""
Create Land Cover Composition Changes Chart (Figure 5)
This script creates a stacked bar chart showing the proportional distribution of land cover types
for each time period (1987, 2000, 2010, 2024).
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os
from pathlib import Path
import seaborn as sns

# Set the style for plots
plt.style.use('ggplot')
sns.set_context("paper", font_scale=1.2)

# Define paths - using absolute paths for better compatibility
base_dir = Path(r"c:\Users\galag\GitHub\VoNat-Mont-Mbam")
data_dir = base_dir / "data" / "data"  # Note the double data directory
output_dir = base_dir / "outputs/charts_figures/land_cover_analysis"
os.makedirs(output_dir, exist_ok=True)

# Define color palette for land cover types - using more distinct colors
land_cover_colors = {
    'Tree cover': '#006400',          # Dark green
    'Shrubland': '#ffbb22',           # Orange-yellow
    'Grassland': '#ffff4c',           # Yellow
    'Cropland': '#f096ff',            # Light purple
    'Built-up': '#fa0000',            # Red
    'Bare / sparse vegetation': '#b4b4b4', # Gray
    'Permanent water bodies': '#0064c8', # Blue
    'Herbaceous wetland': '#0096a0'   # Teal
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
    """Create a stacked bar chart showing proportion of each land cover type for each time period."""
    # Pivot the data for plotting
    pivot_df = df.pivot(index='Year', columns='Land Cover Type', values='Area (hectares)')
    
    # Calculate the total area for each year
    totals = pivot_df.sum(axis=1)
    
    # Calculate percentages
    percent_df = pivot_df.div(totals, axis=0) * 100
    
    # Create the plot with a portrait orientation (better for A4)
    fig, ax = plt.subplots(figsize=(7, 9))
    
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
    
    # Set width of bars
    bar_width = 0.6
    
    # Set positions for bars
    positions = np.arange(len(percent_df.index))
    
    # Create stacked bar chart
    bottom = np.zeros(len(percent_df))
    for lc_type in lc_order:
        # Get the display name
        display_name = renamed_categories.get(lc_type, lc_type)
        color = land_cover_colors[lc_type]
        
        ax.bar(positions, percent_df[lc_type], bottom=bottom, 
               label=display_name, color=color, width=bar_width)
        bottom += percent_df[lc_type]
    
    # Add labels and title
    ax.set_xlabel('Year', fontsize=12)
    ax.set_ylabel('Percentage (%)', fontsize=12)
    ax.set_title('Land Cover Composition (1987-2024)', fontsize=14)
    
    # Set x-ticks to years
    ax.set_xticks(positions)
    ax.set_xticklabels(percent_df.index)
    
    # Add percentage labels for major categories
    for i, year in enumerate(percent_df.index):
        total = 0
        for lc_type in lc_order:
            value = percent_df.loc[year, lc_type]
            if value > 10:  # Only show labels for segments > 10%
                ax.text(i, total + value/2, f"{int(value)}%", 
                        ha='center', va='center', fontweight='bold', 
                        color='white', fontsize=10)
            total += value
    
    # Add legend with better positioning
    ax.legend(loc='upper center', bbox_to_anchor=(0.5, -0.05), 
              ncol=2, fontsize=10, frameon=True)
    
    # Add grid lines for better readability
    ax.grid(axis='y', linestyle='--', alpha=0.3)
    
    # Set y-axis to go from 0 to 100%
    ax.set_ylim(0, 100)
    
    # Add a box around the plot
    for spine in ax.spines.values():
        spine.set_visible(True)
        spine.set_color('black')
        spine.set_linewidth(0.5)
    
    # Save the chart with high resolution
    plt.tight_layout()
    plt.savefig(output_dir / 'fig_composition_changes_1987_2024.png', 
                dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()
    
    print(f"Composition changes chart saved to {output_dir / 'fig_composition_changes_1987_2024.png'}")

def main():
    """Main function to run the analysis."""
    print("Loading land cover data...")
    df = load_data()
    
    print("Generating composition changes chart...")
    create_composition_chart(df)
    
    print("Composition chart created successfully!")

if __name__ == "__main__":
    main()
