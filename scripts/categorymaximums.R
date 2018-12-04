#Hannah Recht, 12-11-15
#Calculate maximums of each category to use as Y axis maximums

library(dplyr)
library(jsonlite)

dt<-read.csv("data/areadata.csv",stringsAsFactors = F)
#subset removing totals and NA category (from old metro data)
dts <- dt %>% filter(statcode != "perChange" & statcode != "TotalNum" & statcode != "Population" & statcode != "Percent") %>%
  select(cat, y2006, y2007, y2008, y2009, y2010, y2011, y2012, y2013, y2014, y2015, y2016, y2017)

#Calculate column maximiums by category
maxs <- dts %>% group_by(cat) %>% summarise_each(funs(max(., na.rm = TRUE)))

#Max of each row excluding cat column
maxs$max <- apply(maxs[,-1], 1, max) 
#Keep category and maximum - round up to 100% if above 90%
maxs <- maxs %>% select(cat,max) %>% 
  mutate(max=replace(max, max>=0.9, 1))

#Save as a js variable to use in d3 line charts
js <- "var catmax = {"
for (i in 1:nrow(maxs)) {
  js <- paste(js, maxs[i,1], ": ", maxs[i,2], ", ", sep="")
}
js <- substr(js, 1, nchar(js)-2) 
js <- paste(js, "};")
write(js,"data/categorymaximums.js")
