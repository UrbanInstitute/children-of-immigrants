#Hannah Recht, 12-11-15
#Calculate maximums of each category to use as Y axis maximums

library(dplyr)
library(doBy)
library(jsonlite)

dt<-read.csv("data/areadata.csv",stringsAsFactors = F)
#subset removing totals and NA category (from old metro data)
dts <- dt %>% filter(statcode != "perChange" & statcode != "TotalNum")

#Calculate column maximiums by category
maxs <- summaryBy(y2006+y2007+y2008+y2009+y2010+y2011+y2012+y2013 ~ cat, data=dts, FUN=max, na.rm=TRUE)
#Max of each row excluding catnum column
maxs$max <- apply(maxs[,-1], 1, max) 
#Keep category and maximum - round up to 100% if above 90%
maxs <- maxs %>% select(cat,max) %>% 
  mutate(max=replace(max, max>=0.9, 1))

#Save as a js variable to use in d3 line charts
items <- paste(maxs[,1], ":", maxs[,2], ",", sep="")
js <- "var catmax = {"

for (i in 1:length(items)) {
  js <- paste(js, items[i], sep="")
}
js <- substr(js, 1, nchar(js)-1) 
js <- paste(js, "};")
write(js,"data/catmax.js")