Provide carto map visualizations via the Carto VL library.

Assumes data is in carto.

## Geocoding data
Data needs to have a `the_geom` column with a valid geometry object.

See:

https://carto.com/developers/data-services-api/reference/#geocoding-functions

https://carto.com/help/working-with-data/carto-functions/

SELECT CDB_LatLng(float, float)

To encode from lat long:

https://{USER_NAME}.carto.com/api/v2/sql?q=UPDATE {TABLE_NAME} SET the_geom = CDB_LatLng({LAT_COLUMN}, {LON_COLUMN})&api_key={API_KEY_WITH_WRITE_ACCESS}

https://paulwalker-datopian.carto.com/api/v2/sql?q=UPDATE accidents_2012_2017 SET the_geom = CDB_LatLng(loc_lat, loc_long)&api_key=Mef_QoqGyQRspq9AumGvbg

Auth: Note that the token used needs to be associated with an API user with write / update permissions
