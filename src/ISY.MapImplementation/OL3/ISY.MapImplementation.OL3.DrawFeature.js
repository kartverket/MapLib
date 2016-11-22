var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.DrawFeature = function(eventHandler) {

    var eventHandlers = {
        modify: [],
        source: [],
        select: [],
        draw: []
    };
    var text = false;
    var style;
    var type;
    var isActive = false;
    var draw; // global so we can remove it later
    var modify;
    var snap;
    var select;
    var listener;
    var measureTooltipElement;
    var measureTooltip;
    var modificationActive = false;
    var wgs84Sphere = new ol.Sphere(6378137);
    var format = new ol.format.GeoJSON({
            defaultDataProjection: 'EPSG:25833',
            projection: 'EPSG:25833'
        }
    );
    var features = new ol.Collection();
    var source = new ol.source.Vector({features: features});
    var drawLayer;
    var drawStyle = new ISY.MapImplementation.OL3.Styles.Measure();
    var jsonStyleFetcher = new ISY.MapImplementation.OL3.Styles.Json();
    var guidCreator = new ISY.Utils.Guid();
    var selectedFeatureId;
    var selectedFeature;
    var showMeasurements;


    function addEventHandlers(map, showMeasurements) {
        if (source) {
            eventHandlers['source'].push(source.on('addfeature',
                function () {
                    drawFeatureEnd();
                }, this));
            eventHandlers['source'].push(source.on('removefeature',
                function () {
                    drawFeatureEnd();
                }, this));
        }
        if (modify) {
            eventHandlers['modify'].push(modify.on('modifystart',
                function () {
                    modificationActive = true;
                }, this));
            eventHandlers['modify'].push(modify.on('modifyend',
                function (evt) {
                    var feature = evt.features.getArray()[0];
                    feature.setProperties({measurement: getMeasurements(feature.getGeometry(), map)});
                    modificationActive = false;
                    drawFeatureEnd();
                }, this));
        }
        if (select) {
            eventHandlers['select'].push(select.on('select',
                function (e) {
                    var selectedFeatures = e.selected;
                    // selectedFeatures.forEach(function(feature) {
                    //     setSelectedStyle(feature);
                    // });
                    // var deSelectedFeatures=e.deselected;
                    // deSelectedFeatures.forEach(function(feature) {
                    //     feature.setStyle(jsonStyleFetcher.GetStyle(feature));
                    // });
                    if (selectedFeatures.length == 1) {
                        eventHandler.TriggerEvent(ISY.Events.EventTypes.DrawFeatureSelect, selectedFeatures[0].getId());
                    }
                }, this));
        }
        if (showMeasurements) {
            eventHandlers['draw'].push(draw.on('drawstart',
                function (evt) {
                    showTooltip(evt, map);
                }, this));
            eventHandlers['draw'].push(draw.on('drawend',
                function () {
                    removeMeasureTooltip(map);
                }, this));
            if (modify) {
                eventHandlers['modify'].push(modify.on('modifystart',
                    function (evt) {
                        showTooltip(evt, map);
                    }, this));
                eventHandlers['modify'].push(modify.on('modifyend',
                    function () {
                        removeMeasureTooltip(map);
                    }, this));
            }
        }
        eventHandlers['draw'].push(draw.on('drawstart',
            function () {
                _removeDoubleClickZoom(map);
            }));
        eventHandlers['draw'].push(draw.on('drawend',
            function (evt) {
                evt.feature.setProperties({measurement: getMeasurements(evt.feature.getGeometry(), map)});
            }));
    }

    function showTooltip(evt, map) {
        createMeasureTooltip(map);
        // set sketch
        sketch = evt.feature || evt.features.getArray()[0];
        listener = sketch.getGeometry().on('change', function (evt) {
            var output = getMeasurements(evt.target, map);
            sketch.setProperties({measurement: output});
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(getTooltipCoord(evt.target));
        });
    }

    function getMeasurements(geom, map) {
        if (geom instanceof ol.geom.Polygon) {
            return formatArea(map, geom);
        } else if (geom instanceof ol.geom.LineString) {
            return formatLength(map, geom);
        }
    }

    function getTooltipCoord(geom) {
        if (geom instanceof ol.geom.Polygon) {
            return geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof ol.geom.LineString) {
            return geom.getLastCoordinate();
        }
    }

    function setSelectedStyle(feature) {
        var selectedColor = 'rgb(128, 128, 255)';
        var selectedStyles;
        jsonStyleFetcher.GetStyle(feature);
        var featureStyle = feature.getStyle();
        if (!featureStyle) {
            featureStyle = style;
        }
        if (featureStyle.length) {
            featureStyle = featureStyle[0];
        }

        switch (feature.getGeometry().getType()) {
            case('Point'):
                selectedStyles = setSelectedPointStyle(featureStyle, selectedColor);
                break;
            case('LineString'):
                selectedStyles = setSelectedLineStringStyle(featureStyle, selectedColor);
                break;
            case('Polygon'):
                selectedStyles = setSelectedPolygonStyle(featureStyle, selectedColor);
                break;
        }
        feature.setStyle(selectedStyles);
    }

    function setSelectedPointStyle(featureStyle, selectedColor) {
        if (featureStyle.getText()) {
            return [setSelectedTextStyle(featureStyle, selectedColor), featureStyle];
        }
        else {
            return [new ol.style.Style({
                image: new ol.style.RegularShape({
                    fill: new ol.style.Fill({
                        color: selectedColor
                    }),
                    radius: featureStyle.getImage().getRadius() + 3,
                    points: featureStyle.getImage().getPoints()
                })
            }), featureStyle];
        }
    }

    function setSelectedLineStringStyle(featureStyle, selectedColor) {
        return [new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: selectedColor,
                lineDash: featureStyle.getStroke().getLineDash(),
                width: featureStyle.getStroke().getWidth() + 5
            })
        }), featureStyle];
    }

    function setSelectedPolygonStyle(featureStyle, selectedColor) {
        return [new ol.style.Style({
            fill: featureStyle.getFill(),
            stroke: new ol.style.Stroke({
                color: selectedColor,
                width: 7
            })
        })];
    }

    function setSelectedTextStyle(featureStyle, selectedColor) {
        return new ol.style.Style({
            text: new ol.style.Text({
                    font: featureStyle.getText().getFont(),
                    text: featureStyle.getText().getText(),
                    stroke: new ol.style.Stroke({
                        color: selectedColor,
                        width: featureStyle.getText().getStroke().getWidth() + 5
                    }),
                    fill: featureStyle.getText().getFill()
                }
            )
        });
    }

    function removeEventHandlers() {
        removeSpecificEventHandlers(modify, 'modify');
        removeSpecificEventHandlers(source, 'source');
        removeSpecificEventHandlers(select, 'select');
        removeSpecificEventHandlers(draw, 'draw');
    }

    function removeSpecificEventHandlers(interaction, name) {
        for (var sourceEvent = 0; sourceEvent < eventHandlers[name].length; sourceEvent++) {
            interaction.unByKey(eventHandlers[name][sourceEvent]);
        }
    }

    function drawFeatureEnd() {
        setFeatureDefaultValues(features.getArray());
        if (!modificationActive) {
            eventHandler.TriggerEvent(ISY.Events.EventTypes.DrawFeatureEnd, format.writeFeatures(source.getFeatures()));
        }
    }

    function addDrawInteraction(map, type) {
        if (draw && draw.type == type) {
            return;
        }
        draw = new ol.interaction.Draw({
            source: source,
            type: (type),
            condition: function (event) {
                return _checkForNoKeys(event) && !modificationActive && !_checkForEmptyText();
            }
        });
        map.addInteraction(draw);
    }

    var _checkForEmptyText = function () {
        return text && style.getText().getText() === "";
    };

    function addModifyInteraction(map) {
        modify = new ol.interaction.Modify({
            features: select.getFeatures(),
            condition: function (event) {
                return _checkForNoKeys(event);
            },
            deleteCondition: function (event) {
                return _checkForShiftKey(event);
            }
        });
        map.addInteraction(modify);
    }

    function _checkForShiftKey(event) {
        return ol.events.condition.shiftKeyOnly(event) &&
            event.type == 'pointerdown';
    }

    function _checkForNoKeys(event) {
        return event.type == 'pointerdown' &&
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

    function addSelectInteraction(map) {
        var selectOptions = {
            condition: ol.events.condition.click,
            layers: [drawLayer]
        };
        if (selectedFeature) {
            selectOptions['features'] = [selectedFeature];
        }
        select = new ol.interaction.Select(selectOptions);
        map.addInteraction(select);
    }

    function initiateDrawing(newFeatures) {
        features = new ol.Collection(newFeatures);
        source = new ol.source.Vector({features: features});
        drawLayer = new ol.layer.Vector({
            source: source,
            style: styleFunction
        });
        drawLayer.set('id', 'drawing');
    }

    function setFeatureDefaultValues(features) {
        for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            if (!feature.getId()) {
                feature.setId(guidCreator.NewGuid());
            }
            if (!feature.getProperties().style) { //} || feature.getId()==selectedFeatureId) {
                determineStyleFromGeometryType(feature);
                //selectedFeature=feature;
            }
        }
    }

    function determineStyleFromGeometryType(feature) {
        switch (feature.getGeometry().getType()) {
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

    function setPointStyle(feature) {
        var properties;
        if (style.getText().getText() !== "") {
            properties = {
                style: {
                    text: getTextFromInputStyle()
                }
            };
        }
        else {
            properties = {
                style: {
                    regularshape: {
                        fill: {
                            color: style.getImage().getFill().getColor()
                        },
                        points: style.getImage().getPoints(),
                        radius: style.getImage().getRadius()
                        //,radius2: style.getImage().getRadius2()
                        //,stroke: style.getStroke().getColor()
                    }
                }
            };
        }

        feature.setProperties(properties);
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

    function setPolygonStyle(feature) {
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

    function getTextFromInputStyle() {
        var textStyle = {
            font: style.getText().getFont(),
            text: style.getText().getText(),
            fill: {
                color: style.getText().getFill().getColor()
            }

        };

        if (style.getText().getStroke()) {
            var textStroke = {
                color: style.getText().getStroke().getColor(),
                width: style.getText().getStroke().getWidth()
            };
            textStyle['stroke'] = textStroke;
        }
        return textStyle;
    }

    function removeAlphaFromRGBA(rgba) {
        return rgba.replace(',' + rgba.split(',')[3], ')').replace('rgba', 'rgb');
    }

    function styleFunction(feature) {
        jsonStyleFetcher.GetStyle(feature);
        if (showMeasurements) {
            var measurement = feature.getProperties().measurement;
            switch (feature.getGeometry().getType()) {
                case('Point'):
                    return;
                case('LineString'):
                    return addMeasurementsToLinestringStyle(feature, measurement);
                case('Polygon'):
                    return addMeasurementsToPolygonStyle(feature, measurement);
            }
        }
    }

    function addMeasurementsToLinestringStyle(feature, measurement) {
        var featureStyle = feature.getStyle()[0];
        var newFeatureStyle = new ol.style.Style({
            stroke: featureStyle.getStroke(),
            text: new ol.style.Text({
                    font: style.getText().font,
                    text: measurement,
                    fill: new ol.style.Fill({
                        color: '#000000'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255,255,255,1)',
                        width: 10
                    })
                }
            )
        });
        feature.setStyle(newFeatureStyle);
        return newFeatureStyle;
    }

    function addMeasurementsToPolygonStyle(feature, measurement) {
        var featureStyle = feature.getStyle()[0];
        var newFeatureStyle = new ol.style.Style({
            fill: featureStyle.getFill(),
            stroke: featureStyle.getStroke(),
            text: new ol.style.Text({
                    font: style.getText().font,
                    text: superscriptLabel(measurement),
                    fill: new ol.style.Fill({
                        color: '#000000'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255,255,255,1)',
                        width: 10
                    })
                }
            )
        });
        feature.setStyle(newFeatureStyle);
        return newFeatureStyle;
    }

    function superscriptLabel(measurement) {
        var htmlElem = document.createElement('span');
        htmlElem.innerHTML = measurement;
        for (var i = 0; i < htmlElem.children.length; i++) {
            var child = htmlElem.children[i];
            if (child.tagName === 'SUP') {
                if (child.textContent <= 3 && child.textContent > 1) {
                    child.textContent = String.fromCharCode(child.textContent.charCodeAt(0) + 128);
                } else if (child.textContent > 3 && child.textContent <= 9) {
                    child.textContent = String.fromCharCode(child.textContent.charCodeAt(0) + 8256);
                }
            }
        }
        return htmlElem.textContent;
    }

    var formatLength = function (map, line) {
        var length;
        // if (geodesicCheckbox.checked) {
        var coordinates = line.getCoordinates();
        length = 0;
        var sourceProj = map.getView().getProjection();
        for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
            var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
            var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
            length += wgs84Sphere.haversineDistance(c1, c2);
        }
        // } else {
        //     length = Math.round(line.getLength() * 100) / 100;
        // }
        var output;
        if (length > 100) {
            output = (Math.round(length / 1000 * 100) / 100) +
                ' ' + 'km';
        } else {
            output = (Math.round(length * 100) / 100) +
                ' ' + 'm';
        }
        return output;
    };

    var formatArea = function (map, polygon) {
        var area;
        // if (geodesicCheckbox.checked) {
        var sourceProj = map.getView().getProjection();
        var geom = (polygon.clone().transform(
            sourceProj, 'EPSG:4326'));
        var coordinates = geom.getLinearRing(0).getCoordinates();
        area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
        // } else {
        //     area = polygon.getArea();
        // }
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

    function createMeasureTooltip(map) {
        removeMeasureTooltip(map);
        measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'tooltip tooltip-measure';
        measureTooltip = new ol.Overlay({
            element: measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center'
        });
        map.addOverlay(measureTooltip);
    }

    function removeMeasureTooltip(map) {
        if (measureTooltipElement && measureTooltipElement.parentNode) {
            measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        }
        map.removeOverlay(measureTooltip);
    }

    var _removeDoubleClickZoom = function (map) {
        map.getInteractions().forEach(function (interaction) {
            if (interaction instanceof ol.interaction.DoubleClickZoom) {
                map.removeInteraction(interaction);
                return;
            }
        });
    };

    var _applyDoubleClickZoom = function (map) {
        _removeDoubleClickZoom(map);
        map.addInteraction(
            new ol.interaction.DoubleClickZoom()
        );
    };

    function activate(map, options) {
        isActive = true;
        text = false;
        showMeasurements = options.showMeasurements;
        if (!options.style && !style) {
            style = drawStyle.Styles();
        }
        else {
            style = options.style;
        }
        if (options.GeoJSON) {
            if (options.GeoJSON == 'remove') {
                initiateDrawing();
            }
            else if (options.deleteFeature && options.selectedFeatureId) {
                source.removeFeature(source.getFeatureById(options.selectedFeatureId));
                selectedFeatureId = undefined;
                selectedFeature = undefined;
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
        if (!options.deleteFeature && options.selectedFeatureId) {
            if (options.selectionActive) {
                selectedFeatureId = options.selectedFeatureId;
                selectedFeature = source.getFeatureById(selectedFeatureId);
                determineStyleFromGeometryType(selectedFeature);
                setSelectedStyle(selectedFeature);
            }
        }
        else {
            selectedFeatureId = undefined;
            selectedFeature = undefined;
        }
        map.getLayers().forEach(function (layer) {
                if (layer.get('id') == 'drawing') {
                    map.removeLayer(layer);
                }
            }
        );
        map.addLayer(drawLayer);

        switch (options.mode) {
            case('modify'):
                addSelectInteraction(map);
                addModifyInteraction(map);
                break;
            case('draw'):
                if (options.type != 'Active') {
                    type = options.type;
                }
                if (options.type == 'Text') {
                    type = 'Point';
                    text = true;
                }
                addDrawInteraction(map, type);
                break;
        }
        if (options.snap) {
            addSnapInteraction(map);
        }
        addEventHandlers(map, options.showMeasurements);

        drawFeatureEnd();
    }

    function deactivate(map) {
        if (isActive) {
            isActive = false;
            if (map !== undefined) {
                map.removeInteraction(draw);
                map.removeInteraction(modify);
                map.removeInteraction(snap);
                map.removeInteraction(select);
                removeEventHandlers();
                _applyDoubleClickZoom(map);
            }
        }
    }

    return {
        Activate: activate,
        Deactivate: deactivate
    };
};