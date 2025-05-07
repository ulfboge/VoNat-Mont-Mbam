@echo off
echo Running Land Cover Analysis for Mont Mbam Region...

:: Create results directory if it doesn't exist
mkdir ..\..\results\land_cover_analysis 2>nul

:: Run the comprehensive analysis script
echo Running comprehensive analysis...
python comprehensive_analysis.py

echo Analysis complete! Results are available in the results/land_cover_analysis directory.
echo.
echo Press any key to exit...
pause > nul
