var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.AddLayerFeature = function(eventHandler){

    var isActive = false;
    var translate;
    var typeObject;
    var snappingFeatures;

    /**
     * Currently drawn feature.
     * @type {ol.Feature}
     */
    var sketch;

    /**
     * The help tooltip element.
     * @type {Element}
     */
    var helpTooltipElement;

    /**
     * Overlay to show the help messages.
     * @type {ol.Overlay}
     */
    var helpTooltip;

    /**
     * Handle pointer move.
     * @param {ol.MapBrowserEvent} evt
     */
    var startModify = false;

    var pointerMoveHandler = function(evt) {
        //if (!startModify || !isActive) {
        if (!isActive) {
            return;
        }
        /** @type {string} */
        var helpMsg = translate['add_layer_start_drawing'];//'Click to start drawing';

        if (sketch && !startModify) {
            helpMsg = translate['add_layer_continue_drawing'];//continuePolygonMsg;
        }
        if (startModify){
            helpMsg = translate['add_layer_modify_object'];//'Click to start drawing';
        }
        helpTooltipElement.innerHTML = helpMsg;
        helpTooltip.setPosition(evt.coordinate);

        $(helpTooltipElement).removeClass('hidden');
    };

    var draw; // global so we can remove it later
    var drawLayer;
    var modify;
    var snapping;
    var source = new ol.source.Vector();
    var drawStyle = new ISY.MapImplementation.OL3.Styles.Default();
    var features;

    function addInteraction(map, features) {


        if (typeObject === "Line"){
            typeObject = "LineString";
        }

        draw = new ol.interaction.Draw({
            source: source,
            style: drawStyle.Styles(),
            type: /** @type {ol.geom.GeometryType} */ (typeObject)
        });

        map.addInteraction(draw);
        addLayer(map, features);

        //var snappingFeaturesCollection = new ol.Collection(snappingFeatures);
        //snapping = new ol.interaction.Snap({
        //    features: snappingFeaturesCollection
        //});
        //
        //map.addInteraction(snapping);
        initSnapping(map);

        //createMeasureTooltip(map);
        createHelpTooltip(map);

        var listener;
        draw.on('drawstart',
            function(evt) {
                // set sketch
                sketch = evt.feature;

                var tooltipCoord = evt.coordinate;

                listener = sketch.getGeometry().on('change', function(evt) {
                    var geom = evt.target;
                    var output;
                    if (geom instanceof ol.geom.Polygon) {
                        output = "";//formatArea(/** @type {ol.geom.Polygon} */ (geom));
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    } else if (geom instanceof ol.geom.LineString) {
                        output = "";//formatLength( /** @type {ol.geom.LineString} */ (geom));
                        tooltipCoord = geom.getLastCoordinate();
                    }
                    //measureTooltipElement.innerHTML = output.string;
                    eventHandler.TriggerEvent(ISY.Events.EventTypes.MeasureMouseMove, output);
                    //measureTooltip.setPosition(tooltipCoord);
                });




            }, this);

        draw.on('drawend',
            function(evt) {
                map.removeInteraction(snapping);
                sketch = null;
                ol.Observable.unByKey(listener);

                sketch = evt.feature;
                if(!features){
                    features=new ol.Collection([sketch]);
                }
                //var newFeatures = new ol.Collection([sketch]);
                modify = new ol.interaction.Modify({
                    features: features,

                    deleteCondition: function(event) {
                        return ol.events.condition.shiftKeyOnly(event) &&
                            ol.events.condition.singleClick(event);
                    }
                });

                map.addInteraction(modify);

                initSnapping(map);

                eventHandler.TriggerEvent(ISY.Events.EventTypes.AddLayerFeatureEnd, sketch);

                startModify = true;
                modify.on('modifyend',
                    function(evt) {
                        sketch = null;
                        ol.Observable.unByKey(listener);
                        sketch = evt.features.getArray()[0];  //evt.feature;
                        eventHandler.TriggerEvent(ISY.Events.EventTypes.AddLayerFeatureEnd, sketch);
                    }, this);
                map.removeInteraction(draw);

            }, this);
    }

    function addLayer(map, gpx){
        if(gpx){
            var format = new ol.format.GPX({
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:25833'
                }
            );
            features=format.readFeatures(gpx);
            features[0].getGeometry().transform('EPSG:4326', 'EPSG:25833');
            var featureCollection=new ol.Collection(features);
            source = new ol.source.Vector({features: featureCollection});
        }
        drawLayer = new ol.layer.Vector({
            source: source,
            style: drawStyle.Styles()
        });
        map.addLayer(drawLayer);
        if(gpx){
            eventHandler.TriggerEvent(ISY.Events.EventTypes.AddLayerFeatureEnd, features[0]);
        }
    }

    function initSnapping(map){
        var snappingFeaturesCollection = new ol.Collection(snappingFeatures);
        snapping = new ol.interaction.Snap({
            features: snappingFeaturesCollection
        });

        map.addInteraction(snapping);
    }

    /**
     * Creates a new help tooltip
     */
    function createHelpTooltip(map) {
        if (helpTooltipElement) {
            if (helpTooltipElement.parentNode !== null){
                helpTooltipElement.parentNode.removeChild(helpTooltipElement);
            }
        }
        helpTooltipElement = document.createElement('div');
        helpTooltipElement.className = 'tooltip hidden';
        helpTooltip = new ol.Overlay({
            element: helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left'
        });
        map.addOverlay(helpTooltip);
    }

    var _removeDoubleClickZoom = function (map) {
        map.getInteractions().forEach(function (interaction) {
            if (interaction instanceof ol.interaction.DoubleClickZoom) {
                map.removeInteraction(interaction);
            }
        });
    };

    var _applyDoubleClickZoom = function (map){
        _removeDoubleClickZoom(map);
        map.addInteraction(
            new ol.interaction.DoubleClickZoom()
        );
    };

    function activate(map, options){
        isActive = true;
        translate = options.translate;
        typeObject = options.toolType;//type;
        snappingFeatures = options.snappingFeatures;
        //console.log(options.features);

        map.on('pointermove', pointerMoveHandler);

        $(map.getViewport()).on('mouseout', function() {
            $(helpTooltipElement).addClass('hidden');
        });
        var features=options.features;
        addInteraction(map, features);
        _removeDoubleClickZoom(map);
    }

    function _removeOverlays(map){

        map.removeInteraction(draw);

        map.removeOverlay(helpTooltip);
        if (helpTooltipElement !== null) {
            if (helpTooltipElement.parentNode !== null){
                helpTooltipElement.parentNode.removeChild(helpTooltipElement);
            }
        }

        var tooltipStaticElements = document.getElementsByClassName('tooltip tooltip-static');
        while(tooltipStaticElements.length > 0){
            var staticElement = tooltipStaticElements[0];
            staticElement.parentNode.removeChild(staticElement);
        }
    }

    function deactivate(map){
        _applyDoubleClickZoom(map);
        if (isActive) {
            isActive = false;
            startModify = false;
            sketch = null;
            if (map !== undefined) {
                map.removeLayer(drawLayer);
                map.removeInteraction(modify);
                map.removeInteraction(snapping);
                _removeOverlays(map);
            }
        }
    }

    return {
        Activate: activate,
        Deactivate: deactivate
    };
};