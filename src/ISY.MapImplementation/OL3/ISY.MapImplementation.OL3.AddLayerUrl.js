var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.AddLayerUrl = function(eventHandler){

    var mapProjection;
    var isActive = false;
    var drawLayer;
    var source = new ol.source.Vector();
    var style;
    var layerId='propertyMarking';

    function _addLayer(map){
        drawLayer = new ol.layer.Vector({
            source: source,
            style: style
        });
        drawLayer.set('id', layerId);
        map.addLayer(drawLayer);
    }

    var _getSourceFromUrl = function(options, map){
        if(options.url) {
            source = new ol.source.Vector({
                format: new ol.format.GML(),
                url: options.url
            });
            source.on('addfeature',
                function(event){
                    if(options.geometryName) {
                        event.feature.setGeometryName(options.geometryName);
                    }
                    event.feature.getGeometry().transform('EPSG:4326', mapProjection);
                    var extent = source.getExtent();
                    map.getView().fit(extent,map.getSize());
                    eventHandler.TriggerEvent(ISY.Events.EventTypes.AddLayerUrlEnd, true);
                }, this);
        }
        return source;
    };

    function _removeOldLayer(map){
        map.getLayers().forEach(function (layer) {
                if (layer.get('id') == layerId) {
                    map.removeLayer(layer);
                }
            }
        );
    }

    function activate(map, options) {
        if(!options.show) {
            map.removeLayer(drawLayer);
            deactivate();
            return;
        }
        isActive = true;
        mapProjection = map.getView().getProjection();
        style = options.style ? options.style : defaultStyle;
        source = _getSourceFromUrl(options, map);
        _removeOldLayer(map);
        _addLayer(map);
    }

    function deactivate(){
        if (isActive) {
            isActive = false;

        }
    }

    return {
        Activate: activate,
        Deactivate: deactivate
    };
};