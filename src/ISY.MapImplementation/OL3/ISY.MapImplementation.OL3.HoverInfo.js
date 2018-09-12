 ISY = ISY || {};
 ISY.MapImplementation = ISY.MapImplementation || {};
 ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

 ISY.MapImplementation.OL3.HoverInfo = function () {
   // 1: ol.interaction.Select()
   // 2: map.on('pointermove', function)

   var multiSelect = false;
   var hoverVersion = 1;
   var hoverInteraction;
   var mapImplementation;
   var hoverIsActive = false;
   var hoverIsInitialized = false;
   var mousemoveIsInitialized = false;
   var featureOverlay;
   var highlight;
   var popup;
   var mouseCoordinate;

   function activateHoverInfo(map, a, mapImpl, options) {
     mapImplementation = mapImpl;
     _setOptions(options);
     _addInteraction(map);
   }

   function deactivateHoverInfo(map) {
     if (map !== undefined) {
       hoverIsActive = false;
       _removePopup();
       switch (hoverVersion) {
         case 1:
           if (hoverInteraction) {
             hoverInteraction.setActive(false);
             map.removeInteraction(hoverInteraction);
             //hoverInteraction.unbindAll(); // deprecated in OpenLayers v3.5.0
             hoverInteraction = undefined;
             hoverIsInitialized = false;
           }
           break;
       }
     }
   }

   function _setOptions(options) {
     if (options) {
       if (options.multiSelect) {
         multiSelect = options.multiSelect;
       }
     }
   }

   function _removePopup() {
     if (popup === undefined) {
       return;
     }
     var element = popup.getElement();
     $(element).popover('destroy');
     if (highlight && featureOverlay) {
       featureOverlay.getSource().removeFeature(highlight);
       highlight = undefined;
     }
   }

   function _getFeatureByZIndexFromPixel(map, pixel) {
     var features = [];
     map.forEachFeatureAtPixel(pixel, function (feature) {
       var zindex = parseInt(mapImplementation.GetLayerByFeature(feature).guid, 10);
       features.push({
         feature: feature,
         zindex: zindex
       });
     });
     features = _orderArrayByZIndex(features);
     if (features === undefined) {
       return undefined;
     }
     return features[0].feature;
   }

   function _getFeatureByZIndex(featureArray) {
     var features = [];
     featureArray.forEach(function (feature) {
       var layer = mapImplementation.GetLayerByFeature(feature);
       if (layer) {
         var zindex = parseInt(layer.guid, 10);
         features.push({
           feature: feature,
           zindex: zindex
         });
       }
     });
     features = _orderArrayByZIndex(features);
     if (features === undefined) {
       return undefined;
     }
     return features[0].feature;
   }

   function _compare(a, b) {
     if (a.zindex < b.zindex) {
       return 1;
     }
     if (a.zindex > b.zindex) {
       return -1;
     }
     return 0;
   }

   function _orderArrayByZIndex(features) {
     if (features.length === 0) {
       return undefined;
     }
     features.sort(_compare);
     return features;
   }

   function _setMouseCoordinates(map, evt) {
     if (hoverIsActive) {
       mousePixel = map.getEventPixel(evt.originalEvent);
       mouseCoordinate = evt.coordinate;
       if (popup) {
         popup.setPosition(mouseCoordinate);
       }
     }
   }

   function _displayFeatureInfo(map, evt) {
     var event;
     var feature;
     var pixel;
     switch (hoverVersion) {
       case 1:
         event = evt;
         break;
       case 2:
         event = evt.originalEvent;
         pixel = map.getEventPixel(event);
         break;
     }
     switch (hoverVersion) {
       case 1:
         feature = _getFeatureByZIndex(event.target.getFeatures().getArray());
         break;
       case 2:
         feature = _getFeatureByZIndexFromPixel(map, pixel);
         break;
     }
     if (popup === undefined) {
       popup = new ol.Overlay({
         element: document.getElementById('popup')
       });
       map.addOverlay(popup);
     }
     var element = popup.getElement();
     if (feature) {
       var featureProperties = feature.getProperties();
       if (featureProperties !== undefined) {
         var coordinate;
         switch (hoverVersion) {
           case 1:
             coordinate = mouseCoordinate;
             break;
           case 2:
             coordinate = evt.coordinate;
             break;
         }
         $(element).popover('destroy');
         popup.setPosition(coordinate);
         // the keys are quoted to prevent renaming in ADVANCED mode.
         //var tooltip = feature.getId()
         var tooltip = '';
         var featureLayer = mapImplementation.GetLayerByFeature(feature);
         var featureTooltip = featureLayer.tooltipTemplate;
         if (featureTooltip) {
           var fieldname;
           var fieldvalue;
           var label = '';
           var pos0 = featureTooltip.indexOf('{');
           var pos1;
           while (pos0 >= 0) {
             if (pos0 > 0) {
               label += featureTooltip.substr(0, pos0);
               featureTooltip = featureTooltip.slice(pos0);
               pos0 = featureTooltip.indexOf('{');
             }
             pos1 = featureTooltip.indexOf('}');
             fieldname = featureTooltip.substr(pos0 + 1, pos1 - pos0 - 1);
             fieldvalue = feature.get(fieldname);
             if (fieldvalue) {
               label += fieldvalue;
             }
             featureTooltip = featureTooltip.slice(pos1 + 1);
             pos0 = featureTooltip.indexOf('{');
           }
           tooltip = label + featureTooltip;
         }
         if (tooltip.length > 0) {
           $(element).popover({
             placement: 'top',
             animation: false,
             html: true,
             content: '<div class="hover-info">' + tooltip + '</div>'
             //'content': tooltip
           });
           $(element).popover('show');
         } else {
           $(element).popover('destroy');
         }
       }
     } else {
       $(element).popover('destroy');
     }
     if (feature !== highlight) {
       if (highlight) {
         featureOverlay.getSource().removeFeature(highlight);
       }
       if (feature) {
         featureOverlay.getSource().addFeature(feature);
       }
       highlight = feature;
     }
   }

   function _getHoverStyle(feature, resolution) {
     return mapImplementation.GetHoverStyle(feature, resolution);
   }

   function _addInteraction(map) {
     if (hoverIsActive) {
       return;
     }
     hoverIsActive = true;
     if (hoverIsInitialized) {
       switch (hoverVersion) {
         case 1:
           map.addInteraction(hoverInteraction);
           hoverInteraction.setActive(true);
           break;
       }
       return;
     }
     hoverIsInitialized = true;
     featureOverlay = new ol.layer.Vector({
       map: map,
       source: new ol.source.Vector({
         useSpatialIndex: false // optional, might improve performance
       }),
       style: _getHoverStyle,
       updateWhileAnimating: true, // optional, for instant visual feedback
       updateWhileInteracting: true // optional, for instant visual feedback
     });

     switch (hoverVersion) {
       case 1:
         hoverInteraction = new ol.interaction.Select({
           condition: ol.events.condition.pointerMove,
           multi: multiSelect,
           style: function (feature, resolution) {
             return mapImplementation.GetHoverStyle(feature, resolution);
           }
         });
         map.addInteraction(hoverInteraction);
         hoverInteraction.on('select', function (evt) {
           if (!hoverIsActive) {
             return;
           }
           if (evt.dragging) {
             return;
           }
           _displayFeatureInfo(map, evt);
         });
         if (!mousemoveIsInitialized) {
           mousemoveIsInitialized = true;
           map.on('pointermove', function (evt) {
             _setMouseCoordinates(map, evt);
           });
         }
         break;
       case 2:
         map.on('pointermove', function (evt) {
           if (!hoverIsActive) {
             return;
           }
           if (evt.dragging) {
             return;
           }
           _displayFeatureInfo(map, evt);
         });
         break;
     }
   }

   return {
     ActivateHoverInfo: activateHoverInfo,
     DeactivateHoverInfo: deactivateHoverInfo
   };

 };
