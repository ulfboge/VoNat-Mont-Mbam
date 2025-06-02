# Land Cover and Forest Change Analysis of the Mont Mbam Survey Area

## Executive Summary

This document presents the results of a focused land cover and forest change analysis for the central survey area of Mont Mbam, encompassing the sampled area plus the highlands to the northeast. The analysis uses ESA WorldCover 2021 data to characterize current land cover distribution and Hansen Global Forest Change data to assess forest dynamics from 2000-2023. The survey area covers approximately 18,054 hectares and is characterized by a landscape dominated by grassland (49.7%) and tree cover (42.2%). Forest loss analysis reveals that 1.4% of the year 2000 forest cover was lost between 2001-2023, with a notable spike in forest loss in 2023.

## 1. Introduction

### 1.1 Study Area

The survey area represents a focused subset of the broader Mont Mbam region, specifically targeting the central portion where field surveys were conducted plus the highlands to the northeast. This area was defined using the boundary provided in `Survey_Area.kml` and encompasses approximately 18,054 hectares. The area is characterized by a mosaic of grassland and forest ecosystems with varying topography.

### 1.2 Analysis Objectives

The primary objectives of this focused analysis were to:

1. Characterize the current land cover distribution within the survey area using high-resolution (10m) ESA WorldCover data
2. Quantify forest cover in 2000 and assess forest loss patterns between 2000-2023 using the Hansen Global Forest Change dataset
3. Analyze temporal trends in forest loss to identify periods of significant change
4. Provide a baseline for understanding landscape dynamics in this core area of Mont Mbam

### 1.3 Methodology

The analysis was conducted using Google Earth Engine, following the methodology outlined in the script `vonat_landcover_forestloss_analysis.js`. The key steps included:

1. Loading the survey area boundary from the KML file
2. Extracting and analyzing ESA WorldCover 2021 data (10m resolution)
3. Processing Hansen Global Forest Change data (30m resolution) to quantify forest cover and loss
4. Calculating annual forest loss statistics from 2001-2023
5. Exporting results as CSV files for further analysis

## 2. Results

### 2.1 Land Cover Distribution

Based on ESA WorldCover 2021 data, the survey area exhibits the following land cover distribution:

| Land Cover Class | Area (hectares) | Percentage |
|------------------|-----------------|------------|
| Tree cover (10) | 7,617.58 | 42.2% |
| Shrubland (20) | 175.80 | 1.0% |
| Grassland (30) | 8,970.92 | 49.7% |
| Cropland (40) | 1,218.58 | 6.7% |
| Built-up (50) | 84.81 | 0.5% |
| Bare/sparse vegetation (60) | 7.33 | <0.1% |
| Permanent water bodies (80) | 0.36 | <0.1% |
| Herbaceous wetland (90) | 8.24 | <0.1% |
| **Total** | **18,053.62** | **100%** |

The survey area is predominantly covered by grassland (49.7%) and tree cover (42.2%), which together account for nearly 92% of the total area. Cropland represents a significant but smaller portion (6.7%), while other land cover types collectively make up less than 2% of the area.

### 2.2 Forest Cover and Loss

#### 2.2.1 Forest Cover in 2000

According to the Hansen Global Forest Change dataset, the survey area contained approximately 4,915.30 hectares of forest in 2000 (using the >30% tree canopy cover threshold). This represents about 27.2% of the total survey area.

#### 2.2.2 Total Forest Loss (2001-2023)

Between 2001 and 2023, the survey area experienced a total forest loss of 67.04 hectares, which represents 1.4% of the forest cover that existed in 2000. This relatively low rate of forest loss suggests overall forest stability in the survey area over the 23-year period.

#### 2.2.3 Annual Forest Loss Patterns

The annual forest loss data reveals the following temporal patterns:

| Year | Forest Loss (hectares) |
|------|------------------------|
| 2001 | 0.62 |
| 2002 | 1.42 |
| 2003 | 3.12 |
| 2004 | 2.67 |
| 2005 | 3.29 |
| 2006 | 6.49 |
| 2007 | 0.98 |
| 2008 | 0.98 |
| 2009 | 5.60 |
| 2010 | 2.49 |
| 2012 | 3.56 |
| 2013 | 3.29 |
| 2014 | 1.42 |
| 2015 | 3.02 |
| 2016 | 1.69 |
| 2017 | 2.22 |
| 2018 | 4.89 |
| 2019 | 0.62 |
| 2020 | 0.98 |
| 2021 | 3.29 |
| 2022 | 1.42 |
| 2023 | 12.34 |

Key observations from the annual forest loss data:

1. **Temporal Variability**: Forest loss varied considerably from year to year, ranging from a minimum of 0.62 hectares (2001, 2019) to a maximum of 12.34 hectares (2023).

2. **Notable Peak Years**: The years with the highest forest loss were:
   - 2023: 12.34 hectares (18.4% of total loss)
   - 2006: 6.49 hectares (9.7% of total loss)
   - 2009: 5.60 hectares (8.4% of total loss)

3. **Recent Acceleration**: The most significant forest loss occurred in 2023, which alone accounted for 18.4% of the total forest loss observed over the 23-year period. This represents a notable increase compared to previous years and warrants further investigation.

4. **Missing Data for 2011**: The dataset does not contain forest loss information for 2011, which may indicate either no detected forest loss in that year or a data gap.

## 3. Discussion

### 3.1 Land Cover Composition

The survey area exhibits a characteristic mosaic of grassland and forest ecosystems typical of the Mont Mbam region. The dominance of grassland (49.7%) over tree cover (42.2%) differs somewhat from the broader Mont Mbam region, where the distribution is more balanced according to ESA WorldCover data (39% grassland, 40% tree cover).

The relatively high proportion of cropland (6.7%) compared to the broader region (7%) suggests that agricultural activities are similarly distributed within the survey area. The minimal presence of built-up areas (0.5%) indicates limited human settlement and infrastructure development.

### 3.2 Forest Dynamics

The forest loss analysis reveals several important patterns:

1. **Overall Forest Stability**: The total forest loss of 67.04 hectares represents only 1.4% of the year 2000 forest cover, indicating relatively high forest stability over the 23-year period. This aligns with the findings from the broader Mont Mbam region analysis, which also showed limited forest loss.

2. **Temporal Patterns**: Forest loss was not uniform across the study period but occurred in distinct pulses, with notable peaks in 2006, 2009, and especially 2023. These patterns may correspond to specific disturbance events or changes in land management practices.

3. **Recent Acceleration**: The significant increase in forest loss in 2023 (12.34 hectares) is particularly noteworthy, as it represents a substantial deviation from the historical pattern. This recent acceleration in forest loss warrants further investigation to determine its causes and potential implications for forest conservation in the area.

### 3.3 Comparison with the Broader Mont Mbam Region

The survey area analysis provides a focused perspective on the central portion of Mont Mbam, allowing for comparison with the broader regional patterns:

1. **Land Cover Distribution**: The survey area shows a higher proportion of grassland (49.7% vs. 39%) and a slightly higher proportion of tree cover (42.2% vs. 40%) compared to the broader region. This suggests that the survey area captures a representative but somewhat distinct ecological zone within Mont Mbam.

2. **Forest Loss Patterns**: The overall forest loss rate in the survey area (1.4% over 23 years) is comparable to the broader region's forest loss rate (1.5% over the same period), indicating similar forest dynamics at both scales.

3. **Temporal Trends**: Both the survey area and the broader region show a notable spike in forest loss in 2023, suggesting that this recent acceleration in forest loss is a regional phenomenon rather than a localized event.

## 4. Conclusion

The land cover and forest change analysis of the Mont Mbam survey area provides valuable insights into the landscape dynamics of this central portion of the region. The area is characterized by a mosaic of grassland and forest ecosystems, with relatively stable forest cover over the past two decades. However, the recent acceleration in forest loss observed in 2023 highlights the need for continued monitoring and conservation efforts.

This focused analysis complements the broader regional assessment by providing more detailed information on a core area of ecological importance within Mont Mbam. The consistency in overall patterns between the survey area and the broader region strengthens confidence in the regional analysis findings, while the differences in specific metrics highlight the spatial variability in landscape composition and dynamics across the Mont Mbam landscape.

The results of this analysis can inform targeted conservation strategies for the survey area, particularly in addressing the recent increase in forest loss and maintaining the balance between grassland and forest ecosystems that characterizes this landscape.
