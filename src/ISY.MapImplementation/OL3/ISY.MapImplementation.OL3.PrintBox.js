var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.PrintBox = function () {

  var isActive = false;
  var printBoxLayer;
  var oldCenter = {};
  var scale = 25000;
  var oldInteraction = {};
  var pageMargin = 1.7; // cm
  var pageWidth = 21 - (pageMargin * 2); // 21cm = A4 width
  var pageHeight = 29.7 - (pageMargin * 2);
  var eventKeys = {};
  var orientation = 'portrait';

  var POINTS_PER_INCH = 72; // PostScript points 1/72"
  var MM_PER_INCHES = 25.4;
  //var UNITS_RATIO = 39.37; // inches per meter

  function _toggleOrientation() {
    var tmpWidth = pageWidth;
    pageWidth = pageHeight;
    pageHeight = tmpWidth;
  }

  var _deregisterMouseEvents = function () {
    for (var eventKey in eventKeys) {
      ol.Observable.unByKey(eventKeys[eventKey]);
      eventKeys[eventKey] = false;
    }
  };

  var _registerMouseEvents = function (map) {
    eventKeys['change_center'] = map.getView().on('change:center', function () {
        var deltaCenter = _findDelta(map);
        _moveLayer(map, deltaCenter);
    });
  };
  var _getPrintRectangleCoords = function(printRectangle, map) {
    // Framebuffer size!!
    var displayCoords = printRectangle.map(function(c) {
      return c / ol.has.DEVICE_PIXEL_RATIO;
    });
    // PrintRectangle coordinates have top-left as origin
    var bottomLeft = map.getCoordinateFromPixel([displayCoords[0], displayCoords[3]]);
    var topRight = map.getCoordinateFromPixel([displayCoords[2], displayCoords[1]]);
    var topLeft = map.getCoordinateFromPixel([displayCoords[0], displayCoords[1]]);
    var bottomRight = map.getCoordinateFromPixel([displayCoords[2], displayCoords[3]]);

    // Always returns an extent [minX, minY, maxX, maxY]
    var printPoly = new ol.geom.Polygon([[bottomLeft, topLeft, topRight, bottomRight, bottomLeft]]);

    return printPoly.getExtent();
  };
  var _calculatePageBoundsPixels = function (map) {
    var resolution = map.getView().getResolution();
    var w = pageWidth / POINTS_PER_INCH * MM_PER_INCHES / 1000.0 * scale / resolution * ol.has.DEVICE_PIXEL_RATIO;
    var h = pageHeight / POINTS_PER_INCH * MM_PER_INCHES / 1000.0 * scale / resolution * ol.has.DEVICE_PIXEL_RATIO;
    var mapSize = map.getSize();
    var center = [mapSize[0] * ol.has.DEVICE_PIXEL_RATIO / 2, mapSize[1] * ol.has.DEVICE_PIXEL_RATIO / 2];
    var minx, miny, maxx, maxy;

    minx = center[0] - (w / 2);
    miny = center[1] - (h / 2);
    maxx = center[0] + (w / 2);
    maxy = center[1] + (h / 2);

    return [minx, miny, maxx, maxy];
  };

  var _getMapCenter = function (map) {
    return map.getView().getCenter();
  };

  var _findDelta = function (map) {
    var newCenter = _getMapCenter(map);
    var deltaCenter = [
      newCenter[0] - oldCenter[0],
      newCenter[1] - oldCenter[1]
    ];
    oldCenter = newCenter;
    return deltaCenter;
  };

  var _moveLayer = function (map, deltaCenter) {
    var source = printBoxLayer.getSource();
    var feature = source.getFeatures()[0];
    feature.getGeometry().translate(deltaCenter[0], deltaCenter[1]);
  };

  var _createFrame = function (map) {
    var printRectangle = _calculatePageBoundsPixels(map);
    var printBox = _getPrintRectangleCoords(printRectangle, map);
    if (printBoxLayer) {
      map.removeLayer(printBoxLayer);
    }

    oldCenter = _getMapCenter(map);

    var multiPolygonGeometry = _getMultiPolygonGeometry(printBox);

    var feature = new ol.Feature(multiPolygonGeometry);
    feature.setStyle(_getStyle());

    var vectorSource = new ol.source.Vector();
    vectorSource.addFeature(feature);

    printBoxLayer = new ol.layer.Vector({
      name: 'PrintBox',
      source: vectorSource,
      updateWhileAnimating: true,
      updateWhileInteracting: true
    });

    map.addLayer(printBoxLayer);
    printBoxLayer.setZIndex(2000);

  };

  var _getMultiPolygonGeometry = function (coordinates) {
    var lowerLeft = new ol.geom.Point([coordinates[0], coordinates[1]]);
    var upperLeft = new ol.geom.Point([coordinates[0], coordinates[3]]);
    var upperRight = new ol.geom.Point([coordinates[2], coordinates[3]]);
    var lowerRight = new ol.geom.Point([coordinates[2], coordinates[1]]);
    var tempBox = new ol.geom.Polygon([
      [lowerLeft.getCoordinates(), upperLeft.getCoordinates(), upperRight.getCoordinates(), lowerRight.getCoordinates(), lowerLeft.getCoordinates()]
    ]);
    return new ol.geom.MultiPolygon([tempBox.getCoordinates()]);
  };

  var _getStyle = function () {
    return new ol.style.Style({
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
  };

  var _removeKineticDragPan = function (map, copyOld) {
    map.getInteractions().forEach(function (interaction) {
      if (interaction instanceof ol.interaction.DragPan) {
        map.removeInteraction(interaction);
        if (copyOld) {
          oldInteraction = interaction;
        }
      }
    });
  };

  var _applyNonKineticDragPan = function (map) {
    _removeKineticDragPan(map, true);
    map.addInteraction(
      new ol.interaction.DragPan({
        kinetic: false
      })
    );
  };

  var _applyOriginalInteraction = function (map) {
    _removeKineticDragPan(map, false);
    map.addInteraction(oldInteraction);
  };

  function activate(map, options) {
    isActive = true;
    if (map !== undefined) {
      scale = options.scale;
      if (options.pageWidth !== undefined) {
        pageWidth = options.pageWidth;
      }
      if (options.pageHeight !== undefined) {
        pageHeight = options.pageHeight;
      }
      if (options.orientation !== undefined && orientation !== options.orientation) {
        _toggleOrientation();
      }
      orientation = options.orientation;
      _applyNonKineticDragPan(map);
      _registerMouseEvents(map);
      _createFrame(map);
    }
  }

  function deactivate(map) {
    if (isActive) {
      isActive = false;
      if (map !== undefined) {
        map.removeLayer(printBoxLayer);
        _deregisterMouseEvents();
        _applyOriginalInteraction(map);
      }
    }
  }

  return {
    Activate: activate,
    Deactivate: deactivate
  };
};
