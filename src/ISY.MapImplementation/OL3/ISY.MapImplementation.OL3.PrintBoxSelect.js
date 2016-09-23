var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.PrintBoxSelect = function() {

    var isActive = false;
    var printBoxSelectionLayer;
    var oldCenter = {};

    // var checkForUtmChange = function () {
    //     if (!isActive) {
    //         return;
    //     }
    //     console.log(printBoxSelectionLayer.bbox);
    // };

    // var deregisterMouseEvents = function (map) {
    //     map.off('pointerdrag');
    //
    //     map.off('moveend');
    // };

    var registerMouseEvents = function (map) {
        //map.on('pointerdrag', function() {
        map.getView().on('change:center', function() {
            console.log('Dragging...');
            var deltaCenter = findDelta(map);
            moveLayer(map, deltaCenter);
        });

        map.on('moveend', function() {
            //checkForUtmChange();
            console.log('Dragging ended.');
        });
    };

    var findDelta = function (map) {
        var newCenter = map.getView().getCenter();
        var deltaCenter = [
            newCenter[0] - oldCenter[0],
            newCenter[1] - oldCenter[1]
        ];
        oldCenter = newCenter;
        return deltaCenter;
    };

    var moveLayer = function(map, deltaCenter){
        //var vectorLayer = map.getLayerByName('Print');
        var source = printBoxSelectionLayer.getSource();
        var feature = source.getFeatures()[0];
        feature.getGeometry().translate(deltaCenter[0],deltaCenter[1]);
    };

    // function addPrintBoxSelectLayer(map) {
    //     var source = new ol.source.Vector();
    //     var drawStyle = new ISY.MapImplementation.OL3.Styles.Measure();
    //
    //     printBoxSelectionLayer = new ol.layer.Vector({
    //         source: source,
    //         style: drawStyle.DrawStyles()
    //     });
    //
    //     map.addLayer(printBoxSelectionLayer);
    // }

    var createFrame = function(map){
        // if (this.maskLayer) {
        //     // Remove layer
        //     map.removeLayer(this.maskLayer);
        //     delete this.maskLayer;
        //     // Unregister events
        //     //deregisterMouseEvents(map);
        // }

        var mapCenter = map.getView().getCenter();
        oldCenter = mapCenter;

        // General
        var cols = 4;
        var rows = 3;
        var pageMargin = 1.7; // cm
        var pageWidth = 21 - (pageMargin * 2); // 21cm = A4 width
        var pageHeight = 29.7 -(pageMargin * 2);

        // Get scale from form and create aspect
        var scale = 25000; // TODO: Parameterize this
        var boxWidth = (scale * pageWidth * cols) / 100;
        var boxHeight = (scale * pageHeight * rows) / 100;

        // Create a centered box
        var box2 = {};
        box2.left = mapCenter[0] - (boxWidth / 2);
        box2.right = box2.left + boxWidth;
        box2.bottom = mapCenter[1] - (boxHeight / 2);
        box2.top = box2.bottom + boxHeight;



        var coordinates = [];
        var minLon1 = box2.left;
        for (var c = 1; c <= cols; c++) {
            var minLon2 = minLon1 + ((box2.right - box2.left) / cols);
            var minLat1 = box2.bottom;
            for (var r = 1; r <= rows; r++) {
                var minLat2 = minLat1 + ((box2.top - box2.bottom) / rows);
                var lowerLeft = new ol.geom.Point([minLon1, minLat1]);
                var upperLeft = new ol.geom.Point([minLon1, minLat2]);
                var upperRight = new ol.geom.Point([minLon2, minLat2]);
                var lowerRight = new ol.geom.Point([minLon2, minLat1]);
                var tempBox =  new ol.geom.Polygon([[lowerLeft.getCoordinates(), upperLeft.getCoordinates(), upperRight.getCoordinates(), lowerRight.getCoordinates(), lowerLeft.getCoordinates()]]);
                coordinates.push(tempBox.getCoordinates());
                minLat1 = minLat2;
            }
            minLon1 = minLon2;
        }

        var multiPolygonGeometry = new ol.geom.MultiPolygon(coordinates);
        var lonLat = new ol.geom.Point(mapCenter);
        lonLat.applyTransform(ol.proj.getTransform('EPSG:32633', 'EPSG:4326'));
        var epsg = getUTMZone(lonLat.getCoordinates()[0], lonLat.getCoordinates()[1]);
//        var l1 = new OpenLayers.Geometry.Point(box2.left, box2.bottom);
//        var l2 = new OpenLayers.Geometry.Point(box2.right, box2.bottom);
//        l1.transform(new OpenLayers.Projection("EPSG:32633"), new OpenLayers.Projection(epsg.localProj));
//        l2.transform(new OpenLayers.Projection("EPSG:32633"), new OpenLayers.Projection(epsg.localProj));

        // Make vector feature with attributes
        var attributes = {};
        attributes.origin = new ol.geom.Point(mapCenter);
        attributes.tilt = 5.204377268891661; //Math.atan2((l2.y - l1.y), (l2.x - l1.x)) * 180 / Math.PI;
        attributes.sone =  parseInt(epsg.sone, 10);

        var feature = new ol.Feature(multiPolygonGeometry, attributes);
        var vectorSource = new ol.source.Vector();
        vectorSource.addFeature(feature);
        printBoxSelectionLayer = new ol.layer.Vector({
            name:'Print',
            source: vectorSource,
            updateWhileAnimating: true,
            updateWhileInteracting: true
        });



        //var sone = parseInt(epsg.sone, 10) - 33;
        //feature.geometry.rotate(sone * feature.attributes.tilt, feature.attributes.origin);

        // Add layer and set index
        map.addLayer(printBoxSelectionLayer);
        printBoxSelectionLayer.setZIndex(2000);
        //registerMouseEvents(map);
    };

    function activate(map){ //}, options) {
        isActive = true;
        if (map !== undefined) {
            console.log('PrintBoxSelect activated');
            //mapScale = options.mapScale;
            registerMouseEvents(map);
            createFrame(map);
            //addPrintBoxSelectLayer(map);
        }
    }

    function deactivate(map) {
        if (isActive) {
            isActive = false;
            if (map !== undefined) {
                console.log('PrintBoxSelect deactivated');
                map.removeLayer(printBoxSelectionLayer);
            }
        }
    }

    getUTMZone = function(lon, lat) {
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

    return {
        Activate: activate,
        Deactivate: deactivate
    };
};