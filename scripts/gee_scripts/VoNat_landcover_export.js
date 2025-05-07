// Load the image with the respective bands
var image = ee.Image('projects/ee-komba/assets/vonat/classification_dates');
Map.centerObject(image);

// Define the band names and corresponding years
var bands = ['LC_1987-01-01', 'LC_2000-01-01', 'LC_2010-01-01', 'LC_2024-12-01'];
var years = [1987, 2000, 2010, 2024];

// Map classes and palette
var mapClasses = {
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
};

var palette = [
  '#006400', // Tree cover
  '#ffbb22', // Shrubland
  '#ffff4c', // Grassland
  '#f096ff', // Cropland
  '#fa0000', // Built-up
  '#b4b4b4', // Bare / sparse vegetation
  '#f0f0f0', // Snow and ice
  '#0064c8', // Permanent water bodies
  '#0096a0', // Herbaceous wetland
  '#00cf75', // Mangroves
  '#fae6a0', // Moss and lichen
  '#ff00ff'  // Land cover change (bright magenta)
];

// Visualization parameters
var visParams = {
  min: 1,
  max: 12,
  palette: palette
};

// Adding the legend to the map
var addLegend = function(mapClasses, palette) {
  var legend = ui.Panel({
    style: {
      position: 'bottom-left',
      padding: '8px 15px'
    }
  });
  
  var legendTitle = ui.Label({
    value: 'Legend',
    style: {
      fontWeight: 'bold',
      fontSize: '18px',
      margin: '0 0 4px 0',
      padding: '0'
    }
  });
  
  legend.add(legendTitle);
  
  Object.keys(mapClasses).forEach(function(key, index) {
    var colorBox = ui.Label({
      style: {
        backgroundColor: palette[index],
        padding: '8px',
        margin: '0 0 4px 0'
      }
    });
    
    var description = ui.Label({
      value: mapClasses[key],
      style: {margin: '0 0 4px 6px'}
    });
    
    var entry = ui.Panel({
      widgets: [colorBox, description],
      layout: ui.Panel.Layout.Flow('horizontal')
    });
    
    legend.add(entry);
  });
  
  return legend;
};

// Add the legend to the map
var legend = addLegend(mapClasses, palette);
Map.add(legend);

// Loop through the bands and add to the map
bands.forEach(function(band, index) {
  var classified = image.select(band);
  Map.addLayer(classified, visParams, 'Land Cover ' + years[index]);
  
  calculateAndExportArea(classified, band);
  exportClassifiedImage(classified, years[index]);
});

// Function to calculate and export area for each land cover class
function calculateAndExportArea(image, year) {
  var areas = image.reduceRegion({
    reducer: ee.Reducer.frequencyHistogram(),
    geometry: image.geometry(),
    scale: 30,
    maxPixels: 1e9
  });

  areas.evaluate(function(result) {
    var areaPerClass = result[Object.keys(result)[0]];
    var features = Object.keys(areaPerClass).map(function(key) {
      return ee.Feature(null, {
        'Land Cover Type': mapClasses[key],
        'Area (hectares)': ee.Number(areaPerClass[key]).multiply(30 * 30).divide(10000),
        'Year': year
      });
    });

    var featureCollection = ee.FeatureCollection(features);
    Export.table.toDrive({
      collection: featureCollection,
      description: 'Land_Cover_Area_' + year,
      folder: 'VoNat_GEE',
      fileFormat: 'CSV'
    });
  });
}

// ✅ NEW FUNCTION: Export each classified image to Drive
function exportClassifiedImage(image, year) {
  Export.image.toDrive({
    image: image,
    description: 'Land_Cover_Map_' + year,
    folder: 'VoNat_GEE',
    fileNamePrefix: 'Land_Cover_Map_' + year,
    region: image.geometry(),  // Export region based on image geometry
    scale: 30,
    maxPixels: 1e13,
    crs: 'EPSG:4326'  // Adjust CRS if needed
  });
}
