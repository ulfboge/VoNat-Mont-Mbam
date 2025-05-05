import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os
import numpy as np

# Set style
sns.set_theme(style="whitegrid")

# Create output directory if it doesn't exist
output_dir = 'outputs/charts_figures'
os.makedirs(output_dir, exist_ok=True)

# Read the data
worldcover_df = pd.read_csv('data/data/vonat_worldcover_stats_improved.csv')
hansen_df = pd.read_csv('data/data/vonat_hansen_stats_improved.csv')
annual_loss_df = pd.read_csv('data/data/vonat_annual_loss_stats_improved.csv')

# Define ESA WorldCover colors
esa_colors = {
    'Tree cover': '#006400',
    'Shrubland': '#ffbb22',
    'Grassland': '#ffff4c',
    'Cropland': '#f096ff',
    'Built-up': '#fa0000',
    'Bare/sparse vegetation': '#b4b4b4',
    'Permanent water bodies': '#0064c8',
    'Herbaceous wetland': '#0096a0',
    'Other': '#808080'  # Grey color for combined small categories
}

# Group categories with less than 1% into "Other"
threshold = 1.0
worldcover_df['percentage'] = (worldcover_df['area_hectares'] / worldcover_df['area_hectares'].sum()) * 100
major_categories = worldcover_df[worldcover_df['percentage'] >= threshold].copy()
other_categories = worldcover_df[worldcover_df['percentage'] < threshold].copy()

# Create a row for "Other" category
if len(other_categories) > 0:
    other_row = pd.DataFrame({
        'land_cover_code': ['Other'],
        'land_cover_name': ['Other'],
        'area_hectares': [other_categories['area_hectares'].sum()],
        'percentage': [other_categories['percentage'].sum()]
    })
    plot_df = pd.concat([major_categories, other_row], ignore_index=True)
else:
    plot_df = major_categories

# Sort by area for better visualization
plot_df = plot_df.sort_values('area_hectares', ascending=False)

# 1. Land Cover Distribution Pie Chart
plt.figure(figsize=(12, 8))
colors = [esa_colors[name] for name in plot_df['land_cover_name']]

# Create the pie chart with percentage labels inside
wedges, texts, autotexts = plt.pie(plot_df['area_hectares'], 
                                  labels=plot_df['land_cover_name'],
                                  colors=colors,
                                  autopct='%1.1f%%', 
                                  startangle=90,
                                  pctdistance=0.75,  # Move percentage labels closer to center
                                  labeldistance=1.2)  # Move category labels further out

# Enhance the appearance
plt.title('Land Cover Distribution in VoNat-Mont-Mbam (2021)', pad=20, size=14)

# Make percentage labels easier to read
for autotext in autotexts:
    autotext.set_color('white')  # Change to white for better contrast
    autotext.set_fontsize(10)
    autotext.set_fontweight('bold')  # Make percentage labels bold

# Position labels in a more organized way
for i, text in enumerate(texts):
    # Calculate position based on index
    angle = 90 + (360 / len(plot_df)) * i
    x = np.cos(np.radians(angle))
    y = np.sin(np.radians(angle))
    
    # Adjust alignment based on position
    ha = 'left' if x > 0 else 'right'
    va = 'bottom' if y > 0 else 'top'
    
    # Set text properties
    text.set_horizontalalignment(ha)
    text.set_verticalalignment(va)
    
    # Position the label with some padding
    text.set_position((1.3 * x, 1.3 * y))

plt.savefig(os.path.join(output_dir, 'land_cover_distribution.png'), 
            dpi=300, bbox_inches='tight', 
            facecolor='white', edgecolor='none')
plt.close()

# 2. Annual Forest Loss Bar Chart
plt.figure(figsize=(15, 6))
ax = sns.barplot(data=annual_loss_df, x='year', y='forest_loss_hectares', color='#006400')
plt.title('Annual Forest Loss in VoNat-Mont-Mbam (2001-2023)', pad=20, size=14)
plt.xlabel('Year', size=12)
plt.ylabel('Forest Loss (hectares)', size=12)
plt.xticks(rotation=45)

# Add value labels on top of bars
for i in ax.containers:
    ax.bar_label(i, fmt='%.1f')

plt.tight_layout()
plt.savefig(os.path.join(output_dir, 'annual_forest_loss.png'), 
            dpi=300, bbox_inches='tight',
            facecolor='white', edgecolor='none')
plt.close()

# 3. Cumulative Forest Loss Line Graph
plt.figure(figsize=(15, 6))
annual_loss_df['cumulative_loss'] = annual_loss_df['forest_loss_hectares'].cumsum()
sns.lineplot(data=annual_loss_df, x='year', y='cumulative_loss', 
             marker='o', linewidth=2, markersize=8,
             color='#006400')
plt.title('Cumulative Forest Loss in VoNat-Mont-Mbam (2001-2023)', pad=20, size=14)
plt.xlabel('Year', size=12)
plt.ylabel('Cumulative Forest Loss (hectares)', size=12)
plt.xticks(rotation=45)

# Add value labels at each point with more vertical offset
for i, row in annual_loss_df.iterrows():
    # Move labels up by adding a percentage of the y-axis range
    y_offset = (plt.ylim()[1] - plt.ylim()[0]) * 0.02  # 2% of y-axis range
    plt.text(row['year'], row['cumulative_loss'] + y_offset,
             f'{row["cumulative_loss"]:.1f}',
             ha='center', va='bottom',
             bbox=dict(facecolor='white', edgecolor='none', alpha=0.7, pad=2))  # Add white background

plt.tight_layout()
plt.savefig(os.path.join(output_dir, 'cumulative_forest_loss.png'), 
            dpi=300, bbox_inches='tight',
            facecolor='white', edgecolor='none')
plt.close()

# Create a text file with information about the "Other" category
if len(other_categories) > 0:
    with open(os.path.join(output_dir, 'land_cover_notes.txt'), 'w') as f:
        f.write('Note about "Other" category in the Land Cover Distribution chart:\n\n')
        f.write('The "Other" category (less than 1%) includes:\n')
        for _, row in other_categories.iterrows():
            f.write(f'- {row["land_cover_name"]}: {row["area_hectares"]:.1f} ha ({row["percentage"]:.1f}%)\n')

print("Visualizations have been generated successfully!") 