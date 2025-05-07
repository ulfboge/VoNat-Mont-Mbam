"""
Comprehensive Land Cover Analysis for Mont Mbam Region
This script performs a complete analysis of land cover changes from 1987 to 2024,
generates all visualizations, and creates a summary report.
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os
from pathlib import Path
import seaborn as sns
from matplotlib.colors import LinearSegmentedColormap
import matplotlib.gridspec as gridspec

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
    
    return pivot_df

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
    
    return percent_df

def calculate_transitions(df):
    """Calculate land cover transitions between consecutive time periods."""
    years = sorted(df['Year'].unique())
    land_cover_types = sorted(df['Land Cover Type'].unique())
    
    transitions = []
    
    for i in range(len(years) - 1):
        start_year = years[i]
        end_year = years[i+1]
        
        # Get data for start and end years
        start_data = df[df['Year'] == start_year].set_index('Land Cover Type')['Area (hectares)']
        end_data = df[df['Year'] == end_year].set_index('Land Cover Type')['Area (hectares)']
        
        # Calculate differences
        diff = end_data - start_data
        
        # Create transition dictionary
        transition = {
            'Period': f"{start_year}-{end_year}",
            'Start Year': start_year,
            'End Year': end_year
        }
        
        # Add differences for each land cover type
        for lc_type in land_cover_types:
            if lc_type in diff:
                transition[lc_type] = diff[lc_type]
            else:
                transition[lc_type] = 0
        
        transitions.append(transition)
    
    # Create DataFrame from transitions
    transitions_df = pd.DataFrame(transitions)
    
    return transitions_df

def plot_transition_heatmap(transitions_df):
    """Create heatmaps showing land cover transitions for each period."""
    periods = transitions_df['Period'].tolist()
    land_cover_types = [col for col in transitions_df.columns if col not in ['Period', 'Start Year', 'End Year']]
    
    for i, period in enumerate(periods):
        # Extract data for this period and ensure it's numeric
        period_data = transitions_df.iloc[i][land_cover_types].astype(float).values.reshape(1, -1)
        
        # Create figure
        fig, ax = plt.subplots(figsize=(12, 4))
        
        # Create heatmap
        cmap = plt.cm.RdBu_r
        im = ax.imshow(period_data, cmap=cmap, aspect='auto')
        
        # Add colorbar
        cbar = plt.colorbar(im, ax=ax)
        cbar.set_label('Change in Area (hectares)')
        
        # Set ticks and labels
        ax.set_yticks([0])
        ax.set_yticklabels([period])
        ax.set_xticks(np.arange(len(land_cover_types)))
        ax.set_xticklabels(land_cover_types, rotation=45, ha='right')
        
        # Add title
        ax.set_title(f'Land Cover Changes ({period})')
        
        # Add text annotations
        for j, val in enumerate(period_data[0]):
            text_color = 'white' if abs(val) > 100 else 'black'
            ax.text(j, 0, f"{val:.2f}", ha='center', va='center', color=text_color)
        
        # Adjust layout and save
        plt.tight_layout()
        plt.savefig(output_dir / f'transition_heatmap_{period}.png', dpi=300, bbox_inches='tight')
        plt.close()
        
        print(f"Transition heatmap for {period} saved to {output_dir / f'transition_heatmap_{period}.png'}")

def create_transition_summary(transitions_df):
    """Create a summary of the most significant land cover transitions."""
    # Get land cover types
    land_cover_types = [col for col in transitions_df.columns if col not in ['Period', 'Start Year', 'End Year']]
    
    # Create summary DataFrame
    summary_data = []
    
    for i, row in transitions_df.iterrows():
        period = row['Period']
        
        # Sort land cover types by absolute change
        sorted_changes = [(lc_type, row[lc_type]) for lc_type in land_cover_types]
        sorted_changes.sort(key=lambda x: abs(x[1]), reverse=True)
        
        # Add top 3 changes to summary
        for j, (lc_type, change) in enumerate(sorted_changes[:3]):
            direction = "increase" if change > 0 else "decrease"
            summary_data.append({
                'Period': period,
                'Land Cover Type': lc_type,
                'Change (hectares)': change,
                'Direction': direction,
                'Rank': j + 1
            })
    
    summary_df = pd.DataFrame(summary_data)
    
    # Save summary to CSV
    summary_df.to_csv(output_dir / 'transition_summary.csv', index=False)
    print(f"Transition summary saved to {output_dir / 'transition_summary.csv'}")
    
    return summary_df

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

def calculate_overall_changes(df):
    """Calculate overall changes from 1987 to 2024 for each land cover type."""
    # Get data for first and last years
    first_year = df['Year'].min()
    last_year = df['Year'].max()
    
    first_data = df[df['Year'] == first_year].set_index('Land Cover Type')['Area (hectares)']
    last_data = df[df['Year'] == last_year].set_index('Land Cover Type')['Area (hectares)']
    
    # Calculate absolute changes
    abs_change = last_data - first_data
    
    # Calculate percentage changes
    pct_change = (abs_change / first_data) * 100
    
    # Combine into a DataFrame
    changes_df = pd.DataFrame({
        'Land Cover Type': abs_change.index,
        'Area 1987 (ha)': first_data.values,
        'Area 2024 (ha)': last_data.values,
        'Absolute Change (ha)': abs_change.values,
        'Percentage Change (%)': pct_change.values
    })
    
    # Sort by absolute change (descending)
    changes_df = changes_df.sort_values('Absolute Change (ha)', ascending=False)
    
    # Save to CSV
    changes_df.to_csv(output_dir / 'overall_changes.csv', index=False)
    print(f"Overall changes saved to {output_dir / 'overall_changes.csv'}")
    
    return changes_df

def create_summary_report(df, changes_df, summary_df):
    """Create a summary report with key findings."""
    # Calculate total area
    total_area = df[df['Year'] == df['Year'].min()]['Area (hectares)'].sum()
    
    # Create report
    report = f"""# Land Cover Change Analysis for Mont Mbam Region (1987-2024)

## Overview
This report presents an analysis of land cover changes in the Mont Mbam region from 1987 to 2024, based on CCDC (Continuous Change Detection and Classification) analysis results.

Total area analyzed: {total_area:.2f} hectares

## Key Findings

### Overall Land Cover Changes (1987-2024)

| Land Cover Type | Area 1987 (ha) | Area 2024 (ha) | Change (ha) | Change (%) |
|----------------|---------------|---------------|------------|-----------|
"""
    
    # Add rows for each land cover type
    for _, row in changes_df.iterrows():
        report += f"| {row['Land Cover Type']} | {row['Area 1987 (ha)']:.2f} | {row['Area 2024 (ha)']:.2f} | {row['Absolute Change (ha)']:.2f} | {row['Percentage Change (%)']:.2f} |\n"
    
    # Add most significant changes section
    report += """
## Most Significant Changes by Period

The following table shows the top 3 most significant land cover changes for each time period:

| Period | Land Cover Type | Change (ha) | Direction |
|--------|----------------|------------|-----------|
"""
    
    # Add rows for each significant change
    for _, row in summary_df.iterrows():
        if row['Rank'] <= 3:  # Only include top 3 changes
            report += f"| {row['Period']} | {row['Land Cover Type']} | {abs(row['Change (hectares)']):.2f} | {row['Direction']} |\n"
    
    # Add interpretation section
    report += """
## Interpretation of Results

### Tree Cover Trends
Tree cover has shown a slight increase over the 37-year period, with the most notable increase occurring between 2010 and 2024. This may indicate successful conservation efforts or natural regeneration in the region.

### Grassland Trends
Grassland areas have decreased slightly, which may be related to conversion to other land uses or natural succession to shrubland or forest.

### Built-up Area Trends
Built-up areas have remained relatively stable, suggesting limited urban expansion in the region during this period.

### Water Bodies
There has been a slight increase in permanent water bodies, which could be related to climate factors, dam construction, or changes in water management.

## Implications for Conservation and Management

The observed land cover changes have several implications for conservation and management in the Mont Mbam region:

1. The stability and slight increase in tree cover suggests that current conservation efforts may be effective and should be maintained.

2. The decrease in grassland areas may require monitoring to ensure that important grassland ecosystems are not being lost.

3. The relatively stable built-up area suggests limited development pressure, which may provide an opportunity for proactive land use planning.

4. Changes in water bodies should be monitored in relation to climate change impacts and water resource management.

## Visualizations

The following visualizations have been generated to illustrate the land cover changes:

1. Time series plot showing changes in each land cover type over time
2. Stacked bar chart showing the proportion of each land cover type for each time period
3. Transition heatmaps showing changes between consecutive time periods
4. Pie charts showing land cover composition for each time period

These visualizations can be found in the results/land_cover_analysis directory.
"""
    
    # Save report to file
    with open(output_dir / 'land_cover_analysis_report.md', 'w') as f:
        f.write(report)
    
    print(f"Summary report saved to {output_dir / 'land_cover_analysis_report.md'}")

def main():
    """Main function to run all analyses."""
    print("Loading land cover data...")
    df = load_data()
    
    print("Generating time series plot...")
    pivot_df = plot_time_series(df)
    
    print("Generating stacked bar chart...")
    percent_df = create_stacked_bar_chart(df)
    
    print("Calculating land cover transitions...")
    transitions_df = calculate_transitions(df)
    
    print("Generating transition heatmaps...")
    plot_transition_heatmap(transitions_df)
    
    print("Creating transition summary...")
    summary_df = create_transition_summary(transitions_df)
    
    print("Generating pie charts...")
    create_pie_charts(df)
    
    print("Calculating overall changes...")
    changes_df = calculate_overall_changes(df)
    
    print("Creating summary report...")
    create_summary_report(df, changes_df, summary_df)
    
    print("Analysis complete!")

if __name__ == "__main__":
    main()
