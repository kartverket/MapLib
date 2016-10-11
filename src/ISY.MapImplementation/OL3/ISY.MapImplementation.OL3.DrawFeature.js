var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.DrawFeature = function(eventHandler){

    var eventHandlers={
        modify:[],
        source:[],
        select:[]
    };
    var style;
    var type;
    var isActive = false;
    var draw; // global so we can remove it later
    var modify;
    var snap;
    var select;
    var modificationActive=false;
    var format = new ol.format.GeoJSON({
            defaultDataProjection: 'EPSG:25833',
            projection: 'EPSG:25833'
        }
    );
    var features= new ol.Collection();
    var source = new ol.source.Vector({features:features});
    var drawLayer;

    function addEventHandlers(){
        if(source) {
            eventHandlers['source'].push(source.on('addfeature',
                function () {
                    drawFeatureEnd();
                }, this));
            eventHandlers['source'].push(source.on('removefeature',
                function () {
                    drawFeatureEnd();
                }, this));
        }
        if(modify) {
            eventHandlers['modify'].push(modify.on('modifystart',
                function () {
                    modificationActive = true;
                }, this));
            eventHandlers['modify'].push(modify.on('modifyend',
                function () {
                    modificationActive = false;
                    drawFeatureEnd();
                }, this));
        }
        if(select) {
            eventHandlers['select'].push(select.on('select',
                function (e) {
                    console.log(e.selected);
                }, this));
        }
    }

    function removeEventHandlers() {
        removeSpecificEventHandlers(modify, 'modify');
        removeSpecificEventHandlers(source, 'source');
        removeSpecificEventHandlers(select, 'select');
    }
    function removeSpecificEventHandlers(interaction, name) {
        for (var sourceEvent = 0; sourceEvent < eventHandlers[name].length; sourceEvent++) {
            interaction.unByKey(eventHandlers[name][sourceEvent]);
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
            type: (type),
            condition: function(event) {
                return _checkForNoKeys(event) && !modificationActive;
            }
        });
        map.addInteraction(draw);
    }

    function addModifyInteraction(map) {
        modify = new ol.interaction.Modify({
            features: features,
            condition: function(event) {
                return _checkForNoKeys(event);
            },
            deleteCondition: function(event) {
                return _checkForShiftKey(event);
            }
        });
        map.addInteraction(modify);
    }

    function _checkForShiftKey(event){
        return ol.events.condition.shiftKeyOnly(event) &&
            event.type=='pointerdown';
    }

    function _checkForNoKeys(event){
        return event.type=='pointerdown' &&
            ol.events.condition.noModifierKeys(event);
    }

    // function _checkForAltKey(event){
    //     return event.type=='pointerdown' &&
    //         ol.events.condition.altKeyOnly(event);
    // }

    function addSnapInteraction(map) {
        snap = new ol.interaction.Snap({
            source: source
        });
        map.addInteraction(snap);
    }

    function addSelectInteraction(map){
        select = new ol.interaction.Select(
            {
                condition: ol.events.condition.click
            }
        );
        map.addInteraction(select);
    }

    function initiateDrawing(newFeatures){
        features=new ol.Collection(newFeatures);
        source = new ol.source.Vector({features:features});
        drawLayer = new ol.layer.Vector({
            source: source,
            style: styleFunction
        });
    }

    function setFeatureStyle(feature){
        if (!feature.getProperties().style) {
            feature.setProperties({
                style: {
                    fill: style.getFill().getColor(),
                    stroke: style.getStroke().getColor(),
                    strokeWidth: style.getStroke().getWidth(),
                    radius: 2
                }
            });
            return [style];
        }
    }

    function styleFunction(feature) {
        setFeatureStyle(feature);
        var featureStyle = feature.getProperties().style;
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: featureStyle.fill
            }),
            stroke: new ol.style.Stroke({
                color: featureStyle.stroke,
                width: featureStyle.strokeWidth
            }),
            image: new ol.style.Circle({
                radius: featureStyle.radius,
                fill: new ol.style.Fill({
                    color: featureStyle.fill
                }),
                stroke: new ol.style.Stroke({
                    color: featureStyle.stroke,
                    width: featureStyle.strokeWidth
                })
            })
        });
    }

    function activate(map, options) {
        isActive = true;
        if(!options.style && !style) {
            style=new ISY.MapImplementation.OL3.Styles.Measure();
        }
        else{
            style = options.style;
        }
        if(options.GeoJSON){
            if (options.GeoJSON=='remove'){
                initiateDrawing();
            }
            else if(options.operation=='undo'){
                features.pop();
                initiateDrawing(features.getArray());
            }
            else {
                initiateDrawing(format.readFeatures(options.GeoJSON));
            }
        }
        else {
            initiateDrawing();
        }
        map.addLayer(drawLayer);
        switch (options.mode){
            case('modify'):
                addModifyInteraction(map);
                break;
            case('draw'):
                if(options.type!='Active'){
                    type=options.type;
                }
                addDrawInteraction(map, type);
                break;
            case('select'):
                addSelectInteraction(map);
                break;
        }
        if (options.snap) {
            addSnapInteraction(map);
        }
        addEventHandlers();
    }

    function deactivate(map){
        if (isActive) {
            isActive = false;
            if (map !== undefined) {
                map.removeLayer(drawLayer);
                map.removeInteraction(draw);
                map.removeInteraction(modify);
                map.removeInteraction(snap);
                map.removeInteraction(select);
                removeEventHandlers();
            }
        }
    }

    return {
        Activate: activate,
        Deactivate: deactivate
    };
};