// Load the area of interest
var aoi = ee.FeatureCollection("projects/ee-komba/assets/vonat/Mt_Mbam").geometry();

// Center the map on the AOI
Map.centerObject(aoi, 10);

// 1. ESA WorldCover Land Cover Classification (10m)
var worldCover = ee.ImageCollection("ESA/WorldCover/v200")
  .first()
  .clip(aoi);

// Add WorldCover to the map
var worldCoverVis = {
  min: 10,
  max: 95,
  palette: [
    '006400', 'ffbb22', 'ffff4c', 'f096ff', 'fa0000', 'b4b4b4',
    'f0f0f0', '0064c8', '0096a0', '00cf75', 'fae6a0'
  ]
};
Map.addLayer(worldCover, worldCoverVis, 'ESA WorldCover 2021');

// Calculate area statistics for each land cover class
var worldCoverArea = ee.Image.pixelArea().addBands(worldCover);
var worldCoverStats = worldCoverArea.reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField: 1,
    groupName: 'class',
  }),
  geometry: aoi,
  scale: 10,
  maxPixels: 1e13
});

// Print land cover statistics
print('Land Cover Area Statistics (sq meters):', worldCoverStats);

// 2. Hansen Global Forest Change Analysis (2000-2024)
var hansen = ee.Image('UMD/hansen/global_forest_change_2023_v1_11')
  .clip(aoi);

// Extract forest cover and loss layers
var treeCover2000 = hansen.select(['treecover2000']);
var lossYear = hansen.select(['lossyear']);
var loss = hansen.select(['loss']);

// Add forest cover to the map
Map.addLayer(treeCover2000, {min: 0, max: 100, palette: ['black', 'green']}, 'Tree Cover 2000');

// Add forest loss to the map (cumulative)
Map.addLayer(loss, {min: 0, max: 1, palette: ['black', 'red']}, 'Forest Loss (2000-2023)');

// Calculate total forest area in 2000 (in hectares)
var forest2000Area = treeCover2000.gt(30).multiply(ee.Image.pixelArea())
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: aoi,
    scale: 30,
    maxPixels: 1e13
  });
print('Forest Area in 2000 (sq meters):', forest2000Area);

// Calculate total forest loss area (2000-2023 in hectares)
var totalLossArea = loss.multiply(ee.Image.pixelArea())
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: aoi,
    scale: 30,
    maxPixels: 1e13
  });
print('Total Forest Loss Area (2000-2023, sq meters):', totalLossArea);

// Calculate annual forest loss
var areaImage = ee.Image.pixelArea().addBands(lossYear);
var lossByYear = areaImage.reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField: 1,
    groupName: 'year',
  }),
  geometry: aoi,
  scale: 30,
  maxPixels: 1e13
});
print('Annual Forest Loss (sq meters):', lossByYear);

// Export the results
// 1. Export WorldCover image
Export.image.toDrive({
  image: worldCover,
  description: 'WorldCover_Export',
  folder: 'earthengine',
  fileNamePrefix: 'vonat_worldcover',
  region: aoi,
  scale: 10,
  maxPixels: 1e13
});

// 2. Export Hansen forest cover and loss
var hansenComposite = ee.Image.cat([treeCover2000, loss, lossYear])
  .rename(['treecover2000', 'loss', 'lossyear']);

Export.image.toDrive({
  image: hansenComposite,
  description: 'Hansen_Export',
  folder: 'earthengine',
  fileNamePrefix: 'vonat_hansen',
  region: aoi,
  scale: 30,
  maxPixels: 1e13
});

// 3. Export statistics as CSV
// Function to convert feature collection to CSV
function toCSV(fc) {
  var features = fc.map(function(feat) {
    var props = feat.toDictionary();
    return ee.Feature(null, props);
  });
  return features;
}

// Export WorldCover stats
var worldCoverStatsFC = ee.FeatureCollection(
  ee.List(worldCoverStats.get('groups')).map(function(el) {
    el = ee.Dictionary(el);
    return ee.Feature(null, {
      'class': el.get('class'),
      'area_sq_m': el.get('sum')
    });
  })
);
Export.table.toDrive({
  collection: toCSV(worldCoverStatsFC),
  description: 'WorldCover_Stats',
  folder: 'earthengine',
  fileNamePrefix: 'vonat_worldcover_stats',
  fileFormat: 'CSV'
});

// Export Hansen stats
var hansenStats = ee.FeatureCollection([
  ee.Feature(null, {
    'forest_2000_sq_m': forest2000Area.get('treecover2000'),
    'total_loss_sq_m': totalLossArea.get('loss')
  })
]);
Export.table.toDrive({
  collection: hansenStats,
  description: 'Hansen_Stats',
  folder: 'earthengine',
  fileNamePrefix: 'vonat_hansen_stats',
  fileFormat: 'CSV'
});

// Export annual loss stats
var annualLossStatsFC = ee.FeatureCollection(
  ee.List(lossByYear.get('groups')).map(function(el) {
    el = ee.Dictionary(el);
    return ee.Feature(null, {
      'year': el.get('year'),
      'loss_area_sq_m': el.get('sum')
    });
  })
);
Export.table.toDrive({
  collection: toCSV(annualLossStatsFC),
  description: 'Annual_Loss_Stats',
  folder: 'earthengine',
  fileNamePrefix: 'vonat_annual_loss_stats',
  fileFormat: 'CSV'
});

print('Export tasks created. Please run them from the Tasks tab.');