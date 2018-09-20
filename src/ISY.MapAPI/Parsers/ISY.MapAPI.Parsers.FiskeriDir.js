var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};
ISY.MapAPI.Parsers = ISY.MapAPI.Parsers || {};

ISY.MapAPI.Parsers.FiskeriDir = function(mapApi){
    var insteadOfGml = 'insteadofgml';
    var x, y;
    var gmlObject;

    function parse (result){
        var responseFeatureCollection = [];

        result = result.replace(/:gml/g, '');
        result = result.replace(/gml:/g, insteadOfGml);
        result = result.replace(/s:x/g, 'sx');
        var jsonFeatures = xml.xmlToJSON(result);

        var rootObject = jsonFeatures[Object.keys(jsonFeatures)[0]];
        for(var i in rootObject){
            var testObject = rootObject[i];
            if(testObject instanceof Object){
                for(var j in testObject){
                    var testArray = testObject[j];
                    if(testArray instanceof Array){
                        responseFeatureCollection = _arrayToResponseFeatureCollection(testArray);
                    }
                }
            }
        }
        return responseFeatureCollection;
    }

    function _arrayToResponseFeatureCollection(resultArray){
        var result = [];
        for(var i = 0; i < resultArray.length; i++){
            var feature = resultArray[i];

            var responseFeature = new ISY.Domain.FeatureResponse();
            responseFeature.attributes = _getAttributesArray(feature);
            var crs = gmlObject[Object.keys(gmlObject)[0]]["srsname"];
            var extent = gmlObject[Object.keys(gmlObject)[0]][insteadOfGml + "coordinates"];
            extent = extent.replace(/ /g, ',');

            responseFeature.crs = crs;
            responseFeature.geometryObject = mapApi.ExtentToGeoJson(x, y);

            result.push(responseFeature);
        }
        return result;
    }

    function _getAttributesArray(properties){
        var attributes = [];
        for(var i in properties){
            if(i.toLocaleLowerCase().indexOf(insteadOfGml) === -1){
                attributes.push([i, properties[i]]);
                if(i === 'x') { x = properties[i]; }
                if(i === 'y') { y = properties[i]; }
            }
            else {
                gmlObject = properties[i];
            }
        }
        return attributes;
    }

    return {
        Parse: parse
    };
};
