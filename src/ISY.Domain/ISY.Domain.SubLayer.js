var ISY = ISY || {};
ISY.Domain = ISY.Domain || {};

ISY.Domain.SubLayer = function(config){
    var id = new ISY.Utils.Guid().NewGuid();

    var defaults = {
        name: '',
        providerName: '',   //f.eks Fiskeridirektoratet
        source: ISY.Domain.SubLayer.SOURCES.wmts,
        url: '',
        format: ISY.Domain.SubLayer.FORMATS.imagepng,
        coordinate_system: '',
        srs_dimension: '',
        matrixSet: '',
        extent: [-1, 1, -1, 1],
        extentUnits: 'm',
        id: id,
        transparent: true,
        layerIndex: -1,
        legendGraphicUrl: '',
        crossOrigin: 'anonymous',
        featureInfoTitle:'',
        tooltipTemplate:'',
        showDialog:true,
        openNewWindow: false,
        openParentWindow: false,
        windowWidth: 500,
        featureInfoElement: [],
        editable: false,
        featureInfo: new ISY.Domain.FeatureInfo(),
        featureNS: '',
        geometryName: 'geometry'
    };
    var instance =  $.extend({}, defaults, config); // subLayerInstance

    if(instance.legendGraphicUrl.indexOf('?') === -1){
        instance.legendGraphicUrl += '?';
    }
    if (instance.legendGraphicUrl !== '') {
        var legendGraphic = new ISY.Domain.LegendGraphic({url: instance.legendGraphicUrl, layer: instance.name});
    instance.legendGraphicUrl = legendGraphic.GetLegendGraphicUrl();
    }

    return instance;
};

ISY.Domain.SubLayer.SOURCES = {
    wmts: "WMTS",
    wms: "WMS",
    vector: "VECTOR",
    proxyWmts: "proxyWmts",
    proxyWms: "proxyWms",
    tms: "TMS",
    wfs: "WFS"

};

ISY.Domain.SubLayer.FORMATS = {
    imagepng: "image/png",
    imagejpeg: "image/jpeg",
    geoJson: "application/json"
};
