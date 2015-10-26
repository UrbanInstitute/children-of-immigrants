#HR, 10-20-15
#Format Children of Immigrants data

library(dplyr)
library(tidyr)

states<-read.csv("../higher-ed/data/states.csv",stringsAsFactors = F)
st<-read.csv("data/original/InteractiveMap_State2013_10_26_2015.csv",stringsAsFactors = F)
mt<-read.csv("data/original/metrodata.csv",stringsAsFactors = F)

states <- states %>% select(statefip,abbrev) %>% rename (fips=statefip)
st <- st %>% rename(name=StateName,abbrev=StateCode,category=GROUPCODE,statcode=STATCODE,statlabel=STAT,isstate=ISSTATE)
#st[st<0]<-NA
st <- left_join(states,st,by="abbrev")

#Make data long
formatLong <- function(dt) {
  long <- dt %>% gather(year,value,10:17)
  long$year <- as.character(long$year)
  long <- long %>% mutate(year=sapply(strsplit(long$year, split='y', fixed=TRUE),function(x) (x[2])))
  long$year <- as.numeric(long$year)
  long <- long 
}
st_long <- formatLong(st)
write.csv(st_long, "data/areadata_long.csv", na="", row.names=F)

mt <- mt %>% rename(name=MetroName,fips=MetroCode,category=GROUPCODE,statcode=STATCODE,statlabel=STAT,isstate=ISSTATE)
dt <- bind_rows(st,mt)
write.csv(dt, "data/areadata.csv", na="", row.names=F)

