var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.AddLayerUrl = function(){

    var mapProjection;
    var isActive = false;
    var drawLayer;
    var source = new ol.source.Vector();
    var style;

    function _addLayer(map){
        drawLayer = new ol.layer.Vector({
            source: source,
            style: style
        });
        map.addLayer(drawLayer);
    }

    var _getSourceFromUrl = function(url, geometryName){
        if(url) {
            source = new ol.source.Vector({
                format: new ol.format.GML(),
                url: url
            });
            source.on('addfeature',
                function(event){
                    if(geometryName) {
                        event.feature.setGeometryName(geometryName);
                    }
                    event.feature.getGeometry().transform('EPSG:4326', mapProjection);
                }, this);
        }
        return source;
    };

    function activate(map, options) {
        isActive = true;
        mapProjection = map.getView().getProjection();
        style = options.style ? options.style : defaultStyle;
        source = _getSourceFromUrl(options.url, options.geometryName);
        _addLayer(map);
        // var extent = features[0].getGeometry().getExtent();
        // map.getView().fit(extent,map.getSize());
    }

    function deactivate(map){
        if (isActive) {
            isActive = false;
            if (map !== undefined) {
                map.removeLayer(drawLayer);
                source = new ol.source.Vector();
            }
        }
    }

    return {
        Activate: activate,
        Deactivate: deactivate
    };
};