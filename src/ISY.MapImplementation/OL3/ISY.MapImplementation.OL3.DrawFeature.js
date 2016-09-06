var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.DrawFeature = function(eventHandler){

    var isActive = false;
    var circleFeature; // The circle feature
    var circleOverlay; // Overlay for the circle
    var translate;

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
     * The measure tooltip element.
     * @type {Element}
     */
    var measureTooltipElement;


    /**
     * Overlay to show the measurement.
     * @type {ol.Overlay}
     */
    var measureTooltip;


    /**
     * Message to show when the user is drawing a polygon.
     * @type {string}
     */
    //var continuePolygonMsg = 'Click to continue drawing the polygon';


    /**
     * Message to show when the user is drawing a line.
     * @type {string}
     */
    var continueLineMsg = 'Click to continue drawing the line';


    /**
     * Handle pointer move.
     * @param {ol.MapBrowserEvent} evt
     */
    var pointerMoveHandler = function(evt) {
        if (evt.dragging || !isActive) {
            return;
        }
        /** @type {string} */
        var helpMsg = translate['start_drawing'];//'Click to start drawing';

        if (sketch) {
            var geom = (sketch.getGeometry());
            if (geom instanceof ol.geom.Polygon) {
                helpMsg = translate['continue_drawing'];//continuePolygonMsg;
            } else if (geom instanceof ol.geom.LineString) {
                helpMsg = continueLineMsg;
            }
        }
        helpTooltipElement.innerHTML = helpMsg;
        helpTooltip.setPosition(evt.coordinate);

        $(helpTooltipElement).removeClass('hidden');
    };

    var draw; // global so we can remove it later
    var drawLayer;
    function addInteraction(map) {
        circleOverlay = new ol.layer.Vector({
            map: map,
            source: new ol.source.Vector({
                useSpatialIndex: false // optional, might improve performance
            }),
            updateWhileAnimating: true, // optional, for instant visual feedback
            updateWhileInteracting: true // optional, for instant visual feedback
        });
        //map.addOverlay(circleOverlay);
        var type ='Polygon';// (typeSelect.value == 'area' ? 'Polygon' : 'LineString');
        var source = new ol.source.Vector();
        var drawStyle = new ISY.MapImplementation.OL3.Styles.Measure();
        draw = new ol.interaction.Draw({
            source: source,
            style: drawStyle.DrawStyles(),
            type: /** @type {ol.geom.GeometryType} */ (type)
        });
        drawLayer = new ol.layer.Vector({
            source: source,
            style: drawStyle.DrawStyles()
        });

        map.addInteraction(draw);
        map.addLayer(drawLayer);

        createMeasureTooltip(map);
        createHelpTooltip(map);

        var listener;
        draw.on('drawstart',
            function(evt) {
                // set sketch
                sketch = evt.feature;

                var firstPoint = sketch.getGeometry().getCoordinates()[0][0];
                circleFeature = new ol.Feature(new ol.geom.Circle(firstPoint, 0));
                circleOverlay.getSource().addFeature(circleFeature);
            }, this);

        draw.on('drawend',
            function(evt) {
                measureTooltipElement.className = 'tooltip tooltip-static';
                measureTooltip.setOffset([0, -7]);
                // unset sketch
                sketch = null;
                // unset tooltip so that a new one can be created
                measureTooltipElement = null;
                createMeasureTooltip(map);
                ol.Observable.unByKey(listener);

                sketch = evt.feature;

                eventHandler.TriggerEvent(ISY.Events.EventTypes.DrawFeatureEnd, sketch.getGeometry().getCoordinates());
            }, this);
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


    /**
     * Creates a new measure tooltip
     */
    function createMeasureTooltip(map) {
        if (measureTooltipElement) {
            if (measureTooltipElement.parentNode !== null){
                measureTooltipElement.parentNode.removeChild(measureTooltipElement);
            }
        }
        measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'tooltip tooltip-measure';
        measureTooltip = new ol.Overlay({
            element: measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center'
        });
        map.addOverlay(measureTooltip);
    }

    function  activate(map, options){
        isActive = true;
        translate = options.translate;
        map.on('pointermove', pointerMoveHandler);

        $(map.getViewport()).on('mouseout', function() {
            $(helpTooltipElement).addClass('hidden');
        });
        addInteraction(map);
    }

    function deactivate(map){
        if (isActive) {
            isActive = false;
            if (map !== undefined) {
                map.removeLayer(drawLayer);
                //map.unByKey(pointerUp);
                //map.unByKey(pointerMove);
                //pointerUp = "";
                //pointerMove = "";
                measureTooltipElement.className = 'tooltip tooltip-static';
                measureTooltip.setOffset([0, -7]);
                //currentFeature = null;
                measureTooltipElement = null;
                map.removeInteraction(draw);
                map.removeOverlay(circleOverlay);
                map.removeOverlay(measureTooltip);
                map.removeOverlay(helpTooltip);
                if (helpTooltipElement) {
                    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
                    //helpTooltipElement = null;
                }
                if (measureTooltipElement) {
                    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
                    //measureTooltipElement = null;
                }
                //$(elementInfo).popover('destroy');
                //$(element).popover('destroy');
                var tooltipStaticElements = document.getElementsByClassName('tooltip tooltip-static');
                while(tooltipStaticElements.length > 0){
                    var staticElement = tooltipStaticElements[0];
                    staticElement.parentNode.removeChild(staticElement);
                }
            }
            eventHandler.TriggerEvent(ISY.Events.EventTypes.MeasureEnd);
        }
    }

    return {
        Activate: activate,
        Deactivate: deactivate
    };
};