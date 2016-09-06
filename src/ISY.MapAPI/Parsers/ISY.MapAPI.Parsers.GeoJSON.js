var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};
ISY.MapAPI.Parsers = ISY.MapAPI.Parsers || {};

ISY.MapAPI.Parsers.GeoJSON = function() {
    function parse(result) {
        var responseFeatureCollection = [];

        var crs;
        if(result.crs){
            var crsObject = result.crs;
            if(crsObject.properties.code){
                crs = crsObject.type + ':' + crsObject.properties.code;
            }
            else if(crsObject.properties.name){
                // pattern name=urn:ogc:def:crs:EPSG::32633
                crs = crsObject.properties.name.substring(crsObject.properties.name.indexOf('EPSG'), crsObject.properties.name.length);
            }
        }
        if (result.features !== undefined){
            var features = result.features;
            for(var i = 0; i < features.length; i++){
                var feature = features[i];

                var responseFeature = new ISY.Domain.FeatureResponse();
                responseFeature.crs = crs;
                responseFeature.geometryObject = feature;
                responseFeature.attributes = _getAttributesArray(feature.properties);
                responseFeature.olFeature = feature.olFeature;
                responseFeatureCollection.push(responseFeature);
            }
        }
        else if (result.length !== undefined ){
            for(var ii=0; ii<result.length; ii++){
                if (result[ii].rows.length !== undefined){
                    var responseFeatureWms = new ISY.Domain.FeatureResponse();
                    responseFeatureWms.crs = "";
                    responseFeatureWms.geometryObject = "";
                    responseFeatureWms.attributes = _getAttributesArray(result[ii].rows[0]);
                    responseFeatureCollection.push(responseFeatureWms);
                }
            }
        }


        return responseFeatureCollection;
    }

    function _getAttributesArray(properties){
        var attributes = [];
        for(var i in properties){
            attributes.push([i, properties[i]]);
        }
        return attributes;
    }

    return {
        Parse: parse
    };
};
