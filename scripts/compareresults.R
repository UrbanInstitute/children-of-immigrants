#Hannah Recht, 11-12-15
#Compare metro-level results of previous SAS programs vs current Stata program to see differences

library(haven)
library(dplyr)
library(compare)
library(openxlsx)
library(doBy)

sas <- read.csv("data/original/data2010metro.csv", stringsAsFactors = F)
stata <- read.csv("data/original/state chartbook CBSA 2009_2010.csv", stringsAsFactors = F)

sas <- sas %>% arrange(metro08, StatID, number)
stata <- stata %>% arrange(metro13, StatID, number)

compare(sas,stata,ignoreColOrder = T,ignoreCase = T)

#children of immigrant parents
sas1 <- sas %>% select(metro08, metronm, all_children,StatID,number,children_imm_parents)
stata1 <- stata %>% select(metro13, metronm, all_children,statname,StatID,number,children_imm_parents)
imm_par <- left_join(sas1,stata1,by=c("metronm", "StatID", "number"))
imm_par <- imm_par %>% select(c(metro08,metronm,statname,StatID,number,all_children.x,all_children.y), everything()) %>%
  mutate(all_diff = all_children.x - all_children.y, coi_diff = children_imm_parents.x - children_imm_parents.y)
imm_num <- imm_par %>% filter(number==1)
imm_pct <- imm_par %>% filter(number==0)

summary(imm_num$all_diff)
summary(imm_num$coi_diff)
summary(imm_pct$all_diff)
summary(imm_pct$coi_diff)

write.csv(imm_num, "data/original/totaldifferences.csv", na="", row.names=F)

diff <- imm_num %>% filter(all_diff!=0)
diffmetros <- as.data.frame(table(diff$metro08))
colnames(diffmetros) = c("metro08", "nonmatch")
summary(diff$all_diff)
diffstats <- as.data.frame(table(diff$statname))
colnames(diffstats) = c("statname", "nonmatch")

#Compare with puma->cbsa crosswalk
pumas<-read_dta("/Volumes/COI/Test/PUMAtoCBSA_2000_full.dta")
temp <- pumas %>% filter(pumaAFACT00 <1 & top100==1)
pcnomatch <- as.data.frame(table(temp$metro08))

#Check latest cbsa run
dt <- read.csv("data/original/state chartbook CBSA 2009_2010.csv", stringsAsFactors = F)
cbsas <- summaryBy(cbsa ~ cbsaname, data=dt)
#See if metro ids match shapefile
library(rgdal)
fullshp <- readOGR("scripts/cbsashp","tl_2015_us_cbsa")
allcbsas <- as.data.frame(fullshp$CBSAFP)
colnames(allcbsas) <- "cbsa"
allcbsas$cbsa <- as.character(allcbsas$cbsa)
allcbsas$cbsa <- as.numeric(allcbsas$cbsa)
allcbsas <- allcbsas %>% mutate(shp=1)
right <- right_join(allcbsas,cbsas,by=c("cbsa"="cbsa.mean"))
both <- inner_join(allcbsas,cbsas,by=c("cbsa"="cbsa.mean"))