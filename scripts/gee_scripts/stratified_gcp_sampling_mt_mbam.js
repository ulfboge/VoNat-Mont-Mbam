/**
 * Simplified Stratified GCP Sampling for Mont Mbam using ESA WorldCover
 * Creates training data for CCDC classification with only essential columns
 */

// Define the study area
var aoi = ee.FeatureCollection('projects/ee-komba/assets/vonat/Mt_Mbam');
var geometry = aoi.geometry();

// Load and clip the ESA WorldCover land cover data
var worldcover = ee.ImageCollection("ESA/WorldCover/v200").first().clip(geometry);

// Create a simple dictionary for class names
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

// Visualization palette for the map
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

// Remap the land cover classes to sequential integers (1-11)
var label = 'landcover';
var remappedLC = worldcover.remap(
  [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100], // source values
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]            // target values
).rename(label).toByte();

// Create a simple Landsat composite for spectral information
var l8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterBounds(geometry)
  .filterDate('2021-01-01', '2021-12-31')
  .filter(ee.Filter.lt('CLOUD_COVER', 20))
  .map(function(img) {
    // Select and rename bands
    var bands = img.select(['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'])
      .rename(['blue', 'green', 'red', 'nir', 'swir1', 'swir2'])
      .multiply(0.0000275).add(-0.2);  // Scale values
    return bands.copyProperties(img, ['system:time_start']);
  });

// Create median composite and add land cover band
var composite = l8.median().clip(geometry);
var samplingImage = composite.addBands(remappedLC);

// Perform stratified sampling with 1000 points
var gcp = samplingImage.stratifiedSample({
  numPoints: 1000,
  classBand: label,
  region: geometry,
  scale: 30,
  seed: 42,
  dropNulls: true,
  geometries: true
});

// Add only the essential properties: year and class_name
gcp = gcp.map(function(feature) {
  var classValue = ee.Number(feature.get(label));
  var className = ee.Dictionary(classNames).get(classValue.format(), 'Unknown');
  
  // Keep only the essential properties
  return feature
    .set('year', 2021)
    .set('class_name', className);
});

// Create a simple random split for training/validation
gcp = gcp.randomColumn();
var training = gcp.filter(ee.Filter.lt('random', 0.7));
var validation = gcp.filter(ee.Filter.gte('random', 0.7));

// Print collection sizes
print('Total points:', gcp.size());
print('Training points:', training.size());
print('Validation points:', validation.size());

// Visualize the land cover map
Map.centerObject(geometry, 10);
Map.addLayer(worldcover, {
  min: 10,
  max: 100,
  palette: palette
}, 'ESA WorldCover');

// Visualize the sample points
Map.addLayer(training, {color: 'blue'}, 'Training Points');
Map.addLayer(validation, {color: 'red'}, 'Validation Points');

// Export the GCPs to assets
Export.table.toAsset({
  collection: gcp,
  description: 'gcps_Mt_Mbam_all',
  assetId: 'projects/ee-komba/assets/vonat/gcps_Mt_Mbam_all'
});

Export.table.toAsset({
  collection: training,
  description: 'gcps_Mt_Mbam_training',
  assetId: 'projects/ee-komba/assets/vonat/gcps_Mt_Mbam_training'
});

Export.table.toAsset({
  collection: validation,
  description: 'gcps_Mt_Mbam_validation',
  assetId: 'projects/ee-komba/assets/vonat/gcps_Mt_Mbam_validation'
});

