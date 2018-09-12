var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.ModifyFeature = function (eventHandler) {

  var isActive = false;
  var translate;
  var typeObject;
  var features;
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
   * Message to show when the user is drawing a line.
   * @type {string}
   */
  //var continueLineMsg = 'Click to continue drawing the line';


  /**
   * Handle pointer move.
   * @param {ol.MapBrowserEvent} evt
   */
  var pointerMoveHandler = function (evt) {
    if (!isActive) {
      return;
    }
    /** @type {string} */
    var helpMsg = translate['start_modify']; //'Click to start drawing';

    //if (sketch) {
    //    var geom = (sketch.getGeometry());
    //    if (geom instanceof ol.geom.Polygon) {
    //        helpMsg = translate['continue_drawing'];//continuePolygonMsg;
    //    } else if (geom instanceof ol.geom.LineString) {
    //        helpMsg = continueLineMsg;
    //    }
    //}
    if (helpTooltipElement !== undefined) {
      helpTooltipElement.innerHTML = helpMsg;
      helpTooltip.setPosition(evt.coordinate);

      $(helpTooltipElement).removeClass('hidden');
    }
  };

  var modify; // global so we can remove it later
  var snapping;

  function addInteraction(map) {
    if (typeObject === "Line") {
      typeObject = "LineString";
    }
    var newFeatures = new ol.Collection(features);
    modify = new ol.interaction.Modify({
      features: newFeatures,

      deleteCondition: function (event) {
        return ol.events.condition.shiftKeyOnly(event) &&
          ol.events.condition.singleClick(event);
      }
    });

    map.addInteraction(modify);
    initSnapping(map);
    createHelpTooltip(map);

    var listener;
    modify.on('modifyend',
      function (evt) {
        ol.Observable.unByKey(listener);
        sketch = evt.features.getArray()[0]; //evt.feature;
        eventHandler.TriggerEvent(ISY.Events.EventTypes.ModifyFeatureEnd, sketch);
      }, this);

  }

  function initSnapping(map) {
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

  function activate(map, options) {
    isActive = true;
    translate = options.translate;
    features = [];
    if (!Array.isArray(options.features)) {
      features.push(options.features);
    } else {

      for (var i = 0; i < options.features.length; i++) {
        features.push(options.features[i]);
      }
    }
    snappingFeatures = options.snappingFeatures;

    map.on('pointermove', pointerMoveHandler);

    $(map.getViewport()).on('mouseout', function () {
      $(helpTooltipElement).addClass('hidden');
    });
    addInteraction(map);
  }

  function _removeOverlays(map) {

    map.removeOverlay(helpTooltip);
    if (helpTooltipElement !== null) {
      if (helpTooltipElement.parentNode !== null) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
      }
    }

    var tooltipStaticElements = document.getElementsByClassName('tooltip tooltip-static');
    while (tooltipStaticElements.length > 0) {
      var staticElement = tooltipStaticElements[0];
      staticElement.parentNode.removeChild(staticElement);
    }
  }

  function deactivate(map) {
    if (isActive) {
      isActive = false;
      sketch = null;
      if (map !== undefined) {
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
