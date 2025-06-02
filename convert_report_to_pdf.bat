@echo off
echo Converting Central Area CCDC Report to PDF...
python scripts\convert_to_pdf.py docs\reports\Central_Area_CCDC_Report.md -o docs\reports\Central_Area_CCDC_Report.pdf
echo.
echo If the conversion was successful, you can find the PDF at:
echo docs\reports\Central_Area_CCDC_Report.pdf
echo.
pause
