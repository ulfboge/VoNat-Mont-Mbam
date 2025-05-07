"""
Land Cover Transition Analysis for Mont Mbam Region
This script analyzes land cover transitions between time periods and generates transition matrices.
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
        # Extract data for this period
        period_data = transitions_df.iloc[i][land_cover_types].values.reshape(1, -1)
        
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

def main():
    """Main function to run the analysis."""
    print("Loading land cover data...")
    df = load_data()
    
    print("Calculating land cover transitions...")
    transitions_df = calculate_transitions(df)
    
    print("Generating transition heatmaps...")
    plot_transition_heatmap(transitions_df)
    
    print("Creating transition summary...")
    summary_df = create_transition_summary(transitions_df)
    
    print("Transition analysis complete!")

if __name__ == "__main__":
    main()
