# Image Hosting Information

This document contains links to externally hosted images used in the Mont Mbam project reports. These images are hosted externally due to GitHub's file size limitations and best practices for version control.

## Central Area CCDC Report Images

1. **Land Cover Map 2024**  
   ![Land Cover Map 2024](https://i.imgur.com/placeholder1.png)  
   *To update: Upload land_cover_2024.png to an image hosting service and replace the URL*

2. **Land Cover Pie Charts**  
   ![Land Cover Pie Charts](https://i.imgur.com/placeholder2.png)  
   *To update: Upload land_cover_pie_charts.png to an image hosting service and replace the URL*

3. **Land Cover Change Map**  
   ![Land Cover Change Map](https://i.imgur.com/placeholder3.png)  
   *To update: Upload land_cover_change.png to an image hosting service and replace the URL*

4. **Cumulative Forest Loss**  
   ![Cumulative Forest Loss](https://i.imgur.com/placeholder4.png)  
   *To update: Upload small_area_cumulative_forest_loss.png to an image hosting service and replace the URL*

5. **Annual Burned Area Graph**  
   ![Annual Burned Area Graph](https://i.imgur.com/placeholder5.png)  
   *To update: Upload small_area_annual_burned_area.png to an image hosting service and replace the URL*

6. **Fire Frequency Map**  
   ![Fire Frequency Map](https://i.imgur.com/placeholder6.png)  
   *To update: Upload fire_frequency.png to an image hosting service and replace the URL*

7. **2024 Land Cover Map**  
   ![2024 Land Cover Map](https://i.imgur.com/placeholder7.png)  
   *To update: Upload small_area_landcover_2024.png to an image hosting service and replace the URL*

## Instructions for Updating Image Links

1. Upload each image to an image hosting service like Imgur, ImgBB, or a cloud storage service
2. Replace the placeholder URLs in this document with the actual URLs
3. Update the image references in the report markdown files to use these URLs

## Alternative Approach: Using GitHub LFS

If you prefer to keep the images in the repository, consider using GitHub Large File Storage (LFS):

1. Install Git LFS: `git lfs install`
2. Track image files: `git lfs track "*.png"`
3. Add the .gitattributes file: `git add .gitattributes`
4. Add and commit images normally: `git add docs/figures/*.png`

This will store the images using Git LFS, which is designed for large binary files.
