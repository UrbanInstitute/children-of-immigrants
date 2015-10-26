#HR, 10-20-15
#Format Children of Immigrants data

library(dplyr)
library(tidyr)

states<-read.csv("../higher-ed/data/states.csv",stringsAsFactors = F)
st<-read.csv("data/original/InteractiveMap_State2013.csv",stringsAsFactors = F)
mt<-read.csv("data/original/metrodata.csv",stringsAsFactors = F)

states <- states %>% select(statefip,abbrev) %>% 
  rename(FIPS=statefip,ABBREV=abbrev)

st <- st %>% rename(NAME=StateName,ABBREV=StateCode)
st <- left_join(states,st,by="ABBREV")
#State data includes populations but percentages are coded as whole numbers - except Percent variable
st <- st %>% replace(y2006 = y2006/100, y2007=y2007/100, y2008=y2008/100, y2009=y2009/100, y2010=y2010/100, y2011=y2011/100, y2012=y2012/100, y2013=y2013/100)
st <- st %>% mutate(y2006 = replace(y2006, STATCODE !=, y2006/100), 
       t2_05= replace(t2_05, state=="Alaska", NA),
       t2_10= replace(t2_10, state=="Alaska", NA),
       t2_15= replace(t2_15, state=="Alaska", NA),
       t2_0515= replace(t2_0515, state=="Alaska", NA))

mt <- mt %>% rename(NAME=MetroName,FIPS=MetroCode)
dt <- bind_rows(st,mt)
write.csv(dt, "data/areadata.csv", na="", row.names=F)

orig<-read.csv("data/original/InteractiveMap_State2013backup.csv",stringsAsFactors = F)
