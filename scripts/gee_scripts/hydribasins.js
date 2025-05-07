var aoi = ee.FeatureCollection('projects/ee-komba/assets/vonat/Mt_Mbam');

// HydroBASINS levels 7–12
var levels = ['7', '8', '9', '10', '11', '12'];
var hydrobasins = levels.map(function(level) {
  var fc = ee.FeatureCollection('WWF/HydroSHEDS/v1/Basins/hybas_' + level);
  // Filter basins that intersect the AOI and tag with the level
  var filtered = fc.filterBounds(aoi).map(function(feature) {
    return feature.set('level', level);
  });
  return filtered;
});

// Flatten the list of feature collections into one
var mergedBasins = ee.FeatureCollection(hydrobasins).flatten();

// Prepare a list with 'id' (HYBAS_ID) and 'level'
var basinList = mergedBasins.map(function(feature) {
  return ee.Feature(null, {
    id: feature.get('HYBAS_ID'),
    level: feature.get('level')
  });
});

// Map the selected basins
Map.centerObject(aoi);
Map.addLayer(aoi, {color: 'red'}, 'AOI');
Map.addLayer(mergedBasins, {color: 'blue'}, 'Selected Basins');

// Export: shapefile of the selected basins
Export.table.toDrive({
  collection: mergedBasins,
  description: 'SelectedHydrobasins',
  fileFormat: 'SHP'
});

// Export: CSV list with 'id' and 'level'
Export.table.toDrive({
  collection: basinList,
  description: 'BasinList',
  fileFormat: 'CSV'
});
