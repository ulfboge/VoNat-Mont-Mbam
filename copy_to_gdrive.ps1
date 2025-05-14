# PowerShell script to copy files from the GitHub repository to Google Drive
# Created: May 8, 2025

$repoPath = "C:\Users\galag\GitHub\VoNat-Mont-Mbam"
$drivePath = "H:\My Drive\Mont-Mbam-Project"

# Ensure the target directories exist
$directories = @(
    "$drivePath\1_Technical_Documentation\Data_Processing_Workflows",
    "$drivePath\1_Technical_Documentation\Analysis_Methods",
    "$drivePath\1_Technical_Documentation\Quality_Assurance",
    "$drivePath\2_Supporting_Data\Maps_and_Figures",
    "$drivePath\2_Supporting_Data\Statistical_Analyses",
    "$drivePath\3_Additional_Resources\Project_Documentation",
    "$drivePath\3_Additional_Resources\Related_Studies"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -Path $dir -ItemType Directory -Force
        Write-Host "Created directory: $dir"
    }
}

# 1. Technical Documentation - Data Processing Workflows
Write-Host "Copying data processing workflows..."
Copy-Item -Path "$repoPath\scripts\gee_scripts\*" -Destination "$drivePath\1_Technical_Documentation\Data_Processing_Workflows\" -Recurse -Force
Copy-Item -Path "$repoPath\scripts\analysis\*" -Destination "$drivePath\1_Technical_Documentation\Data_Processing_Workflows\" -Recurse -Force

# 2. Technical Documentation - Analysis Methods
Write-Host "Copying analysis methods..."
Copy-Item -Path "$repoPath\scripts\python_scripts\*" -Destination "$drivePath\1_Technical_Documentation\Analysis_Methods\" -Recurse -Force
# Create a README file explaining the analysis methods
@"
# Analysis Methods

This folder contains scripts and documentation related to the analysis methods used in the Mont Mbam Land Cover Change Analysis project.

The analysis methods include:
- Land cover classification using CCDC algorithm
- Change detection analysis
- Fire frequency analysis
- Statistical analysis of land cover transitions
- Visualization methods for results presentation
"@ | Out-File -FilePath "$drivePath\1_Technical_Documentation\Analysis_Methods\README.md" -Encoding utf8

# 3. Technical Documentation - Quality Assurance
Write-Host "Copying quality assurance materials..."
# Create a README file explaining the quality assurance procedures
@"
# Quality Assurance Procedures

This folder contains documentation related to the quality assurance procedures used in the Mont Mbam Land Cover Change Analysis project.

The quality assurance procedures include:
- Accuracy assessment methods
- Validation protocols
- Error matrices
- Ground truth data collection and verification
"@ | Out-File -FilePath "$drivePath\1_Technical_Documentation\Quality_Assurance\README.md" -Encoding utf8
# Copy GPS points data which is used for validation
Copy-Item -Path "$repoPath\data\raw\gps_points\*" -Destination "$drivePath\1_Technical_Documentation\Quality_Assurance\" -Recurse -Force

# 4. Supporting Data - Maps and Figures
Write-Host "Copying maps and figures..."
Copy-Item -Path "$repoPath\outputs\maps\*" -Destination "$drivePath\2_Supporting_Data\Maps_and_Figures\" -Recurse -Force
if (Test-Path "$repoPath\python_scripts\outputs\charts_figures") {
    Copy-Item -Path "$repoPath\python_scripts\outputs\charts_figures\*" -Destination "$drivePath\2_Supporting_Data\Maps_and_Figures\" -Recurse -Force
}

# 5. Supporting Data - Statistical Analyses
Write-Host "Copying statistical analyses..."
Copy-Item -Path "$repoPath\data\*.csv" -Destination "$drivePath\2_Supporting_Data\Statistical_Analyses\" -Recurse -Force

# 6. Additional Resources - Project Documentation
Write-Host "Copying project documentation..."
Copy-Item -Path "$repoPath\docs\reports\Land_Cover_Change_Analysis_Report.md" -Destination "$drivePath\3_Additional_Resources\Project_Documentation\" -Force
Copy-Item -Path "$repoPath\docs\proposal\*" -Destination "$drivePath\3_Additional_Resources\Project_Documentation\" -Recurse -Force
Copy-Item -Path "$repoPath\README.md" -Destination "$drivePath\3_Additional_Resources\Project_Documentation\Project_README.md" -Force

# 7. Additional Resources - Related Studies
Write-Host "Copying related studies..."
Copy-Item -Path "$repoPath\references\*" -Destination "$drivePath\3_Additional_Resources\Related_Studies\" -Recurse -Force
# Create a README file for related studies
@"
# Related Studies

This folder contains references and related studies relevant to the Mont Mbam Land Cover Change Analysis project.

These studies provide context for interpreting the current findings and identifying knowledge gaps in the research area.
"@ | Out-File -FilePath "$drivePath\3_Additional_Resources\Related_Studies\README.md" -Encoding utf8

# Create a main README file for the Google Drive folder
@"
# Mont Mbam Land Cover Change Analysis Project

This Google Drive folder contains supporting materials, technical documentation, and additional resources for the Mont Mbam Land Cover Change Analysis project.

## Folder Structure

1. **Technical Documentation**
   - Data Processing Workflows: Scripts and documentation for data processing
   - Analysis Methods: Scripts and documentation for analysis methods
   - Quality Assurance: Documentation of accuracy assessment and validation procedures

2. **Supporting Data**
   - Maps and Figures: High-resolution maps and visualization products
   - Statistical Analyses: Detailed statistical tables and charts

3. **Additional Resources**
   - Project Documentation: Project reports and technical documentation
   - Related Studies: References to previous research

## GitHub Repository

The code and version-controlled files for this project are available in the GitHub repository:
[VoNat-Mont-Mbam](https://github.com/ulfboge/VoNat-Mont-Mbam)

Last updated: $(Get-Date -Format "MMMM d, yyyy")
"@ | Out-File -FilePath "$drivePath\README.md" -Encoding utf8

Write-Host "File copying complete!"
Write-Host "Google Drive folder is now ready at: $drivePath"
