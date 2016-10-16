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
    var guidCreator = new ISY.Utils.Guid();
    var selectedFeatureId;
    var selectedFeature;


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
                    if (selectedFeatures.length == 1) {
                        eventHandler.TriggerEvent(ISY.Events.EventTypes.DrawFeatureSelect, selectedFeatures[0].getId());
                    }
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
        setFeatureDefaultValues(features.getArray());
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
            features: select.getFeatures(),
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
        var selectOptions = {
            condition: ol.events.condition.click
        };
        if (selectedFeature){
            selectOptions['features']=[selectedFeature];
        }
select = new ol.interaction.Select(selectOptions);
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

    function setFeatureDefaultValues(features){
        for (var i =0; i< features.length; i++) {
            var feature=features[i];
            if(!feature.getId()) {
                feature.setId(guidCreator.NewGuid());
            }
            if (!feature.getProperties().style || feature.getId()==selectedFeatureId) {
                determineStyleFromGeometryType(feature);
                selectedFeature=feature;
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
                regularshape:{
                    fill: {
                        color: style.getImage().getFill().getColor()
                    },
                    points: style.getImage().getPoints(),
                    radius: style.getImage().getRadius()
                    //,radius2: style.getImage().getRadius2()
                    //,stroke: style.getStroke().getColor()
                },
                text: getText()
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
                },
                text: getText()
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
                },
                text: getText()
            }
        });
    }

    function getText(){
        return {
            font: style.getText().getFont(),
            text: style.getText().getText(),
            fill: {
                color: style.getText().getFill().getColor()
            },
            stroke: {
                color: style.getText().getStroke().getColor(),
                width: style.getText().getStroke().getWidth()
        }
        };
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
        if (options.selectedFeatureId) {
            if (options.selectionActive) {
                selectedFeatureId = options.selectedFeatureId;
                setFeatureDefaultValues(features.getArray());
            }
        }
        else{
            selectedFeature=undefined;
        }
        map.addLayer(drawLayer);
        switch (options.mode){
            case('modify'):
                addSelectInteraction(map);
                addModifyInteraction(map);
                break;
            case('draw'):
                if(options.type!='Active'){
                    type=options.type;
                }
                addDrawInteraction(map, type);
                break;
        }
        if (options.snap) {
            addSnapInteraction(map);
        }
        addEventHandlers();
        drawFeatureEnd();
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