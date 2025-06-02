# Land Cover Analysis Using Local Training Data

## Overview

This section presents the results of a land cover change analysis for the Mont Mbam region from 1987 to 2024 using CCDC (Continuous Change Detection and Classification) with only ground survey training data. Unlike the previous analysis that incorporated ESA WorldCover stratified samples, this analysis relies exclusively on field survey points with manually added Water and Wetland points based on satellite imagery and ESA WorldCover data.

## Methodology

The analysis follows the same CCDC approach as the main analysis but differs in the training data used:

1. **Training Data**: Only ground survey points collected in the field with manual additions for water and wetland classes
2. **Time Periods**: Same four time periods (1987, 2000, 2010, 2024)
3. **Classification Algorithm**: Continuous Change Detection and Classification (CCDC)
4. **Output Products**: Land cover area statistics and transition matrices

## Results

### Land Cover Distribution

The land cover distribution based on local training data shows some differences compared to the ESA WorldCover-assisted classification:

**Table 1:** Land cover area statistics based on local training data (hectares)

| Land Cover Type | 1987 | 2000 | 2010 | 2024 | Change (1987-2024) | % Change |
|-----------------|------|------|------|------|-------------------|----------|
| Tree cover | 21,109.95 | 21,109.95 | 21,154.68 | 21,322.44 | +212.49 | +1.01% |
| Shrubland | 3,265.02 | 3,265.02 | 3,270.06 | 3,270.24 | +5.22 | +0.16% |
| Grassland | 25,082.37 | 25,082.37 | 25,063.02 | 24,803.64 | -278.73 | -1.11% |
| Cropland | 8,903.25 | 8,903.25 | 8,902.62 | 8,905.41 | +2.16 | +0.02% |
| Built-up | 1,027.53 | 1,027.53 | 1,000.26 | 1,072.26 | +44.73 | +4.35% |
| Bare / sparse vegetation | 21.69 | 21.69 | 21.69 | 27.36 | +5.67 | +26.14% |
| Permanent water bodies | 2,852.28 | 2,852.28 | 2,859.66 | 2,997.90 | +145.62 | +5.10% |
| Herbaceous wetland | 3,335.76 | 3,335.76 | 3,325.86 | 3,198.60 | -137.16 | -4.11% |

### Key Findings from Local Training Data Analysis

1. **Overall Landscape Stability**: Similar to the main analysis, the landscape shows remarkable stability over the 37-year period, with approximately 92-93% of the study area maintaining the same land cover class.

2. **Tree Cover Changes**: Tree cover increased by 212.49 hectares (+1.01%) from 1987 to 2024, which is comparable to the +196.47 hectares found in the main analysis. This confirms the trend of modest forest expansion in the region.

3. **Grassland Dynamics**: Grassland decreased by 278.73 hectares (-1.11%), which aligns with the trend observed in the main analysis (-260.64 hectares). This consistency across different training datasets reinforces the finding that grassland areas are gradually transitioning to other land cover types.

4. **Built-up Area Expansion**: Built-up areas increased by 44.73 hectares (+4.35%), indicating modest urbanization or infrastructure development in the region.

5. **Water and Wetland Changes**: 
   - Water bodies increased by 145.62 hectares (+5.10%)
   - Wetlands decreased by 137.16 hectares (-4.11%)
   
   This pattern suggests potential hydrological changes, possibly with some wetland areas converting to permanent water bodies.

### Land Cover Transitions

The analysis of land cover transitions between 1987 and 2024 reveals several important patterns:

1. **High Persistence**: Most land cover classes showed high persistence, with the following areas remaining unchanged:
   - Tree cover: 20,814.04 hectares
   - Shrubland: 3,209.41 hectares
   - Grassland: 24,450.72 hectares
   - Cropland: 8,721.50 hectares
   - Built-up: 964.26 hectares
   - Bare/sparse vegetation: 21.43 hectares
   - Permanent water bodies: 2,762.31 hectares
   - Herbaceous wetland: 3,078.24 hectares

2. **Major Transitions**:
   - Grassland to Tree cover: 203.40 hectares
   - Grassland to Built-up: 51.85 hectares
   - Grassland to Cropland: 46.16 hectares
   - Water bodies to Wetland: 55.50 hectares
   - Wetland to Water bodies: 199.78 hectares

## Comparison with ESA WorldCover-Assisted Analysis

The local training data analysis generally confirms the findings from the main analysis that used ESA WorldCover stratified samples. Key similarities and differences include:

1. **Similarities**:
   - Both analyses show overall landscape stability (>90% unchanged)
   - Both confirm modest tree cover expansion (+196.47 ha vs. +212.49 ha)
   - Both show grassland reduction (-260.64 ha vs. -278.73 ha)
   - Both identify similar transition patterns, particularly grassland to tree cover

2. **Differences**:
   - The local training data classification shows higher cropland area (8,903 ha vs. approximately 4,356 ha in ESA WorldCover)
   - Built-up areas are estimated higher in the local training data classification (1,027 ha vs. 518 ha in ESA WorldCover)
   - The local training data shows more dynamic water-wetland interactions

## Implications

The consistency between analyses using different training datasets strengthens confidence in the overall findings regarding landscape stability and modest land cover changes in the Mont Mbam region. The differences in absolute area estimates highlight the sensitivity of land cover classification to training data selection, particularly for classes that may be challenging to distinguish spectrally (e.g., different types of vegetation).

The local training data analysis provides an important validation of the main findings and offers additional insights into land cover dynamics that may be more accurately represented by ground-based observations. This complementary approach enhances the robustness of the overall land cover change assessment for the Mont Mbam region.
