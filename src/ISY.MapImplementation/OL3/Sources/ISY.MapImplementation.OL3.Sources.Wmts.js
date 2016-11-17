var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};
ISY.MapImplementation.OL3.Sources = ISY.MapImplementation.OL3.Sources || {};

ISY.MapImplementation.OL3.Sources.Wmts = function(isySubLayer, parameters){
    var projection = new ol.proj.Projection({
        code: isySubLayer.coordinate_system,
        extent: isySubLayer.extent,
        units: isySubLayer.extentUnits
    });
    var getUrlParameter = function(){
        var urlParameter = '';
        if (parameters) {
            for (var index in parameters) {
                urlParameter += '&' + index + '=' + parameters[index];
            }
        }
        return urlParameter;
    };

    var projectionExtent = projection.getExtent();
    var size = ol.extent.getWidth(projectionExtent) / 256;
    var resolutions = new Array(isySubLayer.numZoomLevels);
    var matrixIds = new Array(isySubLayer.numZoomLevels);
    var matrixSet = isySubLayer.matrixSet;
    if (matrixSet === null || matrixSet === '' || matrixSet === undefined)
    {
        matrixSet = isySubLayer.matrixPrefix ? isySubLayer.coordinate_system : parseInt(isySubLayer.coordinate_system.substr(isySubLayer.coordinate_system.indexOf(':') + 1), 10);
    }
    for (var z = 0; z < isySubLayer.numZoomLevels; ++z) {
        resolutions[z] = size / Math.pow(2, z);
        matrixIds[z] = isySubLayer.matrixPrefix ? matrixSet + ":" + z : matrixIds[z] = z;
    }

    var url;
    var urls;
    if (!Array.isArray(isySubLayer.url) || isySubLayer.url.length === 1) {
        url = isySubLayer.url[0];
        url += getUrlParameter();
    } else {
        urls = isySubLayer.url;
        for (var i = 0; i < urls.length; i++){
            urls[i] += getUrlParameter();
        }
    }

    var source = new ol.source.WMTS({
        url: url,
        urls: urls,
        layer: isySubLayer.name,
        format: isySubLayer.format,
        projection: projection,
        matrixSet: matrixSet,
        crossOrigin: isySubLayer.crossOrigin,
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
        }),
        style: 'default',
        wrapX: true
    });
    source.set('type', 'ol.source.WMTS');

    var oldTileLoadFunction = source.tileLoadFunction;

    var newTileLoadFunction = function(extent, url){
        var tmpurl = url.split('&');
        var newurl = '';
        for (var i = 0; i < tmpurl.length; i++){
            var aurl = tmpurl[i].split('=');
            if (i === 0) {
                var pos = aurl[0].indexOf('?');
                newurl = aurl[0].substr(0, pos + 1);
                newurl += aurl[0].substr(pos + 1).toUpperCase();
            } else {
                newurl += '&' + aurl[0].toUpperCase();
            }
            newurl += '=' + aurl[1];
        }
        //console.log(newurl);
        oldTileLoadFunction(extent, newurl);
    };
    source.tileLoadFunction = newTileLoadFunction;

    return source;
};
