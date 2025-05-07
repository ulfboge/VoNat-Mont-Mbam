// Load the classification image (with bands for different years)
var classification = ee.Image('projects/ee-komba/assets/vonat/classification_dates');

// Select bands for 1987 and 2024
var lc1987 = classification.select('LC_1987-01-01');
var lc2024 = classification.select('LC_2024-12-01');

// 1️⃣ Create a binary change raster: 1 if changed, 0 if same
var change = lc1987.neq(lc2024).rename('change_detected');

// Add change map to the map (show change pixels in magenta)
Map.centerObject(classification);
Map.addLayer(change.updateMask(change), {palette: ['#ff00ff']}, 'Change 1987-2024');

// 2️⃣ Create a transition raster: encodes old-new class as (old * 100 + new)
var transition = lc1987.multiply(100).add(lc2024).rename('transition_code');

// Define a manual visualization for transition codes
var transitionVisParams = {
  min: 100,
  max: 1200,  // Adjust based on expected transition codes (max possible = old*100 + new)
  palette: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666']
};

// Add to map
Map.addLayer(transition, transitionVisParams, 'Land cover transition 1987-2024');


// 📝 (Optional) print unique transition codes
var uniqueTransitions = transition.reduceRegion({
  reducer: ee.Reducer.frequencyHistogram(),
  geometry: classification.geometry(),
  scale: 30,
  maxPixels: 1e9
});
print('Unique transitions (encoded as old*100+new):', uniqueTransitions);

// 3️⃣ Export binary change raster to Google Drive
Export.image.toDrive({
  image: change,
  description: 'Land_Cover_Change_1987_2024',
  folder: 'VoNat_GEE',
  fileNamePrefix: 'Land_Cover_Change_1987_2024',
  region: classification.geometry(),
  scale: 30,
  maxPixels: 1e13,
  crs: 'EPSG:4326' // adjust CRS if needed
});

// 4️⃣ Export transition raster to Google Drive
Export.image.toDrive({
  image: transition,
  description: 'Land_Cover_Transition_1987_2024',
  folder: 'VoNat_GEE',
  fileNamePrefix: 'Land_Cover_Transition_1987_2024',
  region: classification.geometry(),
  scale: 30,
  maxPixels: 1e13,
  crs: 'EPSG:4326'
});

// Define class name lookup as an Earth Engine dictionary
var classNames = ee.Dictionary({
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
});

// 5️⃣ Calculate area per transition code
var pixelArea = ee.Image.pixelArea();
var areaImage = pixelArea.addBands(transition);

var areaPerTransition = areaImage.reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField: 1,  // 1 = transition band
    groupName: 'transition_code'
  }),
  geometry: classification.geometry(),
  scale: 30,
  maxPixels: 1e13
});

// Convert dictionary to FeatureCollection with decoded class names
var areaFeatures = ee.FeatureCollection(
  ee.List(areaPerTransition.get('groups')).map(function(item) {
    item = ee.Dictionary(item);
    var code = ee.Number(item.get('transition_code'));
    var fromClass = code.divide(100).floor();
    var toClass = code.mod(100);
    
    return ee.Feature(null, {
      'transition_code': code,
      'from_class_code': fromClass,
      'to_class_code': toClass,
      'from_class_name': classNames.get(fromClass.int()),
      'to_class_name': classNames.get(toClass.int()),
      'area_m2': item.get('sum'),
      'area_ha': ee.Number(item.get('sum')).divide(10000)
    });
  })
);

// Print to verify
print('Area per transition code with class names:', areaFeatures);

// Export to Drive
Export.table.toDrive({
  collection: areaFeatures,
  description: 'Land_Cover_Transition_Areas_1987_2024',
  folder: 'VoNat_GEE',
  fileNamePrefix: 'Land_Cover_Transition_Areas_1987_2024',
  fileFormat: 'CSV'
});

