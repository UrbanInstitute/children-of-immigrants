# Children of Immigrants data viz
Version 2 built in 2015, originally built in 2012.
[Appendix](http://webapp.urban.org/charts/datatool/pages.cfm)

## Data updates
* First, run [formatdata.R](scripts/formatdata.R) to format and combine separate metro & state datasets for visualization, saved in [areadata.csv](data/areadata.csv)
 * If numbers change siginificantly, run [categorymaximums.R](scripts/categorymaximums.R) to update Y axis max values used in visualization, which are saved in [categorymaximums.js](data/categorymaximums.js)
* Then, if included CBSAs have changed, run [geodata.R](scripts/geodata.R) to download & unzip Census shapefiles, create subsetted CBSA shapefile that includes analyzed CBSAs only, and create merged state + CBSA topojson
 * Requires installation of [gdal](http://www.gdal.org/) and [topojson](https://github.com/mbostock/topojson/wiki/Installation)
* Edit [text.js](js/text.js) to update metric labels and category text as needed