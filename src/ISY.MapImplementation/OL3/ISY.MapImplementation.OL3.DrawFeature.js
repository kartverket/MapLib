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
    var drawStyle = new ISY.MapImplementation.OL3.Styles.Measure();
    var jsonStyleFetcher=new ISY.MapImplementation.OL3.Styles.Json();

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
                    var selectedFeatures=e.selected;
                    console.log(selectedFeatures);
                    selectedFeatures.forEach(function(feature){
                       feature.setStyle(new ol.style.Style({
                           fill: new ol.style.Fill({
                               color: 'rgba(128, 128, 255, 0.5)',
                               stroke: new ol.style.Stroke({
                                   color: 'rgb(128, 128, 255)',
                                   width: 5
                               })
                           }),
                           stroke: new ol.style.Stroke({
                               color: 'rgb(128, 128, 255)',
                               width: 5
                           }),
                           image: new ol.style.Circle({
                               radius: 8,
                               fill: new ol.style.Fill({
                                   color: 'rgb(128, 128, 255)'
                               })
                           })
                       }));
                       console.log(feature);
                    });
                    var deSelectedFeatures=e.deselected;
                    deSelectedFeatures.forEach(function(feature){
                        feature.setStyle(jsonStyleFetcher.GetStyle(feature));
                    });

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
        setFeatureStyle(features.getArray());
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

    function setFeatureStyle(features){
        for (var i =0; i< features.length; i++) {
            var feature=features[i];
            if (!feature.getProperties().style) {
                determineStyleFromGeometryType(feature);
            }
        }
    }

    function determineStyleFromGeometryType(feature){
        switch(feature.getGeometry().getType()){
            case('Point'):
                setPointStyle(feature);
                break;
            case('LineString'):
                setLineStringStyle(feature);
                break;
            case('Polygon'):
                setPolygonStyle(feature);
                break;
        }
    }

    function setPointStyle(feature){
        feature.setProperties({
            style: {
                image:{
                    fill: {
                        color: style.getImage().getFill().getColor()
                    },
                    radius: style.getImage().getRadius()
                    //,stroke: style.getStroke().getColor()
                }
            }
        });
    }
    function setLineStringStyle(feature) {
        feature.setProperties({
            style: {
                stroke: {
                    color: style.getStroke().getColor(),
                    // lineCap: style.getStroke().getLineCap(),
                    // lineJoin: style.getStroke().getLineJoin(),
                    lineDash: style.getStroke().getLineDash(),
                    // miterLimit: style.getStroke().getMiterLimit(),
                    width: style.getStroke().getWidth()
                }
            }
        });
    }

    function setPolygonStyle(feature){
        feature.setProperties({
            style: {
                fill: {
                    color: style.getFill().getColor()
                },
                stroke: {
                    color: removeAlphaFromRGBA(style.getFill().getColor()),
                    width: 2
                }
            }
        });
    }

    function removeAlphaFromRGBA(rgba){
        return rgba.replace(',' + rgba.split(',')[3],')').replace('rgba', 'rgb');
    }


    function styleFunction(feature) {
        var featureStyle = feature.getProperties().style;
        if(!featureStyle){
            return style;
        }
        return jsonStyleFetcher.GetStyle(feature);
    }

    function activate(map, options) {
        isActive = true;
        if(!options.style && !style) {
            style=drawStyle.Styles();
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
                eventHandler.TriggerEvent(ISY.Events.EventTypes.DrawFeatureEnd, format.writeFeatures(source.getFeatures()));
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