/**
 * 
 * Classify CCDC segments
 * 
 * Authors: Eric Bullock (bullocke@bu.edu), Paulo Arevalo (parevalo@bu.edu)
 * 
 * Please cite as:
 * Arévalo, P., Bullock, E.L., Woodcock, C.E., Olofsson, P., 2020. 
 * A Suite of Tools for Continuous Land Change Monitoring in Google Earth Engine. 
 * Front. Clim. 2. https://doi.org/10.3389/fclim.2020.576740
 * 
 * Additional credits: Zhiqiang Yang and Noel Gorelick. 
*/ 

//............. UTILITIES ................//
var dates = require('users/parevalo_bu/gee-ccdc-tools:ccdcUtilities/dates.js')	
var utils = require('users/parevalo_bu/gee-ccdc-tools:ccdcUtilities/api')	
var uiUtils = require('users/parevalo_bu/gee-ccdc-tools:ccdcUtilities/ui')

/**
 * These are a couple global variables. 
 * PROPS: Input parameters such as input features
 * HELPER: Utility functions
 * WIDGS: Application widgets
 */
var PROPS
var HELPER
var WIDGS = {}
var OUTPUT = {}

var ccdParams = {}
var runParams = {}
var vizParams = {}
var globGeom = []


var INDICES = ['NDVI', 'NBR', 'EVI', 'EVI2', 'NDFI', 'GREENNESS', 'BRIGHTNESS', 'WETNESS']
var BANDS = ['BLUE','GREEN','RED', 'NIR', 'SWIR1', 'SWIR2'] 
var FULLBANDS = BANDS.concat(INDICES)
var BPBANDS = ['GREEN', 'RED', 'NIR', 'SWIR1', 'SWIR2']
var TMBANDS = ['GREEN', 'SWIR2']
var dateFormat = 1
// Use the Mt Mbam CCDC results asset
var ccdResults = ee.Image('projects/ee-komba/assets/vonat/CCDC_Mt_Mbam_Results')

// June 16th, checked for format 
/**
 * Input parameters
 * This is a parameter object that contains some
 * pre-defined parameters. As the user changes the
 * widgets these parameters are updated. 
 */ 
var properties = function() {
  // CCDC model parameters
  this.coefs = [
    "INTP", "SLP",
    "COS", "SIN",
    "COS2", "SIN2",
    "COS3", "SIN3",
    "RMSE"]
  // Segment prefix, for now just using 3
  this.segs = ["S1", "S2", "S3", "S4", "S5", "S6"]
  // The method for defining the output study region. 
  this.geoType = ''
  // Input geometry to zoom to in Uganda
  this.geo = ee.Geometry.Point([32.72219419907464,1.4332346559141527])
  // Classifiers for classifying CCDC parameters.
  this.classifiers = ['Random Forest', 'Support Vector Machine',
    'Euclidian Distance']
  this.defaultClassifier = null // load from f
  // List of EarthEngine classifiers corresponding to this.classifiers  
  this.eeClassifiers = [
    ee.Classifier.smileRandomForest(300),
    ee.Classifier.libsvm(),
    ee.Classifier.minimumDistance()
  ]
  // Empty list of input bands, filled when CCDC results loaded.
  this.bands = []
  // Visualization parameters for widget text
  this.visLabels = {
    fontWeight: 'bold',
    fontSize: '14px',
    padding: '4px 4px 4px 4px',
    border: '1px solid black',
    color: 'white',
    backgroundColor: 'black',
    textAlign: 'left',
    stretch: 'horizontal'
  }
  // GLANCE visualization parameters
  this.glanceViz = {min: 1, max: 8, palette: ['#386cb0', 'white', 'red', 'black', '#33a02c', '#b2df8a', '#ffff99','#654321']}
  // Global GLANCE land grid.
  this.grids = ee.FeatureCollection('projects/GLANCE/GRIDS/GEOG_LAND/GLANCE_v01_GLOBAL_TILE_LAND')

  // World regions, this is likely unnecessary (TODO)
  this.regions = ['Select Region', 'AF', 'AN', 'AS', 'EU', 'NA','OC', 'SA']  
  // CCDC date format
  this.dateFormat = 1
  // Default path to input data
  this.inputPath = 'projects/ee-komba/assets/vonat/CCDC_Mt_Mbam_Results'
  // List of possible date formats
  this.dateFormatList = [
    'Julian Days (0)',
    'Fractional Years (1)',
    'Unix time in ms (2)']
  var allPossibleInputs = ["B1","B2","B3","B4","B5","B6","B7",
                           "BLUE","GREEN","RED","NIR","SWIR1","SWIR2","TEMP", "INTP",
                           "AMPLITUDE_1", "PHASE_1","AMPLITUDE_2",
                           "PHASE_2", "SLP","COS", "SIN","COS2", "SIN2", "COS3","SIN3",
                           "RMSE","ELEVATION","ASPECT","DEM_SLOPE","RAINFALL","TEMPERATURE"]
                          // "AMPLITUDE2", "PHASE2","AMPLITUDE3",
                          // "PHASE3","WATER_OCCURRENCE","POPULATION9", "TREE_COVER"]
  // Get dictionary with true or false for each input
  this.defaults = {} // load from fc
  for (var i = 0; i < allPossibleInputs.length; i++) {
    this.defaults[allPossibleInputs[i]] = true
  }
  
  // Training data path, attribute label, and year of training label
  this.trainingPathString = 'users/bullocke/ccdc/public/EastAfrica_Training_Example_Data'
  this.trainingAttribute = 'landcover'
  this.trainingYear = 2016
  
}

// June 16th, checked for format 
/**       
 * Helper functions
 * 
 * These are app-specific functions that help piece together the
 * user interface and CCDC api. 
 */
var helperFuncs = function() {
  
  // A neater way of return the value of a widget in a panel
  this.getVal = function(panel, index) {
    return panel.widgets()
      .get(index)
      .getValue()
  }
  
   // Check if necessary parameters have been filled, if so allow classification button
  this.checkParams = function() {
    var crit1 = PROPS.region.geoType != ''
    var crit2 = PROPS.training.trainingStrategy != ''
    var crit3 = PROPS.classifier.classifier
    var crit4 = PROPS.predictorsLoaded
    if (crit1 && crit2 && crit3 && crit4) {
      WIDGS.main.runButton
        .widgets()
        .get(0)
        .setDisabled(false)
    }
  }
 
  // Return the values from an object as if its a dictionary 
  this.getObjValues = function(obj) { //func.apply(this, vals)
    return Object.keys(obj).map(function(key){ return obj[key] });
  }
}


// June 16th, checked for format 
/**
 * Load change detection results
 */
var loadResults = function(obj) {
  
  // Get input data and type
  PROPS.dataPath = HELPER.getVal(WIDGS.main.inputPath, 1)
  
  // Return the input type (image, collection, array, FeatureCollection (TODO))
  PROPS.pathType = HELPER.getVal(WIDGS.main.imOrCol, 1)

  if (PROPS.pathType == 'Feature Collection') {
    var fc = ee.FeatureCollection(PROPS.dataPath).first().toDictionary()
    var dict = Object(fc.getInfo())
    var keys = Object.keys(dict)
    for (var i = 0; i < keys.length; i++) {

      PROPS["AMPLITUDE"] = true
      PROPS[String(keys[i])] = dict[keys[i]]
    }
  }
 // Make object attributes from utility functions
  PROPS.training = new uiUtils.training(WIDGS.main.mainPanel,PROPS.visLabels, HELPER, PROPS)
  PROPS.classifier = new uiUtils.classifier(PROPS.classifiers, PROPS.eeClassifiers,PROPS.visLabels, HELPER, PROPS.defaultClassifier)
  PROPS.predictors = new uiUtils.predictors(PROPS.visLabels, PROPS.coefs, PROPS, HELPER)
  PROPS.region = new uiUtils.region(WIDGS.main.mainPanel, PROPS.grids, PROPS.regions,PROPS.visLabels, HELPER)

  // Reassign some widgets to the WIDGS object
  WIDGS.predictors = PROPS.predictors.widgs
  WIDGS.region = PROPS.region.widgs
  WIDGS.training = PROPS.training.widgs
  WIDGS.classifier = PROPS.classifier.widgs
  
  // Hard code metadata filter until it's public
  PROPS.metadataFilter = 'z_'

  // Result Type 1: An image-format result
  if (PROPS.pathType == 'Image') {
    
    // Assign data type parameter
    PROPS.ccdcDataType = 'Image'
    PROPS.resultsInLongFormat = 0
    // Assign image collcetion parameter
    PROPS.resultCol = ee.Image(PROPS.dataPath)
    PROPS.resultCol.bandNames().contains('S1_tBreak').evaluate(function(obj) {
      if (obj) {
        PROPS.resultsInLongFormat = 1
      } else {
        PROPS.resultsInLongFormat = 0
      }
    })  
    // Get coefficient band names
    PROPS.resultCol.select(".*_coefs").bandNames().map(function(x) {
      return ee.String(x).split('_').get(0)})
    .evaluate(function(i) {
      
      PROPS.bands = i
      
      PROPS.predictors.fillInputPanels(i)
      
      PROPS.predictorsLoaded = true
      
      WIDGS.predictors.loadParams.setValue('CCDC Model Parameters')
      
      HELPER.checkParams()
    })
    
  } else {  
    
    // Result Type 2: A collection of image arrays in compressed format
    var collection = ee.ImageCollection(PROPS.dataPath)
    
    // This is for the global result format
    if (PROPS.dataPath == 'projects/CCDC/v3') {
      // The global results are stored as array images
      PROPS.ccdcDataType = 'ArrayCollection'
      
      // Filter based on metadata
      // collection = collection.filterMetadata('system:index', 'starts_with', PROPS.metadataFilter)
      
      // Assign image collection parameter
      PROPS.resultCol = collection
      
      // Assign longformat parameter
      PROPS.resultsInLongFormat = 0
      // print(PROPS.resultCol)
      // Get coefficient band names
      PROPS.resultCol.first().select(".*_coefs").bandNames().map(function(x) {
          return ee.String(x).split('_').get(0)})
        .evaluate(function(i) {
          
          PROPS.bands = i
          
          PROPS.predictors.fillInputPanels(i)
          
          PROPS.predictorsLoaded = true
          
          WIDGS.predictors.loadParams.setValue('CCDC Model Parameters')
          
          HELPER.checkParams()
        })
    }
    else { 

      // Result Type 3: A collection of long-format images
      PROPS.ccdcDataType = 'ImageCollection'
      
      // The results are stored in long format
      PROPS.resultsInLongFormat = 1
      
      // Hard code segments to 6 to correspond to East Africa
      PROPS.resultCol = collection.select(['S1.*','S2.*','S3.*','S4.*','S5.*','S6.*'])
      
      // Get the band names and add checkboxes for each
      PROPS.resultCol.mosaic().select('S1.*coef.*INTP').bandNames().map(function(x) {
          return ee.String(x).split('_').get(1)})
        .evaluate(function(i) {
          
          PROPS.bands = i
          
          PROPS.predictors.fillInputPanels(i)
          
          PROPS.predictorsLoaded = true
          
          WIDGS.predictors.loadParams.setValue('CCDC Model Parameters')
        })
    }
  
  }
  
   // Define some export parameters
    PROPS.exportParams = {
      'Coefficients': PROPS.dataPath,
      'CoefType': PROPS.pathType,
      'LongFormat': PROPS.resultsInLongFormat,
      'DateFormat': PROPS.dateFormat,
      'NumSegs': PROPS.segs.length,
      'Bands': PROPS.bands,
    }

  // Add check to display GLANCE legend 
  WIDGS.main.glance = ui.Checkbox('Use GLANCE legend?', false, function(bool) {
    PROPS.glance = bool
  })

  // Add everything to the input panel
  WIDGS.main.inputPanel.widgets().add(WIDGS.classifier.all)
  WIDGS.main.inputPanel.widgets().add(WIDGS.predictors.all)
  WIDGS.main.inputPanel.widgets().add(WIDGS.region.all)
  WIDGS.main.inputPanel.widgets().add(WIDGS.training.all)
  WIDGS.main.inputPanel.widgets().add(WIDGS.main.glance)
  WIDGS.main.inputPanel.widgets().add(WIDGS.main.runButton)
}


/**
 * Do the classification for a single region of interest
 */
var runProcedure = function(outFeat, featId) {
  
  // Remove the title panel from the map until the image has loaded
  WIDGS.main.mainPanel.remove(WIDGS.main.titlePanel)
  
  // Convert output feature to geometry
  var outGeo = outFeat.geometry()
  // Filter collection and make mosaic
  if (PROPS.ccdcDataType == 'Image') {
    PROPS.results = PROPS.resultCol
  } else {
    PROPS.results = PROPS.resultCol.filterBounds(outGeo).mosaic()
  }

  // Clip the results (filler in case I want to do this later)
  PROPS.resultsClipped = PROPS.results
  // print(PROPS.resultsClipped)
  

  // Get input features
  var bandsToClassify = ee.List(PROPS.predictors.inputBands.map(function(b) {
    return PROPS.predictors.inputCoefs.map(function(c) {
      return b.concat('_').concat(c)
    })})).flatten()
    
  // Assign path of to training data and attribute to global parameters
  PROPS.trainingPath = HELPER.getVal(WIDGS.training.panels.widgets().get(0), 1)
  PROPS.trainingPathString = PROPS.trainingPath // load from fc
    
  // Training data attribute name (needs to be in each feature)
  PROPS.training.trainingAttribute = HELPER.getVal(WIDGS.training.panels.widgets().get(1), 1) // load from fc
    
  // Load training data
  PROPS.training.loaded = ee.FeatureCollection(PROPS.trainingPath)

  // If requested, filter training data by output extent. 
  if (PROPS.training.trainingStrategy == 'Within Output Extent') { // load from fc
    
    PROPS.training.loaded = PROPS.training.loaded.filterBounds(outGeo)
  
    PROPS.training.filtered = true} 
    else {
  
    PROPS.training.filtered = false
  
  }
  
  // Get ancillary climate and elevation data
  var ancillary = utils.Inputs.getAncillary()
  
  // Check if attribute is string or numeric. This getInfo is annoying, but easy. 
  // This will avoid headaches from string-formatted landcover attributes. 
  var prop = PROPS.training.loaded.first().get(PROPS.training.trainingAttribute).getInfo() // <- "Do what I say not what I do"
    
  // If the landcover attribute is a string then it should be converted to numeric. 
  if (typeof prop === "string") {
    
    var classes = ee.Dictionary(PROPS.training.loaded.aggregate_histogram(PROPS.training.trainingAttribute)).keys()
    
    var vals = ee.List.sequence(1, classes.size())
    
    print('Attribute is type [string]. Remapping to be numeric')
    print('String classes: ', classes)
    print('Corresponding numeric classes: ', vals)
    
    PROPS.training.loaded = PROPS.training.loaded.remap(classes,vals, PROPS.training.trainingAttribute)
  }
  
  // Get visualization palette, this is probably unnecessary but makes map prettier...
  PROPS.classVals = ee.Dictionary(PROPS.training.loaded.aggregate_histogram(PROPS.training.trainingAttribute)).keys()
    
  // Check if the training data already has predictor data. If it does, there's no reason
  // to obtain them again 
  var savedCoefs = PROPS.training.loaded.first().propertyNames().containsAll(bandsToClassify)

  // Based on format of results, get eventually to long-band image format ("S1, S2, S3, etc")
  if (PROPS.resultsInLongFormat == 1) {
    
    // Load image directly
    var ccdImage = PROPS.resultsClipped.select(['S.*coef.*','S.*RMSE.*', 'S.*tStart', 'S.*tEnd'])
    
    // "Global" i.e. not subset to outGeo
    var ccdImageAll = PROPS.results
    
    // Spec image used for band names
    PROPS.specImage = ccdImage
  }
    else {
    
      // Build image from array  
      var ccdImage = utils.CCDC.buildCcdImage(PROPS.resultsClipped,PROPS.segs.length, PROPS.predictors.inputBands)
      
      // Spec image used for band names
      PROPS.specImage = ccdImage
      
      // "Global" i.e. not subset to outGeo
      var ccdImageAll = utils.CCDC.buildCcdImage(PROPS.results,PROPS.segs.length,PROPS.predictors.inputBands)
  }

  // If predictors are not attached to training data then they are obtained for the
  // training year. 
  PROPS.trainingYear = Number(HELPER.getVal(WIDGS.training.yearPanel.widgets().get(0), 1))

  // Format date based on CCDC date type
  var dateFormatted = dates.convertDate({
    inputFormat: 1,
    inputDate: PROPS.trainingYear, // load from fc
    outputFormat: PROPS.dateFormat
  })

  // Obtain predictors for training year. 
  var coefForTraining = utils.CCDC.getMultiCoefs(ccdImageAll, dateFormatted, PROPS.predictors.inputBands,
      PROPS.predictors.inputCoefs, true, PROPS.segs,'before').addBands(ancillary).unmask()

  // Sample predictors for training year. 
  PROPS.training.withCoefs = coefForTraining.sampleRegions({
    collection: PROPS.training.loaded,
    scale: 30,
    tileScale: 16,
    geometries: true
  })
  print('Class counts in study region: ', PROPS.training.loaded.aggregate_histogram(PROPS.training.trainingAttribute))
    
  // Check if the coefficients are already saved in the training data
  PROPS.training.withCoefs = ee.FeatureCollection(
    ee.Algorithms.If(savedCoefs, PROPS.training.loaded, PROPS.training.withCoefs))

  var printMessage = print(ui.Label('Note!', {
      fontSize: '14px',
      fontWeight: 'bold'
    }),
    ee.Algorithms.If(savedCoefs,'Training data already contains all predictors',
      'Training data does not contain all predictors, calculating...'))
  
  // If the inputs are not already saved, retrieve them and offer option to save    
  savedCoefs.evaluate(function(obj) {
    if (!obj) {
      print(ui.Panel([
            ui.Label('Warning!', {
              fontSize: '14px',
              fontWeight: 'bold'
            }),ui.Label('Save feature collection with predictors to asset to reduce future computation time.')]))
      Export.table.toAsset(PROPS.training.withCoefs, 'trainingWithPredictors')}
  })
  

  // ERIC HERE
  var classificationProps = {
    ccdImage: ccdImage,
    segLength: PROPS.segs.length,
    inputBands: PROPS.predictors.inputBands,
    ancillary: ancillary, 
    ancillaryList: PROPS.predictors.ancillary,
    trainingData: PROPS.training.withCoefs,
    classifier: PROPS.classifier.classifier, 
    outGeo: outGeo, //TODO
    trainingAttribute: PROPS.training.trainingAttribute,
    featureList:  PROPS.predictors.inputCoefs,
    trainProp: null,
    seed: null,
    filteredProp: PROPS.training.filtered
  }

  var inputDict = utils.Classification.getInputDict(
    PROPS.predictors.inputBands, PROPS.predictors.inputCoefs, PROPS.predictors.ancillary)[0]
    
  // print(inputDict)
  var outFeats = [outFeat.setMulti(classificationProps), outFeat.setMulti(classificationProps)]
  var outFC = ee.FeatureCollection(outFeats)

  var classSegs = ee.Image(ee.Image(utils.Classification.classifySegments
    .apply(this,HELPER.getObjValues(classificationProps)))
    .clip(outGeo).setMulti(PROPS.exportParams))
  
  // print(classificationProps)
  // print(PROPS.exportParams)
  print('Classified Segments:', classSegs)

  // Add first segment to the map    
  if (PROPS.glance) {

    WIDGS.main.mainPanel.addLayer(classSegs.select(0).clip(outGeo), PROPS.glanceViz,'First Segment')
 
  } 
    else {
    
      WIDGS.main.mainPanel.addLayer(classSegs.select(0).clip(outGeo).randomVisualizer(), {},'First Segment')
    
  }
  
  // Add title    
  WIDGS.main.mainPanel.add(WIDGS.main.titlePanel)
  
  // Export to asset!    
  Export.image.toAsset({
    image: ee.Image(classSegs).int8(),//.clip(outGeo),
    scale: 30,
    description: 'classification_segments',
    assetId: 'classification_segments',
    maxPixels: 1e13,
    region: outGeo,
    pyramidingPolicy: {
      '.default': 'mode'
    }
  })
  
  // Save parameters load from fc
  OUTPUT = PROPS.defaults
  OUTPUT.trainingPathString = PROPS.trainingPathString
  OUTPUT.defaultClassifier = PROPS.defaultClassifier
  OUTPUT.trainingAttribute = PROPS.training.trainingAttribute
  OUTPUT.trainingYear = PROPS.trainingYear
  OUTPUT.trainingStrategy = PROPS.training.trainingStrategy
  outFeat = outFeat.setMulti(OUTPUT)
  var outFC = ee.FeatureCollection([outFeat, outFeat])

  Export.table.toAsset(outFC, 'Parameters','CCDC_App_Parameters')
  ee.Geometry(PROPS.region.outGeo).evaluate(function(obj) {
    OUTPUT.outGeo = obj
  })
}

/**
 * Classify CCDC and save the results. 
 * 
 * When the 'Run Classification' button is clicked, either submit
 * a single task via the runProcedure() function or a task
 * for each tile that is defined. 
 * 
 * geoTypes indexed by 'Select Method' widget values
 *  1 is a drawn feature or country
 *  2 is tile intersecting point
 *  3-4 are multiple tiles
 */
var saveProcedure = function() {
  // print(PROPS.region)
  // print(PROPS)
  // print(PROPS.geoType)
  if (PROPS.region.geoType < 2) {
    runProcedure(
      ee.Feature(PROPS.region.outGeo), 
      'classification' // TODO
    )
  }
  else if (PROPS.region.geoType == 2) {
    var feat_id = PROPS.region.outGeo.get('id')
    runProcedure(
      ee.Feature(PROPS.region.outGeo),
      feat_id
    )
  } else if (PROPS.region.geoType == 3) {
    runProcedure(
      ee.Feature(PROPS.region.outGeo), 
      'classification' // TODO
    )
  }
  else {
    var outGeosList = PROPS.region.outGeos.toList(100);
    for (var i = 0; i < PROPS.region.outGeosSize; i++) {
      var outGeo = ee.Feature(outGeosList.get(i))
      var feat_id = outGeo.get('id')
      runProcedure(outGeo, feat_id)
    }
  }
}

function mapCallback(coords){
  // Retrieve ccdc arguments
  ccdParams.breakpointBands = BPBANDS
  ccdParams.tmaskBands= TMBANDS
  ccdParams.dateFormat = dateFormat
  ccdParams.lambda = parseFloat(WIDGS.ccd.lambda.widgets().get(1).getValue())
  ccdParams.maxIterations = parseInt(WIDGS.ccd.maxIter.widgets().get(1).getValue())
  ccdParams.minObservations = parseInt(WIDGS.ccd.minObs.widgets().get(1).getValue())
  ccdParams.chiSquareProbability = parseFloat(WIDGS.ccd.chiSq.widgets().get(1).getValue())
  ccdParams.minNumOfYearsScaler = parseFloat(WIDGS.ccd.minYears.widgets().get(1).getValue())
  
  globGeom = ee.Geometry.Point([coords.lon, coords.lat])
  // Retrieve run and viz arguments
  runParams.bandSelect = WIDGS.ccd.bandSelector.widgets().get(1).getValue()
  runParams.sDate = WIDGS.ccd.sDate.widgets().get(1).getValue()
  runParams.eDate = WIDGS.ccd.eDate.widgets().get(1).getValue()
  runParams.nSegs = parseInt(WIDGS.viz.nSegs.widgets().get(1).getValue())
  runParams.runSource = WIDGS.ccd.runSource.widgets().get(1).getValue()
  
  
  if (runParams.runSource == 'Live'){
    runParams.savedBool = false
    
  } else if (runParams.runSource == 'Saved results'){
    runParams.ccdResults =  ccdResultsCollection  
    runParams.savedBool = true 
  }
  
  // print(runParams)
  
  vizParams.tsType = WIDGS.viz.tsType.widgets().get(1).getValue()
  vizParams.red = WIDGS.viz.redBox.widgets().get(0).getValue()
  vizParams.green = WIDGS.viz.greenBox.widgets().get(0).getValue()
  vizParams.blue = WIDGS.viz.blueBox.widgets().get(0).getValue()
  vizParams.redMin = WIDGS.viz.redBox.widgets().get(1).getValue()
  vizParams.greenMin = parseFloat(WIDGS.viz.greenBox.widgets().get(1).getValue())
  vizParams.blueMin = parseFloat(WIDGS.viz.blueBox.widgets().get(1).getValue())
  vizParams.redMax = parseFloat(WIDGS.viz.redBox.widgets().get(2).getValue())
  vizParams.greenMax = parseFloat(WIDGS.viz.greenBox.widgets().get(2).getValue())
  vizParams.blueMax = parseFloat(WIDGS.viz.blueBox.widgets().get(2).getValue())

}


/**
 * Initialize the application and add first panels to the interface
 */
var initApp = function() {
  
  ui.root.clear()
  
  var BAND_GROUPS = {
    'Live': FULLBANDS,
    'Saved results': BANDS
  } 
  
  
  var DISABLE_PANELS = {
    'Live': false,
    'Saved results': true
  }
  
  // Get pre-built ccd Panel
  var ccdPanel = uiUtils.getCcdPanel(BANDS, {redBand: 'NIR', greenBand:'SWIR1', blueBand: 'RED'})
  WIDGS.ccd = ccdPanel.ccd
  WIDGS.viz = ccdPanel.viz
  
  function setPanelStatus(status){
    WIDGS.ccd.lambda.widgets().get(1).setDisabled(status)
    WIDGS.ccd.maxIter.widgets().get(1).setDisabled(status)
    WIDGS.ccd.minObs.widgets().get(1).setDisabled(status)
    WIDGS.ccd.chiSq.widgets().get(1).setDisabled(status)
    WIDGS.ccd.minYears.widgets().get(1).setDisabled(status)
  }
  
  // Set savedbool to match with default in the dropdown (i.e. live results)
  runParams.savedBool = false
  // Enable panels match default in the dropdown (i.e. live results)
  setPanelStatus(false)
  
  // Modify available bands depending on ccd source
  WIDGS.ccd.runSource.widgets().get(1).onChange(
    function(selection){
       WIDGS.ccd.bandSelector.widgets().get(1).items().reset(BAND_GROUPS[selection])
       setPanelStatus(DISABLE_PANELS[selection])
  
    }
  )
  

  HELPER = new helperFuncs()
  PROPS = new properties()
  WIDGS.main = []
  
  // Set custom map panel
  WIDGS.main.mainPanel = ui.Map({onClick: mapCallback})
  WIDGS.main.mainPanel.centerObject(PROPS.geo, 3)
  WIDGS.main.mainPanel.setOptions('HYBRID')
  
  // Make some widgets for loading the input data
  WIDGS.main.imOrCol = uiUtils.makePanel('horizontal',[
      ui.Label({
        value: 'Input Type?',
        style: {
          stretch: 'horizontal',
          color: 'black'
        }
      }),
      ui.Select({
        items: ['Image', 'Image Collection', 'Feature Collection'],
        value: 'Image Collection',
        style: {
          stretch: 'horizontal'
        }
      })
    ])
  WIDGS.main.dateFormat = uiUtils.makePanel('horizontal',[
      ui.Label({
        value: 'Date Format?',
        style: {
          stretch: 'horizontal',
          color: 'black'
        }
      }),
      ui.Select({
        items: PROPS.dateFormatList,
        value: 'Fractional Years (1)',
        style: {
          stretch: 'horizontal'
        },
        onChange: function(i) {
          PROPS.dateFormat = PROPS.dateFormatList.indexOf(i)
        }
      })
    ])
  WIDGS.main.inputPath = uiUtils.makeTextPanel('Input path', PROPS.inputPath, 'horizontal')
  WIDGS.main.filterBox = uiUtils.makeTextPanel('Filter Metadata','z','horizontal')
  
  WIDGS.main.loadButton = ui.Button({label: 'Load', style: {
      width: '95%'
    }, onClick: loadResults
  })
  
 
  
  // Create the panels to hold everything
  WIDGS.main.loadPanel = ui.Panel({
    style: {
      width: '100%'
    },
    widgets: [
      ui.Label('Classify CCDC Segments (BETA)'),
      ui.Label('Load CCDC results', PROPS.visLabels),
      WIDGS.main.imOrCol,
      WIDGS.main.inputPath,
      WIDGS.main.dateFormat,
      WIDGS.main.loadButton]
  })
  WIDGS.main.inputPanel = ui.Panel({
    style: {
      width: '100%'
    },
  })
  WIDGS.main.titlePanel = ui.Panel({
    style: {
      maxHeight: '50px',
      maxWidth: '250px'
    },
    widgets: [ui.Label('First Segment Land Cover')]
  })
  WIDGS.main.sidePanel = ui.Panel({
    style: {
      width: '25%'
    },
    widgets: [WIDGS.main.loadPanel, WIDGS.main.inputPanel],
    layout: ui.Panel.Layout.Flow('vertical')
  })
  
  
  // Reset callback to load time series, it breaks when selecting a tile that intersects a point 
  WIDGS.main.resetCallbackButton = ui.Button({
    label: 'Re-enable chart', 
    onClick: function(x){
      WIDGS.main.mainPanel.onClick(mapCallback)
      WIDGS.main.chartPanel =  uiUtils.getTSChart(WIDGS.main.mainPanel, null, runParams, vizParams, null, null, null)
      WIDGS.main.dataPanel.widgets().get(0).setSecondPanel(WIDGS.main.chartPanel)
    },
    style: {width:'95%'}
    })
  
  
  
  // Set left side panels
  WIDGS.main.chartPanel =  uiUtils.getTSChart(WIDGS.main.mainPanel, null, runParams, vizParams, null, null, null)
  WIDGS.main.geoPanel = uiUtils.getGeoPanel(WIDGS.main.mainPanel)
  WIDGS.main.leftPanel = ui.Panel([WIDGS.ccd.controlPanel, WIDGS.viz.controlPanel, 
    WIDGS.main.geoPanel, WIDGS.main.resetCallbackButton], 
    ui.Panel.Layout.flow('vertical'), {width: '10%'})
  
  // Set all main, split panels
  WIDGS.main.dataPanel = ui.Panel([ui.SplitPanel(WIDGS.main.mainPanel, WIDGS.main.chartPanel, 'vertical')])
  var corePanel = ui.Panel([ui.SplitPanel(WIDGS.main.dataPanel, WIDGS.main.sidePanel, 'horizontal')])
  var fullPanel =  ui.SplitPanel(WIDGS.main.leftPanel, corePanel, 'horizontal')
  
  WIDGS.main.runButton = uiUtils.makePanel('horizontal',[
      ui.Button({
        label: 'Run Classification',
        onClick: saveProcedure,
        disabled: true,
        style: {
          width: '95%'
        }
      }),
    ]);
    
  ui.root.add(fullPanel)
}

// Initiate application
initApp()

// Glance_Class_ID_level1
//users/bullocke/Fiji/NFI/NFI_4_class_2006_data_landsat
// NewForestT
// users/bullocke/Fiji/Sept11_CODED_2014_Today_Raw

// users/openmrv/MRV/CCDC_Tile_Cambodia
// users/openmrv/MRV/cambodia_training