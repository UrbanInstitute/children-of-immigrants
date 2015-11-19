# Children of Immigrants data tool
Originally built in 2012. Version 2 built in 2015.
[About the data](http://datatool.urban.org/charts/datatool/pages.cfm)

## Data updates & custom topojson
* First, run [formatdata.R](scripts/formatdata.R) to combine and format separate metro & state datasets for visualization 
* Then, run [geodata.R](geodata.R) to download & unzip Census shapefiles, create subsetted CBSA shapefile that includeds analyzed CBSAs only, and create merged state + CBSA topojson
 * Requires installation of [gdal](http://www.gdal.org/) and [topojson](https://github.com/mbostock/topojson/wiki/Installation)
