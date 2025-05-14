"""
Survey Point Analysis for Mont Mbam Region
This script analyzes field survey points and compares them with CCDC land cover classification.
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os
from pathlib import Path
import seaborn as sns
from tabulate import tabulate

# Set the style for plots
plt.style.use('ggplot')
sns.set_context("paper", font_scale=1.5)

# Define paths
project_root = Path(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))  # Go up two levels from script
data_dir = project_root / "data" / "processed" / "land_cover"
output_dir = project_root / "results" / "survey_point_analysis"
os.makedirs(output_dir, exist_ok=True)

print(f"Looking for data in: {data_dir}")
print(f"Output will be saved to: {output_dir}")

# Define land cover class mapping (based on VoNat_landcover_export.js)
worldcover_classes = {
    1: 'Tree cover',
    2: 'Shrubland',
    3: 'Grassland',
    4: 'Cropland',
    5: 'Built-up',
    6: 'Bare / sparse vegetation',
    7: 'Snow and ice',
    8: 'Permanent water bodies',
    9: 'Herbaceous wetland',
    10: 'Mangroves',
    11: 'Moss and lichen',
    12: 'Land cover change'
}

# Define color palette for land cover types (from VoNat_landcover_export.js)
land_cover_colors = {
    'Tree cover': '#006400',
    'Shrubland': '#ffbb22',
    'Grassland': '#ffff4c',
    'Cropland': '#f096ff',
    'Built-up': '#fa0000',
    'Bare / sparse vegetation': '#b4b4b4',
    'Snow and ice': '#f0f0f0',
    'Permanent water bodies': '#0064c8',
    'Herbaceous wetland': '#0096a0',
    'Mangroves': '#00cf75',
    'Moss and lichen': '#fae6a0',
    'Land cover change': '#ff00ff'
}

def load_survey_data():
    """Load survey point data from CSV file."""
    csv_file = "LandCover_2024_Sample_Points.csv"
    df = pd.read_csv(data_dir / csv_file)
    
    # Clean up the data
    df.columns = df.columns.str.strip()
    
    # Extract the point number from the Name column
    df['point_number'] = df['Name'].str.extract(r'#\s*(\d+)')
    
    # Add land cover class name based on the LC2024_1 code
    df['land_cover_class'] = df['LC2024_1'].map(worldcover_classes)
    
    return df

def categorize_survey_points(df):
    """Categorize survey points based on description to identify land cover type."""
    # Define keywords for each land cover type
    keywords = {
        'Tree cover': ['forest', 'tree', 'thick forest', 'riparian forest', 'mahogany', 'regeneration', 'medicinal plant', 
                      'natural regeneration', 'eucalyptus', 'large trees', 'thick riparian', 'sugar stick', 'bumeh', 'bitter stick'],
        'Shrubland': ['shrub', 'shrubland', 'scrubland', 'shrub trees'],
        'Grassland': ['grassland', 'grass', 'grazing', 'grazing land'],
        'Cropland': ['farm', 'farmland', 'agricultural', 'cultivation', 'agricultural lands', 'vast farmland'],
        'Built-up': ['settlement', 'community', 'village', 'palace', 'school', 'herder settlement', 'built', 'herder community', 
                     "chief's palace", 'primary school', 'glazier settlement'],
        'Bare / sparse vegetation': ['bare', 'bareland', 'rock', 'stony', 'burnt', 'burning', 'degraded', 'bush fire', 
                                     'bush burning', 'burnt area', 'huge rock', 'rocky and stony', 'degraded area', 'deforestation'],
        'Permanent water bodies': ['river', 'stream', 'water', 'pond', 'waterfall', 'flowing stream', 'flowing river'],
        'Herbaceous wetland': ['wetland']
    }
    
    # Function to determine land cover type from description
    def get_land_cover_from_description(row):
        desc = str(row['description']).lower() if not pd.isna(row['description']) else ''
        name = str(row['Name']).lower()
        
        combined_text = desc + ' ' + name
        
        for lc_type, kw_list in keywords.items():
            for kw in kw_list:
                if kw.lower() in combined_text:
                    return lc_type
        
        return None
    
    # Apply the function to create a new column
    df['observed_land_cover'] = df.apply(get_land_cover_from_description, axis=1)
    
    return df

def create_summary_table(df):
    """Create a summary table comparing observed land cover with CCDC classification."""
    # Filter points that have observed land cover
    df_with_obs = df[~df['observed_land_cover'].isna()].copy()
    
    # Create a cross-tabulation of observed vs. classified land cover
    cross_tab = pd.crosstab(
        df_with_obs['observed_land_cover'], 
        df_with_obs['land_cover_class'],
        margins=True,
        margins_name='Total'
    )
    
    # Calculate agreement percentage
    agreement_count = sum(df_with_obs['observed_land_cover'] == df_with_obs['land_cover_class'])
    agreement_pct = (agreement_count / len(df_with_obs)) * 100
    
    # Save the cross-tabulation to CSV
    cross_tab.to_csv(output_dir / 'land_cover_comparison.csv')
    
    # Create a more detailed summary table
    summary_data = []
    
    for lc_type in worldcover_classes.values():
        # Points classified as this type by CCDC
        classified_as_type = df_with_obs[df_with_obs['land_cover_class'] == lc_type]
        # Points observed as this type in the field
        observed_as_type = df_with_obs[df_with_obs['observed_land_cover'] == lc_type]
        # Points that match (both classified and observed as this type)
        matching_points = classified_as_type[classified_as_type['observed_land_cover'] == lc_type]
        
        # Calculate commission and omission errors
        commission_error = len(classified_as_type) - len(matching_points)
        omission_error = len(observed_as_type) - len(matching_points)
        
        # Calculate percentages
        if len(classified_as_type) > 0:
            commission_pct = (commission_error / len(classified_as_type)) * 100
        else:
            commission_pct = 0
            
        if len(observed_as_type) > 0:
            omission_pct = (omission_error / len(observed_as_type)) * 100
        else:
            omission_pct = 0
        
        summary_data.append({
            'Land Cover Type': lc_type,
            'CCDC Count': len(classified_as_type),
            'Field Observation Count': len(observed_as_type),
            'Matching Count': len(matching_points),
            'Commission Error': commission_error,
            'Commission Error (%)': commission_pct,
            'Omission Error': omission_error,
            'Omission Error (%)': omission_pct
        })
    
    summary_df = pd.DataFrame(summary_data)
    summary_df.to_csv(output_dir / 'land_cover_summary.csv', index=False)
    
    return cross_tab, summary_df, agreement_pct

def generate_summary_text(cross_tab, summary_df, agreement_pct, df):
    """Generate a summary text report of the analysis."""
    # Count points with and without land cover observations
    total_points = len(df)
    points_with_obs = len(df[~df['observed_land_cover'].isna()])
    points_without_obs = total_points - points_with_obs
    
    # Get the most common land cover types in CCDC and field observations
    ccdc_most_common = summary_df.sort_values('CCDC Count', ascending=False)['Land Cover Type'].iloc[0]
    field_most_common = summary_df.sort_values('Field Observation Count', ascending=False)['Land Cover Type'].iloc[0]
    
    # Generate text report
    report = f"""# Survey Point Analysis Report

## Overview
- Total survey points: {total_points}
- Points with land cover observations: {points_with_obs} ({points_with_obs/total_points*100:.1f}%)
- Points without land cover observations: {points_without_obs} ({points_without_obs/total_points*100:.1f}%)

## Agreement Analysis
- Overall agreement between field observations and CCDC classification: {agreement_pct:.1f}%
- Most common land cover type in CCDC classification: {ccdc_most_common}
- Most common land cover type in field observations: {field_most_common}

## Land Cover Comparison Table
{tabulate(summary_df[['Land Cover Type', 'CCDC Count', 'Field Observation Count', 'Matching Count']], 
          headers='keys', tablefmt='pipe', showindex=False)}

## Error Analysis
{tabulate(summary_df[['Land Cover Type', 'Commission Error (%)', 'Omission Error (%)']], 
          headers='keys', tablefmt='pipe', showindex=False)}

## Key Findings
"""
    
    # Add key findings based on the data
    # Find the land cover types with highest agreement
    best_match = summary_df.loc[summary_df['Matching Count'].idxmax()]
    if best_match['Matching Count'] > 0:
        report += f"- **Highest Agreement**: {best_match['Land Cover Type']} shows the highest agreement between field observations and CCDC classification.\n"
    
    # Find the land cover types with lowest agreement
    worst_match_idx = summary_df[summary_df['CCDC Count'] > 0]['Commission Error (%)'].idxmax()
    worst_match = summary_df.loc[worst_match_idx]
    if worst_match['Commission Error (%)'] > 0:
        report += f"- **Lowest Agreement**: {worst_match['Land Cover Type']} shows the highest commission error, indicating potential classification challenges.\n"
    
    # Add information about specific transitions
    for i, row in summary_df.iterrows():
        lc_type = row['Land Cover Type']
        if row['CCDC Count'] > 0 and row['Commission Error'] > 0:
            # Find what this land cover type was misclassified as
            misclassified_as = df[
                (df['land_cover_class'] == lc_type) & 
                (df['observed_land_cover'] != lc_type) & 
                (~df['observed_land_cover'].isna())
            ]['observed_land_cover'].value_counts()
            
            if not misclassified_as.empty:
                top_misclass = misclassified_as.index[0]
                count = misclassified_as.iloc[0]
                report += f"- {count} points classified as {lc_type} by CCDC were observed as {top_misclass} in the field.\n"
    
    # Save the report to a markdown file
    with open(output_dir / 'survey_point_analysis_report.md', 'w') as f:
        f.write(report)
    
    return report

def plot_confusion_matrix(df):
    """Create a confusion matrix visualization."""
    # Filter points that have observed land cover
    df_with_obs = df[~df['observed_land_cover'].isna()].copy()
    
    # Get unique land cover classes
    land_cover_types = list(worldcover_classes.values())
    
    # Create confusion matrix
    conf_matrix = pd.crosstab(
        df_with_obs['observed_land_cover'], 
        df_with_obs['land_cover_class'],
        normalize='index'
    )
    
    # Fill missing classes with zeros
    for lc_type in land_cover_types:
        if lc_type not in conf_matrix.index:
            conf_matrix.loc[lc_type] = 0
        if lc_type not in conf_matrix.columns:
            conf_matrix[lc_type] = 0
    
    # Sort by land cover type order
    conf_matrix = conf_matrix.reindex(land_cover_types)
    conf_matrix = conf_matrix.reindex(columns=land_cover_types)
    
    # Create the plot
    plt.figure(figsize=(12, 10))
    sns.heatmap(conf_matrix, annot=True, fmt='.2f', cmap='Blues', 
                xticklabels=conf_matrix.columns, yticklabels=conf_matrix.index)
    plt.xlabel('CCDC Classification')
    plt.ylabel('Field Observation')
    plt.title('Confusion Matrix: Field Observations vs. CCDC Classification')
    plt.tight_layout()
    plt.savefig(output_dir / 'confusion_matrix.png', dpi=300, bbox_inches='tight')
    plt.close()

def main():
    """Main function to run the analysis."""
    try:
        print("Loading survey point data...")
        # Print the contents of the directory to verify the file is there
        print(f"Files in data directory: {[f.name for f in data_dir.glob('*')]}")
        
        df = load_survey_data()
        print(f"Loaded data with {len(df)} rows and columns: {df.columns.tolist()}")
        
        print("Categorizing survey points based on descriptions...")
        df = categorize_survey_points(df)
        
        print("Creating summary table...")
        cross_tab, summary_df, agreement_pct = create_summary_table(df)
        
        print("Generating summary text...")
        report = generate_summary_text(cross_tab, summary_df, agreement_pct, df)
        
        print("Creating confusion matrix visualization...")
        plot_confusion_matrix(df)
        
        print(f"Analysis complete! Results saved to {output_dir}")
        
        # Print a preview of the report
        print("\nSummary Report Preview:")
        print("=" * 80)
        print("\n".join(report.split("\n")[:20]))
        print("...")
        print("=" * 80)
        
    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
