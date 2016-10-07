var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.DrawFeature = function(eventHandler){

    var isActive = false;
    var sketch;
    var draw; // global so we can remove it later
    var source = new ol.source.Vector();
    var drawStyle = new ISY.MapImplementation.OL3.Styles.Measure();
    var drawLayer = new ol.layer.Vector({
        source: source,
        style: drawStyle.DrawStyles()
    });

    function addEventHandlers(draw){
        draw.on('drawstart',
            function(evt) {
                sketch = evt.feature;
            }, this);
        draw.on('drawend',
            function(evt) {
                sketch = evt.feature;
                var format = new ol.format.GeoJSON('EPSG:25833');
                console.log(format.writeFeature(sketch));
                eventHandler.TriggerEvent(ISY.Events.EventTypes.DrawFeatureEnd, sketch.getGeometry().getCoordinates());
            }, this);
    }

    function addInteraction(map, value) {
        draw = new ol.interaction.Draw({
            source: source,
            type: (value)
        });
        map.addInteraction(draw);
        addEventHandlers(draw);
    }

    function activate(map, options){
        console.log(options);
        isActive = true;
        map.addLayer(drawLayer);
        addInteraction(map, options.type);
    }

    function deactivate(map){
        if (isActive) {
            isActive = false;
            if (map !== undefined) {
                map.removeLayer(drawLayer);
            }
        }
    }

    return {
        Activate: activate,
        Deactivate: deactivate
    };
};