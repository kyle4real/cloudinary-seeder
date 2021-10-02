# Cloudinary Seeder

A seeder for bulk image upload to cloudinary along with creating JSON file that correlates image file names to the created cloudinary URL.

## Setup

-   dotenv
    -   see dotenv example
-   data folder
    -   create folder titled 'data' in root
-   image folder
    -   create folder titled 'all-product-images' and nest a 'png' folder where all image files are to be put

## Usage

-   Check out the seeder.js file in cloudinary seeder
    -   Build json file -> configure keys in the seeder functions so that the file names correlate with the filePaths
-   To begin upload, in root, run:

```
node cloudinary-seeder/seeder.js -upload
```
