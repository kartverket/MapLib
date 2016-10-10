var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.DrawFeature = function(eventHandler){

    var eventHandlers={
        modify:[],
        source:[]
    };
    var isActive = false;
    var draw; // global so we can remove it later
    var modify;
    var modificationActive=false;
    var format = new ol.format.GeoJSON('EPSG:25833');
    var features= new ol.Collection();
    var source = new ol.source.Vector({features:features});
    var drawStyle = new ISY.MapImplementation.OL3.Styles.Measure();
    var drawLayer = new ol.layer.Vector({
        source: source,
        style: drawStyle.DrawStyles()
    });

    function addEventHandlers(){
        eventHandlers['source'].push(source.on('addfeature',
            function() {
                drawFeatureEnd();
            }, this));
        eventHandlers['source'].push(source.on('removefeature',
            function() {
                drawFeatureEnd();
            }, this));
        eventHandlers['modify'].push(modify.on('modifystart',
            function(){
                modificationActive=true;
            }, this));
        eventHandlers['modify'].push(modify.on('modifyend',
            function(){
                modificationActive=false;
                drawFeatureEnd();
            }, this));
    }

    function removeEventHandlers() {
        for (var modifyEvent = 0; modifyEvent<eventHandlers['modify'].length; modifyEvent++) {
            modify.unByKey(eventHandlers['modify'][modifyEvent]);
        }
        for (var sourceEvent = 0; sourceEvent<eventHandlers['source'].length; sourceEvent++) {
            source.unByKey(eventHandlers['source'][sourceEvent]);
        }
    }

    function drawFeatureEnd(){
        if(!modificationActive) {
            eventHandler.TriggerEvent(ISY.Events.EventTypes.DrawFeatureEnd, format.writeFeatures(source.getFeatures()));
        }
    }

    function addDrawInteraction(map, type) {
        if(draw && draw.type==type){
            return;
        }

        draw = new ol.interaction.Draw({
            source: source,
            type: (type)
        });
        map.addInteraction(draw);
    }

    function addMoveInteraction(map) {
        modify = new ol.interaction.Modify({
            features: features,
            // the SHIFT key must be pressed to delete vertices, so
            // that new vertices can be drawn at the same position
            // of existing vertices
            deleteCondition: function(event) {
                return ol.events.condition.shiftKeyOnly(event) &&
                    ol.events.condition.singleClick(event);
            }
        });
        map.addInteraction(modify);
    }

    function activate(map, options){
        isActive = true;
        map.addLayer(drawLayer);
        addMoveInteraction(map);
        addDrawInteraction(map, options.type);
        addEventHandlers();
    }

    function deactivate(map){
        if (isActive) {
            isActive = false;
            if (map !== undefined) {
                map.removeLayer(drawLayer);
                map.removeInteraction(draw);
                map.removeInteraction(modify);
                removeEventHandlers();
            }
        }
    }

    return {
        Activate: activate,
        Deactivate: deactivate
    };
};