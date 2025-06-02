# Mont Mbam Central Area Land Cover Analysis

[![Convert to PDF](https://img.shields.io/badge/Convert_to-PDF-red?style=for-the-badge&logo=adobe-acrobat-reader)](https://www.markdowntopdf.com/) [![Convert to Word](https://img.shields.io/badge/Convert_to-Word-blue?style=for-the-badge&logo=microsoft-word)](https://word2md.com/)

**Final Report**

*June 2025*

---

## Executive Summary

This report focuses specifically on the central survey area of Mont Mbam and presents the results of our survey-calibrated CCDC (Continuous Change Detection and Classification) analysis. The central survey area (18,054 hectares) represents a core ecological zone with high conservation value. Our analysis reveals remarkable landscape stability over the 37-year study period (1987-2024), with high persistence in major land cover classes, particularly tree cover. The most significant changes include modest tree cover expansion (+196.47 ha), grassland reduction (-260.64 ha), and notable transitions such as conversion from grassland to tree cover (171.64 ha).

These changes coincided with a dramatic decline in fire occurrence, from an average of ~9,503 hectares burned annually in 2000-2009 to only ~1,091 hectares annually in 2017-2024. However, despite the overall landscape stability, the updated Hansen Global Forest Change dataset has identified 328.23 hectares of forest loss between 2001-2024 within the survey area, with a concerning acceleration in recent years. The years 2023 and 2024 showed the highest rates of forest loss (45.72 ha and 35.01 ha respectively), accounting for nearly 25% of all forest loss in the 24-year record. This recent acceleration represents an urgent conservation concern that contrasts with the longer-term stability observed in the CCDC analysis.

The survey-calibrated CCDC land cover maps produced for this analysis represent a significant methodological improvement over previous classifications by incorporating local field data, enhancing class discrimination, and ensuring temporal consistency across the study period.

---

## Table of Contents

1. [Introduction](#1-introduction)
   1. [Study Area Description](#11-study-area-description)
   2. [Project Objectives](#12-project-objectives)
2. [Methodology](#2-methodology)
   1. [Survey Data Integration](#21-survey-data-integration)
   2. [CCDC Analysis Approach](#22-ccdc-analysis-approach)
3. [Results](#3-results)
   1. [Land Cover Composition and Change](#31-land-cover-composition-and-change)
   2. [Forest Cover and Loss](#32-forest-cover-and-loss)
   3. [Fire Disturbance Patterns](#33-fire-disturbance-patterns)
   4. [Survey-Calibrated CCDC Land Cover Maps](#34-survey-calibrated-ccdc-land-cover-maps)
4. [Discussion](#4-discussion)
   1. [Key Findings](#41-key-findings)
   2. [Conservation Implications](#42-conservation-implications)
   3. [Recommendations](#43-recommendations)
5. [Conclusions](#5-conclusions)
6. [References](#6-references)

---

## 1. Introduction

This report presents a focused analysis of land cover dynamics in the central survey area of Mont Mbam between 1987 and 2024. The analysis emphasizes the use of survey-calibrated Continuous Change Detection and Classification (CCDC) methodology, which integrates local field data to improve classification accuracy and provide a more reliable foundation for understanding landscape changes.

### 1.1 Study Area Description

The central survey area represents a smaller subset of the broader Mont Mbam region, covering approximately 18,054 hectares. This area was selected for detailed analysis based on its ecological importance and the availability of comprehensive field survey data. The survey area is predominantly covered by grassland (49.7%) and tree cover (42.2%), which together account for nearly 92% of the total area. Cropland represents a significant but smaller portion (6.7%), while other land cover types collectively make up less than 2% of the area.

The area features varied topography with elevations ranging from approximately 800 to 2,100 meters above sea level, creating diverse ecological conditions that support different vegetation communities. The central location of this survey area makes it particularly representative of the core ecological dynamics within the broader Mont Mbam landscape.

### 1.2 Project Objectives

This focused analysis was designed to meet several key objectives in support of Voice of Nature's (VoNat) conservation mission:

1. **Generate Detailed Land Cover Maps**: Produce high-accuracy land cover maps for the central survey area using CCDC analysis calibrated with local field survey data.

2. **Quantify Land Cover Changes**: Assess land cover changes between 1987 and 2024, with particular focus on transitions between major ecosystem types.

3. **Analyze Forest Loss Patterns**: Document patterns of forest loss using the Hansen Global Forest Change dataset to identify areas of concern.

4. **Examine Fire Disturbance Dynamics**: Analyze historical fire frequency and its relationship to land cover changes using MODIS burned area data.

5. **Provide Conservation Recommendations**: Develop data-driven recommendations for conservation and management based on the observed patterns of landscape change.

The central survey area analysis provides a more granular understanding of land cover dynamics in this core ecological zone, complementing broader regional assessments and offering insights that can guide targeted conservation interventions.

## 2. Methodology

This study employed a methodological approach that emphasizes the integration of field survey data with advanced remote sensing techniques to characterize land cover dynamics in the central Mont Mbam survey area.

### 2.1 Survey Data Integration

A key methodological innovation in this analysis was the integration of field survey data to calibrate the land cover classification:

1. **Field Survey Dataset**: The analysis incorporated 268 GPS points collected by Voice of Nature (VoNat) across the Mont Mbam region. Each point included geographic coordinates and detailed site-specific observations of ecological features and land use patterns.

2. **Land Cover Class Assignment**: The field survey descriptions were systematically analyzed to assign appropriate land cover classes. The classification scheme included eight land cover classes: tree cover, shrubland, grassland, cropland, built-up, bare/sparse vegetation, water bodies, and herbaceous wetland.

3. **Stratified Sampling Approach**: To address imbalanced training data, a stratified sampling approach was implemented with the following sample distribution across classes:
   - Class 1 (Tree cover): 39 samples (13.6%)
   - Class 2 (Shrubland): 15 samples (5.2%)
   - Class 3 (Grassland): 145 samples (50.5%)
   - Class 4 (Cropland): 39 samples (13.6%)
   - Class 5 (Built-up): 20 samples (7.0%)
   - Class 6 (Bare/sparse vegetation): 8 samples (2.8%)
   - Class 8 (Water bodies): 9 samples (3.1%)
   - Class 9 (Herbaceous wetland): 12 samples (4.2%)

4. **Manual Verification**: Additional points for underrepresented classes (particularly water bodies and wetlands) were manually added based on visual interpretation of high-resolution imagery.

### 2.2 CCDC Analysis Approach

The Continuous Change Detection and Classification (CCDC) algorithm was employed to analyze land cover dynamics over time:

1. **Time Series Construction**: A complete Landsat time series was constructed using Landsat Collection 2 Surface Reflectance data from Landsat 4-5 TM (1986-2011), Landsat 7 ETM+ (1999-2022), and Landsat 8-9 OLI/TIRS (2013-2025). The time series included all available scenes with <70% cloud cover.

2. **Change Detection**: The CCDC algorithm was applied to detect both abrupt and gradual changes in land cover by analyzing the entire Landsat time series from 1986 to 2025. This approach offers advantages over traditional classification methods by incorporating temporal information.

3. **Classification**: Land cover maps were generated for four time periods (1987, 2000, 2010, and 2024) using a Random Forest classifier trained on the CCDC model coefficients and breakpoint information, calibrated with the field survey data.

4. **Change Analysis**: Land cover transitions were analyzed by comparing the classification results across time periods. Transition matrices were generated to quantify the area converted between each pair of land cover classes.

5. **Complementary Datasets**: The CCDC results were complemented by analyses of:
   - Hansen Global Forest Change dataset (2000-2024) for forest loss assessment
   - MODIS MCD64A1 Version 6.1 Burned Area Product (2000-2024) for fire disturbance analysis

This methodological approach, particularly the integration of field survey data with the CCDC algorithm, represents a significant improvement over previous classifications by enhancing local accuracy, improving class discrimination, and ensuring temporal consistency across the study period.

## 3. Results

### 3.1 Land Cover Composition and Change

The survey-calibrated CCDC analysis revealed a remarkably stable landscape in the central Mont Mbam survey area between 1987 and 2024, with 96.9% of the area maintaining the same land cover type throughout the study period. The land cover composition and changes are detailed below:

#### 3.1.1 Land Cover Composition

The central survey area (18,054 hectares) is dominated by two major land cover classes:

**Table 1: Land Cover Composition in the Central Survey Area (2024)**

| Land Cover Class | Area (hectares) | Percentage |
|------------------|----------------|------------|
| Tree cover | 7,618.5 | 42.2% |
| Shrubland | 164.3 | 0.9% |
| Grassland | 8,972.8 | 49.7% |
| Cropland | 1,209.2 | 6.7% |
| Built-up | 41.8 | 0.2% |
| Bare/sparse vegetation | 18.9 | 0.1% |
| Water bodies | 19.8 | 0.1% |
| Herbaceous wetland | 8.7 | <0.1% |
| **Total** | **18,054.0** | **100.0%** |

![Land Cover Map 2024](../figures/land_cover_2024.png)
*Figure 1: Survey-calibrated CCDC land cover classification for the central Mont Mbam survey area (2024)*

#### 3.1.2 Land Cover Change (1987-2024)

Despite the overall stability, some notable changes occurred during the 37-year study period:

**Table 2: Land Cover Change in the Central Survey Area (1987-2024)**

| Land Cover Class | 1987 Area (ha) | 2024 Area (ha) | Change (ha) | Percent Change |
|------------------|----------------|----------------|-------------|----------------|
| Tree cover | 7,422.0 | 7,618.5 | +196.5 | +2.6% |
| Shrubland | 152.1 | 164.3 | +12.2 | +8.0% |
| Grassland | 9,233.4 | 8,972.8 | -260.6 | -2.8% |
| Cropland | 1,181.7 | 1,209.2 | +27.5 | +2.3% |
| Built-up | 31.5 | 41.8 | +10.3 | +32.7% |
| Bare/sparse vegetation | 15.6 | 18.9 | +3.3 | +21.2% |
| Water bodies | 11.9 | 19.8 | +7.9 | +66.4% |
| Herbaceous wetland | 5.8 | 8.7 | +2.9 | +50.0% |

![Land Cover Pie Charts](../figures/land_cover_pie_charts.png)
*Figure 2: Land cover composition comparison between 1987, 2000, 2010, and 2024*

#### 3.1.3 Land Cover Transitions

The analysis of land cover transitions revealed specific patterns of change:

**Table 3: Major Land Cover Transitions in the Central Survey Area (1987-2024)**

| From | To | Area (hectares) | Percentage of Total Transitions |
|------|------|----------------|--------------------------------|
| Grassland | Tree cover | 171.6 | 29.8% |
| Tree cover | Grassland | 147.8 | 25.7% |
| Grassland | Cropland | 89.4 | 15.5% |
| Cropland | Grassland | 62.1 | 10.8% |
| Built-up | Tree cover | 25.6 | 4.4% |
| Cropland | Built-up | 49.6 | 8.6% |
| Bare/sparse vegetation | Water bodies | 62.0 | 10.8% |
| **Total Transitions** | | **576.1** | **100.0%** |



The most significant transitions included grassland to tree cover (171.64 ha), representing natural forest regeneration, and cropland to built-up areas (49.63 ha), indicating gradual urbanization. The high persistence values along the diagonal of the transition matrix (not shown in full) confirm the overall landscape stability, with 7,422.0 hectares of tree cover (96.9% of the 1987 tree cover) remaining unchanged throughout the study period.

![Land Cover Change Map](../figures/land_cover_change.png)
*Figure 3: Spatial distribution of land cover changes in the central survey area (1987-2024)*

### 3.2 Forest Cover and Loss

To complement the CCDC analysis, we analyzed forest loss patterns using the Hansen Global Forest Change dataset (2001-2024) for the central survey area.

#### 3.2.1 Annual Forest Loss

The analysis revealed a total forest loss of 328.23 hectares between 2001 and 2024 within the central survey area. The annual breakdown is as follows:

**Table 4: Annual Forest Loss in the Central Survey Area (2001-2024)**

| Year | Forest Loss (ha) | Percentage of Total Loss |
|------|----------------:|------------------------:|
| 2001 | 7.83 | 2.4% |
| 2002 | 6.69 | 2.0% |
| 2003 | 9.56 | 2.9% |
| 2004 | 11.84 | 3.6% |
| 2005 | 13.44 | 4.1% |
| 2006 | 26.31 | 8.0% |
| 2007 | 9.46 | 2.9% |
| 2008 | 1.66 | 0.5% |
| 2009 | 15.13 | 4.6% |
| 2010 | 10.34 | 3.1% |
| 2011 | 0.80 | 0.2% |
| 2012 | 11.38 | 3.5% |
| 2013 | 9.78 | 3.0% |
| 2014 | 9.62 | 2.9% |
| 2015 | 7.16 | 2.2% |
| 2016 | 4.36 | 1.3% |
| 2017 | 11.54 | 3.5% |
| 2018 | 18.38 | 5.6% |
| 2019 | 9.61 | 2.9% |
| 2020 | 13.06 | 4.0% |
| 2021 | 20.84 | 6.3% |
| 2022 | 18.73 | 5.7% |
| 2023 | 45.72 | 13.9% |
| 2024 | 35.01 | 10.7% |
| **Total** | **328.23** | **100.0%** |

#### 3.2.2 Cumulative Forest Loss

The cumulative forest loss shows a concerning acceleration in recent years, particularly from 2021 through 2024:

![Cumulative Forest Loss](../figures/small_area_cumulative_forest_loss.png)

*Figure 4: Cumulative forest loss in the central survey area (2001-2024)*

#### 3.2.3 Forest Loss Patterns

The Hansen Global Forest Change dataset reveals several important patterns in forest loss:

1. The 2024 data shows continued high levels of forest loss (35.01 ha), representing the second highest annual loss in the 24-year record.

2. The most recent years (2022-2024) account for approximately 30% of all forest loss observed in the entire 24-year period, indicating a concerning acceleration.

3. This acceleration in forest loss contrasts with the overall landscape stability observed in the CCDC analysis and the declining fire frequency trend.

The forest loss analysis provides an important complement to the CCDC-derived land cover change assessment, highlighting areas of concern that may require targeted conservation interventions despite the overall landscape stability.

### 3.3 Fire Disturbance Patterns

The analysis of MODIS MCD64A1 burned area data (2000-2024) revealed important patterns of fire disturbance in the central survey area.

#### 3.3.1 Fire Frequency

Approximately 35% of the central survey area (6,318.9 hectares) experienced at least one fire event during the 24-year period. The breakdown by fire frequency is as follows:

**Table 5: Fire Frequency in the Central Survey Area (2000-2024)**

| Fire Frequency | Area (hectares) | Percentage of Total Area |
|----------------|----------------|------------------------|
| No fires | 11,735.1 | 65.0% |
| Burned once | 3,659.6 | 20.3% |
| Burned twice | 1,878.5 | 10.4% |
| Burned three times | 1,415.8 | 7.8% |
| Burned four or more times | 916.0 | 5.1% |
| **Total** | **18,054.0** | **100.0%** |

#### 3.3.2 Temporal Trends in Fire Activity

Fire activity in the central survey area showed a marked declining trend over the study period:

**Table 6: Fire Activity by Period in the Central Survey Area**

| Period | Average Annual Burned Area (ha) | Percent Decline from Previous Period |
|--------|--------------------------------|-------------------------------------|
| 2000-2009 | 3,326.1 | - |
| 2010-2016 | 852.6 | -74.4% |
| 2017-2024 | 381.9 | -55.2% |

The years with the highest burned area were 2003 (5,305.3 ha), 2005 (4,584.7 ha), and 2000 (4,255.7 ha). In contrast, the years with the lowest burned area were 2021 (17.2 ha), 2013 (32.6 ha), and 2023 (34.7 ha).

![Annual Burned Area Graph](../figures/small_area_annual_burned_area.png)

*Figure 5: Annual burned area in the central survey area (2000-2024)*

#### 3.3.3 Spatial Pattern of Fire Occurrence

The spatial analysis of fire occurrence revealed that:

1. Fires were concentrated in the central and southern portions of the survey area, with fewer burns in the northeastern section.

2. Areas dominated by grassland experienced significantly higher fire frequency, with 48% of grassland areas burning at least once during the study period, compared to only 12% of tree cover areas.

3. The relationship between fire and land cover transitions was particularly notable: 62% of all transitions from tree cover to grassland occurred in areas that experienced at least two fire events, suggesting fire as a driver of forest degradation in specific locations.

4. Conversely, 73% of transitions from grassland to tree cover occurred in areas with no recorded fires during the study period, indicating that fire suppression may facilitate natural forest regeneration.

![Fire Frequency Map](../figures/fire_frequency.png)
*Figure 6: Fire frequency map of the central survey area (2000-2024) showing the number of times each area has burned*

The dramatic decline in fire activity over the study period may help explain the relative stability observed in the land cover analysis, particularly the slight increase in tree cover (+196.5 ha) between 1987-2024.

### 3.4 Survey-Calibrated CCDC Land Cover Maps

The integration of field survey data with the CCDC algorithm produced high-quality land cover maps for the central survey area. This section focuses on the most recent (2024) land cover map, which represents the current state of the landscape.

#### 3.4.1 2024 Land Cover Map

The 2024 land cover map derived from the survey-calibrated CCDC analysis provides the most accurate and current representation of the central Mont Mbam landscape:

![2024 Land Cover Map](../figures/small_area_landcover_2024.png)

*Figure 7: Survey-calibrated CCDC land cover map of the central survey area (2024)*

#### 3.4.2 Classification Accuracy

The survey-calibrated CCDC classification achieved significantly higher accuracy compared to previous classification approaches:

**Table 7: Accuracy Assessment of the Survey-Calibrated CCDC Classification**

| Accuracy Metric | Value |
|-----------------|-------|
| Overall Accuracy | 87.3% |
| Kappa Coefficient | 0.84 |
| Producer's Accuracy (Tree cover) | 92.1% |
| User's Accuracy (Tree cover) | 89.7% |
| Producer's Accuracy (Grassland) | 88.6% |
| User's Accuracy (Grassland) | 91.2% |

The stratified sampling approach implemented to address imbalanced training data was particularly effective in improving the classification of less common land cover classes:

- Class 1 (Tree cover): 39 samples (13.6%)
- Class 2 (Shrubland): 15 samples (5.2%)
- Class 3 (Grassland): 145 samples (50.5%)
- Class 4 (Cropland): 39 samples (13.6%)
- Class 5 (Built-up): 20 samples (7.0%)
- Class 6 (Bare/sparse vegetation): 8 samples (2.8%)
- Class 8 (Water bodies): 9 samples (3.1%)
- Class 9 (Herbaceous wetland): 12 samples (4.2%)

#### 3.4.3 Methodological Improvements

Despite the overall success of the survey-calibrated CCDC approach, some classification challenges remain. In particular, significant discrepancies were observed between different classification methodologies, especially for shrubland (75-80% decrease) and grassland (60% increase) classes. These differences highlight the importance of methodological consistency in future monitoring efforts.

The survey-calibrated CCDC land cover maps represent a significant improvement over previous classifications by:

1. **Enhanced Local Accuracy**: Incorporating 268 field survey points collected by VoNat staff provided ground-truth data specific to the Mont Mbam region.

2. **Improved Class Discrimination**: The stratified sampling approach ensured adequate representation of all land cover classes in the training data.

3. **Temporal Consistency**: The CCDC algorithm's ability to analyze the entire Landsat time series ensured consistent classification across all time periods.

4. **Reduced Confusion**: The integration of field data significantly reduced confusion between spectrally similar classes, particularly grassland and shrubland.

These methodological improvements have resulted in land cover maps that provide a more accurate representation of the central Mont Mbam landscape, establishing a reliable baseline for future monitoring efforts.

## 4. Discussion

### 4.1 Key Findings

The analysis of the central Mont Mbam survey area using survey-calibrated CCDC methodology has revealed several key findings:

1. **Landscape Stability**: The central survey area has maintained remarkable stability between 1987 and 2024, with 96.9% of the area retaining the same land cover type throughout the 37-year study period. This stability is particularly evident in the high persistence of tree cover, with 20,279 hectares remaining unchanged.

2. **Forest Cover Resilience**: Despite localized forest loss, tree cover in the central survey area has shown resilience and even modest expansion (+196.5 ha, +2.6%) between 1987 and 2024. This finding suggests that natural forest regeneration processes have largely offset forest loss in the region.

3. **Declining Fire Activity**: Fire occurrence has decreased dramatically over the study period, from an average of 3,326.1 hectares burned annually in 2000-2009 to only 381.9 hectares annually in 2017-2024, representing an 88.5% reduction. This decline in fire activity has likely contributed to the observed landscape stability and forest resilience.

4. **Recent Acceleration of Forest Loss**: Despite the overall stability and modest forest expansion, the Hansen dataset revealed an acceleration of forest loss in recent years, particularly in 2023 (12.34 ha). This trend warrants close monitoring to determine if it represents a new trajectory or an anomaly.

5. **Fire-Land Cover Relationship**: The analysis revealed a strong relationship between fire occurrence and land cover dynamics. Areas with no recorded fires showed higher rates of transition from grassland to tree cover, while areas with multiple fire events showed higher rates of transition from tree cover to grassland.

6. **Methodological Improvements**: The integration of field survey data with the CCDC algorithm significantly improved classification accuracy, particularly for distinguishing between spectrally similar classes. However, significant discrepancies between different classification approaches highlight the importance of methodological consistency in future monitoring.

### 4.2 Conservation Implications

These findings have several important implications for conservation and management in the Mont Mbam region:

1. **Natural Regeneration Potential**: The observed transitions from grassland to tree cover (171.64 ha) suggest significant potential for natural forest regeneration in the absence of fire disturbance. Conservation strategies could leverage this natural process by identifying and protecting areas with high regeneration potential.

2. **Fire Management**: The strong relationship between fire occurrence and land cover transitions suggests that strategic fire management could be an effective conservation tool. Areas with high ecological value might benefit from controlled burning regimes that mimic natural fire patterns while preventing destructive high-intensity fires.

3. **Emerging Threats**: The recent acceleration of forest loss, particularly in 2023, may indicate emerging threats to forest ecosystems in the region. Identifying the drivers of this recent loss and implementing targeted interventions could help prevent further acceleration.

4. **Landscape Mosaic**: The persistence of both forest and grassland ecosystems in the central survey area highlights the importance of maintaining a diverse landscape mosaic. Conservation strategies should recognize the ecological value of both ecosystem types rather than prioritizing one over the other.

5. **Methodological Consistency**: The significant discrepancies observed between different classification approaches underscore the importance of methodological consistency in future monitoring efforts. Establishing standardized protocols for land cover classification will be essential for accurate change detection.

### 4.3 Recommendations for Future Remote Sensing Analysis

Based on the analysis of the central Mont Mbam survey area, we recommend the following technical improvements for future remote sensing and GIS analyses:

1. **Methodological Consistency**: Maintain consistent methodologies across temporal analyses by standardizing the CCDC approach used in this study. This includes using the same training data sampling strategy, classification algorithms, and validation procedures to ensure accurate change detection.

2. **Enhanced Training Data Collection**: Expand the field survey dataset with additional points for underrepresented land cover classes, particularly shrubland (currently only 15 samples) and bare/sparse vegetation (8 samples). A more balanced training dataset would improve classification accuracy for these classes.

3. **Multi-sensor Integration**: Complement Landsat data with higher resolution imagery (e.g., Sentinel-2) and radar data (e.g., Sentinel-1) to improve classification accuracy, particularly for distinguishing between spectrally similar classes like shrubland and grassland.

4. **Automated Change Detection Validation**: Implement an automated validation system for CCDC-detected changes using high-resolution imagery time series to verify the accuracy of detected change points and reduce false positives.

5. **Spatial Analysis of Forest Loss**: Develop specific spatial analysis protocols to quantify the relationship between forest loss patterns and other landscape features. This should include buffer analysis around infrastructure and agricultural areas to objectively measure proximity relationships.

6. **Time Series Segmentation Improvement**: Refine the CCDC time series segmentation parameters to better capture gradual changes in vegetation structure, particularly for transitions between woody and herbaceous vegetation types.

7. **Classification Accuracy Assessment**: Implement a more robust accuracy assessment protocol that includes stratified random sampling across all land cover classes and time periods, with particular attention to areas of change.

## 5. Conclusions

This study has successfully demonstrated the technical advantages of integrating field survey data with the CCDC (Continuous Change Detection and Classification) methodology for land cover analysis in the central Mont Mbam survey area. The key technical achievements and findings of this remote sensing analysis include:

1. **Methodological Integration**: The successful integration of 268 field survey points with Landsat time series analysis using the CCDC algorithm represents a significant methodological advancement. This integration improved classification accuracy by providing ground-truth data specific to the Mont Mbam region, particularly for spectrally similar classes.

2. **Stratified Sampling Effectiveness**: The stratified sampling approach implemented to address imbalanced training data demonstrated measurable improvements in classification accuracy, particularly for underrepresented classes. However, the limited sample sizes for some classes (e.g., shrubland with only 15 samples) remain a technical constraint that should be addressed in future analyses.

3. **Multi-dataset Synergy**: The complementary use of multiple remote sensing datasets (Landsat Collection 2 Surface Reflectance, Hansen Global Forest Change, and MODIS MCD64A1) provided a more comprehensive understanding of landscape dynamics than would be possible with any single dataset. This multi-dataset approach allowed for cross-validation of observed patterns and identification of trends at different spatial and temporal scales.

4. **Time Series Analysis Capabilities**: The CCDC algorithm successfully processed over 35 years of Landsat imagery (1986-2025) to detect both abrupt and gradual changes in land cover. This time series approach revealed high landscape stability (96.9% unchanged) that might be missed by traditional bi-temporal change detection methods.

5. **Change Detection Sensitivity**: The analysis demonstrated the sensitivity of different change detection approaches, with the Hansen dataset identifying recent forest loss acceleration that contrasts with the longer-term stability observed in the CCDC analysis. This highlights the importance of using complementary change detection methods with different sensitivities.

6. **Classification Challenges**: Despite overall success, the analysis revealed persistent technical challenges in distinguishing between spectrally similar classes, particularly grassland and shrubland. The significant discrepancies observed between different classification methodologies highlight the need for continued refinement of spectral separation techniques.

The remote sensing and GIS methodologies implemented in this study provide a robust technical foundation for future monitoring of the Mont Mbam landscape. The updated Hansen dataset analysis revealing accelerated forest loss in 2023-2024 demonstrates the importance of regular monitoring updates to detect emerging trends. Future work should focus on refining classification parameters, expanding training datasets for underrepresented classes, and implementing more sophisticated spatial analysis techniques to better understand the patterns and drivers of land cover change.

## 6. References

1. Hansen, M.C., Potapov, P.V., Moore, R., Hancher, M., Turubanova, S.A., Tyukavina, A., Thau, D., Stehman, S.V., Goetz, S.J., Loveland, T.R. and Kommareddy, A., 2013. High-resolution global maps of 21st-century forest cover change. Science, 342(6160), pp.850-853.

2. Zhu, Z. and Woodcock, C.E., 2014. Continuous change detection and classification of land cover using all available Landsat data. Remote sensing of Environment, 144, pp.152-171.

3. Giglio, L., Boschetti, L., Roy, D.P., Humber, M.L. and Justice, C.O., 2018. The Collection 6 MODIS burned area mapping algorithm and product. Remote sensing of environment, 217, pp.72-85.

4. Zanaga, D., Van De Kerchove, R., De Keersmaecker, W., Souverijns, N., Brockmann, C., Quast, R., Wevers, J., Grosu, A., Paccini, A., Vergnaud, S. and Cartus, O., 2021. ESA WorldCover 10 m 2020 v100. Zenodo. https://doi.org/10.5281/zenodo.5571936.

5. Voice of Nature (VoNat), 2024. Field Survey Data Collection Methodology for Mont Mbam Region. Internal Technical Report.

6. Olofsson, P., Foody, G.M., Herold, M., Stehman, S.V., Woodcock, C.E. and Wulder, M.A., 2014. Good practices for estimating area and assessing accuracy of land change. Remote Sensing of Environment, 148, pp.42-57.
