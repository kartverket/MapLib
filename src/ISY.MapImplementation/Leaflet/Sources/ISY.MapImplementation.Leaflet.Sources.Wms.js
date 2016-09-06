/**
 * Created by to on 2015-01-30.
 */
var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.Leaflet = ISY.MapImplementation.Leaflet || {};
ISY.MapImplementation.Leaflet.Sources = ISY.MapImplementation.Leaflet.Sources || {};

ISY.MapImplementation.Leaflet.Sources.Wms = function(isySubLayer){
    var urls = isySubLayer.url;
    if (Array.isArray(urls)){
        for (var i = 0; i < urls.length; i++){
            urls[i] += '?';
        }
    } else {
        urls += '?';
    }
    return new L.TileLayer.WMS(
        urls,
        {
            attribution: isySubLayer.attribution,
            layers: isySubLayer.name,
            format: isySubLayer.format,
            transparent: true,
            version: "1.0.0"
        });
};
