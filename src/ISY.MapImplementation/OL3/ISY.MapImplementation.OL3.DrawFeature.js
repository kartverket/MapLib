var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.DrawFeature = function(eventHandler){

    var isActive = false;
    var sketch;
    var draw; // global so we can remove it later

    var features= new ol.Collection();
    var source = new ol.source.Vector({features:features});
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
                var features=source.getFeatures();
                features.push(sketch);
                eventHandler.TriggerEvent(ISY.Events.EventTypes.DrawFeatureEnd, format.writeFeatures(features));
            }, this);
    }

    function addDrawInteraction(map, value) {
        draw = new ol.interaction.Draw({
            source: source,
            type: (value)
        });
        map.addInteraction(draw);
        addEventHandlers(draw);
    }

    function addMoveInteraction(map) {
        var modify = new ol.interaction.Modify({
            features: features
            // // the SHIFT key must be pressed to delete vertices, so
            // // that new vertices can be drawn at the same position
            // // of existing vertices
            // deleteCondition: function(event) {
            //     return ol.events.condition.shiftKeyOnly(event) &&
            //         ol.events.condition.singleClick(event);
            // }
        });
        map.addInteraction(modify);
    }

    function activate(map, options){
        isActive = true;
        map.addLayer(drawLayer);
        addMoveInteraction(map);
        addDrawInteraction(map, options.type);

    }

    function deactivate(map){
        if (isActive) {
            isActive = false;
            if (map !== undefined) {
                map.removeLayer(drawLayer);
                map.removeInteraction(draw);
            }
        }
    }

    return {
        Activate: activate,
        Deactivate: deactivate
    };
};