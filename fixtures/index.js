'use string'
const nock = require('nock')


module.exports.initMocks = function() {
  nock('http://127.0.0.1:5000', {"encodedQueryParams":true})
    .get('/api/3/action/package_search')
    .query({"q":"co2"})
    .reply(200, {"help":"http://127.0.0.1:5000/api/3/action/help_show?name=package_search","success":true,"result":{"count":1,"sort":"score desc, metadata_modified desc","facets":{},"results":[{"license_title":"eds-license","maintainer":"","relationships_as_object":[],"private":false,"maintainer_email":"","num_tags":0,"id":"51906c35-5f1b-42c6-834d-47566424cc57","metadata_created":"2019-04-30T17:17:41.906339","metadata_modified":"2019-04-30T17:17:43.180581","author":"Energinet","author_email":"energidata@energinet.dk","state":"active","version":"","creator_user_id":"5a6c2aa5-dece-4792-adfd-b825978f321f","type":"dataset","resources":[{"cache_last_updated":null,"package_id":"51906c35-5f1b-42c6-834d-47566424cc57","filters":"[]","datastore_active":true,"id":"6ed8a2fb-f432-43ce-bae7-17684cf8a6bf","size":null,"state":"active","hash":"","description":" This text has been added for test purposes by jsq","format":"Data","last_modified":null,"url_type":"datastore","attributes":[],"mimetype":null,"cache_url":null,"name":"CO2 Emission Data","created":"2019-04-30T17:17:43.031828","url":"http://127.0.0.1:5000/datastore/dump/6ed8a2fb-f432-43ce-bae7-17684cf8a6bf","mimetype_inner":null,"position":0,"revision_id":"92646bb0-47c0-4ace-ba77-14e1a922bf52","resource_type":null}],"num_resources":1,"tags":[],"groups":[],"license_id":"eds-license","relationships_as_subject":[],"organization":{"description":"Just another test organization.","created":"2019-03-27T21:26:27.501417","title":"Test Organization","name":"test_org_00","is_organization":true,"state":"active","image_url":"http://placekitten.com/g/200/100","revision_id":"24612477-8155-497c-9e8d-5fef03f94c52","type":"organization","id":"2669d62a-f122-4256-9382-21c260ceef40","approval_status":"approved"},"name":"co2emis","isopen":false,"url":null,"notes":"This dataset provides an updated near up-to-date history for the CO2 emission from electricity consumed in Denmark measured in g/kWh.","owner_org":"2669d62a-f122-4256-9382-21c260ceef40","extras":[{"key":"Alias","value":"co2emis6"},{"key":"Unique key","value":"(Minutes5UTC, PriceArea)"}],"title":"CO2 Emission","revision_id":"8ec628ca-806d-44ba-a042-a5260fed5053"}],"search_facets":{}}}, [ 'Server',
    'PasteWSGIServer/0.5 Python/2.7.12',
    'Date',
    'Tue, 04 Jun 2019 07:04:01 GMT',
    'Content-Type',
    'application/json;charset=utf-8',
    'Content-Length',
    '2327' ]);
}
