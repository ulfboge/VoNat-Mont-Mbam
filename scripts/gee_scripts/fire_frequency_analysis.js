/**
 * Fire Frequency Analysis for Mont Mbam using MODIS MCD64A1 Burned Area Product
 * 
 * This script analyzes the frequency of fires in the Mont Mbam region using
 * the MODIS MCD64A1 Version 6.1 Burned Area dataset from 2001 to present.
 * 
 * The script:
 * 1. Loads the Mont Mbam area of interest
 * 2. Processes the MODIS burned area data for each year
 * 3. Calculates fire frequency (how many times each pixel has burned)
 * 4. Creates visualizations and exports results
 */

// Define the study area
var aoi = ee.FeatureCollection('projects/ee-komba/assets/vonat/Mt_Mbam');
var geometry = aoi.geometry();

// Center map on the study area
Map.centerObject(geometry, 10);
Map.addLayer(geometry, {color: 'gray'}, 'Mont Mbam AOI');

// Define the time period for analysis
var startYear = 2000;  // MODIS data starts in November 2000
var endYear = 2024;    // Use the most recent available data

// For the first year (2000), we'll only use data from November and December
// For the current year (2024), we'll use data up to the most recent month

// Load the MODIS Burned Area product
var modis = ee.ImageCollection('MODIS/061/MCD64A1');

// Function to extract burned areas for a given year
function getBurnedAreaForYear(year) {
  var startDate, endDate;
  
  // Handle special cases for the first and current year
  if (year === 2000) {
    // MODIS data starts in November 2000
    startDate = ee.Date.fromYMD(2000, 11, 1);
    endDate = ee.Date.fromYMD(2000, 12, 31);
  } else if (year === 2024) {
    // For the current year, use data up to the current date
    startDate = ee.Date.fromYMD(2024, 1, 1);
    // Get the current date (system will use the date when the script is run)
    var now = ee.Date(Date.now());
    endDate = now;
  } else {
    // For all other years, use the full year
    startDate = ee.Date.fromYMD(year, 1, 1);
    endDate = ee.Date.fromYMD(year, 12, 31);
  }
  
  // Filter the collection to the given date range
  var yearlyData = modis
    .filterDate(startDate, endDate)
    .filterBounds(geometry);
  
  // Create a binary image where 1 = burned, 0 = not burned
  // The 'BurnDate' band contains the day of burn (1-366) or 0 if not burned
  var burnedMask = yearlyData.select('BurnDate').max().gt(0);
  
  // Return the binary burned area image with metadata
  return burnedMask
    .rename('burned')
    .set('year', year)
    .set('system:time_start', startDate.millis())
    .set('start_date', startDate.format('YYYY-MM-dd'))
    .set('end_date', endDate.format('YYYY-MM-dd'));
}

// Create a list of years for analysis
var years = ee.List.sequence(startYear, endYear);

// Map the function over all years to get a collection of yearly burned area images
var burnedAreaCollection = ee.ImageCollection.fromImages(
  years.map(getBurnedAreaForYear)
);

// Calculate fire frequency (how many times each pixel has burned)
var fireFrequency = burnedAreaCollection
  .select('burned')
  .sum()
  .clip(geometry)
  .toFloat()  // Convert to float to avoid Long type issues
  .rename('fire_frequency');

// Create a completely different approach for most recent burn year
// We'll build it year by year without using image collections

// Start with an empty image (all zeros)
var mostRecentBurnYear = ee.Image(0).int16().rename('most_recent_burn');

// Process years in chronological order
// We'll manually loop through the years to avoid collection homogeneity issues
for (var i = startYear; i <= endYear; i++) {
  // Get the date range for this year
  var startDate, endDate;
  if (i === 2000) {
    startDate = ee.Date.fromYMD(2000, 11, 1);
    endDate = ee.Date.fromYMD(2000, 12, 31);
  } else if (i === 2024) {
    startDate = ee.Date.fromYMD(2024, 1, 1);
    endDate = ee.Date(Date.now());
  } else {
    startDate = ee.Date.fromYMD(i, 1, 1);
    endDate = ee.Date.fromYMD(i, 12, 31);
  }
  
  // Get the burned area for this year
  var yearlyData = modis
    .filterDate(startDate, endDate)
    .filterBounds(geometry);
  
  // Create a binary mask where 1 = burned, 0 = not burned
  var burnedMask = yearlyData.select('BurnDate').max().gt(0);
  
  // Update the most recent burn year image
  // Where this year burned, set the value to the year
  mostRecentBurnYear = mostRecentBurnYear.where(burnedMask, i);
}

// Clip to the study area
mostRecentBurnYear = mostRecentBurnYear.clip(geometry);

// Create a mask for areas that have never burned
var neverBurnedMask = fireFrequency.eq(0);

// Apply the mask to the most recent burn year
var mostRecentBurnYearMasked = mostRecentBurnYear.updateMask(mostRecentBurnYear.gt(0));

// Calculate the percentage of the area that has burned at least once
var totalArea = geometry.area().divide(10000); // in hectares
var burnedAreaSum = fireFrequency.gt(0).multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: geometry,
  scale: 500,
  maxPixels: 1e9
});

var burnedAreaHa = ee.Number(burnedAreaSum.get('fire_frequency')).divide(10000); // in hectares
var percentBurned = burnedAreaHa.divide(totalArea).multiply(100);

// Calculate area burned for each frequency class
function calculateAreaByFrequency(frequency) {
  // Convert frequency to an ee.Number and then to an ee.Image for comparison
  var freqImage = ee.Image.constant(ee.Number(frequency));
  var areaImage = fireFrequency.eq(freqImage).multiply(ee.Image.pixelArea());
  var area = areaImage.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: geometry,
    scale: 500,
    maxPixels: 1e9
  });
  return ee.Feature(null, {
    'frequency': frequency,
    'area_ha': ee.Number(area.get('fire_frequency')).divide(10000),
    'description': frequency === 0 ? 'Never burned' : 
                  (frequency === 1 ? 'Burned once' : 
                  'Burned ' + frequency + ' times')
  });
}

// Create a list of frequency values (0 to max expected frequency)
var frequencyValues = ee.List.sequence(0, 10);
var areaByFrequency = ee.FeatureCollection(frequencyValues.map(calculateAreaByFrequency));

// Calculate yearly burned area
function calculateYearlyBurnedArea(year) {
  var startDate = ee.Date.fromYMD(year, 1, 1);
  var endDate = ee.Date.fromYMD(year, 12, 31);
  
  var yearlyData = modis
    .filterDate(startDate, endDate)
    .filterBounds(geometry);
  
  var burnedArea = yearlyData.select('BurnDate').max().gt(0);
  var areaImage = burnedArea.multiply(ee.Image.pixelArea());
  
  var area = areaImage.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: geometry,
    scale: 500,
    maxPixels: 1e9
  });
  
  return ee.Feature(null, {
    'year': year,
    'burned_area_ha': ee.Number(area.get('BurnDate')).divide(10000)
  });
}

var yearlyBurnedArea = ee.FeatureCollection(years.map(calculateYearlyBurnedArea));

// Print summary statistics
print('Total area (ha):', totalArea);
print('Area burned at least once (ha):', burnedAreaHa);
print('Percentage of area burned at least once:', percentBurned);
print('Area by fire frequency:', areaByFrequency);
print('Yearly burned area:', yearlyBurnedArea);

// Visualization parameters
var fireFrequencyVis = {
  min: 0,
  max: 5,
  palette: ['#FFFFFF', '#FEE5D9', '#FCBBA1', '#FC9272', '#FB6A4A', '#EF3B2C', '#CB181D', '#A50F15', '#67000D']
};

var burnYearVis = {
  min: startYear,
  max: endYear,
  palette: ['#FFF7EC', '#FEE8C8', '#FDD49E', '#FDBB84', '#FC8D59', '#EF6548', '#D7301F', '#B30000', '#7F0000']
};

// Add layers to the map
Map.addLayer(fireFrequency, fireFrequencyVis, 'Fire Frequency 2000-2024');
Map.addLayer(mostRecentBurnYearMasked, burnYearVis, 'Most Recent Burn Year');
Map.addLayer(neverBurnedMask.selfMask(), {palette: ['#2ca25f']}, 'Never Burned Areas');

// Create a legend for fire frequency
var createLegend = function() {
  var legend = ui.Panel({
    style: {
      position: 'bottom-left',
      padding: '8px 15px'
    }
  });
  
  var legendTitle = ui.Label({
    value: 'Fire Frequency Legend',
    style: {
      fontWeight: 'bold',
      fontSize: '16px',
      margin: '0 0 4px 0',
      padding: '0'
    }
  });
  
  legend.add(legendTitle);
  
  var makeRow = function(color, name) {
    var colorBox = ui.Label({
      style: {
        backgroundColor: color,
        padding: '8px',
        margin: '0 0 4px 0'
      }
    });
    
    var description = ui.Label({
      value: name,
      style: {margin: '0 0 4px 6px'}
    });
    
    return ui.Panel({
      widgets: [colorBox, description],
      layout: ui.Panel.Layout.Flow('horizontal')
    });
  };
  
  legend.add(makeRow('#FFFFFF', 'Never burned'));
  legend.add(makeRow('#FEE5D9', 'Burned once'));
  legend.add(makeRow('#FCBBA1', 'Burned twice'));
  legend.add(makeRow('#FC9272', 'Burned 3 times'));
  legend.add(makeRow('#FB6A4A', 'Burned 4 times'));
  legend.add(makeRow('#EF3B2C', 'Burned 5 times'));
  legend.add(makeRow('#CB181D', 'Burned 6+ times'));
  
  return legend;
};

Map.add(createLegend());

// Export results
// 1. Fire frequency image
Export.image.toDrive({
  image: fireFrequency,
  description: 'Mont_Mbam_Fire_Frequency_2000_2024',
  folder: 'VoNat_GEE',
  region: geometry,
  scale: 500,
  maxPixels: 1e9,
  crs: 'EPSG:4326'
});

// 2. Most recent burn year
Export.image.toDrive({
  image: mostRecentBurnYear,
  description: 'Mont_Mbam_Most_Recent_Burn_Year',
  folder: 'VoNat_GEE',
  region: geometry,
  scale: 500,
  maxPixels: 1e9,
  crs: 'EPSG:4326'
});

// 3. Area by fire frequency table
Export.table.toDrive({
  collection: areaByFrequency,
  description: 'Mont_Mbam_Area_By_Fire_Frequency_2000_2024',
  folder: 'VoNat_GEE',
  fileFormat: 'CSV'
});

// 4. Yearly burned area table
Export.table.toDrive({
  collection: yearlyBurnedArea,
  description: 'Mont_Mbam_Yearly_Burned_Area_2000_2024',
  folder: 'VoNat_GEE',
  fileFormat: 'CSV'
});

// Add a chart of yearly burned area
var yearlyBurnedAreaChart = ui.Chart.feature.byFeature({
  features: yearlyBurnedArea,
  xProperty: 'year',
  yProperties: ['burned_area_ha']
})
.setChartType('LineChart')
.setOptions({
  title: 'Yearly Burned Area in Mont Mbam (2000-2024)',
  hAxis: {title: 'Year', format: '####'},
  vAxis: {title: 'Burned Area (hectares)'},
  lineWidth: 2,
  pointSize: 4,
  series: {0: {color: '#CB181D'}}
});

print(yearlyBurnedAreaChart);

// Add a chart of area by fire frequency
var frequencyAreaChart = ui.Chart.feature.byFeature({
  features: areaByFrequency,
  xProperty: 'description',
  yProperties: ['area_ha']
})
.setChartType('ColumnChart')
.setOptions({
  title: 'Area by Fire Frequency in Mont Mbam (2000-2024)',
  hAxis: {title: 'Fire Frequency'},
  vAxis: {title: 'Area (hectares)'},
  legend: {position: 'none'},
  colors: ['#EF3B2C']
});

print(frequencyAreaChart);
