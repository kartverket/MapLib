var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};
ISY.MapAPI.Map = ISY.MapAPI.Map || {};

ISY.MapAPI.FeatureInfo = function (mapImplementation, httpHelper, eventHandler, featureParser) {

  /*
   The reference to document in this class is necessary due to offset.
   When the marker is placed onto the map for the first time offset does not work unless the image is already present in the DOM.
   A possible fix to this is to not use an image and instead use an icon.

   */

  var infoMarker;
  var infoMarkerPath = 'assets/img/pin-md-orange.png'; // This path is possible to change by API call.
  var useInfoMarker = false;
  var pixelTolerance = 10;

  /*
   Common feature info functions
   */

  function _trigStartGetInfoRequest(layersToRequest) {
    var responseFeatureCollections = _createResponseFeatureCollections(layersToRequest);
    eventHandler.TriggerEvent(ISY.Events.EventTypes.FeatureInfoStart, responseFeatureCollections);
  }

  function _createResponseFeatureCollections(layersToRequest) {
    var responseFeatureCollections = [];
    for (var i = 0; i < layersToRequest.length; i++) {
      var layerToRequest = layersToRequest[i];
      var responseFeatureCollection = new ISY.Domain.LayerResponse();
      responseFeatureCollection.id = layerToRequest.id;
      responseFeatureCollection.name = layerToRequest.providerName;
      responseFeatureCollection.isLoading = true;
      responseFeatureCollections.push(responseFeatureCollection);
    }
    return responseFeatureCollections;
  }

  function _handleGetInfoRequest(url, subLayer) {
    var callback = function (data) {
      _handleGetInfoResponse(subLayer, data);
    };
    httpHelper.get(url).then(callback);
  }

  // function _convertJSONtoArray(data) {
  //     var results = [];
  //     Object.keys(data).forEach(function (key) {
  //         results.push([key, data[key]]);
  //     });
  //     return results;
  // }

  function readIncludedFields(includedFields) {
    var includedFieldsDict = {};
    if (includedFields.field) {
      if (includedFields.field.constructor !== Array) {
        includedFields.field = [includedFields.field];
      }
      includedFields.field.forEach(function (field) {
        if (field.type === 'picture' || field.type === 'link' || field.type === 'symbol' || field.type === 'boolean') {
          includedFieldsDict[field.name] = {
            name: field.alias ? field.alias : field.name,
            type: field.type
          };
          if (field.baseurl) {
            includedFieldsDict[field.name].baseurl = field.baseurl;
            includedFieldsDict[field.name].filetype = field.filetype ? '.' + field.filetype : '';
          }
        } else {
          includedFieldsDict[field.name] = {
            name: field.alias ? field.alias : field.name,
            unit: field.unit ? field.unit : ''
          };
        }
      });
    }
    if (includedFields.capitalize === 'true') {
      includedFieldsDict['_capitalize'] = true;
    }
    return includedFieldsDict;
  }

  function applyIncludedFields(parsedResult, subLayer) {
    if (!subLayer.featureInfo || !subLayer.featureInfo.includedFields) {
      return parsedResult;
    }
    var includedFields = readIncludedFields(subLayer.featureInfo.includedFields);
    var parsedResultsIncluded = [];
    parsedResult.forEach(function (feature) {
      parsedResultsIncluded.push(compareIncludedFields(includedFields, feature, subLayer.featureInfo.featureDict));
    });
    return parsedResultsIncluded;
  }

  function compareIncludedFields(includedFields, feature, featureDict) {
    var newFields = {
      attributes: []
    };
    if (Object.keys(includedFields).length > 1) {
      for (var fieldName in includedFields) {
        if (typeof includedFields[fieldName] === 'object') {
          var fieldValue = feature[fieldName];
          var newFieldName;
          if (Object.keys(feature).indexOf(fieldName) > -1) {
            newFieldName = includedFields._capitalize ? includedFields[fieldName].name.toLowerCase().capitalizeFirstLetter() : includedFields[fieldName].name;
            if ((includedFields[fieldName].type === 'symbol' && includedFields[fieldName].baseurl) ||
              (includedFields[fieldName].type === 'picture' && includedFields[fieldName].baseurl) ||
              (includedFields[fieldName].type === 'link' && includedFields[fieldName].baseurl)) {
              fieldValue = {
                url: includedFields[fieldName].baseurl + feature[fieldName] + includedFields[fieldName].filetype,
                type: includedFields[fieldName].type,
                name: feature[fieldName]
              };
            } else if (includedFields[fieldName].unit) {
              fieldValue += includedFields[fieldName].unit;
            } else if (includedFields[fieldName].type === 'boolean') {
              fieldValue = fieldValue === 't' ? 'Ja' : 'Nei';
            }
          } else if (Object.keys(feature).length === 1) {
            newFieldName = feature._capitalize ? fieldName.toLowerCase().capitalizeFirstLetter() : fieldName;
          } else {
            newFieldName = includedFields._capitalize ? includedFields[fieldName].name.toLowerCase().capitalizeFirstLetter() : includedFields[fieldName].name;
          }
          if (featureDict !== undefined) {
            for (var dict in featureDict) {
              if (newFieldName === dict) {
                fieldValue = featureDict[dict][fieldValue];
              }
            }
          }
          newFields.attributes.push([newFieldName, fieldValue]);
        }
      }
    } else {
      for (var fieldName1 in feature) {
        var tmpFieldName = feature._capitalize ? fieldName1.toLowerCase().capitalizeFirstLetter() : fieldName1;
        newFields.attributes.push([tmpFieldName, feature[fieldName1]]);
      }
    }
    return newFields;
  }

  String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  function _handleGetInfoResponse(subLayer, result) {
    var parsedResult;
    var exception;
    var getProperties;
    if (subLayer.featureInfo.supportsGetFeatureInfo && subLayer.source === 'WMS') {
      var xmlFile = jQuery.parseXML(result.data);
      var jsonFile = xml.xmlToJSON(xmlFile);

      if (jsonFile.hasOwnProperty('msGMLOutput')) {
        if (jsonFile.msGMLOutput.hasOwnProperty(subLayer.providerName + '_layer')) {
          getProperties = jsonFile.msGMLOutput[subLayer.providerName + '_layer'][subLayer.providerName + '_feature'];
          parsedResult = [];
          if (getProperties.constructor !== Array) {
            getProperties = [getProperties];
          }
          for (var i = 0; i < getProperties.length; i++) {
            parsedResult.push(getProperties[i]);
          }
        } else {
          for (var element in jsonFile.msGMLOutput) {
            if (element.endsWith('layer')) {
              var layername = element.substr(0, element.indexOf('layer'));
              getProperties = jsonFile.msGMLOutput[element][layername + 'feature'];
              parsedResult = [];
              if (getProperties.constructor !== Array) {
                getProperties = [getProperties];
              }
              for (var p = 0; p < getProperties.length; p++) {
                parsedResult.push(getProperties[p]);
              }
            }
          }
        }
      }
    } else {
      try {
        if (subLayer.featureInfo.includedFields) {
          parsedResult = [];
          var features = result.features;
          for (var featuresCount = 0; featuresCount < features.length; featuresCount++) {
            var tmpFeatures = features[featuresCount].properties;
            if (features[featuresCount].id) {
              tmpFeatures.id = features[featuresCount].id;
            }
            parsedResult.push(tmpFeatures);
          }
        } else {
          parsedResult = featureParser.Parse(result);
        }
      } catch (e) {
        exception = e;
      }
    }

    if (!parsedResult) {
      return;
    }

    parsedResult = applyIncludedFields(parsedResult, subLayer);

    var responseFeatureCollection = new ISY.Domain.LayerResponse();
    responseFeatureCollection.id = subLayer.id;
    responseFeatureCollection.name = subLayer.providerName;
    responseFeatureCollection.isLoading = false;
    responseFeatureCollection.features = parsedResult;
    responseFeatureCollection.exception = exception;
    responseFeatureCollection.featureInfoTitle = subLayer.featureInfoTitle;
    if (subLayer.source === ISY.Domain.SubLayer.SOURCES.proxyWms || subLayer.source === ISY.Domain.SubLayer.SOURCES.proxyWmts ||
      subLayer.source === ISY.Domain.SubLayer.SOURCES.wms || subLayer.source === ISY.Domain.SubLayer.SOURCES.wmts) {
      responseFeatureCollection.wms = true;
    }
    responseFeatureCollection.featureInfoElement = subLayer.featureInfoElement;
    responseFeatureCollection.showDialog = subLayer.showDialog;
    responseFeatureCollection.openNewWindow = subLayer.openNewWindow;
    responseFeatureCollection.openParentWindow = subLayer.openParentWindow;
    responseFeatureCollection.windowWidth = subLayer.windowWidth;
    responseFeatureCollection.editable = subLayer.editable;

    eventHandler.TriggerEvent(ISY.Events.EventTypes.FeatureInfoEnd, responseFeatureCollection);
  }

  function _getSupportedFormatsForService(isySubLayer, service, callback) {
    var parseCallback = function (data) {
      var jsonCapabilities = parseGetCapabilities(data);
      callback(jsonCapabilities);
    };

    // TODO: This replace is too specific
    var wmsUrl = isySubLayer.url.replace('proxy/wms', 'proxy/');
    var getCapabilitiesUrl;
    var questionMark = '?';
    var urlHasQuestionMark = wmsUrl.indexOf(questionMark) > -1;
    if (!urlHasQuestionMark) {
      wmsUrl = wmsUrl + encodeURIComponent(questionMark);
    }

    var request = 'SERVICE=' + service + '&REQUEST=GETCAPABILITIES';
    if (isySubLayer.source === ISY.Domain.SubLayer.SOURCES.proxyWms || isySubLayer.source === ISY.Domain.SubLayer.SOURCES.proxyWmts) {
      request = encodeURIComponent(request);
    }
    getCapabilitiesUrl = wmsUrl + request;
    httpHelper.get(getCapabilitiesUrl).success(parseCallback);
  }

  function parseGetCapabilities(getCapabilitiesXml) {
    var parser = new ol.format.WMSCapabilities();
    return parser.read(getCapabilitiesXml);
  }

  /*
      Get Feature Info function
   */

  function handlePointSelect(coordinate, layersSupportingGetFeatureInfo) {
    if (useInfoMarker === true) {
      _showInfoMarker(coordinate);
    }
    eventHandler.TriggerEvent(ISY.Events.EventTypes.MapClickCoordinate, coordinate);
    _trigStartGetInfoRequest(layersSupportingGetFeatureInfo);

    for (var i = 0; i < layersSupportingGetFeatureInfo.length; i++) {
      var subLayer = layersSupportingGetFeatureInfo[i];
      switch (subLayer.source) {
        case ISY.Domain.SubLayer.SOURCES.wmts:
        case ISY.Domain.SubLayer.SOURCES.wms:
        case ISY.Domain.SubLayer.SOURCES.proxyWms:
        case ISY.Domain.SubLayer.SOURCES.proxyWmts:
          _sendGetFeatureInfoRequest(subLayer, coordinate);
          break;
        case ISY.Domain.SubLayer.SOURCES.wfs:
        case ISY.Domain.SubLayer.SOURCES.vector:
          var features = mapImplementation.GetFeaturesInExtent(subLayer, mapImplementation.GetExtentForCoordinate(coordinate, pixelTolerance));
          _handleGetInfoResponse(subLayer, features);
          break;
      }
    }
  }

  function _sendGetFeatureInfoRequest(subLayer, coordinate) {
    var infoUrl = mapImplementation.GetInfoUrl(subLayer, coordinate);
    infoUrl = decodeURIComponent(infoUrl);
    _handleGetInfoRequest(infoUrl, subLayer);
  }

  function getSupportedGetFeatureInfoFormats(isySubLayer, callback) {
    var service = 'WMS';
    var getFormatCallback = function (jsonCapabilities) {
      var formats = jsonCapabilities.Capability.Request.GetFeatureInfo.Format;
      callback(formats);
    };
    _getSupportedFormatsForService(isySubLayer, service, getFormatCallback);
  }

  /*
      Get Feature functions
   */

  function handleBoxSelect(boxExtent, layersSupportingGetFeature) {
    _trigStartGetInfoRequest(layersSupportingGetFeature);

    for (var i = 0; i < layersSupportingGetFeature.length; i++) {
      var subLayer = layersSupportingGetFeature[i];
      switch (subLayer.source) {
        case ISY.Domain.SubLayer.SOURCES.wmts:
        case ISY.Domain.SubLayer.SOURCES.wms:
        case ISY.Domain.SubLayer.SOURCES.proxyWms:
        case ISY.Domain.SubLayer.SOURCES.proxyWmts:
          _sendBoxSelectRequest(subLayer, boxExtent);
          break;
        case ISY.Domain.SubLayer.SOURCES.wfs:
        case ISY.Domain.SubLayer.SOURCES.vector:
          var features = mapImplementation.GetFeaturesInExtent(subLayer, boxExtent);
          _handleGetInfoResponse(subLayer, features);
          break;
      }
    }
  }

  function _sendBoxSelectRequest(isySubLayer, boxExtent) {
    var proxyHost = mapImplementation.GetProxyHost();
    var infoUrl = proxyHost + _getFeatureUrl(isySubLayer, boxExtent);
    _handleGetInfoRequest(infoUrl, isySubLayer);
  }

  function _getFeatureUrl(isySubLayer, boxExtent) {
    var crs = isySubLayer.featureInfo.getFeatureCrs;
    //var adaptedExtent = mapImplementation.TransformBox(isySubLayer.coordinate_system, isySubLayer.featureInfo.getFeatureCrs, boxExtent);
    //var extent = mapImplementation.GetCenterFromExtent(boxExtent);
    //var url = "service=WFS&request=GetFeature&typeName=" + isySubLayer.name + "&srsName=" + crs + "&outputFormat=" + isySubLayer.featureInfo.getFeatureFormat + "&bbox=" + adaptedExtent;
    var url = 'service=WMS&version=1.3.0&request=GetFeatureInfo&TRANSPARENT=' + isySubLayer.transparent + '&QUERY_LAYERS=' + isySubLayer.name + '&INFO_FORMAT=' + isySubLayer.featureInfo.getFeatureInfoFormat + '&SRS=' + crs + '&bbox=' + boxExtent + '&width=' + 400 + '&height=' + 400 + '&x=' + 150 + '&y=' + 150;
    url = decodeURIComponent(url);
    url = url.substring(url.lastIndexOf('?'), url.length);
    url = url.replace('?', '');
    url = encodeURIComponent(url);
    // TODO: This replace is too specific
    return isySubLayer.url[0].replace('proxy/wms', 'proxy/') + url;
  }

  function getSupportedGetFeatureFormats(isySubLayer, callback) {
    //TODO: Handle namespace behaviour, when colon is present the parser fails....Meanwhile, do not use
    var service = 'WFS';
    var getFormatCallback = function (jsonCapabilities) {
      var formats = jsonCapabilities.Capability.Request.GetFeature.Format;
      callback(formats);
    };
    _getSupportedFormatsForService(isySubLayer, service, getFormatCallback);
  }

  /*
      Marker functions for Get Feature info click
   */

  function createDefaultInfoMarker() {
    infoMarker = document.createElement('img');
    infoMarker.src = infoMarkerPath;
    _hideInfoMarker();
    _addInfoMarker();
  }

  function _showInfoMarker(coordinate) {
    if (infoMarker === undefined) {
      createDefaultInfoMarker();
    }
    setInfoMarker(infoMarker, true);
    infoMarker.style.visibility = 'visible';
    infoMarker.style.position = 'absolute';
    infoMarker.style.zIndex = '11';
    mapImplementation.ShowInfoMarker(coordinate, infoMarker);
  }

  function _showInfoMarkers(coordinates) {
    mapImplementation.ShowInfoMarkers(coordinates, infoMarker);
  }

  function setInfoMarker(element, removeCurrent) {
    if (useInfoMarker === true) {
      if (removeCurrent === true) {
        if (infoMarker === undefined) {
          createDefaultInfoMarker();
        }
        mapImplementation.RemoveInfoMarker(infoMarker);
        _hideInfoMarker();
        useInfoMarker = false;
      }
      infoMarker = element;
      //_addInfoMarker();
    }
  }

  function _addInfoMarker() {
    document.body.appendChild(infoMarker);
    //useInfoMarker = true;
  }

  function removeInfoMarker() {
    useInfoMarker = true;
    setInfoMarker(infoMarker, true);
  }

  function removeInfoMarkers() {
    mapImplementation.RemoveInfoMarkers(undefined);
  }

  function _hideInfoMarker() {
    infoMarker.style.visibility = 'hidden';
  }

  function setInfoMarkerPath(path) {
    infoMarkerPath = path;
  }

  function showInfoMarker(coordinate) {
    _showInfoMarker(coordinate);
    //mapImplementation.ShowInfoMarker(coordinate);
  }

  function showInfoMarkers(coordinates) {
    _showInfoMarkers(coordinates);
    //mapImplementation.ShowInfoMarker(coordinate);
  }

  return {
    HandlePointSelect: handlePointSelect,
    HandleBoxSelect: handleBoxSelect,
    CreateDefaultInfoMarker: createDefaultInfoMarker,
    SetInfoMarker: setInfoMarker,
    RemoveInfoMarker: removeInfoMarker,
    RemoveInfoMarkers: removeInfoMarkers,
    GetSupportedGetFeatureInfoFormats: getSupportedGetFeatureInfoFormats,
    GetSupportedGetFeatureFormats: getSupportedGetFeatureFormats,
    SetInfoMarkerPath: setInfoMarkerPath,
    ShowInfoMarker: showInfoMarker,
    ShowInfoMarkers: showInfoMarkers
  };
};
