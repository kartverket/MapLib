var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};
ISY.MapAPI.Map = ISY.MapAPI.Map || {};

ISY.MapAPI.FeatureInfo = function(mapImplementation, httpHelper, eventHandler, featureParser){

    /*
        The reference to document in this class is necessary due to offset.
        When the marker is placed onto the map for the first time offset does not work unless the image is already present in the DOM.
        A possible fix to this is to not use an image and instead use an icon.

     */

    var infoMarker;
    var infoMarkerPath = "assets/img/pin-md-orange.png"; // This path is possible to change by API call.
    var useInfoMarker = false;
    var pixelTolerance = 10;

    /*
        Common feature info functions
     */

    function _trigStartGetInfoRequest(layersToRequest){
        var responseFeatureCollections = _createResponseFeatureCollections(layersToRequest);
        eventHandler.TriggerEvent(ISY.Events.EventTypes.FeatureInfoStart, responseFeatureCollections);
    }

    function _createResponseFeatureCollections(layersToRequest){
        var responseFeatureCollections = [];
        for(var i = 0; i < layersToRequest.length; i++){
            var layerToRequest = layersToRequest[i];
            var responseFeatureCollection = new ISY.Domain.LayerResponse();
            responseFeatureCollection.id = layerToRequest.id;
            responseFeatureCollection.name = layerToRequest.providerName;
            responseFeatureCollection.isLoading = true;
            responseFeatureCollections.push(responseFeatureCollection);
        }
        return responseFeatureCollections;
    }

    function _handleGetInfoRequest(url, subLayer){
        var callback = function(data){
            _handleGetInfoResponse(subLayer, data);
        };
        httpHelper.get(url).success(callback);
    }

    function _convertJSONtoArray(data) {
        var results = [];
        Object.keys(data).forEach(function(key){
            var value = data[key];
            var result = [];
            result.push(key);
            result.push(value);
            results.push(result);
        });
        return results;
    }

    function _handleGetInfoResponse(subLayer, result){
        var parsedResult;
        var exception;

        if (subLayer.featureInfo.getFeatureInfoFormat === "application/vnd.ogc.gml"){
            var xmlFile = jQuery.parseXML(result);
            var jsonFile = xml.xmlToJSON(xmlFile);
            if (jsonFile.msGMLOutput[subLayer.providerName + "_layer"] !== undefined){
                var features = _convertJSONtoArray(jsonFile.msGMLOutput[subLayer.providerName + "_layer"][subLayer.providerName + "_feature"]);
                parsedResult =[{
                    "attributes": features
                }];
            }

        }else{
            try {
                parsedResult = featureParser.Parse(result);
            }
            catch(e){
                exception = e;
            }
        }

        var responseFeatureCollection = new ISY.Domain.LayerResponse();
        responseFeatureCollection.id = subLayer.id;
        responseFeatureCollection.name = subLayer.providerName;
        responseFeatureCollection.isLoading = false;
        responseFeatureCollection.features = parsedResult;
        responseFeatureCollection.exception = exception;
        responseFeatureCollection.featureInfoTitle = subLayer.featureInfoTitle;
        if(subLayer.source === ISY.Domain.SubLayer.SOURCES.proxyWms || subLayer.source == ISY.Domain.SubLayer.SOURCES.proxyWmts ||
            subLayer.source === ISY.Domain.SubLayer.SOURCES.wms || subLayer.source === ISY.Domain.SubLayer.SOURCES.wmts){
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

    function _getSupportedFormatsForService(isySubLayer, service, callback){
        var parseCallback = function(data){
            var jsonCapabilities = parseGetCapabilities(data);
            callback(jsonCapabilities);
        };

        // TODO: This replace is too specific
        var wmsUrl = isySubLayer.url.replace('proxy/wms', 'proxy/');
        var getCapabilitiesUrl;
        var questionMark = '?';
        var urlHasQuestionMark = wmsUrl.indexOf(questionMark) > -1;
        if(!urlHasQuestionMark){
            wmsUrl = wmsUrl + encodeURIComponent(questionMark);
        }

        var request = 'SERVICE=' + service + '&REQUEST=GETCAPABILITIES';
        if(isySubLayer.source === ISY.Domain.SubLayer.SOURCES.proxyWms || isySubLayer.source == ISY.Domain.SubLayer.SOURCES.proxyWmts){
            request = encodeURIComponent(request);
        }
        getCapabilitiesUrl = wmsUrl + request;
        httpHelper.get(getCapabilitiesUrl).success(parseCallback);
    }

    function parseGetCapabilities(getCapabilitiesXml){
        var parser = new ol.format.WMSCapabilities();
        var result = parser.read(getCapabilitiesXml);
        return result;
    }

    /*
        Get Feature Info function
     */

    function handlePointSelect(coordinate, layersSupportingGetFeatureInfo){
        if(useInfoMarker === true){
            _showInfoMarker(coordinate);
        }

        _trigStartGetInfoRequest(layersSupportingGetFeatureInfo);

        for(var i = 0; i < layersSupportingGetFeatureInfo.length; i++){
            var subLayer = layersSupportingGetFeatureInfo[i];
            switch (subLayer.source){
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

    function _sendGetFeatureInfoRequest(subLayer, coordinate){
        var infoUrl = mapImplementation.GetInfoUrl(subLayer, coordinate);
        _handleGetInfoRequest(infoUrl, subLayer);
    }

    function getSupportedGetFeatureInfoFormats(isySubLayer, callback){
        var service = 'WMS';
        var getFormatCallback = function(jsonCapabilities){
            var formats = jsonCapabilities.Capability.Request.GetFeatureInfo.Format;
            callback(formats);
        };
        _getSupportedFormatsForService(isySubLayer, service, getFormatCallback);
    }

    /*
        Get Feature functions
     */

    function handleBoxSelect(boxExtent, layersSupportingGetFeature){
        _trigStartGetInfoRequest(layersSupportingGetFeature);

        for(var i = 0; i < layersSupportingGetFeature.length; i++){
            var subLayer = layersSupportingGetFeature[i];
            switch (subLayer.source){
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

    function _sendBoxSelectRequest(isySubLayer, boxExtent){
        var proxyHost = mapImplementation.GetProxyHost();
        var infoUrl = proxyHost + _getFeatureUrl(isySubLayer, boxExtent);
        _handleGetInfoRequest(infoUrl, isySubLayer);
    }

    function _getFeatureUrl(isySubLayer, boxExtent){
        var crs = isySubLayer.featureInfo.getFeatureCrs;
        //var adaptedExtent = mapImplementation.TransformBox(isySubLayer.coordinate_system, isySubLayer.featureInfo.getFeatureCrs, boxExtent);
        //var extent = mapImplementation.GetCenterFromExtent(boxExtent);
        var adaptedExtent = boxExtent;
        //var url = "service=WFS&request=GetFeature&typeName=" + isySubLayer.name + "&srsName=" + crs + "&outputFormat=" + isySubLayer.featureInfo.getFeatureFormat + "&bbox=" + adaptedExtent;
        var url = "service=WMS&version=1.3.0&request=GetFeatureInfo&TRANSPARENT=" + isySubLayer.transparent + "&QUERY_LAYERS=" + isySubLayer.name + "&INFO_FORMAT="+ isySubLayer.featureInfo.getFeatureInfoFormat + "&SRS=" + crs + "&bbox=" + adaptedExtent + "&width=" + 400 + "&height=" + 400 + "&x=" + 150 + "&y=" + 150;
        url = decodeURIComponent(url);
        url = url.substring(url.lastIndexOf('?'), url.length);
        url = url.replace('?', '');
        url = encodeURIComponent(url);
        // TODO: This replace is too specific
        return isySubLayer.url[0].replace('proxy/wms', 'proxy/') + url;
    }

    function getSupportedGetFeatureFormats(isySubLayer, callback){
        //TODO: Handle namespace behaviour, when colon is present the parser fails....Meanwhile, do not use
        var service = 'WFS';
        var getFormatCallback = function(jsonCapabilities){
            var formats = jsonCapabilities.Capability.Request.GetFeature.Format;
            callback(formats);
        };
        _getSupportedFormatsForService(isySubLayer, service, getFormatCallback);
    }

    /*
        Marker functions for Get Feature info click
     */

    function createDefaultInfoMarker(){
        infoMarker = document.createElement("img");
        infoMarker.src= infoMarkerPath;
        _hideInfoMarker();
        _addInfoMarker();
    }

    function _showInfoMarker(coordinate){
        if (infoMarker === undefined){
            createDefaultInfoMarker();
        }
        setInfoMarker(infoMarker, true);
        infoMarker.style.visibility = "visible";
        mapImplementation.ShowInfoMarker(coordinate, infoMarker);
    }

    function _showInfoMarkers(coordinates){
        // if (infoMarker === undefined){
        //     createDefaultInfoMarker();
        // }
        // setInfoMarker(infoMarker, true);
        // infoMarker.style.visibility = "visible";
        mapImplementation.ShowInfoMarkers(coordinates, infoMarker);
    }

    function setInfoMarker(element, removeCurrent){
        if(useInfoMarker === true) {
            if (removeCurrent === true) {
                if (infoMarker === undefined){
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
    function _addInfoMarker(){
        document.body.appendChild(infoMarker);
        //useInfoMarker = true;
    }

    function removeInfoMarker(){
        useInfoMarker = true;
        setInfoMarker(infoMarker, true);
    }

    function removeInfoMarkers() {
        mapImplementation.RemoveInfoMarkers(undefined);
    }

    function _hideInfoMarker(){
        infoMarker.style.visibility = "hidden";
    }

    function setInfoMarkerPath(path){
        infoMarkerPath = path;
    }

    function showInfoMarker(coordinate){
        _showInfoMarker(coordinate);
        //mapImplementation.ShowInfoMarker(coordinate);
    }

    function showInfoMarkers(coordinates){
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