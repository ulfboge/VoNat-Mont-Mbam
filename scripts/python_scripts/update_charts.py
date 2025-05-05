import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import os
from matplotlib.colors import LinearSegmentedColormap

# Set the output directory
output_dir = r'c:\Users\galag\GitHub\VoNat-Mont-Mbam\outputs\charts_figures'

# Create Land Cover Distribution Chart
def create_land_cover_chart():
    # Land cover data from the updated analysis
    land_cover_types = [
        'Tree Cover', 'Grassland', 'Cropland', 'Shrubland', 
        'Permanent Water Bodies', 'Herbaceous Wetland', 'Other'
    ]
    
    # Combine smaller categories into "Other"
    areas = [26006, 25693, 4356, 3131, 2672, 2195, 562]  # Built-up and Bare/sparse vegetation combined as "Other"
    percentages = [40, 39, 7, 5, 4, 3, 2]  # Rounded percentages
    
    # Define colors for each land cover type based on the dataset
    # 10: Tree cover, 20: Shrubland, 30: Grassland, 40: Cropland, 80: Permanent water bodies, 90: Herbaceous wetland, Other
    colors = ['#006400', '#ffbb22', '#ffff4c', '#f096ff', '#0064c8', '#0096a0', '#b4b4b4']
    
    # Create the pie chart
    plt.figure(figsize=(10, 7))
    wedges, texts, autotexts = plt.pie(
        percentages, 
        labels=land_cover_types, 
        colors=colors,
        autopct='%1.0f%%', 
        startangle=90,
        pctdistance=0.85
    )
    
    # Style the pie chart
    plt.axis('equal')
    plt.title('Land Cover Distribution in VoNat-Mont-Mbam (2021)', fontsize=16, pad=20)
    
    # Style the text elements
    for text in texts:
        text.set_fontsize(12)
    for autotext in autotexts:
        autotext.set_fontsize(11)
        autotext.set_weight('bold')
        autotext.set_color('white')
    
    # Add a note about the "Other" category
    plt.figtext(0.5, 0.01, 'Note: "Other" includes Built-up (1%) and Bare/sparse vegetation (<1%)', 
                ha='center', fontsize=10, style='italic')
    
    # Save the chart
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'land_cover_distribution.png'), dpi=300, bbox_inches='tight')
    plt.close()
    print("Land cover distribution chart created successfully.")

# Create Annual Forest Loss Chart
def create_annual_forest_loss_chart():
    # Annual forest loss data from the updated analysis
    years = list(range(2001, 2024))
    forest_loss = [
        7.8, 6.7, 9.6, 11.8, 13.4, 26.3, 9.5, 1.7, 15.1, 10.3, 0.8, 11.4, 9.8, 
        9.6, 7.2, 4.4, 11.5, 18.4, 9.6, 13.1, 20.8, 18.7, 45.7
    ]
    
    # Create the bar chart
    plt.figure(figsize=(12, 6))
    bars = plt.bar(years, forest_loss, color='#CD5C5C', width=0.7)
    
    # Highlight significant years
    highlight_years = [2006, 2009, 2018, 2021, 2023]
    for i, year in enumerate(years):
        if year in highlight_years:
            bars[i].set_color('#8B0000')
    
    # Add labels and title
    plt.xlabel('Year', fontsize=12)
    plt.ylabel('Forest Loss (hectares)', fontsize=12)
    plt.title('Annual Forest Loss in VoNat-Mont-Mbam (2001-2023)', fontsize=16, pad=20)
    
    # Customize the axes
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.xticks(years[::2], rotation=45)  # Show every other year
    
    # Add data labels for highlighted years
    for i, year in enumerate(years):
        if year in highlight_years:
            plt.text(year, forest_loss[i] + 1, f'{forest_loss[i]}', 
                     ha='center', va='bottom', fontsize=9, fontweight='bold')
    
    # No annotation for highest loss as requested
    
    # Save the chart
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'annual_forest_loss.png'), dpi=300, bbox_inches='tight')
    plt.close()
    print("Annual forest loss chart created successfully.")

# Create Cumulative Forest Loss Chart
def create_cumulative_forest_loss_chart():
    # Annual forest loss data
    years = list(range(2001, 2024))
    forest_loss = [
        7.8, 6.7, 9.6, 11.8, 13.4, 26.3, 9.5, 1.7, 15.1, 10.3, 0.8, 11.4, 9.8, 
        9.6, 7.2, 4.4, 11.5, 18.4, 9.6, 13.1, 20.8, 18.7, 45.7
    ]
    
    # Calculate cumulative loss
    cumulative_loss = np.cumsum(forest_loss)
    
    # Create the line chart
    plt.figure(figsize=(12, 6))
    
    # Plot cumulative loss line
    plt.plot(years, cumulative_loss, marker='o', markersize=6, linewidth=2.5, 
             color='#8B0000', markerfacecolor='#CD5C5C')
    
    # Add area under the curve
    plt.fill_between(years, cumulative_loss, alpha=0.3, color='#CD5C5C')
    
    # Add labels and title
    plt.xlabel('Year', fontsize=12)
    plt.ylabel('Cumulative Forest Loss (hectares)', fontsize=12)
    plt.title('Cumulative Forest Loss in VoNat-Mont-Mbam (2001-2023)', fontsize=16, pad=20)
    
    # Customize the axes
    plt.grid(linestyle='--', alpha=0.7)
    plt.xticks(years[::2], rotation=45)  # Show every other year
    
    # Add annotation for total loss
    plt.annotate(f'Total loss: {cumulative_loss[-1]:.1f} ha', 
                xy=(2023, cumulative_loss[-1]), 
                xytext=(2018, cumulative_loss[-1] - 50),
                arrowprops=dict(facecolor='black', shrink=0.05, width=1.5, headwidth=8),
                fontsize=10, fontweight='bold')
    
    # Add percentage loss annotation
    plt.figtext(0.5, 0.01, 'Total loss represents 1.5% of forest cover in 2000 (19,274 ha)', 
                ha='center', fontsize=10, style='italic')
    
    # Save the chart
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'cumulative_forest_loss.png'), dpi=300, bbox_inches='tight')
    plt.close()
    print("Cumulative forest loss chart created successfully.")

if __name__ == "__main__":
    print("Generating updated charts for VoNat-Mont-Mbam project...")
    create_land_cover_chart()
    create_annual_forest_loss_chart()
    create_cumulative_forest_loss_chart()
    print("All charts have been updated successfully.")
