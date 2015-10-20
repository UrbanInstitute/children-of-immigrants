#HR, 10-20-15
#Format Children of Immigrants data

library(dplyr)
library(tidyr)

states<-read.csv("../higher-ed/data/states.csv",stringsAsFactors = F)
st<-read.csv("data/original/statedata.csv",stringsAsFactors = F)
mt<-read.csv("data/original/metrodata.csv",stringsAsFactors = F)


states <- states %>% select(statefip,abbrev) %>% 
  rename(FIPS=statefip,ABBREV=abbrev)


st <- st %>% rename(NAME=StateName,ABBREV=StateCode)
st <- left_join(states,st,by="ABBREV")
#State data includes populations but percentages are coded as whole numbers
st <- st %>% filter(STATCODE != "TotalNum") %>% 
  mutate(y2006 = y2006/100, y2007=y2007/100, y2008=y2008/100, y2009=y2009/100, y2010=y2010/100, y2011=y2011/100, y2012=y2012/100, y2013=y2013/100)

mt <- mt %>% rename(NAME=MetroName,FIPS=MetroCode)
dt <- bind_rows(st,mt)
write.csv(dt, "data/areadata.csv", na="", row.names=F)