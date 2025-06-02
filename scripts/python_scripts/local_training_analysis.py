import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os
import seaborn as sns
from matplotlib.colors import LinearSegmentedColormap
from datetime import datetime

# Set the working directory to the project root
project_dir = r"C:\Users\galag\GitHub\VoNat-Mont-Mbam"
data_dir = os.path.join(project_dir, "data", "data", "local_training")
output_dir = os.path.join(project_dir, "outputs", "local_training_analysis")

# Create output directory if it doesn't exist
os.makedirs(output_dir, exist_ok=True)

# Define color palette for land cover classes
colors = {
    'Tree cover': '#006400',               # Dark green
    'Shrubland': '#8B4513',                # Brown
    'Grassland': '#ADFF2F',                # Yellow-green
    'Cropland': '#FFD700',                 # Gold
    'Built-up': '#FF0000',                 # Red
    'Bare / sparse vegetation': '#D2B48C', # Tan
    'Permanent water bodies': '#0000FF',   # Blue
    'Herbaceous wetland': '#00FFFF'        # Cyan
}

# Function to load and process land cover area data
def load_land_cover_data():
    years = ["1987-01-01", "2000-01-01", "2010-01-01", "2024-12-31"]
    dfs = []
    
    for year in years:
        file_path = os.path.join(data_dir, f"Land_Cover_Area_LC_{year}.csv")
        df = pd.read_csv(file_path)
        # Extract year for easier processing
        df['Year'] = year.split('-')[0]
        dfs.append(df)
    
    # Combine all dataframes
    combined_df = pd.concat(dfs, ignore_index=True)
    return combined_df

# Function to load and process transition data
def load_transition_data():
    file_path = os.path.join(data_dir, "Land_Cover_Transition_Areas_1987_2024 (1).csv")
    df = pd.read_csv(file_path)
    return df

# Function to create time series analysis
def create_time_series_plot(df):
    # Pivot the data for time series plotting
    pivot_df = df.pivot(index='Year', columns='Land Cover Type', values='Area (hectares)')
    
    # Plot the time series
    plt.figure(figsize=(12, 8))
    
    for lc_type in pivot_df.columns:
        plt.plot(pivot_df.index, pivot_df[lc_type], marker='o', linewidth=2, label=lc_type, color=colors[lc_type])
    
    plt.title('Land Cover Change in Mont Mbam (1987-2024)', fontsize=16)
    plt.xlabel('Year', fontsize=14)
    plt.ylabel('Area (hectares)', fontsize=14)
    plt.grid(True, linestyle='--', alpha=0.7)
    plt.legend(title='Land Cover Type', bbox_to_anchor=(1.05, 1), loc='upper left')
    plt.tight_layout()
    
    # Save the figure
    plt.savefig(os.path.join(output_dir, 'time_series_land_cover.png'), dpi=300, bbox_inches='tight')
    plt.close()

# Function to create stacked bar chart
def create_stacked_bar_chart(df):
    # Pivot the data for stacked bar chart
    pivot_df = df.pivot(index='Year', columns='Land Cover Type', values='Area (hectares)')
    
    # Plot the stacked bar chart
    plt.figure(figsize=(12, 8))
    
    # Get the land cover types in order of their total area (largest to smallest)
    lc_types = pivot_df.columns.tolist()
    
    # Create the stacked bar chart with custom colors
    bottom = np.zeros(len(pivot_df.index))
    for lc_type in lc_types:
        plt.bar(pivot_df.index, pivot_df[lc_type], bottom=bottom, label=lc_type, color=colors[lc_type])
        bottom += pivot_df[lc_type].values
    
    plt.title('Land Cover Distribution in Mont Mbam (1987-2024)', fontsize=16)
    plt.xlabel('Year', fontsize=14)
    plt.ylabel('Area (hectares)', fontsize=14)
    plt.legend(title='Land Cover Type', bbox_to_anchor=(1.05, 1), loc='upper left')
    plt.tight_layout()
    
    # Save the figure
    plt.savefig(os.path.join(output_dir, 'stacked_bar_land_cover.png'), dpi=300, bbox_inches='tight')
    plt.close()

# Function to create pie charts for each year
def create_pie_charts(df):
    years = df['Year'].unique()
    
    # Create a 2x2 grid of pie charts
    fig, axs = plt.subplots(2, 2, figsize=(16, 16))
    axs = axs.flatten()
    
    for i, year in enumerate(sorted(years)):
        year_df = df[df['Year'] == year]
        
        # Create pie chart
        wedges, texts, autotexts = axs[i].pie(
            year_df['Area (hectares)'],
            labels=year_df['Land Cover Type'],
            autopct='%1.1f%%',
            startangle=90,
            colors=[colors[lc] for lc in year_df['Land Cover Type']]
        )
        
        # Style the pie chart
        axs[i].set_title(f'Land Cover Distribution in {year}', fontsize=14)
        
        # Make the percentage labels more readable
        for autotext in autotexts:
            autotext.set_fontsize(10)
            autotext.set_weight('bold')
    
    plt.tight_layout()
    
    # Save the figure
    plt.savefig(os.path.join(output_dir, 'pie_charts_land_cover.png'), dpi=300, bbox_inches='tight')
    plt.close()

# Function to create a transition matrix visualization
def create_transition_matrix(transition_df):
    # Create a pivot table for the transition matrix
    matrix_df = pd.pivot_table(
        transition_df,
        values='area_ha',
        index='from_class_name',
        columns='to_class_name',
        aggfunc='sum',
        fill_value=0
    )
    
    # Sort the matrix to have the same order for rows and columns
    lc_types = sorted(set(transition_df['from_class_name'].unique()) | set(transition_df['to_class_name'].unique()))
    matrix_df = matrix_df.reindex(index=lc_types, columns=lc_types, fill_value=0)
    
    # Create a custom colormap from white to dark blue
    cmap = LinearSegmentedColormap.from_list('custom_cmap', ['#FFFFFF', '#0000FF'])
    
    # Plot the transition matrix
    plt.figure(figsize=(12, 10))
    sns.heatmap(
        matrix_df,
        annot=True,
        fmt='.2f',
        cmap=cmap,
        linewidths=0.5,
        cbar_kws={'label': 'Area (hectares)'}
    )
    
    plt.title('Land Cover Transition Matrix (1987-2024)', fontsize=16)
    plt.xlabel('2024 Land Cover', fontsize=14)
    plt.ylabel('1987 Land Cover', fontsize=14)
    plt.tight_layout()
    
    # Save the figure
    plt.savefig(os.path.join(output_dir, 'transition_matrix.png'), dpi=300, bbox_inches='tight')
    plt.close()

# Function to calculate and display net changes
def analyze_net_changes(df):
    # Calculate net changes between 1987 and 2024
    years = ['1987', '2024']
    net_change_df = pd.DataFrame()
    
    for year in years:
        year_df = df[df['Year'] == year]
        if net_change_df.empty:
            net_change_df = year_df[['Land Cover Type', 'Area (hectares)']].copy()
            net_change_df.columns = ['Land Cover Type', year]
        else:
            year_data = year_df[['Land Cover Type', 'Area (hectares)']].copy()
            year_data.columns = ['Land Cover Type', year]
            net_change_df = pd.merge(net_change_df, year_data, on='Land Cover Type')
    
    # Calculate absolute and percentage changes
    net_change_df['Absolute Change (ha)'] = net_change_df['2024'] - net_change_df['1987']
    net_change_df['Percentage Change (%)'] = (net_change_df['Absolute Change (ha)'] / net_change_df['1987']) * 100
    
    # Sort by absolute change
    net_change_df = net_change_df.sort_values('Absolute Change (ha)', ascending=False)
    
    # Create a horizontal bar chart for net changes
    plt.figure(figsize=(12, 8))
    bars = plt.barh(
        net_change_df['Land Cover Type'],
        net_change_df['Absolute Change (ha)'],
        color=[colors[lc] for lc in net_change_df['Land Cover Type']]
    )
    
    # Add data labels
    for bar in bars:
        width = bar.get_width()
        label_x_pos = width + 10 if width > 0 else width - 40
        plt.text(label_x_pos, bar.get_y() + bar.get_height()/2, f'{width:.2f} ha', 
                 va='center', ha='left' if width > 0 else 'right', fontweight='bold')
    
    plt.axvline(x=0, color='black', linestyle='-', linewidth=0.8)
    plt.title('Net Change in Land Cover (1987-2024)', fontsize=16)
    plt.xlabel('Change in Area (hectares)', fontsize=14)
    plt.grid(axis='x', linestyle='--', alpha=0.7)
    plt.tight_layout()
    
    # Save the figure
    plt.savefig(os.path.join(output_dir, 'net_changes.png'), dpi=300, bbox_inches='tight')
    plt.close()
    
    # Save the net change data to CSV
    net_change_df.to_csv(os.path.join(output_dir, 'net_changes.csv'), index=False)
    
    return net_change_df

# Function to generate a comprehensive report
def generate_report(lc_df, transition_df, net_change_df):
    # Calculate total area
    total_area = lc_df[lc_df['Year'] == '1987']['Area (hectares)'].sum()
    
    # Calculate persistence (diagonal of transition matrix)
    persistence_df = transition_df[transition_df['from_class_name'] == transition_df['to_class_name']]
    total_persistence = persistence_df['area_ha'].sum()
    persistence_percentage = (total_persistence / total_area) * 100
    
    # Find major transitions (non-diagonal elements with significant area)
    major_transitions = transition_df[
        (transition_df['from_class_name'] != transition_df['to_class_name']) & 
        (transition_df['area_ha'] > 10)  # Threshold of 10 hectares
    ].sort_values('area_ha', ascending=False).head(10)
    
    # Generate the report
    report = f"""# Mont Mbam Land Cover Change Analysis (1987-2024)
## Based on Local Training Data

*Generated on {datetime.now().strftime('%Y-%m-%d')}*

## Overview
This analysis examines land cover changes in the Mont Mbam region from 1987 to 2024 using CCDC (Continuous Change Detection and Classification) analysis results based on local training data.

## Key Findings

### Land Cover Distribution
The total study area is approximately {total_area:.2f} hectares.

| Land Cover Type | 1987 Area (ha) | 2024 Area (ha) | Change (ha) | Change (%) |
|-----------------|----------------|----------------|-------------|------------|
"""
    
    for _, row in net_change_df.iterrows():
        report += f"| {row['Land Cover Type']} | {row['1987']:.2f} | {row['2024']:.2f} | {row['Absolute Change (ha)']:.2f} | {row['Percentage Change (%)']:.2f} |\n"
    
    report += f"""
### Land Cover Stability
- {persistence_percentage:.2f}% of the study area maintained the same land cover class from 1987 to 2024.

### Major Land Cover Transitions
The following are the most significant land cover transitions observed:

| From | To | Area (ha) |
|------|------|----------|
"""
    
    for _, row in major_transitions.iterrows():
        report += f"| {row['from_class_name']} | {row['to_class_name']} | {row['area_ha']:.2f} |\n"
    
    report += """
## Conclusion
"""
    
    # Add conclusions based on the data
    # Tree cover trends
    tree_change = net_change_df[net_change_df['Land Cover Type'] == 'Tree cover']['Absolute Change (ha)'].values[0]
    report += f"\nTree cover has {'increased' if tree_change > 0 else 'decreased'} by {abs(tree_change):.2f} hectares ({abs(net_change_df[net_change_df['Land Cover Type'] == 'Tree cover']['Percentage Change (%)'].values[0]):.2f}%) from 1987 to 2024. "
    
    # Grassland trends
    grass_change = net_change_df[net_change_df['Land Cover Type'] == 'Grassland']['Absolute Change (ha)'].values[0]
    report += f"Grassland has {'increased' if grass_change > 0 else 'decreased'} by {abs(grass_change):.2f} hectares ({abs(net_change_df[net_change_df['Land Cover Type'] == 'Grassland']['Percentage Change (%)'].values[0]):.2f}%). "
    
    # Built-up trends
    builtup_change = net_change_df[net_change_df['Land Cover Type'] == 'Built-up']['Absolute Change (ha)'].values[0]
    report += f"Built-up areas have {'increased' if builtup_change > 0 else 'decreased'} by {abs(builtup_change):.2f} hectares ({abs(net_change_df[net_change_df['Land Cover Type'] == 'Built-up']['Percentage Change (%)'].values[0]):.2f}%).\n"
    
    # Water and wetland trends
    water_change = net_change_df[net_change_df['Land Cover Type'] == 'Permanent water bodies']['Absolute Change (ha)'].values[0]
    wetland_change = net_change_df[net_change_df['Land Cover Type'] == 'Herbaceous wetland']['Absolute Change (ha)'].values[0]
    report += f"\nWater bodies have {'increased' if water_change > 0 else 'decreased'} by {abs(water_change):.2f} hectares, while wetlands have {'increased' if wetland_change > 0 else 'decreased'} by {abs(wetland_change):.2f} hectares.\n"
    
    # Overall stability
    report += f"\nOverall, the landscape shows a relatively high degree of stability, with {persistence_percentage:.2f}% of the area maintaining the same land cover class over the 37-year period. The most dynamic transitions appear to be between grassland and tree cover, suggesting natural succession processes or changes in land management practices."
    
    # Write the report to a markdown file
    with open(os.path.join(output_dir, 'land_cover_analysis_report.md'), 'w') as f:
        f.write(report)

# Main function to run the analysis
def main():
    print("Loading land cover data...")
    lc_df = load_land_cover_data()
    
    print("Loading transition data...")
    transition_df = load_transition_data()
    
    print("Creating time series plot...")
    create_time_series_plot(lc_df)
    
    print("Creating stacked bar chart...")
    create_stacked_bar_chart(lc_df)
    
    print("Creating pie charts...")
    create_pie_charts(lc_df)
    
    print("Creating transition matrix...")
    create_transition_matrix(transition_df)
    
    print("Analyzing net changes...")
    net_change_df = analyze_net_changes(lc_df)
    
    print("Generating comprehensive report...")
    generate_report(lc_df, transition_df, net_change_df)
    
    print(f"Analysis complete. Results saved to {output_dir}")

if __name__ == "__main__":
    main()
