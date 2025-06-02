"""
Create a comprehensive GeoJSON file from the sample points
with proper structure for Google Earth Engine
"""

import json
import os
import re

# Input and output paths
input_path = os.path.join('qgis', 'vector', 'geojson', 'sample_points_LC2024.geojson')
output_path = os.path.join('data', 'processed', 'field_survey_points_complete.geojson')

# Define the mapping of keywords to land cover classes
keyword_to_class = {
    # Tree cover (1)
    'forest': 1,
    'tree': 1,
    'riparian forest': 1,
    'thick forest': 1,
    'natural regeneration': 1,
    'eucalyptus': 1,
    'mahogany': 1,
    'medicinal plant': 1,
    'sugar stick': 1,
    'bitter stick': 1,
    'bumeh': 1,
    'regenerating': 1,
    'regeneration': 1,
    'perkih': 1,
    'bantai': 1,
    
    # Shrubland (2)
    'shrub': 2,
    'shrubland': 2,
    'scrubland': 2,
    'shrub trees': 2,
    
    # Grassland (3)
    'grassland': 3,
    'grass': 3,
    'grazing land': 3,
    'grazing': 3,
    
    # Cropland (4)
    'farm': 4,
    'farmland': 4,
    'agricultural': 4,
    'cultivation': 4,
    'rice': 4,
    'agriculture': 4,
    'crop': 4,
    
    # Built-up (5)
    'settlement': 5,
    'community': 5,
    'village': 5,
    'palace': 5,
    'school': 5,
    'herder settlement': 5,
    'built': 5,
    'herder community': 5,
    'chief': 5,
    'primary school': 5,
    'glazier settlement': 5,
    'abandoned settlement': 5,
    
    # Bare/sparse vegetation (6)
    'bare': 6,
    'bareland': 6,
    'rock': 6,
    'stony': 6,
    'burnt': 6,
    'burning': 6,
    'degraded': 6,
    'bush fire': 6,
    'bush burning': 6,
    'burnt area': 6,
    'huge rock': 6,
    'rocky': 6,
    'degraded area': 6,
    'deforestation': 6,
    'fire': 6,
    
    # Water bodies (8)
    'river': 8,
    'stream': 8,
    'water': 8,
    'pond': 8,
    'waterfall': 8,
    'flowing stream': 8,
    'flowing river': 8,
    
    # Herbaceous wetland (9)
    'wetland': 9
}

# Class names dictionary
class_names = {
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
    11: 'Moss and lichen'
}

def determine_land_cover_class(name, description):
    """Determine the land cover class based on the name and description"""
    # Combine name and description for searching
    text = (name or '').lower() + ' ' + (description or '').lower()
    
    # Special cases based on analysis of the data
    if 'monkeys' in text and 'forest' in text:
        return 1  # Tree cover
    if 'herder' in text and ('settlement' in text or 'community' in text):
        return 5  # Built-up
    if 'bush burning' in text or 'bush fire' in text or 'burnt' in text:
        return 6  # Bare/sparse vegetation
    if 'river' in text or 'stream' in text or 'water' in text:
        return 8  # Permanent water bodies
    
    # General keyword matching
    for keyword, class_code in keyword_to_class.items():
        if keyword in text:
            return class_code
    
    # If no match found, use the CCDC classification as fallback
    return None

try:
    # Read the input GeoJSON with UTF-8 encoding
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Create a new feature collection
    output_data = {
        "type": "FeatureCollection",
        "name": "field_survey_points_for_gee",
        "crs": data["crs"],
        "features": []
    }
    
    # Process each feature
    for feature in data["features"]:
        properties = feature["properties"]
        name = properties.get("Name", "")
        description = properties.get("description", "")
        ccdc_class = int(properties.get("LC2024_1", 0))
        
        # Determine the land cover class based on the description
        observed_class = determine_land_cover_class(name, description)
        
        # If no class could be determined, use the CCDC class
        if observed_class is None:
            observed_class = ccdc_class
        
        # Create the new feature with the required properties
        new_feature = {
            "type": "Feature",
            "properties": {
                "fid": properties["fid"],
                "landcover": observed_class,
                "year": 2024,
                "class_name": class_names.get(observed_class, "Unknown"),
                "source": "Field_Survey",
                "weight": 3,
                "original_name": name,
                "description": description,
                "LC2024_1": ccdc_class
            },
            "geometry": feature["geometry"]
        }
        
        output_data["features"].append(new_feature)
    
    # Write the output GeoJSON with UTF-8 encoding
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"Successfully created comprehensive GeoJSON with {len(output_data['features'])} points")
    print(f"Output saved to: {output_path}")
    
    # Print a summary of the land cover classes
    class_counts = {}
    for feature in output_data["features"]:
        lc = feature["properties"]["landcover"]
        class_counts[lc] = class_counts.get(lc, 0) + 1
    
    print("\nLand cover class distribution:")
    for class_code, count in sorted(class_counts.items()):
        print(f"  {class_names.get(class_code, 'Unknown')} (Class {class_code}): {count} points")
    
except Exception as e:
    print(f"Error: {str(e)}")
