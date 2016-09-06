var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.Utilities = function(){
    function convertGmlToGeoJson(gml){
        var xmlParser = new ol.format.WMSCapabilities();
        var xmlFeatures = xmlParser.read(gml);
        var gmlParser = new ol.format.GML();
        var features = gmlParser.readFeatures(xmlFeatures);
        var jsonParser = new ol.format.GeoJSON();
        return jsonParser.writeFeatures(features);
    }

    function extentToGeoJson(x, y){
        var point = new ol.geom.Point([x, y]);
        var feature = new ol.Feature();
        feature.setGeometry(point);
        var geoJson = new ol.format.GeoJSON();
        return geoJson.writeFeature(feature);
    }

    return {
        ConvertGmlToGeoJson: convertGmlToGeoJson,
        ExtentToGeoJson: extentToGeoJson
    };
};