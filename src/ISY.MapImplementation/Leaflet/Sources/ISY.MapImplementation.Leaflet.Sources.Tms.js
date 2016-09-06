/**
 * Created by to on 2015-01-29.
 */
var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.Leaflet = ISY.MapImplementation.Leaflet || {};
ISY.MapImplementation.Leaflet.Sources = ISY.MapImplementation.Leaflet.Sources || {};

ISY.MapImplementation.Leaflet.Sources.Tms = function(isySubLayer){
    /*
    var projection = new ol.proj.Projection({
        code: isySubLayer.coordinate_system,
        extent: isySubLayer.extent,
        units: isySubLayer.extentUnits
    });

    var projectionExtent = projection.getExtent();
    var size = ol.extent.getWidth(projectionExtent) / 256;
    var resolutions = new Array(14);
    var matrixIds = new Array(14);
    */
    var numZoomLevels = 18;
    /*
    var matrixSet = isySubLayer.matrixSet;
    if (matrixSet === null || matrixSet === '' || matrixSet === undefined)
    {
        matrixSet=isySubLayer.coordinate_system;
    }
    for (var z = 0; z < numZoomLevels; ++z) {
        resolutions[z] = size / Math.pow(2, z);
        matrixIds[z] = matrixSet + ":" + z;
    }
    */

    var imageformat = isySubLayer.format;

    var ipos = isySubLayer.format.indexOf("/");
    if (ipos > 0){
        imageformat = imageformat.substr(ipos + 1);
    }

    var urls = isySubLayer.url; //test
    if (Array.isArray(urls)){
        urls = isySubLayer.url[0];
    }

    return new L.TileLayer(
        //urls + '/tms/1.0.0/' + isySubLayer.name + '@' + isySubLayer.coordinate_system + '@' + imageformat + '/{z}/{x}/{y}.' + imageformat,
        urls + '/tms/1.0.0/' + isySubLayer.name + '@EPSG:32632@' + imageformat + '/{z}/{x}/{y}.' + imageformat,
        {
            attribution: isySubLayer.attribution,
            minZoom: 0,
            maxZoom: numZoomLevels,
            //tileSize: 256,
            tms: true,
            continousWorld: true
        });

    /*
    return new ol.source.WMTS({
        url: isySubLayer.url,
        layer: isySubLayer.name,
        format: isySubLayer.format,
        projection: projection,
        matrixSet: matrixSet,
        crossOrigin: isySubLayer.crossOrigin,
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
        })
    });
    */
};
