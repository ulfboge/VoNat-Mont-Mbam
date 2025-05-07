import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# Set the style for the plots
plt.style.use('seaborn-v0_8-whitegrid')
sns.set_context("paper", font_scale=1.5)

# Define base directory and paths using absolute paths
base_dir = r'C:\Users\galag\GitHub\VoNat-Mont-Mbam'
output_dir = os.path.join(base_dir, 'outputs', 'charts_figures', 'fire_analysis')
os.makedirs(output_dir, exist_ok=True)

# Read the yearly burned area data
data_dir = os.path.join(base_dir, 'data', 'data')
yearly_data_file = os.path.join(data_dir, 'Mont_Mbam_Yearly_Burned_Area_2000_2024.csv')
print(f"Looking for file at: {yearly_data_file}")
yearly_data = pd.read_csv(yearly_data_file)

# Extract the year and burned area columns
yearly_data['year'] = yearly_data['year'].astype(int)
yearly_data = yearly_data.sort_values('year')

# Create the yearly burned area chart
plt.figure(figsize=(12, 6))
ax = sns.barplot(x='year', y='burned_area_ha', data=yearly_data, color='firebrick')

# Add a trend line
x = yearly_data['year'].values
y = yearly_data['burned_area_ha'].values
z = np.polyfit(x, y, 3)
p = np.poly1d(z)
plt.plot(x, p(x), 'k--', linewidth=2, alpha=0.7)

# Customize the chart
plt.title('Annual Burned Area in Mont Mbam (2000-2024)', fontsize=16)
plt.xlabel('Year', fontsize=14)
plt.ylabel('Burned Area (hectares)', fontsize=14)
plt.xticks(rotation=45)
plt.grid(axis='y', alpha=0.3)

# Add annotations for key years
max_year = yearly_data.loc[yearly_data['burned_area_ha'].idxmax(), 'year']
max_area = yearly_data['burned_area_ha'].max()
plt.annotate(f'Peak: {int(max_area)} ha',
             xy=(yearly_data['year'].tolist().index(max_year), max_area),
             xytext=(0, 20),
             textcoords='offset points',
             arrowprops=dict(arrowstyle='->', connectionstyle='arc3,rad=.2'))

# Add period annotations
plt.axvline(x=9.5, color='gray', linestyle='--', alpha=0.5)  # Between 2009 and 2010
plt.axvline(x=16.5, color='gray', linestyle='--', alpha=0.5)  # Between 2016 and 2017
plt.text(4.5, max_area * 0.9, 'High Fire Activity', ha='center')
plt.text(13, max_area * 0.9, 'Moderate', ha='center')
plt.text(20.5, max_area * 0.9, 'Low', ha='center')

# Tight layout and save
plt.tight_layout()
plt.savefig(os.path.join(output_dir, 'yearly_burned_area.png'), dpi=300, bbox_inches='tight')
plt.close()

print(f"Chart saved to {os.path.join(output_dir, 'yearly_burned_area.png')}")
