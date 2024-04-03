#Hannah Recht, 10-20-15
#Format Children of Immigrants data
#Two original CSVs: state-level and CBSA-level (100 most populous)
#End result: areadata.csv has rows for each geography*metric with columns for each year of data (2007-2013)
#Use original statcodes but create new metric categories and numbers for grouping

library(dplyr)
library(tidyr)
library(doBy)

states <- read.csv("data/states.csv",stringsAsFactors = F)
st <- read.csv("data/InteractiveMap_wSameSexParents_State2022.csv",stringsAsFactors = F)
mt <- read.csv("data/InteractiveMap_wSameSexParents_Metro2022.csv",stringsAsFactors = F)

colnames(st) <- tolower(colnames(st))
colnames(mt) <- tolower(colnames(mt))

########################################################################################################
# Make dataset of the metrics used and their descriptions - make new category/level variables for vis
# Reimport after editing for merge
########################################################################################################

# Export metrics for editing - only need to do once
#metrics <- summaryBy(isstate ~ category + statcode + statistics_label + statlabel + statid, data=st) %>% 
#  select(-isstate.mean) %>% 
#  arrange(statid)
#write.csv(metrics, "data/metrics.csv", na="", row.names=F)

#join new metric ids to wide data
metrics<-read.csv("data/metrics_edited.csv", stringsAsFactors = F)
metrics <- metrics %>% select(statcode,cat,catnum,level)

########################################################################################################
# Format & join datasets 
########################################################################################################

states <- states %>% select(fips,abbrev)
st <- st %>% rename(name=statename,abbrev=statecode) 
st <- left_join(states,st,by="abbrev")
st <- st %>% select(fips,name,isstate,abbrev, statcode, starts_with("y2"))

mt <- mt %>% rename(name=metroname,fips=metrocode) %>%
  select(fips,name,isstate, statcode, starts_with("y2"))

dt <- bind_rows(st,mt)
#low sample size flag: -97, -98
dt[dt == -97] <- NA
dt[dt == -98] <- NA

dt <- left_join(dt,metrics,by="statcode")
dt <- dt %>% select(c(cat,catnum,level,statcode,fips,abbrev,name),everything()) %>% 
  arrange(catnum,level) %>% 
  #Island in RI wasn't capitalized
  mutate(name=replace(name, fips==44, "Rhode Island")) %>%
  filter(is.na(fips) == FALSE)

write.csv(dt, "data/areadata.csv", na="", row.names=F)
