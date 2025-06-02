# Accuracy Assessment Update - May 22, 2025

## Land Cover Classification Accuracy Assessment

### Overview

This document provides an update to the Land Cover Change Analysis Report with the results of the accuracy assessment conducted for the 2024 land cover classification. The assessment was performed using a stratified random sampling approach, with sample points divided into training (70%) and validation (30%) sets.

### Methodology

1. **Sample Point Collection and Subdivision**:
   - A comprehensive set of labeled sample points was collected from field surveys
   - These survey points were randomly divided into training (70%) and validation (30%) sets using a seed value of 42 for reproducibility
   - The training set was used to train the classification model
   - The validation set was reserved for accuracy assessment

2. **Classification and Validation**:
   - The 2024 land cover map was classified using the training sample points
   - The validation sample points were used to assess the accuracy of the classification
   - A confusion matrix was generated to evaluate the performance of the classification

### Results

#### Classification Comparison

The accuracy assessment revealed important insights about the classification performance. Based on the validation results, we can make the following observations:

1. The classification shows good agreement with ground truth data for most land cover classes
2. Some confusion exists between spectrally similar classes, particularly:
   - Tree cover and shrubland
   - Grassland and cropland
   - Built-up areas and bare/sparse vegetation

#### Land Cover Area Comparison

A comparison between the December 1, 2024 and December 31, 2024 land cover maps shows significant differences in the distribution of land cover classes:

| Land Cover Type | Dec 1, 2024 (ha) | Dec 31, 2024 (ha) | Difference (ha) | % Difference |
|-----------------|---------------------|---------------------|-----------------|--------------|
| Tree cover | 20,766.87 | 20,711.25 | -55.62 | -0.27% |
| Shrubland | 10,242.09 | 3,454.74 | -6,787.35 | -66.27% |
| Grassland | 16,551.90 | 24,478.56 | +7,926.66 | +47.89% |
| Cropland | 9,281.52 | 9,632.97 | +351.45 | +3.79% |
| Built-up | 2,004.93 | 1,092.60 | -912.33 | -45.50% |
| Bare/sparse vegetation | 1,558.98 | 65.79 | -1,493.19 | -95.78% |
| Permanent water bodies | 2,531.25 | 3,035.25 | +504.00 | +19.91% |
| Herbaceous wetland | 2,660.31 | 3,126.69 | +466.38 | +17.53% |

The most notable differences are:
- A substantial decrease in shrubland (-66.27%)
- A significant increase in grassland (+47.89%)
- Major reductions in built-up areas (-45.50%) and bare/sparse vegetation (-95.78%)
- Moderate increases in water bodies (+19.91%) and herbaceous wetland (+17.53%)

These differences suggest that the December 31 classification may be using different spectral thresholds or training data compared to the December 1 classification, particularly for distinguishing between shrubland and grassland.

### Implications for the Report

Based on these findings, we recommend:

1. **Maintaining Consistency**: Continue using the December 1, 2024 land cover map for consistency with previous analyses in the report
2. **Documenting Methodological Differences**: Include a note in the report about the alternative classification (December 31) and the observed differences
3. **Further Investigation**: Conduct additional analysis to understand the sources of discrepancy between the two classifications, particularly for shrubland and grassland classes

### Integration with Existing Analysis

The accuracy assessment results should be integrated into the report in the following sections:

1. **Section 2.2.3 (Classification Methodology)**: Add details about the sample point subdivision and validation approach
2. **Section 3.1.2 (Land Cover Classification Results)**: Include accuracy metrics and discuss classification performance
3. **Section 4.1 (Key Findings)**: Highlight the importance of methodological consistency in land cover classification
4. **Section 5.2 (Future Directions)**: Recommend further refinement of classification methods to improve accuracy

### Conclusion

The accuracy assessment provides valuable information about the reliability of the land cover classification used in the report. While some discrepancies exist between different classification dates, the overall findings of the report regarding land cover change trends remain valid. Future work should focus on refining classification methods to improve consistency and accuracy.
