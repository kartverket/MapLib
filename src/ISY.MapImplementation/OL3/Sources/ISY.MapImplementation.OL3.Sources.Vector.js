var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};
ISY.MapImplementation.OL3.Sources = ISY.MapImplementation.OL3.Sources || {};

ISY.MapImplementation.OL3.Sources.Vector = function(isySubLayer){
    var source;
    //var projection = ol.proj.get(isySubLayer.coordinate_system);

    switch (isySubLayer.format){
        case ISY.Domain.SubLayer.FORMATS.geoJson:
            source = new ol.source.Vector({
                format: new ol.format.GeoJSON({
                    defaultDataProjection: isySubLayer.coordinate_system
                }),
                url: isySubLayer.url});
            source.set('type', 'ol.source.Vector');
            break;
    }

    return source;
};