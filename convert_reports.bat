@echo off
echo Mont Mbam Report Converter
echo =======================
echo.
echo This tool will convert your Markdown reports to PDF and Word formats.
echo.

:menu
echo Select an option:
echo 1. Convert Central Area CCDC Report to PDF
echo 2. Convert Central Area CCDC Report to Word
echo 3. Convert Land Cover Change Analysis Report to PDF
echo 4. Convert Land Cover Change Analysis Report to Word
echo 5. Convert all reports to both formats
echo 6. Exit
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto convert_ccdc_pdf
if "%choice%"=="2" goto convert_ccdc_word
if "%choice%"=="3" goto convert_lcca_pdf
if "%choice%"=="4" goto convert_lcca_word
if "%choice%"=="5" goto convert_all
if "%choice%"=="6" goto end

echo Invalid choice. Please try again.
goto menu

:convert_ccdc_pdf
echo.
echo Converting Central Area CCDC Report to PDF...
python scripts\convert_to_pdf.py docs\reports\Central_Area_CCDC_Report.md -o docs\reports\Central_Area_CCDC_Report.pdf
echo.
echo If the conversion was successful, you can find the PDF at:
echo docs\reports\Central_Area_CCDC_Report.pdf
echo.
pause
goto menu

:convert_ccdc_word
echo.
echo Converting Central Area CCDC Report to Word...
echo Checking if Pandoc is installed...
where pandoc >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Pandoc is not installed. Please install Pandoc from https://pandoc.org/installing.html
    echo.
    pause
    goto menu
)
pandoc docs\reports\Central_Area_CCDC_Report.md -o docs\reports\Central_Area_CCDC_Report.docx
echo.
echo If the conversion was successful, you can find the Word document at:
echo docs\reports\Central_Area_CCDC_Report.docx
echo.
pause
goto menu

:convert_lcca_pdf
echo.
echo Converting Land Cover Change Analysis Report to PDF...
python scripts\convert_to_pdf.py docs\reports\Land_Cover_Change_Analysis_Report.md -o docs\reports\Land_Cover_Change_Analysis_Report.pdf
echo.
echo If the conversion was successful, you can find the PDF at:
echo docs\reports\Land_Cover_Change_Analysis_Report.pdf
echo.
pause
goto menu

:convert_lcca_word
echo.
echo Converting Land Cover Change Analysis Report to Word...
echo Checking if Pandoc is installed...
where pandoc >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Pandoc is not installed. Please install Pandoc from https://pandoc.org/installing.html
    echo.
    pause
    goto menu
)
pandoc docs\reports\Land_Cover_Change_Analysis_Report.md -o docs\reports\Land_Cover_Change_Analysis_Report.docx
echo.
echo If the conversion was successful, you can find the Word document at:
echo docs\reports\Land_Cover_Change_Analysis_Report.docx
echo.
pause
goto menu

:convert_all
echo.
echo Converting all reports to PDF and Word formats...

echo Converting Central Area CCDC Report to PDF...
python scripts\convert_to_pdf.py docs\reports\Central_Area_CCDC_Report.md -o docs\reports\Central_Area_CCDC_Report.pdf

echo Converting Central Area CCDC Report to Word...
where pandoc >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Pandoc is not installed. PDF conversion will continue, but Word conversion requires Pandoc.
    echo Please install Pandoc from https://pandoc.org/installing.html for Word conversion.
) else (
    pandoc docs\reports\Central_Area_CCDC_Report.md -o docs\reports\Central_Area_CCDC_Report.docx
)

echo Converting Land Cover Change Analysis Report to PDF...
python scripts\convert_to_pdf.py docs\reports\Land_Cover_Change_Analysis_Report.md -o docs\reports\Land_Cover_Change_Analysis_Report.pdf

echo Converting Land Cover Change Analysis Report to Word...
where pandoc >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Pandoc is not installed. PDF conversion will continue, but Word conversion requires Pandoc.
) else (
    pandoc docs\reports\Land_Cover_Change_Analysis_Report.md -o docs\reports\Land_Cover_Change_Analysis_Report.docx
)

echo.
echo Conversion complete. Check the docs\reports directory for the output files.
echo.
pause
goto menu

:end
echo.
echo Thank you for using the Mont Mbam Report Converter.
echo.
