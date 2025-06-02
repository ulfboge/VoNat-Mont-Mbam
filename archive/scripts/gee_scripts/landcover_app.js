/**
 * @license
 * Copyright 2019 Boston University
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @fileoverview User interface more making land cover maps with CCDC.
 * @author Eric L. Bullock, PhD
 */


//............. UTILITIES ................//
var utils = require('users/parevalo_bu/gee-ccdc-tools:ccdcUtilities/api')
var uiUtils = require('users/parevalo_bu/gee-ccdc-tools:ccdcUtilities/ui') 

 
//............. VARIABLES ................//

var properties = function() {
  this.coefs = [
    "INTP", "SLP", 
    "COS", "SIN", 
    "COS2", "SIN2",
    "COS3", "SIN3", 
    "RMSE"]
    
  this.segs = ["S1", "S2", "S3","S4", "S5", "S6"]
 
  /**
   * Visualization parameters
   */ 
  this.visLabels = {
    fontWeight: 'bold', 
    fontSize: '14px', 
    padding: '4px 4px 4px 4px',
    border: '1px solid black',
    color: 'white',
    backgroundColor: 'black',
    textAlign: 'center',
    stretch: 'horizontal'
  }
  this.visLabelsSub = {
    fontWeight: 'bold', 
    fontSize: '14px', 
    padding: '4px 4px 4px 4px',
    color: 'black',
    backgroundColor: 'white',
    textAlign: 'center',
    stretch: 'horizontal'
  }

}

var horizontalStyle = {
  stretch: 'horizontal', 
  width: '100%'
}

var PROPS
var HELPER
var WIDGS = {}

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
var ccdResultsCollection = ee.ImageCollection('projects/CCDC/v3')
var ccdResults = ccdResultsCollection.mosaic()



//............. HELPER FUNCTIONS ................//
var helperFuncs = function() {
  
   
  // A neater way of return the value of a widget in a panel
  this.getVal = function(panel, index) {
    return panel
      .widgets()
      .get(index)
      .getValue()
  }
  
  // Check whether change visualization parameters were assigned
  this.checkChange = function() {
    var crit1 = PROPS.useChangeName 
    var crit2 = PROPS.useChangePalette
    return crit1 && crit2
  }
  
  // Check whether a change band should be created
  this.checkChangeBand = function() {
    return PROPS.changeStart && PROPS.changeEnd && PROPS.changeClass1 && PROPS.changeClass2
  }
  
  // Check whether land cover visualization parameters were assigned
  this.checkLC = function() {
    var crit1 = PROPS.useClassNames 
    var crit2 = PROPS.usePalette
    return crit1 && crit2
  }
  
  // Parse list of strings
  this.parseList = function(list) {
    return list.split(',')
      .map(
        function(item) {
        return item.trim();
      })
  }
  
  // Return an image where 1 equals any values in a list
  this.getMultipleVals = function(vals, date) {
    return ee.Image.cat(
      [
        vals
        .split(',')
        .map(
          function(item) {
            return HELPER.getLC(date)
              .eq(Number(item.trim()))
          }
        )
      ]
    ).reduce(
      ee.Reducer.anyNonZero()
    ).selfMask()
  }
  
  // Simplify function for obtaining land cover at date  
  this.getLC = function(date) {
    var dateClassificationAfter = utils.Classification.getLcAtDate(
      PROPS.imageLoaded, 
      date, 
      PROPS.segLength, 
      //TODO: expose as a param in the UI
      ee.ImageCollection('projects/CCDC/v3').mosaic(), 
      'after',
      null, 
      null,
      null,
      PROPS.dateFormat
    )
    
    var dateClassificationBefore = utils.Classification.getLcAtDate(
      PROPS.imageLoaded, 
      date,
      PROPS.segLength, 
      //TODO: expose as a param in the UI
      ee.ImageCollection('projects/CCDC/v3').mosaic(), 
      'before', 
      null, 
      null,
      null, 
      PROPS.dateFormat
    )
    
    var dateClassification = ee.Image.cat(
      [
        dateClassificationBefore, 
        dateClassificationAfter
      ]
    )
    .reduce(
      ee.Reducer.firstNonNull()
    )

    return dateClassification.rename(ee.String('LC_').cat(date))
  }
  
  // Load CCDC coefficients based on the format they were saved in. 
  this.loadCoefs = function() {
    if (PROPS.pathType == 'Image' && !PROPS.resultsInLongFormat) {
      return utils.CCDC.buildCcdImage(
        ee.Image(PROPS.dataPath), 
        PROPS.segLength, 
        ["BLUE","GREEN","RED","NIR","SWIR1","SWIR2"]) // TODO
    } else if (PROPS.resultsInLongFormat) {
      return ee.ImageCollection(PROPS.dataPath).mosaic()
    } else {
      return utils.CCDC.buildCcdImage(
        ee.ImageCollection(PROPS.dataPath).mosaic(), 
        PROPS.segLength, 
        ["BLUE","GREEN","RED","NIR","SWIR1","SWIR2"]
      ) 
    }
  }
}

/**
 * Load an ee.Image or ee.ImageCollection
 */
var loadImage = function(obj){
  WIDGS.main.inputPanel.clear()
  PROPS.imageLoaded = ee.Image(HELPER.getVal(WIDGS.main.coefImage, 1))

  // Get properties from input and evaluate to assign as parameters
  var listToEvaluate = ee.List(
    [
      PROPS.imageLoaded.get('Coefficients'),
      PROPS.imageLoaded.get('CoefType'),
      PROPS.imageLoaded.get('DateFormat'),
      PROPS.imageLoaded.get('LongFormat')
    ]
  )
  listToEvaluate.evaluate(function(obj) {
    PROPS.dataPath = obj[0]
    PROPS.pathType = obj[1]
    PROPS.dateFormat = obj[2]
    PROPS.resultsInLongFormat = obj[3]

    PROPS.segLength = 6 // To do

    PROPS.coefsLoaded = HELPER.loadCoefs()
        
    PROPS.bands = PROPS.coefsLoaded.bandNames().map(function(b) {
      return ee.String(b).split('_').get(1)
    })
    .distinct()
    .removeAll(['tStart','tEnd','tBreak','changeProb'])
    
    if (!PROPS.imageLoaded instanceof ee.Image) {
      print("Error loading segment image")
    } else if (!PROPS.coefsLoaded instanceof ee.Image) {
      print("Error loading information from metadata")
    } else {
      WIDGS.main.inputPanel.widgets().add(ui.Label('Land Cover Bands',PROPS.visLabelsSub))
      WIDGS.main.inputPanel.widgets().add(WIDGS.main.dateBox)
      WIDGS.main.inputPanel.widgets().add(WIDGS.main.changeClassPanel)
      WIDGS.main.inputPanel.widgets().add(WIDGS.main.vizPanel)
      WIDGS.main.inputPanel.widgets().add(WIDGS.main.runButton)
    }
    
  }) // End evaluate


} 


/**
 * Do the classification for a single region of interest
 */
var runProcedure = function() {
  var outGeo = PROPS.imageLoaded.geometry()
  WIDGS.main.mainPanel.centerObject(outGeo, 7)
  WIDGS.main.mainPanel.layers().reset()
  
  // Check for viz parameters
  var classes = []
  var palettes = []
  if (HELPER.checkLC()) {
    var useLegend = true

    PROPS.LCPalette = HELPER.parseList(PROPS.palette)
    var LCs = HELPER.parseList(PROPS.LcClassName)

    for (var i = 0; i < PROPS.LCPalette.length; i++) {
      palettes.push(PROPS.LCPalette[i])
      classes.push(LCs[i])
    }
  }
  if (HELPER.checkChange()) {
    classes.push(PROPS.changeName)
    palettes.push(PROPS.changePalette)
    var useLegend = true
  } else {
    classes.push(PROPS.changeName)
    palettes.push('red')
  }  

  // Get dates formatted as list
  var datesToClassify = HELPER.parseList(PROPS.dateList)

  // Extract dates
  var classIms = ee.List(datesToClassify.map(function(date) {
  //   var dateParams = {inputFormat: 3, inputDate: PROPS.startDate, outputFormat: 1}
  // var dateParams2 = {inputFormat: 3, inputDate: PROPS.endDate, outputFormat: 1}
  // var formattedDate = utils.Dates.convertDate(dateParams)
    var lc = HELPER.getLC(date)
    if (PROPS.LCPalette) {
      WIDGS.main.legendPanel
      WIDGS.main.mainPanel.addLayer(
        lc, 
        {
          min: 1, 
          max: PROPS.LCPalette.length, 
          palette: PROPS.LCPalette
        }, 
        'Classification ' + date)
    } else{
      WIDGS.main.mainPanel.addLayer(
        lc.randomVisualizer(), 
        {}, 
        'Classification ' + date)
    }
    return lc
  }))
  
  var imList = []
  for (var i = 0; i < datesToClassify.length; i++) {
    imList.push(classIms.get(i))
  }
  
  if (useLegend){
    WIDGS.main.legendPanel.clear()
    var legend = utils.Classification.makeLegend(classes, palettes)
    WIDGS.main.legendPanel.add(legend)
  }
  
  
  // Now get land change
  var exportProps = {}
  
  if (HELPER.checkChangeBand()) {
    print('Making change band')

    // Check if the classes are single values or multiple
   
    var vals1 = HELPER.getMultipleVals(PROPS.changeClass1,PROPS.changeStart)
    var vals2 = HELPER.getMultipleVals(PROPS.changeClass2,PROPS.changeEnd)
    exportProps['ChangeStartDate'] = PROPS.changeStart,
    exportProps['ChangeEndDate'] = PROPS.changeEnd,
    exportProps['ChangeStartClasses'] = PROPS.changeClass1,
    exportProps['ChangeEndClasses'] = PROPS.changeClass2

    var changeBand = vals1
    .and(vals2)
    .selfMask()
    .rename('ChangeBand')
    
    imList.push(changeBand)
    
    WIDGS.main.mainPanel.addLayer(
      changeBand, 
      {
        palette: PROPS.changePalette
      }, 
      PROPS.changeName
    )//#1b9e77,#d95f02,#7570b3, #e7298a, #66a61e,#e6ab02
  }
  var dem = ee.Image("USGS/SRTMGL1_003")
  WIDGS.main.mainPanel.addLayer(
      ee.Terrain.hillshade(dem).updateMask(ee.Image(imList[0]).gt(0)), 
      {
          opacity: .34,
          gamma: 0.28,
          bias: 0,
          gain: 1
      }, 
      'Hillshade',
      true
    )
  
  var output = ee.Image(
    ee.Image.cat(imList).int8()
    .copyProperties(ee.Image(PROPS.imageLoaded))
  ).setMulti(ee.Dictionary(exportProps))


  Export.image.toAsset({
    image: output,
    scale: 30,
    description: 'classification_dates',
    assetId: 'classification_dates',
    maxPixels: 1e13,
    region: outGeo,
    pyramidingPolicy: {'.default': 'mode'}
  })  
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
  
  // Set ccdc related sub-panels
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
  
  // Set all other subpanels
  PROPS = new properties()
  HELPER = new helperFuncs()
  
  WIDGS.main = []
  WIDGS.main.mainPanel = ui.Map({onClick: mapCallback})
  WIDGS.main.mainPanel.setOptions('HYBRID')
  

  WIDGS.main.coefImage = uiUtils.makeTextPanel(
    'Segment Image',
    'users/bullocke/ccdc/public/zambiaSegments',
    'horizontal')

  WIDGS.main.loadButton = ui.Button(
    {
      label:'Load', 
      style: {
        width: '95%'
      },
      onClick: loadImage
    }
  )

  WIDGS.main.loadPanel = ui.Panel(
    {
      style: {
        width: '100%'
      }, 
    widgets: [
      ui.Label(
        'Make Landcover Maps (BETA)',
        PROPS.visLabels
      ),
      WIDGS.main.coefImage, 
      WIDGS.main.loadButton]
  })
       
  WIDGS.main.inputPanel = ui.Panel({
    style: {width: '100%'},
  })
  
  WIDGS.main.sidePanel = ui.Panel(
    {
      style: {
        width: '25%'
      },
    widgets: [
      WIDGS.main.loadPanel, 
      WIDGS.main.inputPanel
    ],
    layout: ui.Panel.Layout.Flow('vertical')
  })
  
  // Set left side panels
  WIDGS.main.chartPanel =  uiUtils.getTSChart(WIDGS.main.mainPanel, null, runParams, vizParams, null, null, null)
  WIDGS.main.geoPanel = uiUtils.getGeoPanel(WIDGS.main.mainPanel)
  WIDGS.main.leftPanel = ui.Panel([WIDGS.ccd.controlPanel, WIDGS.viz.controlPanel, 
    WIDGS.main.geoPanel], 
    ui.Panel.Layout.flow('vertical'), {width: '10%'})
  
  
  // Set all main, split panels
  WIDGS.main.dataPanel = ui.Panel([ui.SplitPanel(WIDGS.main.mainPanel, WIDGS.main.chartPanel, 'vertical')])
  var corePanel = ui.Panel([ui.SplitPanel(WIDGS.main.dataPanel, WIDGS.main.sidePanel, 'horizontal')])
  var fullPanel =  ui.SplitPanel(WIDGS.main.leftPanel, corePanel, 'horizontal')
  
  
  WIDGS.main.runButton = uiUtils.makePanel(
    'horizontal',
    [
      ui.Button(
        {
          label:'Run', 
          onClick: runProcedure,
          disabled: false,
          style: {
            width: '95%'
          }
        }
      ),
    ]
  );
  
  PROPS.dateList = '2001-01-01'
  
  WIDGS.main.dateBox = uiUtils.makeTextPanel(
    'Land Cover Dates (YYYY-MM-DD); Comma separated',
    PROPS.dateList,
    'horizontal')
    
  WIDGS.main.dateBox
  .widgets()
  .get(1)
  .onChange(
    function(str) {
      PROPS.dateList = str
    }
  )
  
  // Again for change
  
  WIDGS.main.startDateBox = ui.Textbox(
    '2001-01-01', 
    null, 
    function(str) {
      PROPS.changeStart = str
    }, 
    false, 
    {
      width: '20%'
    }
  )
  
  WIDGS.main.endDateBox = ui.Textbox(
    '2010-01-01', 
    null, 
    function(str) {
      PROPS.changeEnd = str
    }, 
    false, 
    {
      width: '20%'
    }
  )
  
  WIDGS.main.changeClass1Box = ui.Textbox(
    1, 
    null, 
    function(str) {
      PROPS.changeClass1 = str
    }, 
    false, 
    {
      width: '20%'
    }
  )
  
  WIDGS.main.changeClass2Box = ui.Textbox(
    2, 
    null, 
    function(str) {
      PROPS.changeClass2 = str
    }, 
    false, 
    {
      width: '20%'
    }
  )
  
  WIDGS.main.changeStartEnd = ui.Panel(
    [
      ui.Label('Date (From)'),
      WIDGS.main.startDateBox,
      ui.Label('Date (To)'),
      WIDGS.main.endDateBox,
    ],
    ui.Panel.Layout.Flow('horizontal'),
    {
      textAlign: 'center'
    }
  )
   
  WIDGS.main.changeClass = ui.Panel(
    [
      ui.Label('Class (From)'),
      WIDGS.main.changeClass1Box,
      ui.Label('Class (To)'),
      WIDGS.main.changeClass2Box,
    ],
    ui.Panel.Layout.Flow('horizontal'),
    {
      textAlign: 'center'
    }
  )
  
  WIDGS.main.legendPanel = ui.Panel(
    {
      style: {
        stretch: 'vertical',
        position: 'bottom-right',
        width: '260px'
      }
    })
  WIDGS.main.mainPanel.add(WIDGS.main.legendPanel)
  
  
  WIDGS.main.changeClassPanel = ui.Panel(
    {
      style: {
        stretch: 'vertical'
      }, 
      widgets: [
        ui.Label(
          'Change band (optional)',
          PROPS.visLabelsSub
        ),
        WIDGS.main.changeStartEnd, 
        WIDGS.main.changeClass
      ]
    }
  )
  
  
  // Visualization
  
  WIDGS.main.classNames = uiUtils.makeTextPanel(
    'Map Classes (String)',
    null,
    'horizontal')
  
  WIDGS.main.classNames
  .widgets()
  .get(1)
  .onChange(
    function(str) {
      PROPS.LcClassName = str
      PROPS.useClassNames = true
    }
  ) 
  
  WIDGS.main.classNames
  .widgets()
  .get(1)
  .setPlaceholder('Forest, Grassland, Cropland, Water, Settlement, Otherland')
    
  
  WIDGS.main.paletteBox = uiUtils.makeTextPanel(
    'Palette',
    null,
    'horizontal')
  
  WIDGS.main.paletteBox.widgets()
  .get(1)
  .onChange(
    function(str) {
      PROPS.usePalette = true
      PROPS.palette = str
    }
  )  
  
  WIDGS.main.paletteBox
  .widgets()
  .get(1)
  .setPlaceholder('darkgreen, lime, yellow, blue, black, orange')

  WIDGS.main.changePaletteBox = uiUtils.makeTextPanel(
    'Change Class Color',
    'red',
    'horizontal')
    
  PROPS.useChangePalette = false
  
  PROPS.changePalette = 'red'
  
  WIDGS.main.changePaletteBox
  .widgets()
  .get(1)
  .onChange(
    function(str) {
      PROPS.changePalette = str
    }
  ) 
  WIDGS.main.changePaletteBox
  .widgets()
  .get(1)
  .setPlaceholder('red')

  WIDGS.main.changeName = uiUtils.makeTextPanel(
    'Change Class Name',
    'Land Cover Change',
    'horizontal')
  PROPS.changeName = 'Land Cover Change'
  PROPS.useChangeName = false

  WIDGS.main.changeName
  .widgets()
  .get(1)
  .onChange(
    function(str) {
      PROPS.changeName = str
    }
  )
     
  WIDGS.main.vizPanel = ui.Panel(
    {
      style: {
        width: '100%'
      }, 
      widgets: [
        ui.Label(
          'Visualization Parameters (Optional)',
          PROPS.visLabelsSub
        ),
        WIDGS.main.classNames, 
        WIDGS.main.paletteBox,
        WIDGS.main.changeName,
        WIDGS.main.changePaletteBox
      ]
    }
  )

  ui.root.add(fullPanel)
}


initApp()
// 
// #33a02c, #b2df8a, #fdbf6f, #1f78b4, #fb9a99, #ff7f00 
// Forest, Grassland, Cropland, Water, Settlement, Other
// users/bullocke/cambodia_classification_segments
