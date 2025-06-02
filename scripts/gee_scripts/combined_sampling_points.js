/**
 * Simple Combined Sampling Points for Mont Mbam
 * 
 * This script combines ESA WorldCover stratified samples and field survey points
 * without any processing, for use in the Land Cover GUI application.
 */

// Define the study area
var aoi = ee.FeatureCollection('projects/ee-komba/assets/vonat/Mt_Mbam');
var geometry = aoi.geometry();

// Define the land cover classes for visualization only
var classNames = {
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
};

// Visualization palette
var palette = [
  '006400', // Tree cover
  'ffbb22', // Shrubland
  'ffff4c', // Grassland
  'f096ff', // Cropland
  'fa0000', // Built-up
  'b4b4b4', // Bare/sparse
  'f0f0f0', // Snow/ice
  '0064c8', // Water
  '0096a0', // Wetland
  '00cf75', // Mangroves
  'fae6a0'  // Moss/lichen
];

// Load and clip the ESA WorldCover land cover data for visualization
var worldcover = ee.ImageCollection("ESA/WorldCover/v200").first().clip(geometry);

// Remap the land cover classes to sequential integers (1-11)
var remappedLC = worldcover.remap(
  [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100], // source values
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]            // target values
).rename('landcover').toByte();

// Generate ESA WorldCover stratified samples
var esaSamples = remappedLC.stratifiedSample({
  numPoints: 800,
  classBand: 'landcover',
  region: geometry,
  scale: 30,
  seed: 42,
  dropNulls: true,
  geometries: true
});

// Add source property to ESA samples
esaSamples = esaSamples.map(function(feature) {
  return feature.set('source', 'ESA_WorldCover');
});

// Import the field survey points from your GEE asset
var fieldSurveyPoints = ee.FeatureCollection('projects/ee-komba/assets/vonat/sample_points_LC2024');

// Add source property to field survey points
var labeledFieldPoints = fieldSurveyPoints.map(function(feature) {
  return feature.set('source', 'Field_Survey');
});

// Simply combine ESA samples with field points without processing
var combinedPoints = esaSamples.merge(labeledFieldPoints);

// Print collection sizes
print('ESA samples:', esaSamples.size());
print('Field survey points:', labeledFieldPoints.size());
print('Combined points:', combinedPoints.size());

// Display the results
Map.centerObject(geometry, 10);

// Add the ESA WorldCover for reference
Map.addLayer(remappedLC, {
  min: 1,
  max: 11,
  palette: palette
}, 'ESA WorldCover');

// Add the sample points
Map.addLayer(esaSamples, {color: 'yellow'}, 'ESA Samples', false);
Map.addLayer(labeledFieldPoints, {color: 'blue'}, 'Field Survey Points', true);

// Add a legend
var legend = ui.Panel({
  style: {
    position: 'bottom-right',
    padding: '8px 15px'
  }
});

var legendTitle = ui.Label({
  value: 'Land Cover Classes',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 4px 0',
    padding: '0'
  }
});

legend.add(legendTitle);

// Add each class to the legend
Object.keys(classNames).forEach(function(key) {
  var color = palette[parseInt(key) - 1];
  var name = classNames[key];
  
  var colorBox = ui.Label({
    style: {
      backgroundColor: '#' + color,
      padding: '8px',
      margin: '0 0 4px 0'
    }
  });
  
  var description = ui.Label({
    value: name,
    style: {
      margin: '0 0 4px 6px'
    }
  });
  
  var row = ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
  
  legend.add(row);
});

Map.add(legend);

// Export the combined points as an asset for use in the Land Cover GUI
Export.table.toAsset({
  collection: combinedPoints,
  description: 'Combined_Ground_Truth_Points',
  assetId: 'projects/ee-komba/assets/vonat/combined_ground_truth_points'
});

// Also export to Drive for backup
Export.table.toDrive({
  collection: combinedPoints,
  description: 'Combined_Ground_Truth_Points_CSV',
  fileFormat: 'CSV'
});
