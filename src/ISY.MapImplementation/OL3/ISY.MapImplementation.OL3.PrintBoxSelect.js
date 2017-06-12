var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.PrintBoxSelect = function (eventHandler) {

  var isActive = false;
  var printBoxSelectionLayer;
  var oldCenter = {};
  var oldUTM = "";
  var scale = 25000;
  var oldInteraction = {};
  var cols = 4;
  var rows = 3;
  var pageMargin = 1.7; // cm
  var pageWidth = 21 - (pageMargin * 2); // 21cm = A4 width
  var pageHeight = 29.7 - (pageMargin * 2);
  var eventKeys = {};
  var orientation = 'portrait';
  var rotation = true;

  function _toggleOrientation() {
    var tmpWidth = pageWidth;
    pageWidth = pageHeight;
    pageHeight = tmpWidth;
  }

  function _UTMZoneNotChanged(map) {
    if (!isActive) {
      return;
    }
    var mapCenterGeographic = _getMapCenterGeographic(_getMapCenter(map));
    var UTM = _getUTMZoneFromGeographicPoint(mapCenterGeographic.getCoordinates()[0], mapCenterGeographic.getCoordinates()[1]);
    if (UTM !== oldUTM) {
      _createFrame(map);
      return false;
    }
    return true;
  }

  var _deregisterMouseEvents = function () {
    for (var eventKey in eventKeys) {
      ol.Observable.unByKey(eventKeys[eventKey]);
      eventKeys[eventKey] = false;
    }
  };

  var _registerMouseEvents = function (map) {
    eventKeys['change_center'] = map.getView().on('change:center', function () {
      if (_UTMZoneNotChanged(map)) {
        var deltaCenter = _findDelta(map);
        _moveLayer(map, deltaCenter);
      }
    });

    eventKeys['moveend'] = map.on('moveend', function () {
      _getExtentOfPrintBox(map);
    });
  };

  var _getExtentOfPrintBox = function (map) {
    var mapCenter = _getMapCenter(map);
    var mapCenterActiveUTMZone = _getMapCenterActiveUTMZone(mapCenter);
    var printBox = _getPrintBox(mapCenterActiveUTMZone);
    var biSone = getBiSone(printBox, oldUTM.sone);
    var extent = {
      bbox: [printBox.left, printBox.bottom, printBox.right, printBox.top],
      center: mapCenterActiveUTMZone.getCoordinates(),
      projection: oldUTM.localProj,
      sone: oldUTM.sone,
      biSone: biSone,
      scale: scale
    };
    eventHandler.TriggerEvent(ISY.Events.EventTypes.PrintBoxSelectReturnValue, extent);
  };

  var _getMapCenter = function (map) {
    return map.getView().getCenter();
  };

  var _getMapCenterGeographic = function (mapCenter) {
    var mapCenterGeographic = new ol.geom.Point(mapCenter);
    if (rotation) {
      mapCenterGeographic.applyTransform(ol.proj.getTransform('EPSG:32633', 'EPSG:4326'));
    }
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

  var _moveLayer = function (map, deltaCenter) {
    var source = printBoxSelectionLayer.getSource();
    var feature = source.getFeatures()[0];
    feature.getGeometry().translate(deltaCenter[0], deltaCenter[1]);
  };

  var _getUTMZoneFromGeographicPoint = function (lon, lat) {
    // From emergencyPoster.js
    var sone = "32V",
      localProj = "EPSG:32632";
    if (lat > 72) {
      if (lon < 21) {
        sone = "33X";
        localProj = "EPSG:32633";
      } else {
        sone = "35X";
        localProj = "EPSG:32635";
      }
    } else if (lat > 64) {
      if (lon < 6) {
        sone = "31W";
        localProj = "EPSG:32631";
      } else if (lon < 12) {
        sone = "32W";
        localProj = "EPSG:32632";
      } else if (lon < 18) {
        sone = "33W";
        localProj = "EPSG:32633";
      } else if (lon < 24) {
        sone = "34W";
        localProj = "EPSG:32634";
      } else if (lon < 30) {
        sone = "35W";
        localProj = "EPSG:32635";
      } else {
        sone = "36W";
        localProj = "EPSG:32636";
      }
    } else {
      if (lon < 3) {
        sone = "31V";
        localProj = "EPSG:32631";
      } else if (lon >= 12) {
        sone = "33V";
        localProj = "EPSG:32633";
      }
    }
    return {
      'sone': sone,
      'localProj': localProj
    };
  };
  var getBiSone = function (geometry, sone) {
    var lonLatBL = new ol.geom.Point([geometry.left, geometry.bottom]);
    lonLatBL.applyTransform(ol.proj.getTransform('EPSG:32633', 'EPSG:4326'));
    var soneBL = _getUTMZoneFromGeographicPoint(lonLatBL.getCoordinates()[0], lonLatBL.getCoordinates()[1]).sone;
    if (soneBL !== sone) {
      return soneBL;
    }

    var lonLatTL = new ol.geom.Point([geometry.right, geometry.top]);
    lonLatTL.applyTransform(ol.proj.getTransform('EPSG:32633', 'EPSG:4326'));
    var soneTL = _getUTMZoneFromGeographicPoint(lonLatTL.getCoordinates()[0], lonLatTL.getCoordinates()[1]).sone;
    if (soneTL !== sone) {
      return soneTL;
    }

    var lonLatBR = new ol.geom.Point([geometry.right, geometry.bottom]);
    lonLatBR.applyTransform(ol.proj.getTransform('EPSG:32633', 'EPSG:4326'));
    var soneBR = _getUTMZoneFromGeographicPoint(lonLatBR.getCoordinates()[0], lonLatBR.getCoordinates()[1]).sone;
    if (soneBR !== sone) {
      return soneBR;
    }

    var lonLatTR = new ol.geom.Point([geometry.right, geometry.top]);
    lonLatTR.applyTransform(ol.proj.getTransform('EPSG:32633', 'EPSG:4326'));
    var soneTR = _getUTMZoneFromGeographicPoint(lonLatTR.getCoordinates()[0], lonLatTR.getCoordinates()[1]).sone;
    if (soneTR !== sone) {
      return soneTR;
    }
    return '';
  };
  var _createFrame = function (map) {
    _getExtentOfPrintBox(map);
    if (printBoxSelectionLayer) {
      map.removeLayer(printBoxSelectionLayer);
    }
    var mapCenter = _getMapCenter(map);
    oldCenter = mapCenter;

    var printBoxSelect = _getPrintBox(_getMapCenterActiveUTMZone(mapCenter));
    var multiPolygonGeometry = _getMultiPolygonGeometry(_getGrid(printBoxSelect), mapCenter);

    var feature = new ol.Feature(multiPolygonGeometry);
    feature.setStyle(_getStyle());

    var vectorSource = new ol.source.Vector();
    vectorSource.addFeature(feature);

    printBoxSelectionLayer = new ol.layer.Vector({
      name: 'PrintBoxSelect',
      source: vectorSource,
      updateWhileAnimating: true,
      updateWhileInteracting: true
    });

    map.addLayer(printBoxSelectionLayer);
    printBoxSelectionLayer.setZIndex(2000);

  };

  var _getUTMZoneFromMapCenter = function (mapCenter) {
    var mapCenterGeographic = _getMapCenterGeographic(mapCenter);
    var UTM = _getUTMZoneFromGeographicPoint(mapCenterGeographic.getCoordinates()[0], mapCenterGeographic.getCoordinates()[1]);
    oldUTM = UTM;
    return UTM;
  };

  var _getMultiPolygonGeometry = function (coordinates, mapCenter) {
    var multiPolygonGeometry = new ol.geom.MultiPolygon(coordinates);
    if (rotation) {
      multiPolygonGeometry.applyTransform(ol.proj.getTransform(_getUTMZoneFromMapCenter(mapCenter).localProj, 'EPSG:32633'));
    }
    return multiPolygonGeometry;
  };

  var _getMapCenterActiveUTMZone = function (mapCenter) {
    var mapCenterActiveUTMZone = new ol.geom.Point(mapCenter);
    if (rotation) {
      mapCenterActiveUTMZone.applyTransform(ol.proj.getTransform('EPSG:32633', _getUTMZoneFromMapCenter(mapCenter).localProj));
    } else {
      _getUTMZoneFromMapCenter(mapCenter);
    }
    return mapCenterActiveUTMZone;
  };

  var _getPrintBox = function (mapCenterActiveUTMZone) {
    var printBoxSelect = {};
    printBoxSelect.width = (scale * pageWidth * cols) / 100;
    printBoxSelect.height = (scale * pageHeight * rows) / 100;
    printBoxSelect.left = mapCenterActiveUTMZone.getCoordinates()[0] - (printBoxSelect.width / 2);
    printBoxSelect.right = printBoxSelect.left + printBoxSelect.width;
    printBoxSelect.bottom = mapCenterActiveUTMZone.getCoordinates()[1] - (printBoxSelect.height / 2);
    printBoxSelect.top = printBoxSelect.bottom + printBoxSelect.height;
    return printBoxSelect;
  };

  var _getGrid = function (printBoxSelect) {
    var coordinates = [];
    var tempLeft = printBoxSelect.left;
    for (var c = 1; c <= cols; c++) {
      var tempRight = tempLeft + ((printBoxSelect.right - printBoxSelect.left) / cols);
      var tempBottom = printBoxSelect.bottom;
      for (var r = 1; r <= rows; r++) {
        var tempTop = tempBottom + ((printBoxSelect.top - printBoxSelect.bottom) / rows);
        var lowerLeft = new ol.geom.Point([tempLeft, tempBottom]);
        var upperLeft = new ol.geom.Point([tempLeft, tempTop]);
        var upperRight = new ol.geom.Point([tempRight, tempTop]);
        var lowerRight = new ol.geom.Point([tempRight, tempBottom]);
        var tempBox = new ol.geom.Polygon([
          [lowerLeft.getCoordinates(), upperLeft.getCoordinates(), upperRight.getCoordinates(), lowerRight.getCoordinates(), lowerLeft.getCoordinates()]
        ]);
        coordinates.push(tempBox.getCoordinates());
        tempBottom = tempTop;
      }
      tempLeft = tempRight;
    }
    return coordinates;
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
      cols = options.cols;
      rows = options.rows;
      if (options.orientation !== undefined && orientation !== options.orientation) {
        _toggleOrientation();
      }
      orientation = options.orientation;
      rotation = options.rotation || true;
      _applyNonKineticDragPan(map);
      _registerMouseEvents(map);
      _createFrame(map);
    }
  }

  function deactivate(map) {
    if (isActive) {
      isActive = false;
      if (map !== undefined) {
        map.removeLayer(printBoxSelectionLayer);
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
