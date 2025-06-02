/**
 * Combined Ground Truth Points for Mont Mbam Land Cover Classification
 * 
 * This script creates a combined dataset of ESA WorldCover samples and field survey points
 * for use in the Land Cover GUI application.
 */

// Define the study area
var aoi = ee.FeatureCollection('projects/ee-komba/assets/vonat/Mt_Mbam');
var geometry = aoi.geometry();

// Define the land cover classes
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

// Load and clip the ESA WorldCover land cover data
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

// Add properties to ESA samples
esaSamples = esaSamples.map(function(feature) {
  var classValue = ee.Number(feature.get('landcover'));
  var className = ee.Dictionary(classNames).get(classValue.format(), 'Unknown');
  
  return feature
    .set('class_value', classValue)
    .set('class_name', className)
    .set('source', 'ESA_WorldCover');
});

// Import the field survey points from your GEE asset
var fieldSurveyPoints = ee.FeatureCollection('projects/ee-komba/assets/vonat/sample_points_LC2024');

// Process field survey points to extract land cover classes from descriptions
var processedFieldPoints = fieldSurveyPoints.map(function(feature) {
  // Get the name and description to determine observed land cover
  var name = ee.String(feature.get('Name')).toLowerCase();
  var description = ee.String(ee.Algorithms.If(
    feature.get('description'),
    feature.get('description'),
    ''
  )).toLowerCase();
  
  // Combine name and description for keyword search
  var fullText = name.cat(' ').cat(description);
  
  // Determine land cover class based on keywords
  // Tree cover (1)
  var isTreeCover = fullText.match('forest|tree|regeneration|eucalyptus|mahogany|medicinal plant').length().gt(0);
  
  // Shrubland (2)
  var isShrubland = fullText.match('shrub|scrubland').length().gt(0);
  
  // Grassland (3)
  var isGrassland = fullText.match('grassland|grass|grazing').length().gt(0);
  
  // Cropland (4)
  var isCropland = fullText.match('farm|agricultural|cultivation|crop|rice').length().gt(0);
  
  // Built-up (5)
  var isBuiltUp = fullText.match('settlement|community|village|built|herder settlement|school').length().gt(0);
  
  // Bare/sparse vegetation (6)
  var isBareLand = fullText.match('bare|bareland|rock|stony|burnt|burning|degraded|bush fire|bush burning').length().gt(0);
  
  // Water bodies (8)
  var isWater = fullText.match('river|stream|water|pond|waterfall').length().gt(0);
  
  // Wetland (9)
  var isWetland = fullText.match('wetland').length().gt(0);
  
  // Determine the observed land cover class
  var observedClass = ee.Algorithms.If(isTreeCover, 1,
    ee.Algorithms.If(isShrubland, 2,
      ee.Algorithms.If(isGrassland, 3,
        ee.Algorithms.If(isCropland, 4,
          ee.Algorithms.If(isBuiltUp, 5,
            ee.Algorithms.If(isBareLand, 6,
              ee.Algorithms.If(isWater, 8,
                ee.Algorithms.If(isWetland, 9,
                  // If no match found, use the LC2024_1 property if available
                  ee.Algorithms.If(feature.propertyNames().contains('LC2024_1'),
                    feature.get('LC2024_1'),
                    0 // Default to 0 if no class can be determined
                  )
                )
              )
            )
          )
        )
      )
    )
  );
  
  // Add properties needed for classification
  return feature
    .set('landcover', observedClass)
    .set('class_value', observedClass)
    .set('class_name', ee.Dictionary(classNames).get(ee.Number(observedClass).format(), 'Unknown'))
    .set('source', 'Field_Survey');
});

// Filter out any points that couldn't be classified (landcover = 0)
processedFieldPoints = processedFieldPoints.filter(ee.Filter.neq('landcover', 0));

// Combine ESA samples with processed field points
var combinedPoints = esaSamples.merge(processedFieldPoints);

// Print collection sizes
print('ESA samples:', esaSamples.size());
print('Field survey points:', processedFieldPoints.size());
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
Map.addLayer(processedFieldPoints, {color: 'blue'}, 'Field Survey Points', true);

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

// Print collection sizes
print('ESA samples:', esaSamples.size());
print('Field survey points:', processedFieldPoints.size());
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
Map.addLayer(processedFieldPoints, {color: 'blue'}, 'Field Survey Points', true);

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
    style: {margin: '0 0 4px 6px'}
  });
  
  var row = ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
  
  legend.add(row);
});

Map.add(legend);

// Export the refined classification
Export.image.toAsset({
  image: classified,
  description: 'refined_classification_with_field_survey_2024',
  assetId: 'projects/ee-komba/assets/vonat/refined_classification_with_field_survey_2024',
  region: geometry,
  scale: 30,
  maxPixels: 1e13,
  pyramidingPolicy: {'.default': 'mode'}
});

// Also export to Drive for easy download
Export.image.toDrive({
  image: classified,
  description: 'Refined_Land_Cover_Classification_2024',
  folder: 'VoNat_GEE',
  fileNamePrefix: 'Refined_Land_Cover_Classification_2024',
  region: geometry,
  scale: 30,
  maxPixels: 1e13,
  crs: 'EPSG:4326'
});

// Export the accuracy assessment as a CSV
var accuracyByClass = ee.FeatureCollection([
  ee.Feature(null, {
    'Overall_Accuracy': confusionMatrix.accuracy(),
    'Kappa': confusionMatrix.kappa()
  })
]);

Export.table.toDrive({
  collection: accuracyByClass,
  description: 'Classification_Accuracy_Metrics',
  fileFormat: 'CSV'
});

// Export the confusion matrix as a CSV
var confusionMatrixData = confusionMatrix.array();
var confusionMatrixFC = ee.FeatureCollection(
  ee.List.sequence(1, confusionMatrix.array().length().get(0)).map(function(rowIdx) {
    var row = confusionMatrixData.slice(0, rowIdx, 1).toList().get(0);
    var feature = ee.Feature(null);
    
    // Add each column as a property
    return ee.List.sequence(1, confusionMatrix.array().length().get(1)).iterate(function(colIdx, f) {
      var value = ee.List(row).get(ee.Number(colIdx).subtract(1));
      var colName = 'Class_' + colIdx;
      return ee.Feature(f).set(colName, value);
    }, feature).set('Actual_Class', rowIdx);
  })
);

Export.table.toDrive({
  collection: confusionMatrixFC,
  description: 'Confusion_Matrix',
  fileFormat: 'CSV'
});
