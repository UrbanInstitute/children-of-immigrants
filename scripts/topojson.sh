topojson -o data/states.json --id-property +STATEFP  --p name=NAME -- scripts/stateshp/cb_2014_us_state_20m.shp

topojson -o data/cbsa.json --id-property +CBSAFP --p name=NAME -- scripts/cbsashp/tl_2015_us_cbsa.shp

topojson -o data/cbsa.json --id-property +CBSAFP --p name=NAME -- scripts/coishp/coicbsa.shp

topojson -o data/metros.json --p name=name -- data/cbsa.json data/states.json