var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};
ISY.MapImplementation.OL3.Sources = ISY.MapImplementation.OL3.Sources || {};

ISY.MapImplementation.OL3.Sources.Wms = function(isySubLayer, parameters){
    var url;
    var urls;
    var getUrlParameter = function(url){
        var urlParameter = '';
        if (parameters) {
            for (var index in parameters) {
                if (urlParameter.length > 0){
                    urlParameter += '&';
                }
                urlParameter += index + '=' + parameters[index];
            }
            if (url.indexOf('?') > 0){
                url += '&';
            } else {
                url += '?';
            }
            url += urlParameter;
        }
        return url;
    };
    if (Array.isArray(isySubLayer.url)){
        urls = isySubLayer.url;
        for (var i = 0; i < urls.length; i++){
            urls[i] = getUrlParameter(urls[i]);
        }
    } else {
        url = isySubLayer.url;
        url = getUrlParameter(url);
    }
    var source;

    if (isySubLayer.tiled) {
        source = new ol.source.TileWMS({
            params: {
                LAYERS: isySubLayer.name,
                VERSION: "1.1.1",
                FORMAT: isySubLayer.format,
                STYLES: isySubLayer.styles || ''
            },
            url: url,
            urls: urls,
            crossOrigin: isySubLayer.crossOrigin,
            transparent: isySubLayer.transparent
        });
        source.set('type', 'ol.source.TileWMS');
    } else {
        if (url === undefined){
            url = urls[urls.length - 1];
        }
        source = new ol.source.ImageWMS({
            params: {
                LAYERS: isySubLayer.name,
                VERSION: "1.1.1",
                FORMAT: isySubLayer.format,
                STYLES: isySubLayer.styles || ''
            },
            ratio: 1,
            url: url,
            crossOrigin: isySubLayer.crossOrigin,
            transparent: isySubLayer.transparent
        });
        source.set('type', 'ol.source.ImageWMS');
    }
    return source;
};
