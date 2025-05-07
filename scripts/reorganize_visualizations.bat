@echo off
echo Reorganizing visualizations for VoNat-Mont-Mbam project...

REM Create necessary directories if they don't exist
mkdir "outputs\charts_figures\land_cover_analysis" 2>nul
mkdir "outputs\charts_figures\forest_change" 2>nul
mkdir "outputs\charts_figures\current_land_cover" 2>nul

REM Copy CCDC analysis visualizations
echo Copying CCDC analysis visualizations...
copy "results\land_cover_analysis\land_cover_time_series.png" "outputs\charts_figures\land_cover_analysis\fig_time_series_1987_2024.png"
copy "results\land_cover_analysis\land_cover_stacked_bar.png" "outputs\charts_figures\land_cover_analysis\fig_composition_changes_1987_2024.png"
copy "results\land_cover_analysis\land_cover_pie_charts.png" "outputs\charts_figures\land_cover_analysis\fig_pie_charts_all_years.png"
copy "results\land_cover_analysis\transition_heatmap_1987-2000.png" "outputs\charts_figures\land_cover_analysis\fig_transition_heatmap_1987_2000.png"
copy "results\land_cover_analysis\transition_heatmap_2000-2010.png" "outputs\charts_figures\land_cover_analysis\fig_transition_heatmap_2000_2010.png"
copy "results\land_cover_analysis\transition_heatmap_2010-2024.png" "outputs\charts_figures\land_cover_analysis\fig_transition_heatmap_2010_2024.png"

REM Copy CSV files
echo Copying data files...
copy "results\land_cover_analysis\overall_changes.csv" "outputs\charts_figures\land_cover_analysis\data_overall_changes.csv"
copy "results\land_cover_analysis\transition_summary.csv" "outputs\charts_figures\land_cover_analysis\data_transition_summary.csv"
copy "results\land_cover_analysis\land_cover_analysis_report.md" "outputs\charts_figures\land_cover_analysis\report_land_cover_analysis.md"

REM Organize existing files
echo Organizing existing files...
move "outputs\charts_figures\annual_forest_loss.png" "outputs\charts_figures\forest_change\fig_annual_loss_2001_2023.png" 2>nul
move "outputs\charts_figures\cumulative_forest_loss.png" "outputs\charts_figures\forest_change\fig_cumulative_loss_2001_2023.png" 2>nul
move "outputs\charts_figures\land_cover_distribution.png" "outputs\charts_figures\current_land_cover\fig_distribution_2021.png" 2>nul

echo Reorganization complete!
echo.
echo New file structure:
echo - outputs\charts_figures\land_cover_analysis\ - CCDC analysis (1987-2024)
echo - outputs\charts_figures\forest_change\ - Hansen forest change (2000-2023)
echo - outputs\charts_figures\current_land_cover\ - WorldCover (2021)
echo.
echo Press any key to exit...
pause > nul
