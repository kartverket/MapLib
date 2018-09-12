var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.Measure = function (eventHandler) {

  var isActive = false;
  var circleFeature; // The circle feature
  var circleRadius; // Distance for the initial circle
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
  var pointerMoveHandler = function (evt) {
    if (evt.dragging || !isActive) {
      return;
    }
    /** @type {string} */
    var helpMsg = translate['start_measure']; //'Click to start drawing';

    if (sketch) {
      var geom = (sketch.getGeometry());
      if (geom instanceof ol.geom.Polygon) {
        helpMsg = translate['continue_measure']; //continuePolygonMsg;
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
    var type = 'Polygon'; // (typeSelect.value === 'area' ? 'Polygon' : 'LineString');
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
      function (evt) {
        // set sketch
        sketch = evt.feature;

        var firstPoint = sketch.getGeometry().getCoordinates()[0][0];
        circleFeature = new ol.Feature(new ol.geom.Circle(firstPoint, 0));
        circleOverlay.getSource().addFeature(circleFeature);

        /** @type {ol.Coordinate|undefined} */
        var tooltipCoord = evt.coordinate;

        listener = sketch.getGeometry().on('change', function (evt) {
          var geom = evt.target;
          var output;
          var circleArea;
          if (geom instanceof ol.geom.Polygon) {
            output = formatArea( /** @type {ol.geom.Polygon} */ (geom));
            tooltipCoord = geom.getInteriorPoint().getCoordinates();
            _formatPolygonLength(geom);
            var circleGeom = _drawCircle(geom);
            if (circleGeom !== null) {
              circleArea = formatArea(circleGeom);
            }
          } else if (geom instanceof ol.geom.LineString) {
            output = formatLength( /** @type {ol.geom.LineString} */ (geom));
            tooltipCoord = geom.getLastCoordinate();
          }
          var circleCoordinates = geom.getCoordinates()[0];
          if (circleCoordinates.length === 2) {
            measureTooltipElement.innerHTML = circleArea.string;
          } else {
            measureTooltipElement.innerHTML = output.string;
          }

          eventHandler.TriggerEvent(ISY.Events.EventTypes.MeasureMouseMove, output);
          measureTooltip.setPosition(tooltipCoord);
        });
      }, this);

    draw.on('drawend',
      function () {
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

  function _drawCircle(geom) {
    var circleCoordinates = geom.getCoordinates()[0];
    if (circleCoordinates.length === 2) {
      circleFeature.getGeometry().setRadius(circleRadius);
      return Math.PI * Math.pow(circleRadius, 2);
    } else {
      circleFeature.getGeometry().setRadius(0);
      return null;
    }
  }

  function _formatPolygonLength(polygon) {
    return _formatLength(polygon.getCoordinates()[0]);
  }

  /**
   * Creates a new help tooltip
   */
  function createHelpTooltip(map) {
    if (helpTooltipElement) {
      if (helpTooltipElement.parentNode !== null) {
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
      if (measureTooltipElement.parentNode !== null) {
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
  function _formatLength(coordinates) {
    var length = _getLength(coordinates);
    circleRadius = length;
    length = Math.round(length * 100) / 100;
    var output;
    var value;
    var unit;
    if (length > 100) {
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
      value: value
    };
  }

  var formatLength = function (line) {
    var length = Math.round(line.getLength() * 100) / 100;
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

  function _getLength(coordinates) {
    var length;
    if (coordinates.length > 0) {
      var stride = coordinates[0].length; // 2D or 3D
      var flatCoordinates = _flatternCoordinates(coordinates);
      length = _getFlatLength(flatCoordinates, 0, flatCoordinates.length, stride);
    }
    return length;
  }

  function _flatternCoordinates(coordinates) {
    var flatCoordinates = [];
    for (var i = 0; i < coordinates.length; i++) {
      var thisCoordinate = coordinates[i];
      for (var j = 0; j < thisCoordinate.length; j++) {
        flatCoordinates.push(thisCoordinate[j]);
      }
    }
    return flatCoordinates;
  }

  function _getFlatLength(flatCoordinates, offset, end, stride) {
    var x1 = flatCoordinates[offset];
    var y1 = flatCoordinates[offset + 1];
    var length = 0;
    var i;
    for (i = offset + stride; i < end; i += stride) {
      var x2 = flatCoordinates[i];
      var y2 = flatCoordinates[i + 1];
      length += Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
      x1 = x2;
      y1 = y2;
    }
    return length;
  }


  /**
   * format length output
   * @param {ol.geom.Polygon} polygon
   * @return {string}
   */
  var formatArea = function (polygon) {
    var output;
    var unit;
    var value;
    var area; // = polygon.getArea();
    if (polygon.getArea === undefined) {
      area = polygon;
    } else {
      area = polygon.getArea();
    }


    if (area > 100000) {
      unit = 'km<sup>2</sup>';
      value = Math.round(area / 1000000 * 100) / 100;
      output = value + ' ' + unit;
    } else if (area < 100000 && area > 1000) {
      unit = 'da';
      value = Math.round(area / 1000 * 100) / 100;
      output = value + ' ' + unit;
    } else {
      unit = 'm<sup>2</sup>';
      value = Math.round(area * 100) / 100;
      output = value + ' ' + unit;
    }
    return {
      string: output,
      unit: unit,
      value: value,
      order: 2
    };
  };

  function activate(map, options) {
    isActive = true;
    translate = options.translate;
    map.on('pointermove', pointerMoveHandler);

    $(map.getViewport()).on('mouseout', function () {
      $(helpTooltipElement).addClass('hidden');
    });
    addInteraction(map);
  }

  function deactivate(map) {
    if (isActive) {
      isActive = false;
      if (map !== undefined) {
        map.removeLayer(drawLayer);
        measureTooltipElement.className = 'tooltip tooltip-static';
        measureTooltip.setOffset([0, -7]);
        circleFeature.getGeometry().setRadius(0);
        measureTooltipElement = null;
        map.removeInteraction(draw);
        map.removeOverlay(circleOverlay);
        map.removeOverlay(measureTooltip);
        map.removeOverlay(helpTooltip);
        if (helpTooltipElement) {
          helpTooltipElement.parentNode.removeChild(helpTooltipElement);
        }
        if (measureTooltipElement) {
          measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        }
        var tooltipStaticElements = document.getElementsByClassName('tooltip tooltip-static');
        while (tooltipStaticElements.length > 0) {
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
