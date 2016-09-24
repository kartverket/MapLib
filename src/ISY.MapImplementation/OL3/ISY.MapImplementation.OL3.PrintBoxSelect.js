var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.PrintBoxSelect = function() {

    var isActive = false;
    var printBoxSelectionLayer;
    var oldCenter = {};
    var oldUTMZone = "";
    var scale = 25000;
    var oldInteraction={};

    function _UTMZoneNotChanged(map) {
        if (!isActive) {
            return;
        }
        var mapCenterGeographic=_getMapCenterGeographic(map);
        var UTMZone = _getUTMZone(mapCenterGeographic.getCoordinates()[0], mapCenterGeographic.getCoordinates()[1]).sone;
        if (UTMZone != oldUTMZone){
            _createFrame(map);
            return false;
        }
        return true;
    }

    // var deregisterMouseEvents = function(map){
    //     map.getView().un('change:center');
    //     // map.un('moveend');
    // };

    var _registerMouseEvents = function (map) {
        map.getView().on('change:center', function() {
            if(_UTMZoneNotChanged(map)) {
                var deltaCenter = _findDelta(map);
                _moveLayer(map, deltaCenter);
            }
        });

        // map.on('moveend', function() {
        // });
    };

    var _getMapCenter = function (map){
        return map.getView().getCenter();
    };

    var _getMapCenterGeographic = function(map){
        var mapCenterGeographic = new ol.geom.Point(_getMapCenter(map));
        mapCenterGeographic.applyTransform(ol.proj.getTransform('EPSG:32633', 'EPSG:4326'));
        return mapCenterGeographic;
    };

    var _findDelta = function (map) {
        var newCenter = map.getView().getCenter();
        var deltaCenter = [
            newCenter[0] - oldCenter[0],
            newCenter[1] - oldCenter[1]
        ];
        oldCenter = newCenter;
        return deltaCenter;
    };

    var _moveLayer = function(map, deltaCenter){
        var source = printBoxSelectionLayer.getSource();
        var feature = source.getFeatures()[0];
        feature.getGeometry().translate(deltaCenter[0],deltaCenter[1]);
    };

    var _getUTMZone = function(lon, lat) {
        // From emergencyPoster.js
        var sone = "32V", localProj = "EPSG:32632";
        if (lat > 72) {
            if (lon < 21) {
                sone = "33X"; localProj = "EPSG:32633";
            } else {
                sone = "35X"; localProj = "EPSG:32635";
            }
        } else if (lat > 64) {
            if (lon < 6) {
                sone = "31W"; localProj = "EPSG:32631";
            } else if (lon < 12) {
                sone = "32W"; localProj = "EPSG:32632";
            } else if (lon < 18) {
                sone = "33W"; localProj = "EPSG:32633";
            } else if (lon < 24) {
                sone = "34W"; localProj = "EPSG:32634";
            } else if (lon < 30) {
                sone = "35W"; localProj = "EPSG:32635";
            } else {
                sone = "36W"; localProj = "EPSG:32636";
            }
        } else {
            if (lon < 3) {
                sone = "31V"; localProj = "EPSG:32631";
            } else if (lon >= 12) {
                sone = "33V"; localProj = "EPSG:32633";
            }
        }
        return {'sone':sone, 'localProj': localProj};
    };

    var _createFrame = function(map){
        if(printBoxSelectionLayer)
        {
            map.removeLayer(printBoxSelectionLayer);
        }
        var mapCenter = _getMapCenter(map);
        oldCenter = mapCenter;

        var mapCenterGeographic =_getMapCenterGeographic(map);
        var UTM = _getUTMZone(mapCenterGeographic.getCoordinates()[0], mapCenterGeographic.getCoordinates()[1]);
        oldUTMZone = UTM.sone;
        var mapCenterActiveUTMZone = new ol.geom.Point(mapCenter);
        mapCenterActiveUTMZone.applyTransform(ol.proj.getTransform('EPSG:32633', UTM.localProj));

        var cols = 4;
        var rows = 3;
        var pageMargin = 1.7; // cm
        var pageWidth = 21 - (pageMargin * 2); // 21cm = A4 width
        var pageHeight = 29.7 -(pageMargin * 2);
        var printSelectBox = {};
        printSelectBox.width = (scale * pageWidth * cols) / 100;
        printSelectBox.height = (scale * pageHeight * rows) / 100;
        printSelectBox.left = mapCenterActiveUTMZone.getCoordinates()[0] - (printSelectBox.width / 2);
        printSelectBox.right = printSelectBox.left + printSelectBox.width;
        printSelectBox.bottom = mapCenterActiveUTMZone.getCoordinates()[1] - (printSelectBox.height / 2);
        printSelectBox.top = printSelectBox.bottom + printSelectBox.height;

        var coordinates = [];
        var tempLeft = printSelectBox.left;
        for (var c = 1; c <= cols; c++) {
            var tempRight = tempLeft + ((printSelectBox.right - printSelectBox.left) / cols);
            var tempBottom = printSelectBox.bottom;
            for (var r = 1; r <= rows; r++) {
                var tempTop = tempBottom + ((printSelectBox.top - printSelectBox.bottom) / rows);
                var lowerLeft = new ol.geom.Point([tempLeft, tempBottom]);
                var upperLeft = new ol.geom.Point([tempLeft, tempTop]);
                var upperRight = new ol.geom.Point([tempRight, tempTop]);
                var lowerRight = new ol.geom.Point([tempRight, tempBottom]);
                var tempBox =  new ol.geom.Polygon([[lowerLeft.getCoordinates(), upperLeft.getCoordinates(), upperRight.getCoordinates(), lowerRight.getCoordinates(), lowerLeft.getCoordinates()]]);
                coordinates.push(tempBox.getCoordinates());
                tempBottom = tempTop;
            }
            tempLeft = tempRight;
        }

        var multiPolygonGeometry = new ol.geom.MultiPolygon(coordinates);
        multiPolygonGeometry.applyTransform(ol.proj.getTransform(UTM.localProj, 'EPSG:32633'));
        var feature = new ol.Feature(multiPolygonGeometry);//, attributes);
        feature.setStyle(_getStyle());
        var vectorSource = new ol.source.Vector();
        vectorSource.addFeature(feature);
        printBoxSelectionLayer = new ol.layer.Vector({
            name:'Print',
            source: vectorSource,
            updateWhileAnimating: true,
            updateWhileInteracting: true
        });

        map.addLayer(printBoxSelectionLayer);
        printBoxSelectionLayer.setZIndex(2000);

    };

    var _getStyle = function () {
        var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#ee9900',
                width: 1,
                opacity: 1
            }),
            fill: new ol.style.Fill({
                color: 'rgba(238,153,0,0.4)',
                opacity: 0.4
            })
        });
        return style;
    };

    var _removeKineticDragPan = function (map, copyOld) {
        map.getInteractions().forEach(function (interaction) {
            if (interaction instanceof ol.interaction.DragPan) {
                map.removeInteraction(interaction);
                if(copyOld) {
                    oldInteraction = interaction;
                }
            }
        });
    };

    var _applyNonKineticDragPan = function (map){
        _removeKineticDragPan(map, true);
        map.addInteraction(
            new ol.interaction.DragPan({kinetic: false})
        );
    };

    var _applyOriginalInteraction = function(map) {
        _removeKineticDragPan(map, false);
        map.addInteraction(oldInteraction);
    };

    function activate(map, options) {
        isActive = true;
        if (map !== undefined) {
            scale = options.scale;
            _applyNonKineticDragPan(map);
            _registerMouseEvents(map);
            _createFrame(map);
        }
    }

    function deactivate(map) {
        if (isActive) {
            isActive = false;
            if (map !== undefined) {
                console.log('PrintBoxSelect deactivated');
                map.removeLayer(printBoxSelectionLayer);
                //deregisterMouseEvents(map);
                _applyOriginalInteraction(map);
            }
        }
    }

    return {
        Activate: activate,
        Deactivate: deactivate
    };
};