#Hannah Recht, 11-18-15
#Subset CBSA shapefile for Children of Immigrants included areas

library(dplyr)
library(rgdal)

dt<-read.csv("data/areadata.csv",stringsAsFactors = F)

#Download boundary files from Census
#States
download.file("http://www2.census.gov/geo/tiger/GENZ2014/shp/cb_2014_us_state_20m.zip", "scripts/cb_2014_us_state_20m.zip")
unzip("scripts/cb_2014_us_state_20m.zip", exdir="scripts/stateshp")

#CBSAs (see http://www.census.gov/population/metro/data/metrodef.html)
download.file("ftp://ftp2.census.gov/geo/tiger/TIGER2015/CBSA/tl_2015_us_cbsa.zip", "scripts/tl_2015_us_cbsa.zip")
unzip("scripts/tl_2015_us_cbsa.zip", exdir="scripts/cbsashp")

#Make dataset of the included CBSAs to filter shapefile
mt <- dt %>% filter(isstate==0) 
cbsas<- as.data.frame(table(mt$fips))%>% 
  rename(CBSAFP=Var1) %>% 
  select(-Freq) %>% 
  mutate(top100 = 1)

#Merge top 100 onto shapefile, subset and export new filtered shp
fullshp <- readOGR("scripts/cbsashp","tl_2015_us_cbsa")
coishp<- merge(fullshp,cbsas,by="CBSAFP", all.x=T)
coishp@data[is.na(coishp@data)] <- 0
coiinc <- coishp[coishp$top100=="1",]
plot(coiinc)
writeOGR(coiinc, dsn="scripts/coishp", layer="coicbsa", driver="ESRI Shapefile")

#Make topojson of state boundaries + included CBSAs for d3
system("bash scripts/topojson.sh")