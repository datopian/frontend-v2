'use string'
const nock = require('nock')


module.exports.initMocks = function() {
  // Uncomment this line if you want to record API calls
  // nock.recorder.rec()


  // Mocks for standalone version:
  nock('http://127.0.0.1:5000', {"encodedQueryParams":true})
    .persist()
    .post('/api/3/action/package_search', {"facet.field":["organization","groups","tags","res_format","license_id"],"facet.limit":5})
    .reply(200, {
      "help": "http://127.0.0.1:5000/api/3/action/help_show?name=package_search",
      "success": true,
      "result": {
        "count": 4,
        "sort": "title_string asc",
        "facets": {
          "organization": {
            "test_org_00": 2
          },
          "license_id": {},
          "res_format": {
            "CSV": 1
          },
          "groups": {},
          "tags": {}
        },
        "results": [
          {
            "license_title": null,
            "maintainer": null,
            "relationships_as_object": [],
            "private": false,
            "maintainer_email": null,
            "num_tags": 0,
            "update_frequency": "P1D",
            "id": "d2d18eea-d98a-4f9a-a580-13131e2a88dc",
            "metadata_created": "2019-06-10T13:09:12.713162",
            "metadata_modified": "2019-06-10T13:12:22.161302",
            "author": "Energinet",
            "author_email": "energidata@energinet.dk",
            "state": "active",
            "version": "2017",
            "creator_user_id": "5a6c2aa5-dece-4792-adfd-b825978f321f",
            "type": "dataset",
            "resources": [
              {
                "cache_last_updated": null,
                "package_id": "d2d18eea-d98a-4f9a-a580-13131e2a88dc",
                "filters": "[]",
                "datastore_active": true,
                "id": "42c7a4f1-f755-450f-9b5b-31b6085b9b19",
                "size": null,
                "state": "active",
                "schema": "{'fields': [{'type': 'text', 'name': 'Country Name', 'id': 'Country Name'}, {'type': 'text', 'name': 'Country Code', 'id': 'Country Code'}, {'type': 'float', 'name': 'Year', 'id': 'Year'}, {'info': {'notes': 'GDP in current USD'}, 'type': 'float', 'id': 'Value', 'name': 'Value', 'description': 'GDP in current USD'}]}",
                "hash": "",
                "description": "",
                "format": "CSV",
                "last_modified": "2019-06-10T13:12:22.080475",
                "url_type": "datastore",
                "attributes": "[]",
                "path": "data/gdp.csv",
                "mimetype": null,
                "cache_url": null,
                "name": "gdp",
                "created": "2019-06-10T13:09:13.613813",
                "url": "http://127.0.0.1:5000/datastore/dump/42c7a4f1-f755-450f-9b5b-31b6085b9b19",
                "mimetype_inner": null,
                "position": 0,
                "revision_id": "a81405b5-fe0b-49c5-845a-82bb0b01a843",
                "resource_type": null
              }
            ],
            "num_resources": 1,
            "tags": [],
            "groups": [],
            "license_id": null,
            "relationships_as_subject": [],
            "organization": {
              "description": "Just another test organization.",
              "created": "2019-03-27T21:26:27.501417",
              "title": "Test Organization",
              "name": "test_org_00",
              "is_organization": true,
              "state": "active",
              "image_url": "http://placekitten.com/g/200/100",
              "revision_id": "24612477-8155-497c-9e8d-5fef03f94c52",
              "type": "organization",
              "id": "2669d62a-f122-4256-9382-21c260ceef40",
              "approval_status": "approved"
            },
            "name": "gdp",
            "isopen": false,
            "url": null,
            "notes": "Country, regional and world GDP in current US Dollars ($). Regional means collections of countries e.g. Europe & Central Asia. Data is sourced from the World Bank and turned into a standard normalized CSV.",
            "owner_org": "2669d62a-f122-4256-9382-21c260ceef40",
            "title": "Country, Regional and World GDP (Gross Domestic Product)",
            "revision_id": "1820bf3f-082d-4119-a0ab-0e1dfae1bb3c",
            "resolution": "One hour (PT1H)"
          },
          {
            "license_title": null,
            "maintainer": null,
            "relationships_as_object": [],
            "private": false,
            "maintainer_email": null,
            "num_tags": 0,
            "update_frequency": "P1D",
            "id": "223a978e-8f40-4277-ba6f-9127b9e98e9e",
            "metadata_created": "2019-06-10T13:22:02.718193",
            "metadata_modified": "2019-06-10T13:23:43.580947",
            "author": "Energinet",
            "author_email": "energidata@energinet.dk",
            "state": "active",
            "version": null,
            "creator_user_id": "5a6c2aa5-dece-4792-adfd-b825978f321f",
            "type": "dataset",
            "resources": [
              {
                "cache_last_updated": null,
                "package_id": "223a978e-8f40-4277-ba6f-9127b9e98e9e",
                "filters": "[]",
                "datastore_active": true,
                "id": "bd9adb32-e96d-4002-8efb-688eae64b065",
                "size": null,
                "state": "active",
                "schema": "{'fields': [{'type': 'text', 'name': 'Country Name', 'id': 'Country Name'}, {'type': 'text', 'name': 'Country Code', 'id': 'Country Code'}, {'type': 'float', 'name': 'Year', 'id': 'Year'}, {'type': 'float', 'name': 'Value', 'id': 'Value'}]}",
                "hash": "",
                "description": "",
                "format": "CSV",
                "last_modified": "2019-06-10T13:23:43.520760",
                "url_type": "datastore",
                "attributes": "[]",
                "path": "data/population.csv",
                "mimetype": null,
                "cache_url": null,
                "name": "population",
                "created": "2019-06-10T13:22:03.166187",
                "url": "http://127.0.0.1:5000/datastore/dump/bd9adb32-e96d-4002-8efb-688eae64b065",
                "mimetype_inner": null,
                "position": 0,
                "revision_id": "9c20df7e-84fb-48f9-954b-c7cb56ceef3b",
                "resource_type": null
              }
            ],
            "num_resources": 1,
            "tags": [],
            "groups": [],
            "license_id": null,
            "relationships_as_subject": [],
            "organization": {
              "description": "Just another test organization.",
              "created": "2019-03-27T21:26:27.501417",
              "title": "Test Organization",
              "name": "test_org_00",
              "is_organization": true,
              "state": "active",
              "image_url": "http://placekitten.com/g/200/100",
              "revision_id": "24612477-8155-497c-9e8d-5fef03f94c52",
              "type": "organization",
              "id": "2669d62a-f122-4256-9382-21c260ceef40",
              "approval_status": "approved"
            },
            "name": "population",
            "isopen": false,
            "url": null,
            "notes": "Population figures for countries, regions (e.g. Asia) and the world. Data comes originally from World Bank and has been converted into standard CSV.",
            "owner_org": "2669d62a-f122-4256-9382-21c260ceef40",
            "title": "Population figures for countries, regions (e.g. Asia) and the world",
            "revision_id": "421e6b78-524c-4c9b-92bc-e77c50280dab",
            "resolution": "One hour (PT1H)"
          },
          {
            "license_title": null,
            "maintainer": null,
            "relationships_as_object": [],
            "private": false,
            "maintainer_email": null,
            "num_tags": 0,
            "update_frequency": "P1D",
            "id": "223a978e-8f40-4277-ba6f-9127b9e98e9e",
            "metadata_created": "2019-07-05T13:22:02.718193",
            "metadata_modified": "2019-07-05T13:23:43.580947",
            "author": "Energinet",
            "author_email": "energidata@energinet.dk",
            "state": "active",
            "version": null,
            "creator_user_id": "5a6c2aa5-dece-4792-adfd-b825978f321f",
            "type": "dataset",
            "resources": [
              {
                "cache_last_updated": null,
                "package_id": "fake-pkg-id",
                "filters": "[]",
                "datastore_active": true,
                "id": "fake-res-id",
                "size": "51654",
                "state": "active",
                "hash": "",
                "description": "This is a test GeoJSON resource",
                "format": "geojson",
                "last_modified": "2019-07-05T13:23:43.520760",
                "url_type": "",
                "attributes": "[]",
                "path": "data/map.geojson",
                "mimetype": null,
                "cache_url": null,
                "name": "geojson",
                "created": "2019-07-05T13:22:03.166187",
                "url": "http://127.0.0.1:5000/filestore/geojson-file.geojson",
                "mimetype_inner": null,
                "position": 0,
                "revision_id": "9c20df7e-84fb-48f9-954b-c7cb56ceef3b",
                "resource_type": null
              }
            ],
            "num_resources": 1,
            "tags": [],
            "groups": [],
            "license_id": null,
            "relationships_as_subject": [],
            "organization": {
              "description": "Just another test organization.",
              "created": "2019-03-27T21:26:27.501417",
              "title": "Test Organization",
              "name": "test_org_00",
              "is_organization": true,
              "state": "active",
              "image_url": "http://placekitten.com/g/200/100",
              "revision_id": "24612477-8155-497c-9e8d-5fef03f94c52",
              "type": "organization",
              "id": "2669d62a-f122-4256-9382-21c260ceef40",
              "approval_status": "approved"
            },
            "name": "geojson",
            "isopen": false,
            "url": null,
            "notes": "This is an example dataset that demonstrates how to package up GeoJSON data and display it on the map. We are using GeoJSON data for United Kingdom.",
            "owner_org": "2669d62a-f122-4256-9382-21c260ceef40",
            "title": "GeoJSON example",
            "revision_id": "421e6b78-524c-4c9b-92bc-e77c50280dab",
            "resolution": "One hour (PT1H)"
          },
          {
            "license_title": null,
            "maintainer": null,
            "relationships_as_object": [],
            "private": false,
            "maintainer_email": null,
            "num_tags": 0,
            "update_frequency": "P1D",
            "id": "223a978e-8f40-4277-ba6f-9127b9e98e9e",
            "metadata_created": "2019-07-05T13:22:02.718193",
            "metadata_modified": "2019-07-05T13:23:43.580947",
            "author": "Energinet",
            "author_email": "energidata@energinet.dk",
            "state": "active",
            "version": null,
            "creator_user_id": "5a6c2aa5-dece-4792-adfd-b825978f321f",
            "type": "dataset",
            "resources": [
              {
                "cache_last_updated": null,
                "package_id": "fake-pkg-id",
                "filters": "[]",
                "datastore_active": true,
                "id": "fake-res-id",
                "size": "51654",
                "state": "active",
                "hash": "",
                "description": "This is a test PDF resource",
                "format": "pdf",
                "last_modified": "2019-07-05T13:23:43.520760",
                "url_type": "",
                "attributes": "[]",
                "mimetype": null,
                "cache_url": null,
                "name": "pdf",
                "created": "2019-07-05T13:22:03.166187",
                "url": "http://www.africau.edu/images/default/sample.pdf",
                "mimetype_inner": null,
                "position": 0,
                "revision_id": "9c20df7e-84fb-48f9-954b-c7cb56ceef3b",
                "resource_type": null
              }
            ],
            "num_resources": 1,
            "tags": [],
            "groups": [],
            "license_id": null,
            "relationships_as_subject": [],
            "organization": {
              "description": "Just another test organization.",
              "created": "2019-03-27T21:26:27.501417",
              "title": "Test Organization",
              "name": "test_org_00",
              "is_organization": true,
              "state": "active",
              "image_url": "http://placekitten.com/g/200/100",
              "revision_id": "24612477-8155-497c-9e8d-5fef03f94c52",
              "type": "organization",
              "id": "2669d62a-f122-4256-9382-21c260ceef40",
              "approval_status": "approved"
            },
            "name": "pdf",
            "isopen": false,
            "url": null,
            "notes": "PDF example",
            "owner_org": "2669d62a-f122-4256-9382-21c260ceef40",
            "title": "PDF example",
            "revision_id": "421e6b78-524c-4c9b-92bc-e77c50280dab",
            "resolution": "One hour (PT1H)"
          }
        ],
        "search_facets": {
          "organization": {
            "items": [
              {
                "count": 2,
                "display_name": "Test Organization",
                "name": "test_org_00"
              }
            ],
            "title": "organization"
          },
          "tags": {
            "items": [],
            "title": "tags"
          },
          "groups": {
            "items": [],
            "title": "groups"
          },
          "res_format": {
            "items": [
              {
                "count": 1,
                "display_name": "CSV",
                "name": "CSV"
              }
            ],
            "title": "res_format"
          },
          "license_id": {
            "items": [],
            "title": "license_id"
          }
        }
      }
    }, [ 'Server',
    'PasteWSGIServer/0.5 Python/2.7.12',
    'Date',
    'Mon, 10 Jun 2019 13:29:35 GMT',
    'Content-Type',
    'application/json;charset=utf-8',
    'Content-Length',
    '5521' ])

  nock('http://127.0.0.1:5000', {"encodedQueryParams":true})
    .persist()
    .post('/api/3/action/package_search', {"q":"gdp","sort":"score desc","facet.field":["organization","groups","tags","res_format","license_id"],"facet.limit":5})
    .reply(200, {"help":"http://127.0.0.1:5000/api/3/action/help_show?name=package_search","success":true,"result":{"count":1,"sort":"score desc","facets":{"organization":{"test_org_00":1},"license_id":{},"res_format":{},"groups":{},"tags":{}},"results":[{"license_title":null,"maintainer":null,"relationships_as_object":[],"private":false,"maintainer_email":null,"num_tags":0,"update_frequency":"P1D","id":"d2d18eea-d98a-4f9a-a580-13131e2a88dc","metadata_created":"2019-06-10T13:09:12.713162","metadata_modified":"2019-06-10T13:12:22.161302","author":"Energinet","author_email":"energidata@energinet.dk","state":"active","version":"2017","creator_user_id":"5a6c2aa5-dece-4792-adfd-b825978f321f","type":"dataset","resources":[{"cache_last_updated":null,"package_id":"d2d18eea-d98a-4f9a-a580-13131e2a88dc","filters":"[]","datastore_active":true,"id":"42c7a4f1-f755-450f-9b5b-31b6085b9b19","size":null,"state":"active","schema":"{'fields': [{'type': 'text', 'name': 'Country Name', 'id': 'Country Name'}, {'type': 'text', 'name': 'Country Code', 'id': 'Country Code'}, {'type': 'float', 'name': 'Year', 'id': 'Year'}, {'info': {'notes': 'GDP in current USD'}, 'type': 'float', 'id': 'Value', 'name': 'Value', 'description': 'GDP in current USD'}]}","hash":"","description":"","format":"CSV","last_modified":"2019-06-10T13:12:22.080475","url_type":"datastore","attributes":"[]","path":"data/gdp.csv","mimetype":null,"cache_url":null,"name":"gdp","created":"2019-06-10T13:09:13.613813","url":"http://127.0.0.1:5000/datastore/dump/42c7a4f1-f755-450f-9b5b-31b6085b9b19","mimetype_inner":null,"position":0,"revision_id":"a81405b5-fe0b-49c5-845a-82bb0b01a843","resource_type":null}],"num_resources":1,"tags":[],"groups":[],"license_id":null,"relationships_as_subject":[],"organization":{"description":"Just another test organization.","created":"2019-03-27T21:26:27.501417","title":"Test Organization","name":"test_org_00","is_organization":true,"state":"active","image_url":"http://placekitten.com/g/200/100","revision_id":"24612477-8155-497c-9e8d-5fef03f94c52","type":"organization","id":"2669d62a-f122-4256-9382-21c260ceef40","approval_status":"approved"},"name":"gdp","isopen":false,"url":null,"notes":"Country, regional and world GDP in current US Dollars ($). Regional means collections of countries e.g. Europe & Central Asia. Data is sourced from the World Bank and turned into a standard normalized CSV.","owner_org":"2669d62a-f122-4256-9382-21c260ceef40","title":"Country, Regional and World GDP (Gross Domestic Product)","revision_id":"1820bf3f-082d-4119-a0ab-0e1dfae1bb3c","resolution":"One hour (PT1H)"}],"search_facets":{"organization":{"items":[{"count":1,"display_name":"Test Organization","name":"test_org_00"}],"title":"organization"},"tags":{"items":[],"title":"tags"},"groups":{"items":[],"title":"groups"},"res_format":{"items":[],"title":"res_format"},"license_id":{"items":[],"title":"license_id"}}}}, [ 'Server',
    'PasteWSGIServer/0.5 Python/2.7.12',
    'Date',
    'Mon, 10 Jun 2019 13:30:40 GMT',
    'Content-Type',
    'application/json;charset=utf-8',
    'Content-Length',
    '3078' ])

  nock('http://127.0.0.1:5000', {"encodedQueryParams":true})
    .persist()
    .post('/api/3/action/package_show', {"name_or_id":"gdp"})
    .reply(200, {"help":"http://127.0.0.1:5000/api/3/action/help_show?name=package_show","success":true,"result":{"license_title":null,"maintainer":null,"relationships_as_object":[],"private":false,"maintainer_email":null,"num_tags":0,"update_frequency":"P1D","id":"d2d18eea-d98a-4f9a-a580-13131e2a88dc","metadata_created":"2019-06-10T13:09:12.713162","metadata_modified":"2019-06-10T13:12:22.161302","author":"Energinet","author_email":"energidata@energinet.dk","state":"active","version":"2017","creator_user_id":"5a6c2aa5-dece-4792-adfd-b825978f321f","type":"dataset","resources":[{"cache_last_updated":null,"package_id":"d2d18eea-d98a-4f9a-a580-13131e2a88dc","filters":[],"datastore_active":true,"id":"42c7a4f1-f755-450f-9b5b-31b6085b9b19","size":null,"state":"active","schema":{"fields":[{"type":"string","name":"Country Name"},{"type":"string","name":"Country Code"},{"type":"year","name":"Year"},{"description":"GDP in current USD","type":"number","name":"Value"}]},"hash":"","description":"","format":"csv","last_modified":"2019-06-10T13:12:22.080475","url_type":"datastore","attributes":[],"path":"data/gdp.csv","mimetype":null,"cache_url":null,"name":"gdp","created":"2019-06-10T13:09:13.613813","url":"https://pkgstore.datahub.io/core/gdp/gdp_csv/data/0048bc8f6228d0393d41cac4b663b90f/gdp_csv.csv","mimetype_inner":null,"position":0,"revision_id":"a81405b5-fe0b-49c5-845a-82bb0b01a843","resource_type":null}],"num_resources":1,"tags":[],"groups":[],"license_id":null,"relationships_as_subject":[],"organization":{"description":"Just another test organization.","created":"2019-03-27T21:26:27.501417","title":"Test Organization","name":"test_org_00","is_organization":true,"state":"active","image_url":"http://placekitten.com/g/200/100","revision_id":"24612477-8155-497c-9e8d-5fef03f94c52","type":"organization","id":"2669d62a-f122-4256-9382-21c260ceef40","approval_status":"approved"},"name":"gdp","isopen":false,"url":null,"notes":"Country, regional and world GDP in current US Dollars ($). Regional means collections of countries e.g. Europe & Central Asia. Data is sourced from the World Bank and turned into a standard normalized CSV.","owner_org":"2669d62a-f122-4256-9382-21c260ceef40","title":"Country, Regional and World GDP (Gross Domestic Product)","revision_id":"1820bf3f-082d-4119-a0ab-0e1dfae1bb3c","resolution":"One hour (PT1H)"}}, [ 'Server',
    'PasteWSGIServer/0.5 Python/2.7.12',
    'Date',
    'Mon, 10 Jun 2019 13:43:33 GMT',
    'Content-Type',
    'application/json;charset=utf-8',
    'Content-Length',
    '2576' ])

  nock('http://127.0.0.1:5000', {"encodedQueryParams":true})
    .persist()
    .post('/api/3/action/package_show', {"name_or_id":"population"})
    .reply(200, {"help":"http://127.0.0.1:5000/api/3/action/help_show?name=package_show","success":true,"result":{"license_title":null,"maintainer":null,"relationships_as_object":[],"private":false,"maintainer_email":null,"num_tags":0,"update_frequency":"P1D","id":"223a978e-8f40-4277-ba6f-9127b9e98e9e","metadata_created":"2019-06-10T13:22:02.718193","metadata_modified":"2019-06-10T13:23:43.580947","author":"Energinet","author_email":"energidata@energinet.dk","state":"active","version":null,"creator_user_id":"5a6c2aa5-dece-4792-adfd-b825978f321f","type":"dataset","resources":[{"cache_last_updated":null,"package_id":"223a978e-8f40-4277-ba6f-9127b9e98e9e","filters":[],"datastore_active":true,"id":"bd9adb32-e96d-4002-8efb-688eae64b065","size":null,"state":"active","schema":{"fields":[{"type":"string","name":"Country Name"},{"type":"string","name":"Country Code"},{"type":"year","name":"Year"},{"type":"number","name":"Value"}]},"hash":"","description":"","format":"csv","last_modified":"2019-06-10T13:23:43.520760","url_type":"datastore","attributes":[],"path":"data/population.csv","mimetype":null,"cache_url":null,"name":"population","created":"2019-06-10T13:22:03.166187","url":"https://pkgstore.datahub.io/core/population/population_csv/data/ead5be05591360d33ad1a37382f8f8b1/population_csv.csv","mimetype_inner":null,"position":0,"revision_id":"9c20df7e-84fb-48f9-954b-c7cb56ceef3b","resource_type":null}],"num_resources":1,"tags":[],"groups":[],"license_id":null,"relationships_as_subject":[],"organization":{"description":"Just another test organization.","created":"2019-03-27T21:26:27.501417","title":"Test Organization","name":"test_org_00","is_organization":true,"state":"active","image_url":"http://placekitten.com/g/200/100","revision_id":"24612477-8155-497c-9e8d-5fef03f94c52","type":"organization","id":"2669d62a-f122-4256-9382-21c260ceef40","approval_status":"approved"},"name":"population","isopen":false,"url":null,"notes":"Population figures for countries, regions (e.g. Asia) and the world. Data comes originally from World Bank and has been converted into standard CSV.","owner_org":"2669d62a-f122-4256-9382-21c260ceef40","title":"Population figures for countries, regions (e.g. Asia) and the world","revision_id":"421e6b78-524c-4c9b-92bc-e77c50280dab","resolution":"One hour (PT1H)"}}, [ 'Server',
    'PasteWSGIServer/0.5 Python/2.7.12',
    'Date',
    'Mon, 10 Jun 2019 13:45:59 GMT',
    'Content-Type',
    'application/json;charset=utf-8',
    'Content-Length',
    '2474' ])

  nock('http://127.0.0.1:5000', {"encodedQueryParams":true})
    .persist()
    .post('/api/3/action/package_show', {"name_or_id":"geojson"})
    .reply(200, {
      "help": "http://127.0.0.1:5000/api/3/action/help_show?name=package_show",
      "success": true,
      "result": {
        "license_title": null,
        "maintainer": null,
        "relationships_as_object": [],
        "private": false,
        "maintainer_email": null,
        "num_tags": 0,
        "update_frequency": "P1D",
        "id": "223a978e-8f40-4277-ba6f-9127b9e98e9e",
        "metadata_created": "2019-07-05T13:22:02.718193",
        "metadata_modified": "2019-07-05T13:23:43.580947",
        "author": "Energinet",
        "author_email": "energidata@energinet.dk",
        "state": "active",
        "version": null,
        "creator_user_id": "5a6c2aa5-dece-4792-adfd-b825978f321f",
        "type": "dataset",
        "resources": [
          {
            "cache_last_updated": null,
            "package_id": "223a978e-8f40-4277-ba6f-9127b9e98e9e",
            "filters": [],
            "datastore_active": true,
            "id": "fake-res-id",
            "size": 51654,
            "state": "active",
            "hash": "",
            "description": "",
            "format": "geojson",
            "last_modified": "2019-07-05T13:23:43.520760",
            "url_type": "",
            "attributes": [],
            "path": "data/map.geojson",
            "mimetype": null,
            "cache_url": null,
            "name": "population",
            "created": "2019-06-10T13:22:03.166187",
            "url": "https://pkgstore.datahub.io/examples/geojson-tutorial/example/data/db696b3bf628d9a273ca9907adcea5c9/example.geojson",
            "mimetype_inner": null,
            "position": 0,
            "revision_id": "9c20df7e-84fb-48f9-954b-c7cb56ceef3b",
            "resource_type": null
          }
        ],
        "num_resources": 1,
        "tags": [],
        "groups": [],
        "license_id": null,
        "relationships_as_subject": [],
        "organization": {
          "description": "Just another test organization.",
          "created": "2019-03-27T21:26:27.501417",
          "title": "Test Organization",
          "name": "test_org_00",
          "is_organization": true,
          "state": "active",
          "image_url": "http://placekitten.com/g/200/100",
          "revision_id": "24612477-8155-497c-9e8d-5fef03f94c52",
          "type": "organization",
          "id": "2669d62a-f122-4256-9382-21c260ceef40",
          "approval_status": "approved"
        },
        "name": "geojson",
        "isopen": false,
        "url": null,
        "notes": "This is an example dataset that demonstrates how to package up GeoJSON data and display it on the map. We are using GeoJSON data for United Kingdom.",
        "owner_org": "2669d62a-f122-4256-9382-21c260ceef40",
        "title": "GeoJSON example",
        "revision_id": "421e6b78-524c-4c9b-92bc-e77c50280dab",
        "resolution": "One hour (PT1H)"
      }
    }, [ 'Server',
    'PasteWSGIServer/0.5 Python/2.7.12',
    'Date',
    'Mon, 10 Jun 2019 13:45:59 GMT',
    'Content-Type',
    'application/json;charset=utf-8',
    'Content-Length',
    '2474' ])

  nock('http://127.0.0.1:5000', {"encodedQueryParams":true})
    .persist()
    .post('/api/3/action/package_show', {"name_or_id":"pdf"})
    .reply(200, {
      "help": "http://127.0.0.1:5000/api/3/action/help_show?name=package_show",
      "success": true,
      "result": {
        "license_title": null,
        "maintainer": null,
        "relationships_as_object": [],
        "private": false,
        "maintainer_email": null,
        "num_tags": 0,
        "update_frequency": "P1D",
        "id": "223a978e-8f40-4277-ba6f-9127b9e98e9e",
        "metadata_created": "2019-07-05T13:22:02.718193",
        "metadata_modified": "2019-07-05T13:23:43.580947",
        "author": "Energinet",
        "author_email": "energidata@energinet.dk",
        "state": "active",
        "version": null,
        "creator_user_id": "5a6c2aa5-dece-4792-adfd-b825978f321f",
        "type": "dataset",
        "resources": [
          {
            "cache_last_updated": null,
            "package_id": "223a978e-8f40-4277-ba6f-9127b9e98e9e",
            "filters": [],
            "datastore_active": true,
            "id": "fake-res-id",
            "size": 51654,
            "state": "active",
            "hash": "",
            "description": "",
            "format": "pdf",
            "last_modified": "2019-07-05T13:23:43.520760",
            "url_type": "",
            "attributes": [],
            "mimetype": null,
            "cache_url": null,
            "name": "pdf-file",
            "created": "2019-06-10T13:22:03.166187",
            "url": "https://datahub.io/anuveyatsu/example-pdf/r/agile_readme.pdf",
            "mimetype_inner": null,
            "position": 0,
            "revision_id": "9c20df7e-84fb-48f9-954b-c7cb56ceef3b",
            "resource_type": null
          }
        ],
        "num_resources": 1,
        "tags": [],
        "groups": [],
        "license_id": null,
        "relationships_as_subject": [],
        "organization": {
          "description": "Just another test organization.",
          "created": "2019-03-27T21:26:27.501417",
          "title": "Test Organization",
          "name": "test_org_00",
          "is_organization": true,
          "state": "active",
          "image_url": "http://placekitten.com/g/200/100",
          "revision_id": "24612477-8155-497c-9e8d-5fef03f94c52",
          "type": "organization",
          "id": "2669d62a-f122-4256-9382-21c260ceef40",
          "approval_status": "approved"
        },
        "name": "pdf",
        "isopen": false,
        "url": null,
        "notes": "PDF example",
        "owner_org": "2669d62a-f122-4256-9382-21c260ceef40",
        "title": "PDF example",
        "revision_id": "421e6b78-524c-4c9b-92bc-e77c50280dab",
        "resolution": "One hour (PT1H)"
      }
    }, [ 'Server',
    'PasteWSGIServer/0.5 Python/2.7.12',
    'Date',
    'Mon, 10 Jun 2019 13:45:59 GMT',
    'Content-Type',
    'application/json;charset=utf-8',
    'Content-Length',
    '2474' ])

  // CKAN API mocks:
  nock('http://127.0.0.1:5000', {"encodedQueryParams":true})
    .persist()
    .post('/api/3/action/package_search', {"q":"co2","facet.field":["organization","groups","tags","res_format","license_id"],"facet.limit":5})
    .reply(200, {"help":"http://127.0.0.1:5000/api/3/action/help_show?name=package_search","success":true,"result":{"count":1,"sort":"score desc, metadata_modified desc","facets":{"organization":{"test_org_00":1},"license_id":{"eds-license":1},"res_format":{"Data":1},"groups":{},"tags":{}},"results":[{"license_title":"eds-license","maintainer":"","relationships_as_object":[],"private":false,"maintainer_email":"","num_tags":0,"id":"51906c35-5f1b-42c6-834d-47566424cc57","metadata_created":"2019-04-30T17:17:41.906339","metadata_modified":"2019-04-30T17:17:43.180581","author":"Energinet","author_email":"energidata@energinet.dk","state":"active","version":"","creator_user_id":"5a6c2aa5-dece-4792-adfd-b825978f321f","type":"dataset","resources":[{"cache_last_updated":null,"package_id":"51906c35-5f1b-42c6-834d-47566424cc57","filters":"[]","datastore_active":true,"id":"6ed8a2fb-f432-43ce-bae7-17684cf8a6bf","size":null,"state":"active","hash":"","description":" This text has been added for test purposes by jsq","format":"Data","last_modified":null,"url_type":"datastore","attributes":[],"mimetype":null,"cache_url":null,"name":"CO2 Emission Data","created":"2019-04-30T17:17:43.031828","url":"http://127.0.0.1:5000/datastore/dump/6ed8a2fb-f432-43ce-bae7-17684cf8a6bf","mimetype_inner":null,"position":0,"revision_id":"92646bb0-47c0-4ace-ba77-14e1a922bf52","resource_type":null}],"num_resources":1,"tags":[],"groups":[],"license_id":"eds-license","relationships_as_subject":[],"organization":{"description":"Just another test organization.","created":"2019-03-27T21:26:27.501417","title":"Test Organization","name":"test_org_00","is_organization":true,"state":"active","image_url":"http://placekitten.com/g/200/100","revision_id":"24612477-8155-497c-9e8d-5fef03f94c52","type":"organization","id":"2669d62a-f122-4256-9382-21c260ceef40","approval_status":"approved"},"name":"co2emis","isopen":false,"url":null,"notes":"This dataset provides an updated near up-to-date history for the CO2 emission from electricity consumed in Denmark measured in g/kWh.","owner_org":"2669d62a-f122-4256-9382-21c260ceef40","extras":[{"key":"Alias","value":"co2emis6"},{"key":"Unique key","value":"(Minutes5UTC, PriceArea)"}],"title":"CO2 Emission","revision_id":"8ec628ca-806d-44ba-a042-a5260fed5053"}],"search_facets":{"organization":{"items":[{"count":1,"display_name":"Test Organization","name":"test_org_00"}],"title":"organization"},"tags":{"items":[],"title":"tags"},"groups":{"items":[],"title":"groups"},"res_format":{"items":[{"count":1,"display_name":"Data","name":"Data"}],"title":"res_format"},"license_id":{"items":[{"count":1,"display_name":"eds-license","name":"eds-license"}],"title":"license_id"}}}}, [ 'Server',
    'PasteWSGIServer/0.5 Python/2.7.12',
    'Date',
    'Sun, 09 Jun 2019 13:29:19 GMT',
    'Content-Type',
    'application/json;charset=utf-8',
    'Content-Length',
    '2880' ])


  nock('http://127.0.0.1:5000', {"encodedQueryParams":true})
    .persist()
    .post('/api/3/action/package_search', {"q":"co2 res_format:CSV","rows":10,"start":10,"sort":"name asc","facet.field":["organization","groups","tags","res_format","license_id"],"facet.limit":5})
    .reply(200, {"help":"http://127.0.0.1:5000/api/3/action/help_show?name=package_search","success":true,"result":{"count":0,"sort":"name asc","facets":{"organization":{},"license_id":{},"res_format":{},"groups":{},"tags":{}},"results":[],"search_facets":{"organization":{"items":[],"title":"organization"},"tags":{"items":[],"title":"tags"},"groups":{"items":[],"title":"groups"},"res_format":{"items":[],"title":"res_format"},"license_id":{"items":[],"title":"license_id"}}}}, [ 'Server',
    'PasteWSGIServer/0.5 Python/2.7.12',
    'Date',
    'Sun, 09 Jun 2019 13:29:19 GMT',
    'Content-Type',
    'application/json;charset=utf-8',
    'Content-Length',
    '509' ])


  nock('http://127.0.0.1:5000', {"encodedQueryParams":true})
    .persist()
    .post('/api/3/action/package_search', {"q":"groups:test-group","facet.field":["organization","groups","tags","res_format","license_id"],"facet.limit":5})
    .reply(200, {"help":"http://127.0.0.1:5000/api/3/action/help_show?name=package_search","success":true,"result":{"count":2,"sort":"score desc, metadata_modified desc","facets":{"organization":{"test_org_00":2},"license_id":{},"res_format":{"CSV":1},"groups":{"test-group":2},"tags":{}},"results":[{"license_title":null,"maintainer":null,"relationships_as_object":[],"private":false,"maintainer_email":null,"num_tags":0,"update_frequency":"P1D","id":"223a978e-8f40-4277-ba6f-9127b9e98e9e","metadata_created":"2019-06-10T13:22:02.718193","metadata_modified":"2019-06-10T13:23:43.580947","author":"Energinet","author_email":"energidata@energinet.dk","state":"active","version":null,"creator_user_id":"5a6c2aa5-dece-4792-adfd-b825978f321f","type":"dataset","resources":[{"cache_last_updated":null,"package_id":"223a978e-8f40-4277-ba6f-9127b9e98e9e","filters":"[]","datastore_active":true,"id":"bd9adb32-e96d-4002-8efb-688eae64b065","size":null,"state":"active","schema":"{'fields': [{'type': 'text', 'name': 'Country Name', 'id': 'Country Name'}, {'type': 'text', 'name': 'Country Code', 'id': 'Country Code'}, {'type': 'float', 'name': 'Year', 'id': 'Year'}, {'type': 'float', 'name': 'Value', 'id': 'Value'}]}","hash":"","description":"","format":"CSV","last_modified":"2019-06-10T13:23:43.520760","url_type":"datastore","attributes":"[]","path":"data/population.csv","mimetype":null,"cache_url":null,"name":"population","created":"2019-06-10T13:22:03.166187","url":"http://127.0.0.1:5000/datastore/dump/bd9adb32-e96d-4002-8efb-688eae64b065","mimetype_inner":null,"position":0,"revision_id":"9c20df7e-84fb-48f9-954b-c7cb56ceef3b","resource_type":null}],"num_resources":1,"tags":[],"groups":[{"display_name":"Economic Data","description":"A collection of economic indicators available on DataHub.","image_display_url":"https://datahub.io/static/img/awesome-data/economic-data.png","title":"Economic Data","id":"29a82d2f-11c5-48e2-884b-0f34d936bedd","name":"test-group"}],"license_id":null,"relationships_as_subject":[],"organization":{"description":"Just another test organization.","created":"2019-03-27T21:26:27.501417","title":"Test Organization","name":"test_org_00","is_organization":true,"state":"active","image_url":"http://placekitten.com/g/200/100","revision_id":"24612477-8155-497c-9e8d-5fef03f94c52","type":"organization","id":"2669d62a-f122-4256-9382-21c260ceef40","approval_status":"approved"},"name":"population","isopen":false,"url":null,"notes":"Population figures for countries, regions (e.g. Asia) and the world. Data comes originally from World Bank and has been converted into standard CSV.","owner_org":"2669d62a-f122-4256-9382-21c260ceef40","title":"Population figures for countries, regions (e.g. Asia) and the world","revision_id":"421e6b78-524c-4c9b-92bc-e77c50280dab","resolution":"One hour (PT1H)"},{"license_title":null,"maintainer":null,"relationships_as_object":[],"private":false,"maintainer_email":null,"num_tags":0,"update_frequency":"P1D","id":"d2d18eea-d98a-4f9a-a580-13131e2a88dc","metadata_created":"2019-06-10T13:09:12.713162","metadata_modified":"2019-06-10T13:12:22.161302","author":"Energinet","author_email":"energidata@energinet.dk","state":"active","version":"2017","creator_user_id":"5a6c2aa5-dece-4792-adfd-b825978f321f","type":"dataset","resources":[{"cache_last_updated":null,"package_id":"d2d18eea-d98a-4f9a-a580-13131e2a88dc","filters":"[]","datastore_active":true,"id":"42c7a4f1-f755-450f-9b5b-31b6085b9b19","size":null,"state":"active","schema":"{'fields': [{'type': 'text', 'name': 'Country Name', 'id': 'Country Name'}, {'type': 'text', 'name': 'Country Code', 'id': 'Country Code'}, {'type': 'float', 'name': 'Year', 'id': 'Year'}, {'info': {'notes': 'GDP in current USD'}, 'type': 'float', 'id': 'Value', 'name': 'Value', 'description': 'GDP in current USD'}]}","hash":"","description":"","format":"","last_modified":"2019-06-10T13:12:22.080475","url_type":"datastore","attributes":"[]","path":"data/gdp.csv","mimetype":null,"cache_url":null,"name":"gdp","created":"2019-06-10T13:09:13.613813","url":"http://127.0.0.1:5000/datastore/dump/42c7a4f1-f755-450f-9b5b-31b6085b9b19","mimetype_inner":null,"position":0,"revision_id":"a81405b5-fe0b-49c5-845a-82bb0b01a843","resource_type":null}],"num_resources":1,"tags":[],"groups":[{"display_name":"Economic Data","description":"A collection of economic indicators available on DataHub.","image_display_url":"https://datahub.io/static/img/awesome-data/economic-data.png","title":"Economic Data","id":"29a82d2f-11c5-48e2-884b-0f34d936bedd","name":"test-group"}],"license_id":null,"relationships_as_subject":[],"organization":{"description":"Just another test organization.","created":"2019-03-27T21:26:27.501417","title":"Test Organization","name":"test_org_00","is_organization":true,"state":"active","image_url":"http://placekitten.com/g/200/100","revision_id":"24612477-8155-497c-9e8d-5fef03f94c52","type":"organization","id":"2669d62a-f122-4256-9382-21c260ceef40","approval_status":"approved"},"name":"gdp","isopen":false,"url":null,"notes":"Country, regional and world GDP in current US Dollars ($). Regional means collections of countries e.g. Europe & Central Asia. Data is sourced from the World Bank and turned into a standard normalized CSV.","owner_org":"2669d62a-f122-4256-9382-21c260ceef40","title":"Country, Regional and World GDP (Gross Domestic Product)","revision_id":"1820bf3f-082d-4119-a0ab-0e1dfae1bb3c","resolution":"One hour (PT1H)"}],"search_facets":{"organization":{"items":[{"count":2,"display_name":"Test Organization","name":"test_org_00"}],"title":"organization"},"tags":{"items":[],"title":"tags"},"groups":{"items":[{"count":2,"display_name":"Economic Data","name":"test-group"}],"title":"groups"},"res_format":{"items":[{"count":1,"display_name":"CSV","name":"CSV"}],"title":"res_format"},"license_id":{"items":[],"title":"license_id"}}}}, [ 'Server',
    'PasteWSGIServer/0.5 Python/2.7.12',
    'Date',
    'Mon, 10 Jun 2019 13:56:03 GMT',
    'Content-Type',
    'application/json;charset=utf-8',
    'Content-Length',
    '6197' ])


  nock('http://127.0.0.1:5000', {"encodedQueryParams":true})
    .persist()
    .post('/api/3/action/package_search', {"q":"organization:test_org_00","facet.field":["organization","groups","tags","res_format","license_id"],"facet.limit":5})
    .reply(200, {"help":"http://127.0.0.1:5000/api/3/action/help_show?name=package_search","success":true,"result":{"count":5,"sort":"score desc, metadata_modified desc","facets":{"organization":{"test_org_00":5},"license_id":{"eds-license":3,"cc-by":1},"res_format":{"Data":3},"groups":{},"tags":{}},"results":[{"license_title":null,"maintainer":null,"relationships_as_object":[],"private":false,"maintainer_email":null,"num_tags":0,"update_frequency":"P1D","id":"117ac751-b7af-47a6-95ae-1792f2baf8ff","metadata_created":"2019-05-28T16:01:26.309575","metadata_modified":"2019-05-28T16:19:36.408364","author":"Energinet","author_email":"energidata@energinet.dk","state":"active","version":null,"creator_user_id":"5a6c2aa5-dece-4792-adfd-b825978f321f","type":"dataset","resources":[{"cache_last_updated":null,"package_id":"117ac751-b7af-47a6-95ae-1792f2baf8ff","filters":"[]","datastore_active":true,"id":"e232c9e2-4828-4945-b5e7-29bbfa1c6f0d","size":null,"state":"active","schema":"{'fields': [{'info': {'notes': 'hey'}, 'id': 'a', 'type': 'text', 'description': 'hey', 'name': 'a'}, {'type': 'text', 'name': 'b', 'id': 'b'}]}","hash":"","description":"","format":"","last_modified":"2019-05-28T16:19:36.369335","url_type":"datastore","attributes":"[]","path":"fake","mimetype":null,"cache_url":null,"name":"capacityauctiondk-testt7","created":"2019-05-28T16:01:26.930332","url":"http://127.0.0.1:5000/datastore/dump/e232c9e2-4828-4945-b5e7-29bbfa1c6f0d","mimetype_inner":null,"position":0,"revision_id":"3e6ab4b8-83a2-49f2-a2d7-b5a884e5dc49","resource_type":null}],"num_resources":1,"tags":[],"groups":[],"license_id":null,"relationships_as_subject":[],"organization":{"description":"Just another test organization.","created":"2019-03-27T21:26:27.501417","title":"Test Organization","name":"test_org_00","is_organization":true,"state":"active","image_url":"http://placekitten.com/g/200/100","revision_id":"24612477-8155-497c-9e8d-5fef03f94c52","type":"organization","id":"2669d62a-f122-4256-9382-21c260ceef40","approval_status":"approved"},"name":"capacityauctiondk-testttt7","isopen":false,"url":null,"notes":"PTR is explicit auction of transfer capacity on a connection between two price areas","owner_org":"2669d62a-f122-4256-9382-21c260ceef40","title":"Auction of Capacities, PTR DK1-Germany","revision_id":"541d2d8f-866a-4248-87b7-0095ec80cef6","resolution":"One hour (PT1H)"},{"comment":"","license_title":"Creative Commons Attribution","maintainer":"","relationships_as_object":[],"private":false,"maintainer_email":"","num_tags":0,"update_frequency":"PT1H asdasd","metadata_language":"EN","id":"c5667cec-c2c7-494e-ad8c-35dca768733a","metadata_created":"2019-03-27T15:26:27.660896","metadata_modified":"2019-05-27T08:46:08.969062","author":"Energinet","author_email":"energidata@energinet.dk","state":"active","version":"","license_id":"cc-by","type":"dataset","resources":[{"filters":"[]","comment_6":"","comment_5":"","comment_4":"","comment_3":"","comment_2":"","comment_1":"","format":"","mimetype_inner":null,"url_type":"datastore","size_4":"17","size_5":"9","size_6":"9","size_1":"9","size_2":"9","size_3":"17","name":"capacity-auction-dk","example_2":"543,45","example_3":"2017-07-14T08:00","example_1":"1230","example_6":"543,45","example_4":"2017-07-14T08:00Z","example_5":"543,45","revision_id":"ea766d17-9ee5-4eb5-8ee2-4fdc38bf90f0","unit_1":"","state":"active","name_of_attribute_5":"Monthly Auction Congestion Rent (DKK)","size":null,"name_of_attribute_6":"Yearly Auction Congestion Rent (DKK)","unit_5":"DKK per MWh/h","unit_4":"","unit_6":"DKK per MWh/h","hash":"","unit_3":"","unit_2":"EUR per MWh/h","property_constraint_2":"","last_modified":null,"name_of_attribute_2":"Monthly Auction Congestion Rent (EUR)","cache_url":null,"created":"2019-03-27T15:26:27.857096","validation_rules_6":">=0","validation_rules_4":"Always full hours, i.e. minutes are 00","validation_rules_5":">=0","validation_rules_2":">=0","validation_rules_3":"Always full hours, i.e. minutes are 00","validation_rules_1":"","attributes":"[]","resource_type":null,"cache_last_updated":null,"package_id":"c5667cec-c2c7-494e-ad8c-35dca768733a","attribute_description_5":"Total amount of congestion rent at the interconnection to Germany based on t","attribute_description_4":"A date and time (interval), shown in _UTC time zone_, where the values are valid. 00:00 o’clock is the first hour of a given day interval  00:00 - 00:59 and 01:00 covers the second hour (interval) of the day and so forth. Please note: The naming is based on the length of the interval of the finest grain of the resolution.","attribute_description_6":"Total amount of congestion rent at the interconnection to Ger","attribute_description_1":"Total amount of congestion rent at the interconnection to G","attribute_description_3":"A date and time (interval), shown in _Danish tim","attribute_description_2":"Total amount of congestion rent at the interconnection to Germany bas","name_of_field_1":"YearlyAuctionConRentEUR","name_of_field_2":"MonthlyAuctionConRentEUR","name_of_field_3":"HourDK","name_of_field_4":"HourUTC","name_of_field_5":"MonthlyAuctionConRentDKK","name_of_field_6":"YearlyAuctionConRentDKK","type_3":"timestamp","type_2":"float","type_1":"integer","type_6":"float","type_5":"float","type_4":"timestamptz","format_regex_2":"([0-9]*[,])[0-9][0-9]","format_regex_3":"","format_regex_1":"([0-9]*[,])[0-9][0-9]","format_regex_6":"([0-9]*[,])[0-9][0-9]","id":"bbda001e-1037-497c-ba86-e275b5ae2b6c","format_regex_4":"","format_regex_5":"([0-9]*[,])[0-9][0-9]","datastore_active":true,"description":"Heeey","name_of_attribute_4":"Hour UTC","property_constraint_6":"","property_constraint_5":"","property_constraint_4":"","property_constraint_3":"","name_of_attribute_1":"Yearly Auction Congestion Rent (EUR)","property_constraint_1":"","name_of_attribute_3":"Hour DK","mimetype":null,"url":"http://127.0.0.1:5000/datastore/dump/bbda001e-1037-497c-ba86-e275b5ae2b6c","position":0}],"num_resources":1,"tags":[],"groups":[],"creator_user_id":"5a6c2aa5-dece-4792-adfd-b825978f321f","relationships_as_subject":[],"organization":{"description":"Just another test organization.","created":"2019-03-27T21:26:27.501417","title":"Test Organization","name":"test_org_00","is_organization":true,"state":"active","image_url":"http://placekitten.com/g/200/100","revision_id":"24612477-8155-497c-9e8d-5fef03f94c52","type":"organization","id":"2669d62a-f122-4256-9382-21c260ceef40","approval_status":"approved"},"name":"capacityauctiondk1","isopen":true,"url":"","notes":" PTR is explicit auction of transfer capacity on a connection between two price areas","owner_org":"2669d62a-f122-4256-9382-21c260ceef40","extras":[{"key":"alias","value":"capacityauctiondk"}],"license_url":"http://www.opendefinition.org/licenses/cc-by","title":"Auction of Capacities","revision_id":"747253a1-a360-45d9-a20f-117112f1d1a2","resolution":"PT1H ads32"},{"license_title":"eds-license","maintainer":"","relationships_as_object":[],"private":false,"maintainer_email":"","num_tags":0,"id":"51906c35-5f1b-42c6-834d-47566424cc57","metadata_created":"2019-04-30T17:17:41.906339","metadata_modified":"2019-04-30T17:17:43.180581","author":"Energinet","author_email":"energidata@energinet.dk","state":"active","version":"","creator_user_id":"5a6c2aa5-dece-4792-adfd-b825978f321f","type":"dataset","resources":[{"cache_last_updated":null,"package_id":"51906c35-5f1b-42c6-834d-47566424cc57","filters":"[]","datastore_active":true,"id":"6ed8a2fb-f432-43ce-bae7-17684cf8a6bf","size":null,"state":"active","hash":"","description":" This text has been added for test purposes by jsq","format":"Data","last_modified":null,"url_type":"datastore","attributes":[],"mimetype":null,"cache_url":null,"name":"CO2 Emission Data","created":"2019-04-30T17:17:43.031828","url":"http://127.0.0.1:5000/datastore/dump/6ed8a2fb-f432-43ce-bae7-17684cf8a6bf","mimetype_inner":null,"position":0,"revision_id":"92646bb0-47c0-4ace-ba77-14e1a922bf52","resource_type":null}],"num_resources":1,"tags":[],"groups":[],"license_id":"eds-license","relationships_as_subject":[],"organization":{"description":"Just another test organization.","created":"2019-03-27T21:26:27.501417","title":"Test Organization","name":"test_org_00","is_organization":true,"state":"active","image_url":"http://placekitten.com/g/200/100","revision_id":"24612477-8155-497c-9e8d-5fef03f94c52","type":"organization","id":"2669d62a-f122-4256-9382-21c260ceef40","approval_status":"approved"},"name":"co2emis","isopen":false,"url":null,"notes":"This dataset provides an updated near up-to-date history for the CO2 emission from electricity consumed in Denmark measured in g/kWh.","owner_org":"2669d62a-f122-4256-9382-21c260ceef40","extras":[{"key":"Alias","value":"co2emis6"},{"key":"Unique key","value":"(Minutes5UTC, PriceArea)"}],"title":"CO2 Emission","revision_id":"8ec628ca-806d-44ba-a042-a5260fed5053"},{"license_title":"eds-license","maintainer":"","relationships_as_object":[],"private":false,"maintainer_email":"","num_tags":0,"id":"cfd0bad2-a630-47d4-a257-cd4cfdcf196d","metadata_created":"2019-04-30T17:12:12.853109","metadata_modified":"2019-04-30T17:12:13.368416","author":"Energinet","author_email":"energidata@energinet.dk","state":"active","version":"1.0","creator_user_id":"5a6c2aa5-dece-4792-adfd-b825978f321f","type":"dataset","resources":[{"cache_last_updated":null,"package_id":"cfd0bad2-a630-47d4-a257-cd4cfdcf196d","filters":"[]","datastore_active":true,"id":"91ee0945-979e-46b4-9be3-6135b43e9338","size":null,"state":"active","hash":"","description":"Real time data for the Danish Gas System","format":"Data","last_modified":null,"url_type":"datastore","attributes":[],"mimetype":null,"cache_url":null,"name":"Gas System Right Now Data","created":"2019-04-30T17:12:13.174258","url":"http://127.0.0.1:5000/datastore/dump/91ee0945-979e-46b4-9be3-6135b43e9338","mimetype_inner":null,"position":0,"revision_id":"42850e2e-f089-4346-b455-223fbe2145ae","resource_type":null}],"num_resources":1,"tags":[],"groups":[],"license_id":"eds-license","relationships_as_subject":[],"organization":{"description":"Just another test organization.","created":"2019-03-27T21:26:27.501417","title":"Test Organization","name":"test_org_00","is_organization":true,"state":"active","image_url":"http://placekitten.com/g/200/100","revision_id":"24612477-8155-497c-9e8d-5fef03f94c52","type":"organization","id":"2669d62a-f122-4256-9382-21c260ceef40","approval_status":"approved"},"name":"gassystemrightnow4","isopen":false,"url":null,"notes":"All data is real time data, except North Sea production and production of biomethane. Real time data is from our Scada System, where data is stored every 3 minutes. This does not apply for North Sea production data which we receive on an hourly basis from third party (not from the platform operator). And data for produced biomethane we receive 6 times a day from the distri-bution companies.","owner_org":"2669d62a-f122-4256-9382-21c260ceef40","extras":[{"key":"Alias","value":"gassystemrightnow4"},{"key":"Unique key","value":"(TimestampUTC)"}],"title":"Gas System Right Now","revision_id":"06cadc71-fec6-42cd-94bf-ce6de0fe97e5"},{"license_title":"eds-license","maintainer":"","relationships_as_object":[],"private":false,"maintainer_email":"","num_tags":0,"id":"0741b4a1-d46c-42ed-bcb5-31b10aceab13","metadata_created":"2019-04-30T17:09:08.047495","metadata_modified":"2019-04-30T17:09:08.940110","author":"Energinet","author_email":"energidata@energinet.dk","state":"active","version":"1.0","creator_user_id":"5a6c2aa5-dece-4792-adfd-b825978f321f","type":"dataset","resources":[{"cache_last_updated":null,"package_id":"0741b4a1-d46c-42ed-bcb5-31b10aceab13","filters":"[]","datastore_active":true,"id":"324a19d1-787f-4797-868b-2356587e4e60","size":null,"state":"active","hash":"","description":"","format":"Data","last_modified":null,"url_type":"datastore","attributes":[],"mimetype":null,"cache_url":null,"name":"Electricity Balance Non-Validated\r\n Data","created":"2019-04-30T17:09:08.615497","url":"http://127.0.0.1:5000/datastore/dump/324a19d1-787f-4797-868b-2356587e4e60","mimetype_inner":null,"position":0,"revision_id":"41c729b9-559d-4762-b40c-33866f2390ef","resource_type":null}],"num_resources":1,"tags":[],"groups":[],"license_id":"eds-license","relationships_as_subject":[],"organization":{"description":"Just another test organization.","created":"2019-03-27T21:26:27.501417","title":"Test Organization","name":"test_org_00","is_organization":true,"state":"active","image_url":"http://placekitten.com/g/200/100","revision_id":"24612477-8155-497c-9e8d-5fef03f94c52","type":"organization","id":"2669d62a-f122-4256-9382-21c260ceef40","approval_status":"approved"},"name":"electricitybalancenonv","isopen":false,"url":null,"notes":"Data represents the overall balance of consumption, production, import and export of electricity in an area. \r\n\r\nProduction is divided into main production types. Data is based on online power measurements for SCADA, and therefore with some delay.\r\n\r\n","owner_org":"2669d62a-f122-4256-9382-21c260ceef40","extras":[{"key":"Unique key","value":"(HourUTC, PriceArea)"}],"title":"Electricity Balance Non-Validated","revision_id":"261b7d7f-3d0f-4d31-b8ad-e7f7c19ac5ae"}],"search_facets":{"organization":{"items":[{"count":5,"display_name":"Test Organization","name":"test_org_00"}],"title":"organization"},"tags":{"items":[],"title":"tags"},"groups":{"items":[],"title":"groups"},"res_format":{"items":[{"count":3,"display_name":"Data","name":"Data"}],"title":"res_format"},"license_id":{"items":[{"count":3,"display_name":"eds-license","name":"eds-license"},{"count":1,"display_name":"Creative Commons Attribution","name":"cc-by"}],"title":"license_id"}}}}, [ 'Server',
    'PasteWSGIServer/0.5 Python/2.7.12',
    'Date',
    'Sun, 09 Jun 2019 14:19:25 GMT',
    'Content-Type',
    'application/json;charset=utf-8',
    'Content-Length',
    '14576' ])

  nock('http://127.0.0.1:5000', {"encodedQueryParams":true})
    .persist()
    .post('/api/3/action/package_show', {"name_or_id":"co2emis"})
    .reply(200, {"help":"http://127.0.0.1:5000/api/3/action/help_show?name=package_show","success":true,"result":{"license_title":"eds-license","maintainer":"","relationships_as_object":[],"private":false,"maintainer_email":"","num_tags":0,"id":"51906c35-5f1b-42c6-834d-47566424cc57","metadata_created":"2019-04-30T17:17:41.906339","metadata_modified":"2019-04-30T17:17:43.180581","author":"Energinet","author_email":"energidata@energinet.dk","state":"active","version":"","creator_user_id":"5a6c2aa5-dece-4792-adfd-b825978f321f","type":"dataset","resources":[{"cache_last_updated":null,"package_id":"51906c35-5f1b-42c6-834d-47566424cc57","filters":[],"datastore_active":true,"id":"6ed8a2fb-f432-43ce-bae7-17684cf8a6bf","size":null,"state":"active","hash":"","description":" This text has been added for test purposes by jsq","format":"Data","last_modified":null,"url_type":"datastore","attributes":[],"mimetype":null,"cache_url":null,"name":"CO2 Emission Data","created":"2019-04-30T17:17:43.031828","url":"http://127.0.0.1:5000/datastore/dump/6ed8a2fb-f432-43ce-bae7-17684cf8a6bf","mimetype_inner":null,"position":0,"revision_id":"92646bb0-47c0-4ace-ba77-14e1a922bf52","resource_type":null}],"num_resources":1,"tags":[],"groups":[],"license_id":"eds-license","relationships_as_subject":[],"organization":{"description":"Just another test organization.","created":"2019-03-27T21:26:27.501417","title":"Test Organization","name":"test_org_00","is_organization":true,"state":"active","image_url":"http://placekitten.com/g/200/100","revision_id":"24612477-8155-497c-9e8d-5fef03f94c52","type":"organization","id":"2669d62a-f122-4256-9382-21c260ceef40","approval_status":"approved"},"name":"co2emis","isopen":false,"url":null,"notes":"This dataset provides an updated near up-to-date history for the CO2 emission from electricity consumed in Denmark measured in g/kWh.","owner_org":"2669d62a-f122-4256-9382-21c260ceef40","extras":[{"key":"Alias","value":"co2emis6"},{"key":"Unique key","value":"(Minutes5UTC, PriceArea)"}],"title":"CO2 Emission","revision_id":"8ec628ca-806d-44ba-a042-a5260fed5053"}}, [ 'Server',
    'PasteWSGIServer/0.5 Python/2.7.12',
    'Date',
    'Sun, 09 Jun 2019 13:42:48 GMT',
    'Content-Type',
    'application/json;charset=utf-8',
    'Content-Length',
    '2215' ])


  nock('http://127.0.0.1:5000', {"encodedQueryParams":true})
    .persist()
    .post('/api/3/action/package_show', {"name_or_id":"nonexistent-dataset"})
    .reply(404)


  nock('http://127.0.0.1:5000', {"encodedQueryParams":true})
    .persist()
    .post('/api/3/action/organization_show', {"id":"test_org_00","include_users":false})
    .reply(200, {"help":"http://127.0.0.1:5000/api/3/action/help_show?name=organization_show","success":true,"result":{"display_name":"Test Organization","description":"Just another test organization.","image_display_url":"http://placekitten.com/g/200/100","package_count":5,"created":"2019-03-27T21:26:27.501417","name":"test_org_00","is_organization":true,"state":"active","extras":[],"image_url":"http://placekitten.com/g/200/100","groups":[],"type":"organization","title":"Test Organization","revision_id":"24612477-8155-497c-9e8d-5fef03f94c52","num_followers":0,"id":"2669d62a-f122-4256-9382-21c260ceef40","tags":[],"approval_status":"approved"}}, [ 'Server',
    'PasteWSGIServer/0.5 Python/2.7.12',
    'Date',
    'Sun, 09 Jun 2019 13:48:59 GMT',
    'Content-Type',
    'application/json;charset=utf-8',
    'Content-Length',
    '675' ])


  nock('http://127.0.0.1:5000', {"encodedQueryParams":true})
    .persist()
    .post('/api/3/action/organization_show', {"id":"not-found-slug","include_users":false})
    .reply(404)


  nock('http://127.0.0.1:5000', {"encodedQueryParams":true})
    .persist()
    .post('/api/3/action/group_list', {"all_fields":true})
    .reply(200, {"help":"http://127.0.0.1:5000/api/3/action/help_show?name=group_list","success":true,"result":[{"approval_status":"approved","image_display_url":"https://datahub.io/static/img/awesome-data/economic-data.png","package_count":2,"title":"Economic Data","name":"test-group","is_organization":false,"image_url":"https://datahub.io/static/img/awesome-data/economic-data.png","type":"group","num_followers":0,"id":"29a82d2f-11c5-48e2-884b-0f34d936bedd","description":"A collection of economic indicators available on DataHub."}]}, [ 'Server',
    'PasteWSGIServer/0.5 Python/2.7.12',
    'Date',
    'Mon, 10 Jun 2019 13:55:07 GMT',
    'Content-Type',
    'application/json;charset=utf-8',
    'Content-Length',
    '549' ])


  nock('http://127.0.0.1:5000', {"encodedQueryParams":true})
    .persist()
    .post('/api/3/action/organization_list', {"all_fields":true, "sort": "package_count"})
    .reply(200, {"help":"http://127.0.0.1:5000/api/3/action/help_show?name=organization_list","success":true,"result":[{"approval_status":"approved","image_display_url":"","package_count":2,"title":"Test org","name":"test-org","is_organization":true,"image_url":"","type":"organization","num_followers":0,"id":"","description":""}]}, [ 'Server',
    'PasteWSGIServer/0.5 Python/2.7.12',
    'Date',
    'Mon, 10 Jun 2019 13:55:07 GMT',
    'Content-Type',
    'application/json;charset=utf-8',
    'Content-Length',
    '549' ])

  nock('http://127.0.0.1:5000', {"encodedQueryParams":true})
    .persist()
    .post('/api/3/action/group_show', {"id":"test-group"})
    .reply(200, {"help":"http://127.0.0.1:5000/api/3/action/help_show?name=group_show","success":true,"result":{"approval_status":"approved","image_display_url":"https://datahub.io/static/img/awesome-data/economic-data.png","package_count":2,"title":"Economic Data","title_en":"","name":"test-group","is_organization":false,"image_url":"https://datahub.io/static/img/awesome-data/economic-data.png","groups":[],"type":"group","users":[{"capacity":"admin","name":"test_sysadmin_00"}],"title_da_DK":"","num_followers":0,"id":"29a82d2f-11c5-48e2-884b-0f34d936bedd","tags":[],"description":"A collection of economic indicators available on DataHub."}}, [ 'Server',
    'PasteWSGIServer/0.5 Python/2.7.12',
    'Date',
    'Mon, 10 Jun 2019 13:56:03 GMT',
    'Content-Type',
    'application/json;charset=utf-8',
    'Content-Length',
    '670' ])


  nock('http://127.0.0.1:5000', {"encodedQueryParams":true})
    .persist()
    .post('/api/3/action/group_show', {"id":"nonexistent-collection"})
    .reply(404)


  // WP API mocks:
  nock('https://public-api.wordpress.com:443', {"encodedQueryParams":true})
    .persist()
    .get('/rest/v1.1/sites/http%3A%2F%2F127.0.0.1%3A6000/posts/slug:about')
    .reply(200, ["1f8b0800000000000003ed57596fdc3610fe2bac1efc525b7bc4ded81bdb4191f4089a004193a60fdd624151232d114a54786c921af9effd86dc95aff4001af4a908104be4dcdf37a3d9abe2d9d362399f1d165e075af3cb6c317f78b6982f4e0f0b19c3c6ba627995a46627a7f3c5d9f1d9fcb030b6d57db12c641fb7f451061f8bc3823aa94db16ca4f17458f4b2a3bb128d763eac77377837f2d66baf15ad3fa7f7f34fcfb384dcca20dd3abf6f4218fc7235594de665ebf255a96cb79ae4e7d5e4f441559fd5558574d4b43946e8347d70da4c69319b2fa6c7d5637f71b638a82f744d7dd0caf607eee27bb8199c6db4a11b7e921beaeffab919e4fd027e3a2c6a19389bf9747676345d1c4d67af670f96b3d3e5c9e9d7d3d9723a855e676bdd68aaef89cd4f96d393512ce860d8d42f64e09b44b0e2292211afc86d51b7afc6325d875b7bd5f97203e9b2026288b7b231ac261c2c700df7eaf87e283b5a4d5e56b3e31fdb230339d424a036905af5e7c3e573eba8137af0b113b535d609642d8058381410f5a40285e884acf5a0bdd27d2bc8685c7aaaa12048478f7c45a06e80b2ee95ae751dfb20621006e1391214b269129d6c7b29a4d1efa22cc5ab9d2738ea60c38a3e1a2345239536daebfcda892d6db48a060a2facabb408c909bbb0ae97c9aaf752500b4bf8cf07e9c5105df462abb7e41c1c2a153b2ffb523c43f2ae8e6c14592040440535cdb9f4a4584068096fdac37daf529a32b69120ab6e98dcea20a9146ff8cfb564b65aebb6d7deeb0ef764c4e02868b834a8252c20f58e1d1ab228d7ded02b45869cf6efe02907ef51517239ad3a221e19506563627a8a489d01aa750734235c7dcbae5310d10c3180a6a2d3239aa5780d7e00a17d34fb447cf403c18cf7706c991a1ab6febe961c3bb234e5f96a325caefafc0f8cba990945114d7060b3cf89a2968aa3c045ae2ab324d7453a154bf1243a44244039d06d87ec35e0a8036bec70cf8a09b3cc9cc1fa48b8f0d618ad74883582cc6c43815eee3297d413e21f36b01190d18e944a0c80981c8abb45e2ba8a6604ad14df1153228191414e66f1e665ab43c09dae4bf11cd4edb504c638809c20677da6163bc05cb0fb4eb14ea1d0cf6a2e05d731930888e55e6c50288430966de72d71f4658669df1f301c32b65936e3351ac8c52ac537f703bed5e1590dd51d358768b61acae878ca2c03e8013570b016f6502626a6e0d960860f84e3a2bd4895cd8de901f4f5ac29c5d35494918d2367bd1c34f59ce875a43b088194211f652db9060e57ec9ffb48a2e7707f0bf7fd44022c6f46eb0901e448bdee446524880f40ad896100ee9d24453d283f9eec4546128d332b61865c15e662b8391e2b5da19f9013a79cd9af41ff5de512354af183ac801518dde591867e090c0f1ab8cfed90c0de3d8c79039b0eb62448f00a9d9eb288dcf5633fefdb91bfde1fc0e68127fdff73febf9cf3071b4c693d3c12e7526c1c3517ab7ff0055f15426179f2100625e8c8e8feedaab87c82afb5ee119523200350cefd80d9b517f50a69f5477c49ee28d087009d3fdb27c00c56bebc6303c0c8a35e6ea179e0a4738ff672f82b2fafe9e44d6c798de378f1da465dfff56ef278902dad757d319fb13afa2f7a680cb142d537e948abb71fc7fd72403cefadabf3623800715e537697e1e3c0bb129bc4253e5700c96bdbf32acbb482ac5f5b7cc9468ddde97a74ac8c05766c1a85bc23cc479f91dcdb5036722c53ec7f46bf25bfc694a80c6f78c145e2e54b3ab670e7986547ddc342aff960f4a9fdda1197aa658debc30653ccbe87b9f1b035b69226ada2458d2d77f6b099cfeb79fd6041a70d35c7d84ed5ac6954d39c70d40d210f47f55a775cae5c4e8bc53c6c6257f569a7e79e83a4759de40981d4fb5a3ad66ec98e8e917c5c031272298104284f00939760b6cb682afd7b5aad51bb5f7f0356e43a3c5ea15a41b6bb270595d63a8cc2fc2e43906a9370bb7b70a3644c4e6cdcf24644fc7255707fb062e1c934b756de1cd1113e2325b3095de97d5eeef1844edbceca19188edddeaf26e3660f3d54082789ace8e0e1cb1a5d4d92cdfca3e20b988625478349e5fcd7c66ec5b9339b7e5424b27f6907c928cc7f4aac18f025c430cdbcd80f87358b8f98d7d83ff04becd619e1ab7cf304b66cd890dbd1f0ead3a73f00472644b5090f0000"], [ 'Server',
    'nginx',
    'Date',
    'Wed, 05 Jun 2019 08:21:24 GMT',
    'Content-Type',
    'application/json',
    'Transfer-Encoding',
    'chunked',
    'Connection',
    'close',
    'Vary',
    'Accept-Encoding',
    'X-hacker',
    'Oh, Awesome: Opossum',
    'Expires',
    'Wed, 11 Jan 1984 05:00:00 GMT',
    'Cache-Control',
    'no-cache, must-revalidate, max-age=0',
    'Content-Encoding',
    'gzip',
    'X-ac',
    '2.ams _dfw ',
    'Strict-Transport-Security',
    'max-age=15552000' ]);

  nock('https://public-api.wordpress.com:443', {"encodedQueryParams":true})
    .persist()
    .get('/rest/v1.1/sites/http%3A%2F%2F127.0.0.1%3A6000/posts/slug:welcome-to-test-news-page')
    .reply(200, ["1f8b0800000000000003ed596b73db3616fd2b187ec89795a9871d5bf636ed74b6dd6ea6ee63f2da0f5547039190840d48b078c84d33f9ef7b2e4080949d38edd4e9a736338d4402f7e29e73ee43c8dbe2e957c5d5fc7c5258e9c43a7e595c5c9e2fce9793827bb7d7a6b87a1b573d5e2ece2fcf2e179342e99d6c8bab82b7fe20de70677d312944c3a52aaeb65c5931295ade88db2bb6d258b7eedfe0bbe2475f5b5989f5fbf6bd7c761d57f00377dcace3f7bd739dbd5a4d57d345b933f15559e966358d9f57d3e5e9a6beac371b8453cdb66738ba989d2eb733713e5f9ccfce365fd82797e78fea27b216ad93956e1f9927dfc04d67f4562a31f213dc88f6b69ff121ef02f86e52d4dc51348bd9fcf264f6f8e474fe62b6c482abd3b37fcce657b319f635ba965b29ea8f2c73d22932f55fa1e05b30a79913d6b156dc58d6f19dc8380de7ad6dd5d8728fe5e50694012838584d678f57d3d3f96a7a134d9d387d42a64ec8d409995a4d291e50efee407dd3950dde779bf9d9b7bb931dd6013607f8b06ad57ed67d7ead8d6898ecac6f58ad95360cc03090ea260c4bada89c70de305ecb4eda4ab63b2694c44b2b6a6c60427a0b48105cd361b36c2b59cbdab78e79c714dfc03c132e9a16ace1bb9633aee42f9e97ec79ef098e1ad8d0acf54a71b6e59554d2caf8b56107b1979557d8f09d361bc95c70422eb46979b06a2d6762074bf89f751c087be32d3bc88330060eabca3796b7257b8ae04dedc928a2c001712a6c93144b2b2a5ac024873769e1bead4298dcefbcc0da6a64f2201d17257b457f0d2ba3d55aee5a69ad6cf05e28d619e1245c2a60090b08bd21874a68c0950c3daf841246da5fe0291ede0251616258b5c779b803ca4af9f0c9237422a8960dd8f470f535b90e87f0aaf30e4a668dcc6c96ec05f40186d2695220d6db4ec08cb570ac491a12b63e8e259d1d51aaf233c8ebf3551bff4051e34884675e3983426163a0c0b2a253e0454495541271e1a6f225fb9737381183e420b79ed98170e0403b7adee3c6c059544ea7ad177861b552b292ced73864541b00fab18f9c8b56e0fcdd1e361c22ea4559b10e140b03700f085c6ebccaa495ecdf822411c8882407b3f866f94e3a8777b22ed935a4db4a0e8ef100eb9830da46699103940e9d32459b0a403fad090ac2318a088cc55cdc02281c21c3d67b0b1afd31d294f203865de436ae8d7c650311ac927d79f7c047191eb701ddbcb3f3ea20b119192fa2ca40ba030606d65ca23228311c9e0c46fa203802edbb806c4c4cd43e35d49a927d1540c96acc9ab5bc93a2a5408793f614822925ace735270c0c5e917fca238e9cc3fb23de5345022dafb2f5c0006214ad6cd84671081f846ae55d07de1b2e2ad142f2f9495a9245946b56e00cb156a88b6e5c1e3772837c424c147254bf84fc7be482344af61fbe01575074134b1af2c5113d48e036a64320bbff90e306370d6c7188e039323d44e129eb733edf49c7af694d4067c0185bb2fa5381c8201360dfa06fca9a50ad88f52dc28cbb5286907aa3fe40058a12d42142c667735d262856b0d05b42b44326067fc3b172dd3c2a4a1265fb7bee74a88c60c7056d06546839765143359030744380d2511858ac82ac0dfa11ea39899224190b762fb26e7cf2fdefa604f5d153a666a65b118a5d5f2f915454d988e8f163e2a0642f43dd8e59128089bd63a89991d97b5ace757c88e2921ae548afa4b9589fb25b2f496e551f5f28f30a682772b1219d34e75bdf8072ebc85d331558757b6a00a7a958343cd8c83d31a590025a46e7a3527548aac6008784ed17848da130411e2ee40df94ed40db5082852483ed53dda88ba328848d7e421a4bb0f3992723022793b539eed754bd0c68216284dd0ffcf5b0c705493723ba356d4cb887884463f9cad7d3b8b40d2018625215a2213ec7b9b26a1c4f2380f725996f7b0015465e8cc1fed87432499f6d89272853b40f7946e3d22f78b3681d7b36ffe289625fb814a0ab0eadb4acc808623ad01dcb5c6244986b7c2ef24b56879e04d1c85e2ca702e9a217a5d3f64d17811c72e80b7bf2f91684a88a723ddf763cd6896e8b1095dbbd286a6bb98abb47cf4945283c24e6d2db725fbfe9a9fa603524d9c675bdd8ed263d757f3804e9e16fa296f3b0c3681559590ee4f9be4329a0a4cc062dc5629bf46635fb429697ead25f58290df5b61d2acfab44da36c4ac9c4ebd8cc811b4914847a4c71633c1cea421d5a0cd42537fb91562b1381ba93de2f300f24458a51034c1f528179eff874948944434b3f50627d2667ec59485f5208561944e032ecc63b139a5d8c0adcf4d047710f27112ea704d2812615e09a80499352083756dea1488661e430fcd680f86f6568d64aef74540848495b83d1458676fee51fccfdbb96d370371a8a866e1aeb5c98635f6527590c71721c66024a85d892c6ad5ad611867eec0d93f7077fc72621d095c7af985e3afaedfbf72fdfbff297ef4f8ff6a04f76fffc79e0c22abf03111fbcd4c0929d97f5fd17245f744fe6e7640c5af1166b3bbf4100fbf04856afdfe4fbad0e48dd6853c78b2994fe7007d2bf746f3abaab41bb7478892447bc56ea96aed28821acb56b8dfc2fae90ca62921eaeb3dff01276a192e395f4e4ceb2b4bdd29e4e317b3729947c2dec1ae9b05174b714375b5406da7feb31adcd7b27855cd3831c8cb46b23089e1ded181e6e3104e81b98cb0f77a8f55c854bb0e262c64f2fe717b3b36575ba11b3d3d9e3ed7229660bb13d9b2f171797741d28108511f55a36c44f041290adddde379b36dc269270b1521b740fac40e06dcd813a9c099d1d2378bf0619c2840088ee35a5918ad76f649778ace46fe1520fc8fdf4335842ffb081122cdb69f3863ebf6cfb6f585ba7abcfcb8b7ca179fc3ecbcedf7a5c0b5b19d9b9407a0eacc7783108664687779c1c29d9be0ec7b1426d8f2edde2e14f301c9624396481b5f106129fdc6a7a9897f3d5942e20ed6a9aaf1f57d374247a4ce7bcba7d4a6451f717785a4d83a37847fa00fe8a77f82f698503feb7e95b120a3da08c00fc0429adc6421b5f0c87fd9bf04fe3e913118ececdab7da89e91c9e1c1a87c11bc3527887375f8547813c7e1c943429b8d3e388a93c2884e05ddff696347e7eccd867f37088de7a11d04a330ff2ea46f87df21980efa04ee5bf43a74dbc4798d71d289e367a2966efc04b6b4db0bd3b7045489ff0389b713910f1b0000"], [ 'Server',
    'nginx',
    'Date',
    'Wed, 05 Jun 2019 08:28:16 GMT',
    'Content-Type',
    'application/json',
    'Transfer-Encoding',
    'chunked',
    'Connection',
    'close',
    'Vary',
    'Accept-Encoding',
    'X-hacker',
    'Oh, Awesome: Opossum',
    'Expires',
    'Wed, 11 Jan 1984 05:00:00 GMT',
    'Cache-Control',
    'no-cache, must-revalidate, max-age=0',
    'Content-Encoding',
    'gzip',
    'X-ac',
    '2.ams _dfw ',
    'Strict-Transport-Security',
    'max-age=15552000' ]);

  nock('https://public-api.wordpress.com:443', {"encodedQueryParams":true})
    .persist()
    .get('/rest/v1.1/sites/http%3A%2F%2F127.0.0.1%3A6000/posts')
    .query({"number":"10"})
    .reply(200, ["1f8b0800000000000003ed596b73dbc615fd2b5b74c65f2a922029511463d9933669ead669338ee37c08339c05b020d7c22bfba0a278f4df7bee2eb000254b761229339dda9eb109e0ee7d9cfbdcdd77515edb2a8b56b3a3a8a9b5d1d1ea8777d18b2fa2d57471146969c4c63fcc4ecf16b3c5f228e2d6ec6a15ad5aaa93e56c71767c86e545bd9555b48a7865f7e28a1b6da3a348945c16d12ae785164751c54b719322974a9b4dfb05cf053f78ac642a36ef5bf7ddab979e82efb9e16ae39f77c6347ab59eac27b3f156f94fe3b42ed713ff7b3d59ce93ec2c4b129893c6f9315417f17c99c762319d2de2e3e4b93e3f5b3cc9ce65262a23d3ba7aa2cebf829846d5b92cc4408e1323aa9b72864ade06f0fa28cab8216b66f1f46c149f8ce6d3d7f11204abf9f15fe2e92a8eb1aeac33994b917d80cc485310abef4501d982999a19a10dabc4a5660ddf8a8053af6fa6d3528f77201f277019808280f5243e594fe6d3f5e4d2b31a997a44ac46c46a44acd613b207ae37b7a0be6cc625be37c9f4f85fdbd1167480cd003e50adaba7cdb397b51225938db625cbeaa2560cc03038d51c31906a911a61ac623c938dd4a9acb64c14121fb5c8b0800969352081716583c5b24a6526335b19660d2b7802f64c18cf5ab0926f2bce78217fb27cccbe6d254150091e35ab6c517096f35416524bff58b2bdd8c9d41658f075ad12c98c1342226a5571c7556bcec4169cf08f361c085b6535dbcbbd500a02d3d4969a5763f602c6abcc1253580105a1159649b2a512291130c9214d6a88af526726b75b2b409b0e58eea5e162ccded07f3da5e79ac96d25b59625be8b82354a18099105b00407985e92c042d480ab63f46d2a0aa1a4fe0992bcf21a880ae5cdca2cf4e10628178575bf2c4c270765b284372d447d49a29d12b668ac4124b352066f8ed96bc4073cd469d319a2ad6e04d8680dc135858604af0f6349bac3ca62fc14e1f56c5df9bf88a8a125c2325b188542a1bda1c032252df0c1a34a51e271e12ab563f637aba01143c821dc5acff60e070eb4a2f5bb5fe87ce6230765d20a7cd07551c8541a9b41491f6d00e89bd6722e2a01fd9b1d781858d40665ca1ab8582880bb87e132b14570da98fd5d5048386778273bb678d27c2b8dc137998dd94b846e25397c8c17a06342d5da87160940e9a8bb4ca9550aa05f640405e1e883081ef3b9980328a810606ba5b918fdc6bba9cb0f3036deb79ed6fb2b30f0608dd9e7b7153ec870bf0ce886958d2df6128b91f1c247199c6e80810237d3b9d245a2539e187af721e008b4af1db23e3151fb8abed68cd9170e94108d2166356fa4a8c8d05ed3d685f05421b4e519270c143e917cca238e9cc3f703bf7715096e7913b83b0fc04651c992250547e0c3a175614d03bf975ca4a242c887371d4908a250b39ccf606b8aba6886e5319109f2093691c93efa25c2bf45ce85c698fd8327f01522baf4250df962c83d48e0caa7837376fb23d80ddf94e0c51104df22d39d1596b23ee4f3ad74fc92681c3a3dc65812a2bf2b10016402ec2bf44d9911aa29793d87997e55972114bd3efee00a1425448770191fd835c141be82b9dee2aced33d1c9ebd50a75f3a0284994ed7f7353bbca08ef18179b0e1522c72a6aa80a218cb821404915062fa62eac15fa11ea39052585a42fd86d903543cd771fed12d4474b991a3c5d0957ecda7a89a4a2ca468e1ebe261f8cd977ae6efb2c71c0f8ded1d74cefd97b5ace4bff12c5a56b948378a598f3f52988b592c22d6ded7365be00da9d73b1a0d334e45bdb8042eb085db32bb0c5cda9013eed8a45c91d8fd013bb142a8096aa83aa541dbaa8c60087846d09dc425798101ec6e50dc9ee5cd7d722a04826d9aeeed142d4953e88ea8c24b874b72e47ba1cf448decc9457bbba22687d41732eeda07f6b350638aa49a19d512b6ac388fc8818bd3b5bdb76e68124057a12672d3913deb7ba9b843a2f0ff3209465798f3780aa749df983fdb0b724b8ddb7a450e1f6887b4ab71691fb83b603aff5befab5588ed97fa8a400abb6adf80c2839d21ac0bdac314912e35cd8ada4162df7bcf4a390a7747ad10cd1c6f543168dd77eec0278bbfb1289a604af1dc57d3bd60c6689161bd7b5d35ad174e77395c8076f2935c8ecaead85b6a4df5ff3bbe980a2c6cfb3555d0dd263db5673874e9816da292fef071be7d5a243bad5b60b97c154a01c16c3b64af93518fb3c4f49f36b26a917b8fcce85ea66d5175537ca7629d9f975c866cf952417b87a4c76633ceceb42e65a0ca24b26bb41aca6ca03752bbd5f631ee822520c1a60f7a32b30ef1d9f0e3291dc50d106c5d76712c65eb9f4a5080195820526c0aeac51aed979abe09b167a1fdcbd26c28494403ad0a4025c3b60ba49c999eb2b6f5f24dd30b2eff71a08fe1b191a62a5153a28041449b9c2e8225d3bfffc57e6fe6dcedd7037188afa6eeaeb9c9b63df04212118fce4d8cf04940abe250d5bb5cc3c0cedd8eb26ef3bf7b15d20d091c7cf985e1adafb7edaf9fe913bdf1f9eece03ed97cf663ef0b5dd82d1c71e7a10648b65666f71f903c6fcea70b628658b11ab48d4d60c0cebd92e9c55538df6a80d465ad327f3085d2efce40da8fe6aaa1b31a3a65c3472439ecd5b2aee8288d3c045abda991ffd10aa92c8eba979b20d77d045f44c92125bdb945d62d4f6b4b5ac4d74751212f84de201d9282ce96fc628dca40eb6fbc26dab0f628921b7a118c917aa304c1b3a515fdcb1c43407d0976e1e516b59e17ee102c3a8df9fc6c7a1a1f2fd37922e2797c922f97229e89fc78ba9c9d9ed171a080154a641b59927f3c90806c6376b64c2a779a48810bca5aa17b800286571907ea1026ea2018c6db0d9c21943380dcbda1342afcf11bf1253fa6f21777a847279f3fc24be81fdab90464db5a5dd1efefaaf609b45977f479761a0e340fbf87b0b3375e6742a74a36c6393d18d6623ceb032626e50d274185ac2e9c3a5a14f9c1a19b577e84e1704c21872cd0da9f40e297594ff6d3f1743da10348bd9e84e3c7f5a453895e939eab9b5a228b9a3f40d27ae204f933d20790175de34f172b1cf0bfeb9eba40a1179411809f20256a106affa157f693c31f47d223391c9d9ba73b573dbd27fb1783f245f0669c200ed5e1b1f076d728f4e621a10d4c1f1cc5a34889a67071ffbb991de8d9b275f706aef13cb400c714ecaf5dfa36d887603a6813b86dd11bd76d3b9f6718278d387c273269866fc0ab363ba1da964055c267fffce3afc3e278d95f87299b63aaa7b6985e243331cb399f253478bcf76aec1551b36f3c7974e376cc7d8c0eafc87ad2e14dd99d426fdd5e09053585d142edb11e930f65c9a14ba23befd8e23beed8e68bc5629a897c7e9a2f66e2783a8f1768fdc9e9898817c78b13fe7befd8ee34efa3eedb62ba489b9fae66a7f7deb739b2e3d96a7676ebbeedf54eb07fd6d8b4882bf6570100f57ba0bdefa22d5e4f1064a3b79ec728713c3efa866d1e0d6fd868d7b9e3a8620c8d8ebdc526987611a5f8136be7e0a709e1f493ad8d7806e2afea9acee4cb8657576e87c65a3530e823a118146397fc0a0337762e4e1d3a2c585ba87fcc5efcc2f905fb9e17a6ae1c7bfc3360eff6c04f65b9652982549fafa3cb66e426b9d129763ebf88518ed96d1d31ad527cec0d349730e64acb9f8dc0d65694f5980241dfac0dd001f04da7be0e8c9b6afbfcf27c1ac7f1933fc7f3e567bbf393c51cdca11eb813091e2e6566767824323cee84dceee8b3275d4f9eddb175bb03d487856fb84bb91d11d1c1f6440fe2ca85d50d70b04fa1c8f87fd9a6b4fa3ec63e6579266653942e7e7acaf36542a5244996791a27b3e971369f459ff6299fc6d6df28efd33ee537b9e17fdee1bf769ff2c3bbc8557e3a14b91048ef687389c2bdd117b2d9f0a2d8b4231b35893d2f2ca93a8dae7f7c4c17b5c3f7fc219dd1f17c70d81f6563337fe47dcdfc0fdbd6bc2f505c1c3e9c3d23cfcf3f4450e1b2a1ed846be8d7d7ff05a42a0c497b280000"], [ 'Server',
    'nginx',
    'Date',
    'Wed, 05 Jun 2019 08:29:13 GMT',
    'Content-Type',
    'application/json',
    'Transfer-Encoding',
    'chunked',
    'Connection',
    'close',
    'Vary',
    'Accept-Encoding',
    'X-hacker',
    'Oh, Awesome: Opossum',
    'Expires',
    'Wed, 11 Jan 1984 05:00:00 GMT',
    'Cache-Control',
    'no-cache, must-revalidate, max-age=0',
    'Content-Encoding',
    'gzip',
    'X-ac',
    '2.ams _dfw ',
    'Strict-Transport-Security',
    'max-age=15552000' ]);

  nock('https://public-api.wordpress.com:443', {"encodedQueryParams":true})
    .persist()
    .get('/rest/v1.1/sites/http%3A%2F%2F127.0.0.1%3A6000/posts')
    .query({"number":"3"})
    .reply(200, ["1f8b0800000000000003ed596b73dbc615fd2b5b74c65f2a922029511463d9933669ead669338ee37c08339c05b020d7c22bfba0a278f4df7bee2eb000254b761229339dda9eb109e0ee7d9cfbdcdd77515edb2a8b56b3a3a8a9b5d1d1ea8777d18b2fa2d57471146969c4c63fcc4ecf16b3c5f228e2d6ec6a15ad5aaa93e56c71767c86e545bd9555b48a7865f7e28a1b6da3a348945c16d12ae785164751c54b719322974a9b4dfb05cf053f78ac642a36ef5bf7ddab979e82efb9e16ae39f77c6347ab59eac27b3f156f94fe3b42ed713ff7b3d59ce93ec2c4b129893c6f9315417f17c99c762319d2de2e3e4b93e3f5b3cc9ce65262a23d3ba7aa2cebf829846d5b92cc4408e1323aa9b72864ade06f0fa28cab8216b66f1f46c149f8ce6d3d7f11204abf9f15fe2e92a8eb1aeac33994b917d80cc485310abef4501d982999a19a10dabc4a5660ddf8a8053af6fa6d3528f77201f277019808280f5243e594fe6d3f5e4d2b31a997a44ac46c46a44acd613b207ae37b7a0be6cc625be37c9f4f85fdbd1167480cd003e50adaba7cdb397b51225938db625cbeaa2560cc03038d51c31906a911a61ac623c938dd4a9acb64c14121fb5c8b0800969352081716583c5b24a6526335b19660d2b7802f64c18cf5ab0926f2bce78217fb27cccbe6d254150091e35ab6c517096f35416524bff58b2bdd8c9d41658f075ad12c98c1342226a5571c7556bcec4169cf08f361c085b6535dbcbbd500a02d3d4969a5763f602c6abcc1253580105a1159649b2a512291130c9214d6a88af526726b75b2b409b0e58eea5e162ccded07f3da5e79ac96d25b59625be8b82354a18099105b00407985e92c042d480ab63f46d2a0aa1a4fe0992bcf21a880ae5cdca2cf4e10628178575bf2c4c270765b284372d447d49a29d12b668ac4124b352066f8ed96bc4073cd469d319a2ad6e04d8680dc135858604af0f6349bac3ca62fc14e1f56c5df9bf88a8a125c2325b188542a1bda1c032252df0c1a34a51e271e12ab563f637aba01143c821dc5acff60e070eb4a2f5bb5fe87ce6230765d20a7cd07551c8541a9b41491f6d00e89bd6722e2a01fd9b1d781858d40665ca1ab8582880bb87e132b14570da98fd5d5048386778273bb678d27c2b8dc137998dd94b846e25397c8c17a06342d5da87160940e9a8bb4ca9550aa05f640405e1e883081ef3b9980328a810606ba5b918fdc6bba9cb0f3036deb79ed6fb2b30f0608dd9e7b7153ec870bf0ce886958d2df6128b91f1c247199c6e80810237d3b9d245a2539e187af721e008b4af1db23e3151fb8abed68cd9170e94108d2166356fa4a8c8d05ed3d685f05421b4e519270c143e917cca238e9cc3f703bf7715096e7913b83b0fc04651c992250547e0c3a175614d03bf975ca4a242c887371d4908a250b39ccf606b8aba6886e5319109f2093691c93efa25c2bf45ce85c698fd8327f01522baf4250df962c83d48e0caa7837376fb23d80ddf94e0c51104df22d39d1596b23ee4f3ad74fc92681c3a3dc65812a2bf2b10016402ec2bf44d9911aa29793d87997e55972114bd3efee00a1425448770191fd835c141be82b9dee2aced33d1c9ebd50a75f3a0284994ed7f7353bbca08ef18179b0e1522c72a6aa80a218cb821404915062fa62eac15fa11ea39052585a42fd86d903543cd771fed12d4474b991a3c5d0957ecda7a89a4a2ca468e1ebe261f8cd977ae6efb2c71c0f8ded1d74cefd97b5ace4bff12c5a56b948378a598f3f52988b592c22d6ded7365be00da9d73b1a0d334e45bdb8042eb085db32bb0c5cda9013eed8a45c91d8fd013bb142a8096aa83aa541dbaa8c60087846d09dc425798101ec6e50dc9ee5cd7d722a04826d9aeeed142d4953e88ea8c24b874b72e47ba1cf448decc9457bbba22687d41732eeda07f6b350638aa49a19d512b6ac388fc8818bd3b5bdb76e68124057a12672d3913deb7ba9b843a2f0ff3209465798f3780aa749df983fdb0b724b8ddb7a450e1f6887b4ab71691fb83b603aff5befab5588ed97fa8a400abb6adf80c2839d21ac0bdac314912e35cd8ada4162df7bcf4a390a7747ad10cd1c6f543168dd77eec0278bbfb1289a604af1dc57d3bd60c6689161bd7b5d35ad174e77395c8076f2935c8ecaead85b6a4df5ff3bbe980a2c6cfb3555d0dd263db5673874e9816da292fef071be7d5a243bad5b60b97c154a01c16c3b64af93518fb3c4f49f36b26a917b8fcce85ea66d5175537ca7629d9f975c866cf952417b87a4c76633ceceb42e65a0ca24b26bb41aca6ca03752bbd5f631ee822520c1a60f7a32b30ef1d9f0e3291dc50d106c5d76712c65eb9f4a5080195820526c0aeac51aed979abe09b167a1fdcbd26c28494403ad0a4025c3b60ba49c999eb2b6f5f24dd30b2eff71a08fe1b191a62a5153a28041449b9c2e8225d3bfffc57e6fe6dcedd7037188afa6eeaeb9c9b63df04212118fce4d8cf04940abe250d5bb5cc3c0cedd8eb26ef3bf7b15d20d091c7cf985e1adafb7edaf9fe913bdf1f9eece03ed97cf663ef0b5dd82d1c71e7a10648b65666f71f903c6fcea70b628658b11ab48d4d60c0cebd92e9c55538df6a80d465ad327f3085d2efce40da8fe6aaa1b31a3a65c3472439ecd5b2aee8288d3c045abda991ffd10aa92c8eba979b20d77d045f44c92125bdb945d62d4f6b4b5ac4d74751212f84de201d9282ce96fc628dca40eb6fbc26dab0f628921b7a118c917aa304c1b3a515fdcb1c43407d0976e1e516b59e17ee102c3a8df9fc6c7a1a1f2fd37922e2797c922f97229e89fc78ba9c9d9ed171a080154a641b59927f3c90806c6376b64c2a779a48810bca5aa17b800286571907ea1026ea2018c6db0d9c21943380dcbda1342afcf11bf1253fa6f21777a847279f3fc24be81fdab90464db5a5dd1efefaaf609b45977f479761a0e340fbf87b0b3375e6742a74a36c6393d18d6623ceb032626e50d274185ac2e9c3a5a14f9c1a19b577e84e1704c21872cd0da9f40e297594ff6d3f1743da10348bd9e84e3c7f5a453895e939eab9b5a228b9a3f40d27ae204f933d20790175de34f172b1cf0bfeb9eba40a1179411809f20256a106affa157f693c31f47d223391c9d9ba73b573dbd27fb1783f245f0669c200ed5e1b1f076d728f4e621a10d4c1f1cc5a34889a67071ffbb991de8d9b275f706aef13cb400c714ecaf5dfa36d887603a6813b86dd11bd76d3b9f6718278d387c273269866fc0ab363ba1da964055c267fffce3afc3e278d95f87299b63aaa7b6985e243331cb399f253478bcf76aec1551b36f3c7974e376cc7d8c0eafc87ad2e14dd99d426fdd5e09053585d142edb11e930f65c9a14ba23befd8e23beed8e68bc5629a897c7e9a2f66e2783a8f1768fdc9e9898817c78b13fe7befd8ee34efa3eedb62ba489b9fae66a7f7deb739b2e3d96a7676ebbeedf54eb07fd6d8b4882bf6570100f57ba0bdefa22d5e4f1064a3b79ec728713c3efa866d1e0d6fd868d7b9e3a8620c8d8ebdc526987611a5f8136be7e0a709e1f493ad8d7806e2afea9acee4cb8657576e87c65a3530e823a118146397fc0a0337762e4e1d3a2c585ba87fcc5efcc2f905fb9e17a6ae1c7bfc3360eff6c04f65b9652982549fafa3cb66e426b9d129763ebf88518ed96d1d31ad527cec0d349730e64acb9f8dc0d65694f5980241dfac0dd001f04da7be0e8c9b6afbfcf27c1ac7f1933fc7f3e567bbf393c51cdca11eb813091e2e6566767824323cee84dceee8b3275d4f9eddb175bb03d487856fb84bb91d11d1c1f6440fe2ca85d50d70b04fa1c8f87fd9a6b4fa3ec63e6579266653942e7e7acaf36542a5244996791a27b3e971369f459ff6299fc6d6df28efd33ee537b9e17fdee1bf769ff2c3bbc8557e3a14b91048ef687389c2bdd117b2d9f0a2d8b4231b35893d2f2ca93a8dae7f7c4c17b5c3f7fc219dd1f17c70d81f6563337fe47dcdfc0fdbd6bc2f505c1c3e9c3d23cfcf3f4450e1b2a1ed846be8d7d7ff05a42a0c497b280000"], [ 'Server',
    'nginx',
    'Date',
    'Wed, 05 Jun 2019 08:29:13 GMT',
    'Content-Type',
    'application/json',
    'Transfer-Encoding',
    'chunked',
    'Connection',
    'close',
    'Vary',
    'Accept-Encoding',
    'X-hacker',
    'Oh, Awesome: Opossum',
    'Expires',
    'Wed, 11 Jan 1984 05:00:00 GMT',
    'Cache-Control',
    'no-cache, must-revalidate, max-age=0',
    'Content-Encoding',
    'gzip',
    'X-ac',
    '2.ams _dfw ',
    'Strict-Transport-Security',
    'max-age=15552000' ]);

  nock('https://public-api.wordpress.com:443', {"encodedQueryParams":true})
    .persist()
    .get('/rest/v1.1/sites/http%3A%2F%2F127.0.0.1%3A6000/posts/slug:search')
    .reply(404)

  nock('https://public-api.wordpress.com:443', {"encodedQueryParams":true})
    .persist()
    .get('/rest/v1.1/sites/http%3A%2F%2F127.0.0.1%3A6000/posts/slug:dataset/co2emis')
    .reply(404)

  nock('https://public-api.wordpress.com:443', {"encodedQueryParams":true})
    .get('/rest/v1.1/sites/http%3A%2F%2F127.0.0.1%3A6000/posts/slug:test_org_00')
    .reply(404)

  nock('https://public-api.wordpress.com:443', {"encodedQueryParams":true})
    .get('/rest/v1.1/sites/http%3A%2F%2F127.0.0.1%3A6000/posts/slug:collections')
    .reply(404)

  nock('https://public-api.wordpress.com:443', {"encodedQueryParams":true})
    .get('/rest/v1.1/sites/http%3A%2F%2F127.0.0.1%3A6000/posts/slug:collections/test-group')
    .reply(404)

  nock('https://public-api.wordpress.com:443', {"encodedQueryParams":true})
    .get('/rest/v1.1/sites/http%3A%2F%2F127.0.0.1%3A6000/posts/slug:test_org_00/gdp')
    .reply(404)

  nock('https://public-api.wordpress.com:443', {"encodedQueryParams":true})
    .get('/rest/v1.1/sites/http%3A%2F%2F127.0.0.1%3A6000/posts/slug:test_org_00/population')
    .reply(404)

  nock('https://public-api.wordpress.com:443', {"encodedQueryParams":true})
    .get('/rest/v1.1/sites/http%3A%2F%2F127.0.0.1%3A6000/posts/slug:not-found-slug')
    .reply(404)

  nock('https://public-api.wordpress.com:443', {"encodedQueryParams":true})
    .get('/rest/v1.1/sites/http%3A%2F%2F127.0.0.1%3A6000/posts/slug:collections/nonexistent-collection')
    .reply(404)

  nock('https://public-api.wordpress.com:443', {"encodedQueryParams":true})
    .get('/rest/v1.1/sites/http%3A%2F%2F127.0.0.1%3A6000/posts/slug:nonexistent-org/nonexistent-dataset')
    .reply(404)

  // CKAN PAGES mocks:
  nock('http://127.0.0.1:5000', {"encodedQueryParams":true})
    .persist()
    .get('/api/3/action/ckanext_pages_list')
    .reply(200, {"help":"https://localhost:5000/api/3/action/help_show?name=ckanext_pages_list","success":true,"result":[{"user_id":"a1710ffa-ed3e-4e66-9deb-f093f5c3d636","name":"post-name-0","title":"Test Post 0","image":"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/440px-SNice.svg.png","content":"Test content","publish_date":"2018-09-18T00:00:00","page_type":"page","group_id":null},{"user_id":"a1710ffa-ed3e-4e66-9deb-f093f5c3d636","name":"post-name-1","title":"Test Post 1","image":"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/440px-SNice.svg.png","content":"Test content","publish_date":"2018-09-18T00:00:00","page_type":"page","group_id":null},{"user_id":"a1710ffa-ed3e-4e66-9deb-f093f5c3d636","name":"post-name-2","title":"Test Post 2","image":"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/440px-SNice.svg.png","content":"Test content","publish_date":"2018-09-18T00:00:00","page_type":"page","group_id":null}]} )

  nock('http://127.0.0.1:5000', {"encodedQueryParams":true})
    .persist()
    .get('/api/3/action/ckanext_pages_show?page=test-page')
    .reply(200, {"help":"https://localhost/api/3/action/help_show?name=ckanext_pages_show","success":true,"result":{"lang":"","user_id":"a1710ffa-ed3e-4e66-9deb-f093f5c3d636","name":"test-page","title":"CKAN Pages Test Page","created":"2018-09-18T10:26:15.480257","modified":"2018-09-18T10:31:08.357095","private":false,"id":"eba47ac4-1714-438f-9766-e83d297658"}} )
}
