# Format data for report maps
library(dplyr)
library(openxlsx)

stategrowth <- readWorkbook("data/original/Percent Growth_FIPS.xlsx", sheet="State")
metrogrowth <- readWorkbook("data/original/Percent Growth_FIPS.xlsx", sheet="Metro")

growth <- bind_rows(stategrowth, metrogrowth)

growth <- growth %>% select(FIPS, `Percent.Growth`) %>%
  rename(fips = FIPS, pctgrowth = `Percent.Growth`)

stateorigin <- readWorkbook("data/original/Most Common Origin_FIPS.xlsx", sheet=1)
stateorigin <- stateorigin %>% select(FIPS, `Most.Common.Country`) %>%
  rename(fips = FIPS, origin = `Most.Common.Country`)

printmaps <- left_join(growth, stateorigin, by="fips")
write.csv(printmaps, "data/printmapdata.csv", na="", row.names = F)