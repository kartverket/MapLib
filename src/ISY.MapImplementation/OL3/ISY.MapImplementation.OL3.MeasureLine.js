var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.MeasureLine = function(eventHandler){

    var isActive = false;
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
    var continuePolygonMsg = 'Click to continue drawing the polygon';


    /**
     * Message to show when the user is drawing a line.
     * @type {string}
     */
    //var continueLineMsg = 'Click to continue drawing the line';


    /**
     * Handle pointer move.
     * @param {ol.MapBrowserEvent} evt
     */
    var pointerMoveHandler = function(evt) {
        if (evt.dragging || !isActive) {
            return;
        }
        /** @type {string} */
        var helpMsg = translate['start_measure_line'];//'Click to start drawing';

        if (sketch) {
            var geom = (sketch.getGeometry());
            if (geom instanceof ol.geom.Polygon) {
                helpMsg = continuePolygonMsg;
            } else if (geom instanceof ol.geom.LineString) {
                helpMsg = translate['continue_measure_line'];
            }
        }
        helpTooltipElement.innerHTML = helpMsg;
        helpTooltip.setPosition(evt.coordinate);

        $(helpTooltipElement).removeClass('hidden');
    };

    var draw; // global so we can remove it later
    var drawLayer;
    function addInteraction(map) {
        var type ='LineString';// (typeSelect.value == 'area' ? 'Polygon' : 'LineString');
        var source = new ol.source.Vector();
        draw = new ol.interaction.Draw({
            source: source,
            type: /** @type {ol.geom.GeometryType} */ (type)
        });
        var measureStyle = new ISY.MapImplementation.OL3.Styles.Measure();
        drawLayer = new ol.layer.Vector({
                    source: source,
                    style: measureStyle.Styles()
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

                /** @type {ol.Coordinate|undefined} */
                var tooltipCoord = evt.coordinate;

                listener = sketch.getGeometry().on('change', function(evt) {
                    var geom = evt.target;
                    var output;
                    if (geom instanceof ol.geom.Polygon) {
                        output = formatArea(/** @type {ol.geom.Polygon} */ (geom));
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    } else if (geom instanceof ol.geom.LineString) {
                        output = formatLength( /** @type {ol.geom.LineString} */ (geom));
                        tooltipCoord = geom.getLastCoordinate();
                    }
                    measureTooltipElement.innerHTML = output.string;
                    eventHandler.TriggerEvent(ISY.Events.EventTypes.MeasureMouseMove, output);
                    measureTooltip.setPosition(tooltipCoord);
                });
            }, this);

        draw.on('drawend',
            function() {
                measureTooltipElement.className = 'tooltip tooltip-static';
                measureTooltip.setOffset([0, -7]);
                // unset sketch
                sketch = null;
                // unset tooltip so that a new one can be created
                measureTooltipElement = null;
                createMeasureTooltip(map);
                ol.Observable.unByKey(listener);
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

    /**
     * format length output
     * @param {ol.geom.LineString} line
     * @return {string}
     */
    var formatLength = function(line) {
        var length = Math.round(line.getLength() * 100) / 100;
        var output;
        var unit;
        var value;
        if (length > 1000) {
            unit = 'km';
            value = Math.round(length / 1000 * 100) / 100;
            output = value + ' ' + unit;
        } else {
            unit = 'm';
            value = Math.round(length * 100) / 100;
            output = value + ' ' + unit;
        }
        return {
            string: output,
            unit: unit,
            value: value,
            order: 1
        };
    };


    /**
     * format length output
     * @param {ol.geom.Polygon} polygon
     * @return {string}
     */
    var formatArea = function(polygon) {
        var area = polygon.getArea();
        var output;
        if (area > 10000) {
            output = (Math.round(area / 1000000 * 100) / 100) +
                ' ' + 'km<sup>2</sup>';
        } else {
            output = (Math.round(area * 100) / 100) +
                ' ' + 'm<sup>2</sup>';
        }
        return output;
    };

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
                    measureTooltipElement.className = 'tooltip tooltip-static';
                    measureTooltip.setOffset([0, -7]);
                    measureTooltipElement = null;
                    map.removeInteraction(draw);
                    map.removeOverlay(measureTooltip);
                    map.removeOverlay(helpTooltip);
                    if (helpTooltipElement) {
                        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
                    }
                    if (measureTooltipElement) {
                        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
                    }
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