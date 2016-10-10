/**
 * maplib - v0.0.1 - 2016-10-10
 * http://localhost
 *
 * Copyright (c) 2016 
 */
var ISY = ISY || {};
ISY.Domain = ISY.Domain || {};

ISY.Domain.Category = function(config){
    var defaults = {
        catId: -1,
        name: '',
        isOpen: false,
        parentId: -1,
        subCategories: [],
        isyLayers: [],
        isAllLayersSelected: false

    };
    var categoryInstance = $.extend({}, defaults, config); // categoryInstance

    var subCategories = [];
    for(var i = 0; i < config.subCategories.length; i++){
        subCategories.push(new ISY.Domain.Category(config.subCategories[i]));
    }

    categoryInstance.subCategories = subCategories;

    return categoryInstance;
};
var ISY = ISY || {};
ISY.Domain = ISY.Domain || {};

ISY.Domain.FeatureInfo = function(config){
    var defaults = {
        // single select via WMS GetFeatureInfo
        supportsGetFeatureInfo: true,
        getFeatureInfoFormat: 'application/json',
        getFeatureInfoCrs: '',

        // multi select via WFS GetFeature
        supportsGetFeature: true,
        getFeatureBaseUrl: '',
        getFeatureFormat: 'application/json',
        getFeatureCrs: 'EPSG:4326'
    };
    var instance =  $.extend({}, defaults, config);

    return instance;
};
var ISY = ISY || {};
ISY.Domain = ISY.Domain || {};

ISY.Domain.FeatureResponse = function() {
    return {
        geometryObject: '',
        crs: '',
        attributes: []
    };
};
var ISY = ISY || {};
ISY.Domain = ISY.Domain || {};

ISY.Domain.Layer = function(config){
    var defaults = {
        guid: '',
        subLayers: [],
        name: '',
        categoryId: 0,
        visibleOnLoad: true,
        isVisible: false, // Holds current state, will be set to true on factory.Init if VisibleOnLoad = true
        id: new ISY.Utils.Guid().NewGuid(),
        isBaseLayer: false,
        previewActive: false,
        opacity: 1,
        mapLayerIndex: -1,
        minResolution: 0,
        maxResolution: Infinity,
        legendGraphicUrls: [],
        selectedLayerOpen: false //todo johben temp
    };
    var layerInstance = $.extend({}, defaults, config); // layerInstance

    var subLayers = [];
    for(var i = 0; i < config.subLayers.length; i++){
        subLayers.push(new ISY.Domain.SubLayer(config.subLayers[i]));
    }

    layerInstance.subLayers = subLayers;

    return layerInstance;
};
var ISY = ISY || {};
ISY.Domain = ISY.Domain || {};

ISY.Domain.LayerResponse = function(){
    return{
        id: -1,
        isLoading: false,
        exception: '',
        features: []
    };
};
var ISY = ISY || {};
ISY.Domain = ISY.Domain || {};

ISY.Domain.LegendGraphic = function(config){
    var defaults = {
        width : "20",
        height : "20",
        format : "image/png",
        request : "GetLegendGraphic",
        version : "1.0.0",
        layer : '',
        url : ''
    };

    var instance =  $.extend({}, defaults, config);

    function getLegendGraphicUrl (){
        if (instance.url !== "?"){
            return instance.url + "&Request=" + instance.request + "&Version=" + instance.version + "&Format=" + instance.format + "&Width=" + instance.width + "&Height=" + instance.height + "&Layer=" + instance.layer;
        }else{
            return "";
        }

    }

    return {
        GetLegendGraphicUrl: getLegendGraphicUrl
    };
};
var ISY = ISY || {};
ISY.Domain = ISY.Domain || {};

ISY.Domain.MeasureResult = function(polygonArea, edgeLength, circleArea){
    var pa = polygonArea;
    var el = edgeLength;
    var ca = circleArea;

    function getPolygonArea(){
        return pa;
    }

    function getEdgeLength(){
        return el;
    }

    function getCircleArea(){
        return ca;
    }

    function getParsedResult(){
        return 'Polygon area: ' + getPolygonArea() + ' Length: ' + getEdgeLength() + ' Circle area: ' + getCircleArea();
    }

    return {
        PolygonArea: getPolygonArea,
        EdgeLength: getEdgeLength,
        CircleArea: getCircleArea,
        GetParsedResult: getParsedResult
    };
};

var ISY = ISY || {};
ISY.Domain = ISY.Domain || {};

ISY.Domain.SubLayer = function(config){
    var id = new ISY.Utils.Guid().NewGuid();

    var defaults = {
        name: '',
        providerName: '',   //f.eks Fiskeridirektoratet
        source: ISY.Domain.SubLayer.SOURCES.wmts,
        url: '',
        format: ISY.Domain.SubLayer.FORMATS.imagepng,
        coordinate_system: '',
        srs_dimension: '',
        matrixSet: '',
        extent: [-1, 1, -1, 1],
        extentUnits: 'm',
        id: id,
        transparent: true,
        layerIndex: -1,
        legendGraphicUrl: '',
        crossOrigin: 'anonymous',
        featureInfoTitle:'',
        tooltipTemplate:'',
        showDialog:true,
        openNewWindow: false,
        openParentWindow: false,
        windowWidth: 500,
        featureInfoElement: [],
        editable: false,
        featureInfo: new ISY.Domain.FeatureInfo(),
        featureNS: '',
        geometryName: 'geometry'
    };
    var instance =  $.extend({}, defaults, config); // subLayerInstance

    if(instance.legendGraphicUrl.indexOf('?') == -1){
        instance.legendGraphicUrl += '?';
    }
    if (instance.legendGraphicUrl !== '') {
        var legendGraphic = new ISY.Domain.LegendGraphic({url: instance.legendGraphicUrl, layer: instance.name});
    instance.legendGraphicUrl = legendGraphic.GetLegendGraphicUrl();
    }

    return instance;
};

ISY.Domain.SubLayer.SOURCES = {
    wmts: "WMTS",
    wms: "WMS",
    vector: "VECTOR",
    proxyWmts: "proxyWmts",
    proxyWms: "proxyWms",
    tms: "TMS",
    wfs: "WFS"

};

ISY.Domain.SubLayer.FORMATS = {
    imagepng: "image/png",
    imagejpeg: "image/jpeg",
    geoJson: "application/json"
};

var ISY = ISY || {};
ISY.Events = ISY.Events || {};

ISY.Events.EventHandler = function(){
    var callBacks = [];

    function registerEvent(eventType, callBack){
        callBacks.push({
            eventType: eventType,
            callBack: callBack
        });
    }

    function unRegisterEvent(eventType, callBack){
        for(var i = 0; i < callBacks.length; i++){
            if(callBacks[i].eventType == eventType && callBacks[i].callBack == callBack){
                callBacks.splice(i, 1);
                break;
            }
        }
    }

    function triggerEvent(eventType, args){
        for(var i = 0; i < callBacks.length; i++){
            var callBack = callBacks[i];
            if(callBack.eventType == eventType){
                callBack.callBack(args);
            }
        }
    }

    return {
        RegisterEvent: registerEvent,
        UnRegisterEvent: unRegisterEvent,
        TriggerEvent: triggerEvent
    };
};

ISY.Events.EventTypes = {
    ChangeCenter: "ChangeCenter",
    ChangeResolution: "ChangeResolution",
    ChangeLayers: "ChangeLayers",
    FeatureInfoStart: "FeatureInfoStart",
    FeatureInfoEnd: "FeatureInfoEnd",
    MapConfigLoaded: "MapConfigLoaded",
    MapLoaded: "MapLoaded",
    MapMoveend: "MapMoveend",
    ShowExportPanel: "ShowExportPanel",
    MeasureMouseMove: "MeasureMouseMove",
    LoadingLayerEnd: "LoadingLayerEnd",
    LayerCreated: "LayerCreated",
    CachingStart: "CachingStart",
    CachingEnd: "CachingEnd",
    CachingProgress: "CachingProgress",
    StatusPouchDbChanged: "StatusPouchDbChanged",
    MeasureEnd: "MeasureEnd",
    DrawFeatureMouseMove: "DrawFeatureMouseMove",
    DrawFeatureEnd: "DrawFeatureEnd",
    AddLayerFeatureEnd: "AddLayerFeatureEnd",
    ModifyFeatureEnd: "ModifyFeatureEnd",
    RefreshSourceDone: "RefreshSourceDone",
    ZoomIn: "ZoomIn",
    ZoomOut: "ZoomOut",
    TransactionSuccessful: "TransactionSuccessful",
    TransactionFailed: "TransactionFailed",
    TransactionInsertEnd: "TransactionInsertEnd",
    TransactionUpdateEnd: "TransactionUpdateEnd",
    TransactionRemoveEnd: "TransactionRemoveEnd",
    FeatureHasBeenDescribed: "FeatureHasBeenDescribed",
    GeolocationUpdated: "GeolocationUpdated",
    PrintBoxSelectReturnValue: "PrintBoxSelectReturnValue",
    MapClickCoordinate: "MapClickCoordinate"
};
var ISY = ISY || {};
ISY.Facade = ISY.Facade || {};

ISY.Facade.ServerConfigFacade = function () {

    function getMapConfig(url, callback) {

        $.getJSON(url, function (data) {
            callback(data);
        });
    }

    return {
        GetMapConfig: getMapConfig
    };
};
var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};

ISY.MapAPI.Categories = function(){
    var categories = [];

    function init(mapConfig) {
        categories = mapConfig.categories;
    }

    function getCategories() {
        return categories;
    }

    function getCategoryById(catId) {
        for(var i = 0; i < categories.length; i++){
            var cat = categories[i];
            if (cat.catId.toString() === catId.toString()){
                return cat;
            }
            for (var j = 0; j < categories[i].subCategories.length; j++) {
                var subcat = categories[i].subCategories[j];
                if (subcat.catId.toString() === catId.toString()){
                    return subcat;
                }
            }
        }
    }

    return {
        Init: init,
        GetCategoryById: getCategoryById,
        GetCategories: getCategories
    };
};
var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};

ISY.MapAPI.CustomCrsLoader = function(){
    function loadCustomCrs() {
        // proj4 is on the global scope
        //proj4.defs("EPSG:25832", '+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs');
        //proj4.defs("EPSG:25833", '+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs');
        //proj4.defs("EPSG:25835", '+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs');
        //proj4.defs("EPSG:32632", '+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
        //proj4.defs("EPSG:32633", '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
        //proj4.defs("EPSG:32635", '+proj=utm +zone=35 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
        //proj4.defs("EPSG:3575", '+proj=laea +lat_0=90 +lon_0=10 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');

        // From epsg.io
        //SWEREF99:
        proj4.defs("EPSG:3006","+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
        proj4.defs("EPSG:3007","+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
        proj4.defs("EPSG:3008","+proj=tmerc +lat_0=0 +lon_0=13.5 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
        proj4.defs("EPSG:3009","+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
        proj4.defs("EPSG:3010","+proj=tmerc +lat_0=0 +lon_0=16.5 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
        proj4.defs("EPSG:3011","+proj=tmerc +lat_0=0 +lon_0=18 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
        proj4.defs("EPSG:3012","+proj=tmerc +lat_0=0 +lon_0=14.25 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
        proj4.defs("EPSG:3013","+proj=tmerc +lat_0=0 +lon_0=15.75 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
        proj4.defs("EPSG:3014","+proj=tmerc +lat_0=0 +lon_0=17.25 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
        proj4.defs("EPSG:3015","+proj=tmerc +lat_0=0 +lon_0=18.75 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
        proj4.defs("EPSG:3016","+proj=tmerc +lat_0=0 +lon_0=20.25 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
        proj4.defs("EPSG:3017","+proj=tmerc +lat_0=0 +lon_0=21.75 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
        proj4.defs("EPSG:3018","+proj=tmerc +lat_0=0 +lon_0=23.25 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
        //UTM 31-35:
        proj4.defs("EPSG:25832", "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
        proj4.defs("EPSG:25833", "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
        proj4.defs("EPSG:25834", "+proj=utm +zone=34 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
        proj4.defs("EPSG:25835", "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
        proj4.defs("EPSG:25836", "+proj=utm +zone=36 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
        proj4.defs("EPSG:32632", "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");
        proj4.defs("EPSG:32633", "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs");
        proj4.defs("EPSG:32634", "+proj=utm +zone=34 +datum=WGS84 +units=m +no_defs");
        proj4.defs("EPSG:32635", "+proj=utm +zone=35 +datum=WGS84 +units=m +no_defs");
        proj4.defs("EPSG:32636", "+proj=utm +zone=36 +datum=WGS84 +units=m +no_defs");

        proj4.defs("EPSG:3575", "+proj=laea +lat_0=90 +lon_0=10 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");

        proj4.defs("EPSG:4258","+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs");

        // TODO: Geoserver
        //proj4.defs("http://www.opengis.net/gml/srs/epsg.xml#25832", '+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs');
        //proj4.defs("http://www.opengis.net/gml/srs/epsg.xml#25833", '+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs');
        //proj4.defs("http://www.opengis.net/gml/srs/epsg.xml#25835", '+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs');
        //proj4.defs("http://www.opengis.net/gml/srs/epsg.xml#32632", '+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
        //proj4.defs("http://www.opengis.net/gml/srs/epsg.xml#32633", '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
        //proj4.defs("http://www.opengis.net/gml/srs/epsg.xml#32635", '+proj=utm +zone=35 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
        //Sverige:
        proj4.defs("EPSG:3006", "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ");
    }

    return {
        LoadCustomCrs: loadCustomCrs
    };
};
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
        eventHandler.TriggerEvent(ISY.Events.EventTypes.MapClickCoordinate, coordinate);
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
        infoMarker.style.position = "absolute";
        infoMarker.style.zIndex = "11";
        mapImplementation.ShowInfoMarker(coordinate, infoMarker);
    }

    function _showInfoMarkers(coordinates){
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
var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};

ISY.MapAPI.Groups = function(){
    var groups = [];

    function init(mapConfig) {
        groups = mapConfig.groups;
    }

    function getGroups() {
        return groups;
    }

    function getGroupById(groupId) {
        for(var i = 0; i < groups.length; i++){
            var group = groups[i];
            if (group.groupId.toString() === groupId.toString()){
                return group;
            }
            for (var j = 0; j < groups[i].subCategories.length; j++) {
                var subcat = groups[i].subCategories[j];
                if (subcat.groupId.toString() === groupId.toString()){
                    return subcat;
                }
            }
        }
    }

    return {
        Init: init,
        GetGroupById: getGroupById,
        GetGroups: getGroups
    };
};

var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};

ISY.MapAPI.Layers = function(mapImplementation){
    var config;
    var layers;
    var layersArranged;

    function init(mapConfig){
        config = mapConfig;
        layers = mapConfig.layers;

        _setUpLayerIndex();

        var baseLayers = getBaseLayers();
        var isBaseLayerVisible = false;
        for(var i = 0; i < baseLayers.length; i++){
            var baseLayer = baseLayers[i];
            if(baseLayer.visibleOnLoad){
                setBaseLayer(baseLayer);
            }else if(isBaseLayerVisible === false){
                baseLayer.visibleOnLoad = true;
                setBaseLayer(baseLayer);
                isBaseLayerVisible = true;
            }
        }

        var overlayLayers = getOverlayLayers();
        for(var j = 0; j < overlayLayers.length; j++){
            var overlayLayer = overlayLayers[j];
            if(overlayLayer.visibleOnLoad){
                showLayer(overlayLayer);
            } else {
                hideLayer(overlayLayer);
            }
        }
    }

    function _setUpLayerIndex(){
        var layerIndex = 0;

        var baseLayers = getBaseLayers();
        for(var i = 0; i < baseLayers.length; i++){
            var baseLayer = baseLayers[i];
            for(var j = 0; j < baseLayer.subLayers.length; j++){
                baseLayer.subLayers[j].layerIndex = layerIndex;
                layerIndex++;
            }
        }

        var overlayLayers = getOverlayLayers();
        for(var k = 0; k < overlayLayers.length; k++){
            var overlayLayer = overlayLayers[k];
            for(var l = 0; l < overlayLayer.subLayers.length; l++){
                overlayLayer.subLayers[l].layerIndex = layerIndex;
                layerIndex++;
            }
        }
    }

    function _getLayers() {
        if (config !== undefined) {
            return config.layers;
        }
        return [];
    }

    function _compare(a, b) {
        if (a.id < b.id) {
            return -1;
        }
        if (a.id > b.id) {
            return 1;
        }
        return 0;
    }

    function arrangeLayers(){
        if (layersArranged){
            return;
        }
        layersArranged = true;
        var overlayLayers = getOverlayLayers();
        var rearrangeLayers = [];
        for(var k = 0; k < overlayLayers.length; k++){
            var overlayLayer = overlayLayers[k];
            if (overlayLayer.isVisible) {
                rearrangeLayers.push(overlayLayer);
            }
        }
        rearrangeLayers.sort(_compare);
        rearrangeLayers.forEach(function(layer){
            showLayer(layer);
        });
    }

    function getBaseLayers(){
        return _getLayers().filter(function (elem) {
            return elem.isBaseLayer === true;
        });
    }

    function getOverlayLayers(){
        return _getLayers().filter(function (elem) {
            return elem.isBaseLayer === false;
        });
    }

    function setBaseLayer(isyLayer){
        var baseLayers = getVisibleBaseLayers();
        for(var i = 0; i < baseLayers.length; i++){
            var baseLayer = baseLayers[i];
            hideLayer(baseLayer);
        }

        _showBaseLayer(isyLayer);
    }

    function updateSortingIndex(){
        var index = 1;
        for (var i = 0; i < config.groups.length; i++){
            if (config.groups[i].isyLayers !== undefined){
                for (var j = 0; j < config.groups[i].isyLayers.length; j++){
                    for (var k = 0; k<config.groups[i].isyLayers[j].subLayers.length; k++){
                        config.groups[i].isyLayers[j].subLayers[k].sortingIndex = index;
                        index +=1;
                    }
                }
            }else{
                break;
            }
        }
    }

    function addLayer(isyLayer) {
        showLayer(isyLayer);
        layers.push(isyLayer);
    }

    function showLayer(isyLayer) {
        var subLayers = isyLayer.subLayers;
        for(var j = 0; j < subLayers.length; j++){
            var isySubLayer = subLayers[j];
            if(shouldBeVisible(isySubLayer)){
                mapImplementation.ShowLayer(isySubLayer);
            } else {
                mapImplementation.HideLayer(isySubLayer);
            }
        }

        isyLayer.isVisible = true;
        //_recalculateMapLayerIndexes();
        updateSortingIndex();
        mapImplementation.UpdateLayerSortIndex(config.groups);
        mapImplementation.SortLayerBySortIndex();
        mapImplementation.RedrawMap();
    }

    function hideLayer(isyLayer) {
        var subLayers = isyLayer.subLayers;
        isyLayer.isVisible = false;
        for(var j = 0; j < subLayers.length; j++){
            var isySubLayer = subLayers[j];
            mapImplementation.HideLayer(isySubLayer);
        }

        isyLayer.mapLayerIndex = -1;
        //_recalculateMapLayerIndexes();
    }

    function getVisibleSubLayers(){
        var subLayersOnly = [];
        var visibleOverlays = _getVisibleOverlayLayers();
        for(var i = 0; i < visibleOverlays.length; i++){
            var isyLayer = visibleOverlays[i];
            for(var j = 0; j < isyLayer.subLayers.length; j++){
                var subLayer = isyLayer.subLayers[j];
                if(shouldBeVisible(subLayer)){
                    subLayersOnly.push(subLayer);
                }
            }
        }
        return subLayersOnly;
    }

    function getVisibleBaseLayers(){
        return getBaseLayers().filter(function (elem) {
            return elem.isVisible === true;
        });
    }

    function getLayerById(id) {
        if (layer !== undefined) {
            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];
                if (layer.id.toString() === id.toString()) {
                    return layer;
                }
            }
        }
    }

    function moveLayerToIndexInGroup(){
        updateSortingIndex();
        mapImplementation.UpdateLayerSortIndex(config.groups);
        mapImplementation.SortLayerBySortIndex();
        mapImplementation.RedrawMap();
    }

    function moveLayerToIndex(isyLayer, index){
        var subLayers = isyLayer.subLayers;
        for(var i = 0; i < subLayers.length; i++){
            var subLayer = subLayers[i];
            if(shouldBeVisible(subLayer)){
                mapImplementation.MoveLayerToIndex(subLayer, index);
            }
        }
        mapImplementation.RedrawMap();
    }

    function moveLayerAbove(isySourceLayer, isyTargetLayer){
        var targetLayerIndex = _getMaxLayerIndexForLayer(isyTargetLayer);
        var subLayers = isySourceLayer.subLayers;
        for(var i = 0; i < subLayers.length; i++){
            var subLayer = subLayers[i];
            if(shouldBeVisible(subLayer)){
                mapImplementation.MoveLayerToIndex(subLayer, targetLayerIndex);
            }
        }
    }

    function _showBaseLayer(isyLayer) {
        var subLayers = isyLayer.subLayers;
        for(var j = 0; j < subLayers.length; j++){
            var isySubLayer = subLayers[j];
            if(shouldBeVisible(isySubLayer)){
                mapImplementation.ShowBaseLayer(isySubLayer);
            } else {
                mapImplementation.HideLayer(isySubLayer);
            }
        }

        isyLayer.isVisible = true;
        _recalculateMapLayerIndexes();
    }

    function _recalculateMapLayerIndexes(){
        var visibleOverlayLayers = _getVisibleOverlayLayers();
        for(var i = 0; i < visibleOverlayLayers.length; i++){
            var layer = visibleOverlayLayers[i];
            layer.mapLayerIndex = _getMaxLayerIndexForLayer(layer);
        }
    }

    function _getVisibleOverlayLayers(){
        return getOverlayLayers().filter(function (elem) {
            return elem.isVisible === true;
        });
    }

    function shouldBeVisible(/*isySubLayer*/){
        // todo johben: Logic could include zoom levels in case of a layer with both wms and wfs.
        // I.E.
        // var currentZoomLevel = mapImplementation.getCurrentZoomLevel();
        // return subLayer.StartZoomLevel < currentZoomLevel && subLayer.EndZoomLevel > currentZoomLevel
        return true;
    }

    function _getMaxLayerIndexForLayer(isyLayer){
        var subLayers = isyLayer.subLayers;
        var indexes = [];
        for(var i = 0; i < subLayers.length; i++){
            var subLayer = subLayers[i];
            var thisIndex = mapImplementation.GetLayerIndex(subLayer);
            if(thisIndex != null){
                indexes.push(thisIndex);
            }
        }
        return Math.max(indexes);
    }

    return {
        Init: init,
        ArrangeLayers: arrangeLayers,
        GetBaseLayers: getBaseLayers,
        GetOverlayLayers: getOverlayLayers,
        SetBaseLayer: setBaseLayer,
        AddLayer: addLayer,
        HideLayer: hideLayer,
        ShowLayer: showLayer,
        GetVisibleSubLayers: getVisibleSubLayers,
        GetVisibleBaseLayers: getVisibleBaseLayers,
        GetLayerById: getLayerById,
        MoveLayerToIndex: moveLayerToIndex,
        MoveLayerToIndexInGroup: moveLayerToIndexInGroup,
        MoveLayerAbove: moveLayerAbove,
        ShouldBeVisible: shouldBeVisible
    };

};
var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};

ISY.MapAPI.Map = function(mapImplementation, eventHandler, featureInfo, layerHandler, groupHandler, categoryHandler) {

    /*
        Start up functions Start
     */

    var mapConfiguration;

    function init(targetId, mapConfig){
        _loadCustomCrs();

        mapConfiguration = mapConfig;
        mapImplementation.InitMap(targetId, mapConfig);
        layerHandler.Init(mapConfig);
        groupHandler.Init(mapConfig);
        categoryHandler.Init(mapConfig);

        eventHandler.TriggerEvent(ISY.Events.EventTypes.MapLoaded);
    }

    function _loadCustomCrs(){
        var customCrsLoader = new ISY.MapAPI.CustomCrsLoader();
        customCrsLoader.LoadCustomCrs();

        addCustomProj('EPSG:25832');
        addCustomProj('EPSG:25833');
        addCustomProj('EPSG:25834');
        addCustomProj('EPSG:25835');
        addCustomProj('EPSG:25836');
        addCustomProj('EPSG:32632');
        addCustomProj('EPSG:32633');
        addCustomProj('EPSG:32634');
        addCustomProj('EPSG:32635');
        addCustomProj('EPSG:32636');
        addCustomProj('EPSG:4258');
        // TODO: Geoserver
        //addCustomProj('http://www.opengis.net/gml/srs/epsg.xml#25832');
        //addCustomProj('http://www.opengis.net/gml/srs/epsg.xml#25833');
        //addCustomProj('http://www.opengis.net/gml/srs/epsg.xml#25835');
        //addCustomProj('http://www.opengis.net/gml/srs/epsg.xml#32632');
        //addCustomProj('http://www.opengis.net/gml/srs/epsg.xml#32633');
        //addCustomProj('http://www.opengis.net/gml/srs/epsg.xml#32635');
    }

    function addCustomProj(code) {
        if (typeof(ol) == "undefined") {
            // TODO: Never create ol-stuff in general code!!!
            return;
        }
        var proj = new ol.proj.Projection({
            code: code,
            units: 'm'
        });

        ol.proj.addProjection(proj);
    }

    function changeView(viewPropertyObject){
        mapImplementation.ChangeView(viewPropertyObject);
    }

    function redrawMap() {
        mapImplementation.RedrawMap();
    }

    function refreshMap(){
        mapImplementation.RefreshMap();
    }

    function refreshLayerByGuid(guid, featureObj){
        mapImplementation.RefreshLayerByGuid(guid, featureObj);
    }

    /*
        Start up functions End
     */

    /*
        Layer functions Start
     */

    function addLayer(isyLayer) {
        layerHandler.AddLayer(isyLayer);
    }

    function addDataToLayer(isyLayer, data) {
        mapImplementation.AddDataToLayer(isyLayer.subLayers[0], data);
    }

    function removeDataFromLayer(isyLayer, data) {
        mapImplementation.RemoveDataFromLayer(isyLayer.subLayers[0], data);
    }

    function clearLayer(isyLayer) {
        mapImplementation.ClearLayer(isyLayer.subLayers[0]);
    }

    function showLayer(isyLayer) {
        layerHandler.ShowLayer(isyLayer);
    }

    function hideLayer(isyLayer) {
        layerHandler.HideLayer(isyLayer);
    }

    function setLayerOpacity(isyLayer, value) {
        var subLayers = isyLayer.subLayers;
        for(var j = 0; j < subLayers.length; j++){
            var isySubLayer = subLayers[j];
            mapImplementation.SetLayerOpacity(isySubLayer, value);
        }
        mapImplementation.RedrawMap();
    }

    function setBaseLayer(isyLayer){
        layerHandler.SetBaseLayer(isyLayer);
    }

    function getBaseLayers(){
        return layerHandler.GetBaseLayers();
    }

    function getFirstVisibleBaseLayer(){
        return layerHandler.GetVisibleBaseLayers()[0];
    }

    function getOverlayLayers(){
        return layerHandler.GetOverlayLayers();
    }

    function getVisibleSubLayers(){
        return layerHandler.GetVisibleSubLayers();
    }

    function getLayerById(id) {
        return layerHandler.GetLayerById(id);
    }

    function moveLayerToIndex(isyLayer, index){
        layerHandler.MoveLayerToIndex(isyLayer, index);
    }

    function moveLayerToIndexInGroup(){
        layerHandler.MoveLayerToIndexInGroup();
    }

    function moveLayerAbove(isySourceLayer, isyTargetLayer){
        layerHandler.MoveLayerAbove(isySourceLayer, isyTargetLayer);
    }

    function _shouldBeVisible(subLayer){
        return layerHandler.ShouldBeVisible(subLayer);
    }

    /*
        Layer functions End
     */

    /*
     Categories functions Start
     */

    function getCategoryById(id) {
        return categoryHandler.GetCategoryById(id);
    }

    function getCategories() {
        return categoryHandler.GetCategories();
    }

    /*
     Categories functions End
     */

    /*
     Groups functions Start
     */

    function getGroupById(id) {
        return groupHandler.GetGroupById(id);
    }

    function getGroups() {
        return groupHandler.GetGroups();
    }

    /*
     Groups functions End
     */

    /*
        Export functions Start
     */

    function exportMap(callback){
        mapImplementation.ExportMap(callback);
    }

    function activateExport(options) {
        mapImplementation.ActivateExport(options);
    }

    function deactivateExport() {
        mapImplementation.DeactivateExport();
    }

    function renderSync(){
        return mapImplementation.RenderSync();
    }

    /*
        Export functions End
     */

    /*
        Feature Info Start
     */

    function setImageInfoMarker(path){
        featureInfo.SetInfoMarkerPath(path);
        featureInfo.CreateDefaultInfoMarker();
    }

    function setInfoMarker(element, removeCurrent){
        featureInfo.SetInfoMarker(element, removeCurrent);
    }

    function removeInfoMarker(){
        featureInfo.RemoveInfoMarker();
    }

    function removeInfoMarkers(){
        featureInfo.RemoveInfoMarkers();
    }

    function showHighlightedFeatures(layerguid, features){
        mapImplementation.ShowHighlightedFeatures(layerguid, features);
    }

    function clearHighlightedFeatures(){
        mapImplementation.ClearHighlightedFeatures();
    }

    function setHighlightStyle(style) {
        mapImplementation.SetHighlightStyle(style);
    }

    function activateInfoClick(){
        mapImplementation.ActivateInfoClick(_handlePointSelect);
    }

    function showInfoMarker(coordinate){
        featureInfo.ShowInfoMarker(coordinate);
    }

    function showInfoMarkers(coordinates){
        featureInfo.ShowInfoMarkers(coordinates);
    }

    function deactivateInfoClick(){
        mapImplementation.DeactivateInfoClick();
    }

    function activateBoxSelect(){
        mapImplementation.ActivateBoxSelect(_handleBoxSelect);
    }

    function deactivateBoxSelect(){
        mapImplementation.DeactivateBoxSelect();
    }

    function initEdit(isySubLayer) {
        return mapImplementation.InitEdit(isySubLayer);
    }

    function describeFeature(isySubLayer, geometryType){
        mapImplementation.DescribeFeature(isySubLayer, geometryType);
    }

    function activateEditClick(){
        mapImplementation.ActivateEditSelect(_handleEditSelect);
    }

    function deactivateEditClick(){
        mapImplementation.DeactivateEditSelect();
    }

    function updateFeature(feature) {
        mapImplementation.UpdateFeature(feature);
    }

    function insertFeature(feature, source){
        return mapImplementation.InsertFeature(feature, source);
    }

    function deleteFeature(feature){
        return mapImplementation.DeleteFeature(feature);
    }

    function getSupportedGetFeatureInfoFormats(isySubLayer, callback){
        featureInfo.GetSupportedGetFeatureInfoFormats(isySubLayer, callback);
    }

    function getSupportedGetFeatureFormats(isySubLayer, callback){
        featureInfo.GetSupportedGetFeatureFormats(isySubLayer, callback);
    }

    function arrangeLayers(){
        if (getConfigLayerCount() == getLayerCount()){
            layerHandler.ArrangeLayers();
        }
    }

    function convertGmlToGeoJson(gml){
        return mapImplementation.ConvertGmlToGeoJson(gml);
    }

    function _handlePointSelect(coordinate){
        featureInfo.HandlePointSelect(coordinate, _getLayersSupportingGetFeatureInfo());
    }

    function _getLayersSupportingGetFeatureInfo(){
        var visibleSubLayers = getVisibleSubLayers();
        return visibleSubLayers.filter(function(subLayer){
            if (subLayer.featureInfo) {
                return subLayer.featureInfo.supportsGetFeatureInfo === true;
            } else {
                return false;
            }
        });
    }

    function _handleBoxSelect(boxExtent){
        featureInfo.HandleBoxSelect(boxExtent, _getLayersSupportingGetFeature());
    }

    function _getLayersSupportingGetFeature(){
        var visibleSubLayers = getVisibleSubLayers();
        return visibleSubLayers.filter(function(subLayer){
            return subLayer.featureInfo.supportsGetFeature === true;
        });
    }

    function _handleEditSelect(coordinate){
        mapImplementation.HandlePointSelect(coordinate);
    }

    /*
        Feature Info End
     */

    /*
        Measure Start
     */

    function activateMeasure(options){
        mapImplementation.ActivateMeasure(options);
    }

    function deactivateMeasure(){
        mapImplementation.DeactivateMeasure();
    }

    /*
        Measure End
     */

    /*
     Measure line Start
     */

    function activateMeasureLine(options){
        mapImplementation.ActivateMeasureLine(options);
    }

    function deactivateMeasureLine(){
        mapImplementation.DeactivateMeasureLine();
    }

    /*
     Measure line End
     */

    /*
     Add Feature Start
     */

    function activateAddLayerFeature(options){
        mapImplementation.ActivateAddLayerFeature(options);
    }

    function deactivateAddLayerFeature(){
        mapImplementation.DeactivateAddLayerFeature();
    }

    /*
     Add Feature End
     */

    /*
     Add Feature Gps Start
     */

    function activateAddFeatureGps(options){
        mapImplementation.ActivateAddFeatureGps(options);
    }

    function addCoordinatesGps(coordinates){
        mapImplementation.AddCoordinatesGps(coordinates);
    }

    function deactivateAddFeatureGps(){
        mapImplementation.DeactivateAddFeatureGps();
    }

    /*
     Add Feature Gps End
     */

    /*
     Modify Feature Start
     */

    function activateModifyFeature(options){
        mapImplementation.ActivateModifyFeature(options);
    }

    function deactivateModifyFeature(){
        mapImplementation.DeactivateModifyFeature();
    }

    /*
     Modify Feature End
     */

    /*
     DrawFeature Start
     */

    function activateDrawFeature(options){
        mapImplementation.ActivateDrawFeature(options);
    }

    function deactivateDrawFeature(options){
        mapImplementation.DeactivateDrawFeature(options);
    }

    /*
     DrawFeature End
     */

    /*
     Offline Start
     */

    function initOffline(){
        mapImplementation.InitOffline();
    }

    function activateOffline(){
        mapImplementation.ActivateOffline();
    }

    function startCaching(zoomLevelMin, zoomLevelMax, extentView){
        mapImplementation.StartCaching(zoomLevelMin, zoomLevelMax, extentView);
    }

    function stopCaching(){
        mapImplementation.StopCaching();
    }

    function deleteDatabase(callback, zoomlevels, eventhandler){
        mapImplementation.DeleteDatabase(callback, zoomlevels, eventhandler);
    }

    function cacheDatabaseExist(){
        return mapImplementation.CacheDatabaseExist();
    }

    function calculateTileCount(zoomLevelMin, zoomLevelMax, extentView){
        return mapImplementation.CalculateTileCount(zoomLevelMin, zoomLevelMax, extentView);
    }

    function getResource(url, contentType, callback){
        mapImplementation.GetResource(url, contentType, callback);
    }

    function getConfigResource(url, contentType, callback){
        mapImplementation.GetConfigResource(url, contentType, callback);
    }

    function getResourceFromJson(url, contentType, callback){
        mapImplementation.GetResourceFromJson(url, contentType, callback);
    }

    function getLayerResource(key, name, url){
        mapImplementation.GetLayerResource(key, name, url);
    }

    function deactivateOffline(){
        mapImplementation.DeactivateOffline();
    }

    /*
     Offline End
     */

    /*
     HoverInfo Start
     */
    function activateHoverInfo(){
        mapImplementation.ActivateHoverInfo();
    }

    function deactivateHoverInfo(){
        mapImplementation.DeactivateHoverInfo();
    }

    /*
     HoverInfo End
     */


    /*
     PrintBoxSelect Start
    */
    function activatePrintBoxSelect(options){
        mapImplementation.ActivatePrintBoxSelect(options);
    }

    function deactivatePrintBoxSelect(){
        mapImplementation.DeactivatePrintBoxSelect();
    }

    /*
     PrintBoxSelect End
     */

    /*
        Utility functions Start
     */

    function extentToGeoJson(x, y){
        mapImplementation.ExtentToGeoJson(x, y);
    }

    function setStateFromUrlParams(viewPropertyObject){
        mapImplementation.ChangeView(viewPropertyObject);

        if(viewPropertyObject.layers){
            var layerGuids = viewPropertyObject.layers;
            var guids = layerGuids.split(",");
            guids.forEach(function (guid){
                var layer = getLayerById(guid);
                if (layer) {
                    if(layer.isBaseLayer === true){
                        setBaseLayer(layer);
                    }
                    else{
                        showLayer(layer);
                    }
                }
            });
        }
    }

    function setLegendGraphics(isyLayer){
        isyLayer.legendGraphicUrls = [];
        for(var i = 0; i < isyLayer.subLayers.length; i++){
            var subLayer = isyLayer.subLayers[i];
            if(isyLayer.isVisible && _shouldBeVisible(subLayer)){
                isyLayer.legendGraphicUrls.push(subLayer.legendGraphicUrl);
            }
        }
    }

    function addZoom() {
        mapImplementation.AddZoom();
    }

    function addZoomSlider() {
        mapImplementation.AddZoomSlider();
    }

    function addZoomToExtent(extent) {
        mapImplementation.AddZoomToExtent(extent);
    }

    /*function addVectorTestData(){
        var callback = function(data){
            showHighlightedFeatures(featureParser.Parse(data));
        };
        var url = 'assets/mapConfig/testdata.json';
        httpHelper.get(url).success(callback);
    }*/

    function zoomToLayer(isySubLayer){
        mapImplementation.ZoomToLayer(isySubLayer);
    }

    function zoomToLayers(isySubLayers){
        mapImplementation.ZoomToLayers(isySubLayers);
    }

    function fitExtent(extent){
        mapImplementation.FitExtent(extent);
    }

    function getCenter() {
        return mapImplementation.GetCenter();
    }

    function setCenter(center) {
        return mapImplementation.SetCenter(center);
    }

    function getZoom(){
        return mapImplementation.GetZoom();
    }

    function setZoom(zoom){
        mapImplementation.SetZoom(zoom);
    }

    function getRotation(){
        return mapImplementation.GetRotation();
    }

    function setRotation(angle, anchor){
        mapImplementation.SetRotation(angle, anchor);
    }

    function getEpsgCode() {
        return mapImplementation.GetEpsgCode();
    }

    function getVectorLayers(isySubLayer, source){
        return mapImplementation.GetVectorLayers(isySubLayer, source);
    }

    function getConfigLayerCount(){
        if (mapConfiguration){
            var totalCount = 0;
            mapConfiguration.layers.forEach(function (layer){
                if (layer.isVisible) {
                    layer.subLayers.forEach(function () {
                        totalCount++;
                    });
                }
            });
            return totalCount;
        }
    }

    function getLayerCount(){
        return mapImplementation.GetLayerCount();
    }

    function getCenterFromExtent(extent){
        return mapImplementation.GetCenterFromExtent(extent);
    }

    function getScale(){
        return mapImplementation.GetScale();
    }

    function getFeatureCollection(isySubLayer){
        return mapImplementation.GetFeatureCollection(isySubLayer);
    }

    function getFeaturesInMap(isySubLayer){
        return mapImplementation.GetFeaturesInMap(isySubLayer);
    }

    function getFeatureExtent(feature){
        return mapImplementation.GetFeatureExtent(feature);
    }

    function getLegendStyles(isySubLayer){
        return mapImplementation.GetLegendStyles(isySubLayer);
    }

    function getExtent(){
        return mapImplementation.GetExtent();
    }

    function getUrlObject(){
        return mapImplementation.GetUrlObject();
    }

    function getGeolocation(){
        return mapImplementation.GetGeolocation();
    }

    function removeGeolocation(){
        return mapImplementation.RemoveGeolocation();
    }

    function infoClickSimulation(coordinate){
       _handlePointSelect(coordinate);
    }

    function setTranslateOptions(translate){
        mapImplementation.SetTranslateOptions(translate);
    }

    function transformCoordinates(fromEpsg, toEpsg, coordinates){
        return mapImplementation.TransformCoordinates(fromEpsg, toEpsg, coordinates);
    }

    function transformFromGeographic(coordinates){
        return mapImplementation.TransformFromGeographic(coordinates);
    }

    function transformToGeographic(coordinates){
        return mapImplementation.TransformToGeographic(coordinates);
    }

    function removeIsyToken(){
        mapImplementation.RemoveIsyToken();
    }

    function setIsyToken(token){
        mapImplementation.SetIsyToken(token);
    }

    function showCustomMessage(message){
        mapImplementation.ShowCustomMessage(message);
    }

    /*
        Utility functions End
     */

    return {
        // Start up start
        Init: init,
        // Start up end

        /***********************************/

        // Layer start
        AddLayer: addLayer,
        AddDataToLayer: addDataToLayer,
        RemoveDataFromLayer: removeDataFromLayer,
        ClearLayer: clearLayer,
        ShowLayer: showLayer,
        HideLayer: hideLayer,
        GetOverlayLayers: getOverlayLayers,
        GetBaseLayers: getBaseLayers,
        GetLayerById: getLayerById,
        GetFirstVisibleBaseLayer: getFirstVisibleBaseLayer,
        SetBaseLayer: setBaseLayer,
        SetStateFromUrlParams: setStateFromUrlParams,
        SetLayerOpacity: setLayerOpacity,
        MoveLayerToIndex: moveLayerToIndex,
        MoveLayerAbove: moveLayerAbove,
        MoveLayerToIndexInGroup: moveLayerToIndexInGroup,
        // Layer end

        /***********************************/

        // Category start
        GetCategoryById: getCategoryById,
        GetCategories: getCategories,
        // Category end

        /***********************************/

        // Groups start
        GetGroupById: getGroupById,
        GetGroups: getGroups,
        // Category end

        /***********************************/

        // Export start
        RenderSync: renderSync,
        ExportMap: exportMap,
        ActivateExport: activateExport,
        DeactivateExport: deactivateExport,
        // Export end

        /***********************************/

        // Feature Info start
        ActivateInfoClick: activateInfoClick,
        DeactivateInfoClick: deactivateInfoClick,
        ShowHighlightedFeatures: showHighlightedFeatures,
        ClearHighlightedFeatures: clearHighlightedFeatures,
        SetHighlightStyle: setHighlightStyle,
        SetInfoMarker: setInfoMarker,
        SetImageInfoMarker: setImageInfoMarker,
        GetSupportedGetFeatureInfoFormats: getSupportedGetFeatureInfoFormats,
        GetSupportedGetFeatureFormats: getSupportedGetFeatureFormats,
        RemoveInfoMarker: removeInfoMarker,
        RemoveInfoMarkers: removeInfoMarkers,
        ActivateBoxSelect: activateBoxSelect,
        DeactivateBoxSelect: deactivateBoxSelect,
        GetFeatureCollection: getFeatureCollection,
        GetFeaturesInMap: getFeaturesInMap,
        GetFeatureExtent: getFeatureExtent,
        // Feature Info end

        /***********************************/

        // Feature edit start
        InitEdit: initEdit,
        ActivateEditClick: activateEditClick,
        DeactivateEditClick: deactivateEditClick,
        UpdateFeature: updateFeature,
        InsertFeature: insertFeature,
        DeleteFeature: deleteFeature,
        // Feature edit end

        /***********************************/

        // Hover Info start
        ActivateHoverInfo: activateHoverInfo,
        DeactivateHoverInfo: deactivateHoverInfo,
        // Hover Info end

        /***********************************/

        // Measure start
        ActivateMeasure: activateMeasure,
        DeactivateMeasure: deactivateMeasure,
        // Measure end

        /***********************************/

        // Offline start
        InitOffline: initOffline,
        ActivateOffline: activateOffline,
        StartCaching: startCaching,
        StopCaching: stopCaching,
        DeleteDatabase: deleteDatabase,
        CacheDatabaseExist: cacheDatabaseExist,
        CalculateTileCount: calculateTileCount,
        GetResource: getResource,
        GetConfigResource: getConfigResource,
        GetLayerResource: getLayerResource,
        DeactivateOffline: deactivateOffline,
        GetResourceFromJson: getResourceFromJson,
        // Offline end

        /***********************************/

        // MeasureLine start
        ActivateMeasureLine: activateMeasureLine,
        DeactivateMeasureLine: deactivateMeasureLine,
        // MeasureLine end

        /***********************************/

        // AddLayerFeature start
        ActivateAddLayerFeature: activateAddLayerFeature,
        DeactivateAddLayerFeature: deactivateAddLayerFeature,
        // AddLayerFeature end

        /***********************************/

        // AddFeatureGps start
        ActivateAddFeatureGps: activateAddFeatureGps,
        AddCoordinatesGps: addCoordinatesGps,
        DeactivateAddFeatureGps: deactivateAddFeatureGps,
        // AddFeatureGps end

        /***********************************/

        // ModifyFeature start
        ActivateModifyFeature: activateModifyFeature,
        DeactivateModifyFeature: deactivateModifyFeature,
        // ModifyFeature end

        /***********************************/

        // DrawFeature start
        ActivateDrawFeature: activateDrawFeature,
        DeactivateDrawFeature: deactivateDrawFeature,
        // DrawFeature end

        /***********************************/

        // PrintBoxSelect Start
        ActivatePrintBoxSelect: activatePrintBoxSelect,
        DeactivatePrintBoxSelect: deactivatePrintBoxSelect,
        // PrintBoxSelect End

        /***********************************/

        // Utility start
        ArrangeLayers: arrangeLayers,
        ConvertGmlToGeoJson: convertGmlToGeoJson,
        SetLegendGraphics: setLegendGraphics,
        ExtentToGeoJson: extentToGeoJson,
        AddZoom: addZoom,
        AddZoomSlider: addZoomSlider,
        AddZoomToExtent: addZoomToExtent,
        ZoomToLayer: zoomToLayer,
        ZoomToLayers: zoomToLayers,
        FitExtent: fitExtent,
        GetCenter: getCenter,
        SetCenter: setCenter,
        GetZoom: getZoom,
        SetZoom: setZoom,
        GetRotation: getRotation,
        SetRotation: setRotation,
        GetEpsgCode: getEpsgCode,
        GetVectorLayers: getVectorLayers,
        GetCenterFromExtent: getCenterFromExtent,
        GetScale: getScale,
        ChangeView: changeView,
        GetLegendStyles: getLegendStyles,
        RedrawMap: redrawMap,
        RefreshMap: refreshMap,
        RefreshLayerByGuid: refreshLayerByGuid,
        ShowInfoMarker: showInfoMarker,
        ShowInfoMarkers: showInfoMarkers,
        GetExtent: getExtent,
        GetVisibleSubLayers: getVisibleSubLayers,
        GetUrlObject: getUrlObject,
        GetGeolocation: getGeolocation,
        RemoveGeolocation: removeGeolocation,
        InfoClickSimulation: infoClickSimulation,
        SetTranslateOptions: setTranslateOptions,
        TransformCoordinates: transformCoordinates,
        TransformFromGeographic: transformFromGeographic,
        TransformToGeographic: transformToGeographic,
        DescribeFeature: describeFeature,
        RemoveIsyToken: removeIsyToken,
        SetIsyToken: setIsyToken,
        ShowCustomMessage: showCustomMessage
        //AddVectorTestData: addVectorTestData
        // Utility end
    };
};
var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};
ISY.MapAPI.Parsers = ISY.MapAPI.Parsers || {};

ISY.MapAPI.Parsers.Base = function(factory) {
    function parse(result){
        var exception = "exception";
        var xml = "<?xml";
        var html = "<html";
        var msGMLOutput = "msgmloutput";

        var parserName;

        if (result === undefined) {
            return null;
        } else if(result.type){
            if(result.type == "FeatureCollection"){
                parserName = 'geoJson';
            }
        }else if(result.length !== undefined){
            if (result.length >= 1){
                parserName = 'geoJson';
            }
        }
        else if(result.toLowerCase().indexOf(exception) > -1){
            return parseAsException(result);
        }
        else if(result.toLowerCase().indexOf(xml) > -1){
            parserName = 'kartKlifNo';
        }
        else if(result.toLowerCase().indexOf(html) > -1){
            return parseAsHtml(result);
        }
        else if(result.toLowerCase().indexOf(msGMLOutput) > -1){
            parserName = 'fisheryDirectory';
        }
        else{
            return null; // Should be empty collection
        }

        var parser = factory.CreateParser(parserName);
        return parser.Parse(result);
    }

    function parseAsException(exception){
        var exceptionParser = new ISY.MapAPI.Parsers.Exception();
        exceptionParser.Parse(exception);
    }

    function parseAsHtml(result){
        var indexOfTableStart = result.indexOf("<table");
        if(indexOfTableStart > -1){
            var tableResult = result.substring(indexOfTableStart, result.length);
            var indexOfTableEnd = tableResult.indexOf("</body>");
            tableResult = tableResult.substring(0, indexOfTableEnd);
            console.log(tableResult);
            var jsonObject = xml2json.parser(tableResult);
            console.log(jsonObject);
        }
        return [];
    }

    return {
        Parse: parse
    };
};
var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};
ISY.MapAPI.Parsers = ISY.MapAPI.Parsers || {};

ISY.MapAPI.Parsers.Exception = function() {
    function parse(exception){
        var message = exception.replace(/(<([^>]+)>)/ig, '');
        throw message;
    }

    return {
        Parse: parse
    };
};
var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};
ISY.MapAPI.Parsers = ISY.MapAPI.Parsers || {};

ISY.MapAPI.Parsers.Factory = function(geoJson, gml, kartKlifNo, fiskeriDir){
    function createParser(parserName){
        var parser;
        switch (parserName){
            case 'geoJson':
                parser = geoJson;
                break;
            case 'gml':
                parser = gml;
                break;
            case 'kartKlifNo':
                parser = kartKlifNo;
                break;
            case 'fisheryDirectory':
                parser = fiskeriDir;
                break;
        }
        return parser;
    }

    return {
        CreateParser: createParser
    };
};
var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};
ISY.MapAPI.Parsers = ISY.MapAPI.Parsers || {};

ISY.MapAPI.Parsers.FiskeriDir = function(mapApi){
    var insteadOfGml = 'insteadofgml';
    var x, y;
    var gmlObject;

    function parse (result){
        var responseFeatureCollection = [];

        result = result.replace(/:gml/g, '');
        result = result.replace(/gml:/g, insteadOfGml);
        result = result.replace(/s:x/g, 'sx');
        var jsonFeatures = xml2json.parser(result);

        var rootObject = jsonFeatures[Object.keys(jsonFeatures)[0]];
        for(var i in rootObject){
            var testObject = rootObject[i];
            if(testObject instanceof Object){
                for(var j in testObject){
                    var testArray = testObject[j];
                    if(testArray instanceof Array){
                        responseFeatureCollection = _arrayToResponseFeatureCollection(testArray);
                    }
                }
            }
        }
        return responseFeatureCollection;
    }

    function _arrayToResponseFeatureCollection(resultArray){
        var result = [];
        for(var i = 0; i < resultArray.length; i++){
            var feature = resultArray[i];

            var responseFeature = new ISY.Domain.FeatureResponse();
            responseFeature.attributes = _getAttributesArray(feature);
            var crs = gmlObject[Object.keys(gmlObject)[0]]["srsname"];
            var extent = gmlObject[Object.keys(gmlObject)[0]][insteadOfGml + "coordinates"];
            extent = extent.replace(/ /g, ',');

            responseFeature.crs = crs;
            responseFeature.geometryObject = mapApi.ExtentToGeoJson(x, y);

            result.push(responseFeature);
        }
        return result;
    }

    function _getAttributesArray(properties){
        var attributes = [];
        for(var i in properties){
            if(i.toLocaleLowerCase().indexOf(insteadOfGml) === -1){
                attributes.push([i, properties[i]]);
                if(i == 'x') { x = properties[i]; }
                if(i == 'y') { y = properties[i]; }
            }
            else {
                gmlObject = properties[i];
            }
        }
        return attributes;
    }

    return {
        Parse: parse
    };
};
var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};
ISY.MapAPI.Parsers = ISY.MapAPI.Parsers || {};

ISY.MapAPI.Parsers.GML = function() {
    function parse(result) {
        console.log(result);
    }

    return {
        Parse: parse
    };
};
var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};
ISY.MapAPI.Parsers = ISY.MapAPI.Parsers || {};

ISY.MapAPI.Parsers.GeoJSON = function() {
    function parse(result) {
        var responseFeatureCollection = [];

        var crs;
        if(result.crs){
            var crsObject = result.crs;
            if(crsObject.properties.code){
                crs = crsObject.type + ':' + crsObject.properties.code;
            }
            else if(crsObject.properties.name){
                // pattern name=urn:ogc:def:crs:EPSG::32633
                crs = crsObject.properties.name.substring(crsObject.properties.name.indexOf('EPSG'), crsObject.properties.name.length);
            }
        }
        if (result.features !== undefined){
            var features = result.features;
            for(var i = 0; i < features.length; i++){
                var feature = features[i];

                var responseFeature = new ISY.Domain.FeatureResponse();
                responseFeature.crs = crs;
                responseFeature.geometryObject = feature;
                responseFeature.attributes = _getAttributesArray(feature.properties);
                responseFeature.olFeature = feature.olFeature;
                responseFeatureCollection.push(responseFeature);
            }
        }
        else if (result.length !== undefined ){
            for(var ii=0; ii<result.length; ii++){
                if (result[ii].rows.length !== undefined){
                    var responseFeatureWms = new ISY.Domain.FeatureResponse();
                    responseFeatureWms.crs = "";
                    responseFeatureWms.geometryObject = "";
                    responseFeatureWms.attributes = _getAttributesArray(result[ii].rows[0]);
                    responseFeatureCollection.push(responseFeatureWms);
                }
            }
        }


        return responseFeatureCollection;
    }

    function _getAttributesArray(properties){
        var attributes = [];
        for(var i in properties){
            attributes.push([i, properties[i]]);
        }
        return attributes;
    }

    return {
        Parse: parse
    };
};

// This part covers the ArcGIS Server at http://kart.klif.no/
var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};
ISY.MapAPI.Parsers = ISY.MapAPI.Parsers || {};

ISY.MapAPI.Parsers.KartKlifNo = function() {
    function parse(result) {
        var jsonResult = [];
        result = result.replace(/:/g, ''); // Remove colon to prevent xml errors
        var jsonFeatures = xml2json.parser(result);

        if(jsonFeatures.featureinforesponse){
            var response = jsonFeatures.featureinforesponse;
            if(response.fields){
                var fields = response.fields;
                if(fields instanceof Array){
                    for(var i = 0; i < fields.length; i++){
                        jsonResult.push(fields[i]);
                    }
                }
                else{
                    jsonResult.push(fields);
                }
            }
        }
        return _convertToFeatureResponse(jsonResult);
    }

    function _convertToFeatureResponse(jsonFeatures){
        var responseFeatureCollection = [];
        for(var i = 0; i < jsonFeatures.length; i++){
            var responseFeature = new ISY.Domain.FeatureResponse();
            responseFeature.attributes = _getAttributesArray(jsonFeatures[i]);
            responseFeatureCollection.push(responseFeature);
        }
        return responseFeatureCollection;
    }

    function _getAttributesArray(properties){
        var attributes = [];
        for(var i in properties){
            attributes.push([i, properties[i]]);
        }
        return attributes;
    }

    return {
      Parse: parse
    };
};
var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};
ISY.MapAPI.Tools = ISY.MapAPI.Tools || {};

ISY.MapAPI.Tools.Tool = function(config){
    var defaults = {
        id: '',
        activate: function(){ console.log('Not implemented');},
        deactivate: function(){ console.log('Not implemented');},
        messageObject: [],
        description : '',
        isCommand: false
    };

    var instance =  $.extend({}, defaults, config);

    instance.Extend = function(properties){
        instance =$.extend(instance, properties);
        return instance;
    };

    return instance;
};
var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};
ISY.MapAPI.Tools = ISY.MapAPI.Tools || {};

ISY.MapAPI.Tools.ToolFactory = function(map, tools){
    var internalTools = [];
    var externalTools = [];
    var mapImplementation = map;
    var toolOptions = {};

    internalTools = tools.GetTools();

    function addTool(tool){
        externalTools.push(tool);
    }

    function getAvailableTools(){
        var toolsId = [];
        for(var i = 0; i < externalTools.length; i++){
            toolsId.push(externalTools[i].id);
        }
        return toolsId;
    }

    function activateTool(toolId){
        var activeToolIsCommand = false;
        for(var i = 0; i < externalTools.length; i++){
            var tool = externalTools[i];
            tool.deactivate();

            if(tool.id == toolId){
                if (!$.isEmptyObject(toolOptions)){
                    tool.activate(toolOptions);
                }else{
                    tool.activate();
                }
                activeToolIsCommand = tool.isCommand;
            }
        }
        return activeToolIsCommand;
    }

    function setupTools(toolsConfig){
        for(var i = 0; i < toolsConfig.length; i++){
            var configTool = toolsConfig[i];
            var correspondingInternalTool = _getInternalTool(configTool.id);
            if(correspondingInternalTool){
                externalTools.push(correspondingInternalTool);
            }
        }
    }

    function _getInternalTool(toolId){
        for(var i = 0; i < internalTools.length; i++){
            var internalTool = internalTools[i];
            if(internalTool.id === toolId){
                return internalTool;
            }
        }
        return false;
    }

    function deactivateTool(toolId) {
        var tool = _getInternalTool(toolId);
        if (tool){
            toolOptions = {};
            tool.deactivate(mapImplementation);
        }
    }

    function additionalToolOptions(options){
        toolOptions = options;
    }

    return {
        AddTool: addTool,
        GetAvailableTools: getAvailableTools,
        ActivateTool: activateTool,
        SetupTools: setupTools,
        DeactivateTool: deactivateTool,
        AdditionalToolOptions: additionalToolOptions
    };
};
var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};
ISY.MapAPI.Tools = ISY.MapAPI.Tools || {};

ISY.MapAPI.Tools.Tools = function(mapApi){
    var tools = [];

    var getFeatureInfoConfig = {
        id: 'PointSelect',
        description: 'This tool activates a get feature info click on the map',
        activate: function (){
            mapApi.ActivateInfoClick();
        },
        deactivate: function (){
            mapApi.DeactivateInfoClick();
            //mapApi.RemoveInfoMarker();
        },
        messageObject: []
    };
    var getFeatureInfo = new ISY.MapAPI.Tools.Tool(getFeatureInfoConfig);
    tools.push(getFeatureInfo);

    var zoomAndPanConfig = {
        id: 'DefaultZoom',
        description: 'This is the default tool',
        activate: function(){

        },
        deactivate: function(){

        },
        messageObject: []
    };
    var zoomAndPan = new ISY.MapAPI.Tools.Tool(zoomAndPanConfig);
    tools.push(zoomAndPan);

    var boxSelectConfig = {
        id: 'BoxSelect',
        description: 'This tool activates box select functionality to the map',
        activate: function (){
         mapApi.ActivateBoxSelect();
         },
         deactivate: function (){
         mapApi.DeactivateBoxSelect();
         },
        messageObject: []
    };
    var boxSelect = new ISY.MapAPI.Tools.Tool(boxSelectConfig);
    tools.push(boxSelect);

    /*var exportCommandConfig = {
        id: 'MapExport',
        description: 'This command shows the export panel',
        activate: function (){
            eventHandler.TriggerEvent(ISY.Events.EventTypes.ShowExportPanel);
        },
        isCommand: true
    };
    var exportCommand = new ISY.Tools.Tool(exportCommandConfig);
    tools.push(exportCommand);*/

    var drawFeatureConfig = {
        id: 'DrawFeature',
        description: 'This tool lets the user draw a feature in the map',
        activate: function (options){
            mapApi.ActivateDrawFeature(options);
        },
        deactivate: function (){
            mapApi.DeactivateDrawFeature();
        },
        messageObject: []
    };

    var drawFeature = new ISY.MapAPI.Tools.Tool(drawFeatureConfig);
    tools.push(drawFeature);

    var modifyFeatureConfig = {
        id: 'ModifyFeature',
        description: 'This tool lets the user modify feature in the map.',
        activate: function (options){
            mapApi.ActivateModifyFeature(options);
        },
        deactivate: function (){
            mapApi.DeactivateModifyFeature();
        },
        messageObject: []
    };

    var modifyFeature = new ISY.MapAPI.Tools.Tool(modifyFeatureConfig);
    tools.push(modifyFeature);

    var addLayerFeatureConfig = {
        id: 'AddLayerFeature',
        description: 'This tool lets the user add feature to the map',
        activate: function (options){
            mapApi.ActivateAddLayerFeature(options);
        },
        deactivate: function (){
            mapApi.DeactivateAddLayerFeature();
        },
        messageObject: []
    };

    var addLayerFeature = new ISY.MapAPI.Tools.Tool(addLayerFeatureConfig);
    tools.push(addLayerFeature);

    var addFeatureGpsConfig = {
        id: 'AddFeatureGps',
        description: 'This tool lets the user add feature to the map with geolocation',
        activate: function (options){
            mapApi.ActivateAddFeatureGps(options);
        },
        deactivate: function (){
            mapApi.DeactivateAddFeatureGps();
        },
        messageObject: []
    };

    var addFeatureGps = new ISY.MapAPI.Tools.Tool(addFeatureGpsConfig);
    tools.push(addFeatureGps);


    var measureConfig = {
        id: 'Measure',
        description: 'This tool lets the user measure in the map',
        activate: function (options){
            mapApi.ActivateMeasure(options);
        },
        deactivate: function (){
            mapApi.DeactivateMeasure();
        },
        messageObject: []
    };

    var measure = new ISY.MapAPI.Tools.Tool(measureConfig);
    tools.push(measure);

    var measureLine = {
        id: 'MeasureLine',
        description: 'This tool lets the user measure line in the map',
        activate: function (options){
            mapApi.ActivateMeasureLine(options);
        },
        deactivate: function (){
            mapApi.DeactivateMeasureLine();
        },
        messageObject: []
    };

    var measureLineObject = new ISY.MapAPI.Tools.Tool(measureLine);
    tools.push(measureLineObject);

    var hoverInfoConfig = {
        id: "FeatureHoverInfo",
        description: 'This tool allow user get info via mouse hover',
        activate: function(){
            mapApi.ActivateHoverInfo();
        },
        deactivate: function (){
            mapApi.DeactivateHoverInfo();
        },
        messageObject: []
    };

    var hoverInfo = new ISY.MapAPI.Tools.Tool(hoverInfoConfig);
    tools.push(hoverInfo);

    var featureEditorConfig = {
        id: "FeatureEditor",
        description: 'This tool allow user to edit features',
        activate: function(){
            mapApi.ActivateEditClick();
        },
        deactivate: function (){
            mapApi.DeactivateEditClick();
        },
        messageObject: []
    };

    var featureEditor = new ISY.MapAPI.Tools.Tool(featureEditorConfig);
    tools.push(featureEditor);

    var printBoxSelectConfig = {
        id: 'PrintBoxSelect',
        description: 'This tool activates box select functionality for printing',
        activate: function (options){
            mapApi.ActivatePrintBoxSelect(options);
        },
        deactivate: function (){
            mapApi.DeactivatePrintBoxSelect();
        },
        messageObject: []
    };
    var printBoxSelect = new ISY.MapAPI.Tools.Tool(printBoxSelectConfig);
    tools.push(printBoxSelect);

    function getTools(){
        return tools;
    }

    return {
        GetTools: getTools
    };
};
/**
 * Created by to on 2015-01-29.
 */
var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.Leaflet = ISY.MapImplementation.Leaflet || {};

ISY.MapImplementation.Leaflet.Map = function(repository, eventHandler, httpHelper, measure, featureInfo, mapExport){
    var map;
    var layerPool = [];

    var proxyHost = "";

    /*
     Start up functions Start
     */

    function initMap(targetId, mapConfig){
        proxyHost = mapConfig.proxyHost;
        var newMapRes = [];
        newMapRes[0]= mapConfig.newMaxRes;
        for (var t = 1; t < mapConfig.numZoomLevels; t++) {
            newMapRes[t] = newMapRes[t - 1] / 2;
        }
        /*
        var sm = new ol.proj.Projection({
            code: mapConfig.coordinate_system,
            extent: mapConfig.extent,
            units: mapConfig.extentUnits
        });
        */

        /*var marker = new L.Marker(new L.LatLng(44.1373, -13.16813), {
            title: 'Lerkendal'
        });*/

        var baselayerconfig = mapConfig.layers[0].subLayers[0];

        /*var crs = new L.Proj.CRS(
            'EPSG:32633',
            '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
            {
                //origin: [572944, 7029918],
                origin: [7039762, 270661],
                //transformation: ??,
                //scales: function(zoom) {return 1 / (234.375 / Math.pow(2, zoom));},
                // use scales OR resolutions, not both
                //bounds: baselayerconfig.extent,
                resolutions: newMapRes
            });*/

        //var customcrs = L.CRS.proj4js('EPSG:25832', '+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs', new L.Transformation(0.5 / (Math.PI * L.Projection.Mercator.R_MAJOR), 0.5, -0.5 / (Math.PI * L.Projection.Mercator.R_MINOR), 0.5));
        /*var trans = new L.Transformation(0.5 / (Math.PI * L.Projection.Mercator.R_MAJOR), 0.5, -0.5 / (Math.PI * L.Projection.Mercator.R_MINOR), 0.5);
        trans = new L.Transformation(0.5 / Math.PI, 0.5, -0.5 / Math.PI, 0.5);
        L.CRS.EPSG32633 = L.extend({}, L.CRS, {
            code: 'EPSG:32633',
            //projection: customcrs.projection,//L.Projection.SphericalMercator,
            projection: L.Projection.SphericalMercator,
            transformation: trans,

            project: function (latlng) { // (LatLng) -> Point
                var projectedPoint = this.projection.project(latlng),
                    earthRadius = 6378137;
                return projectedPoint.multiplyBy(earthRadius);
            }
        });*/

        var crs = L.CRS.EPSG900913;

        //var map = new L.Map('Krak-Map', { center: new L.LatLng(7039762, 270661), zoom: 17, crs: crs });
        //crs.options.resolutions = newMapRes;

        var baselayer = null;
        switch (baselayerconfig.source){
            case "TMS":
                baselayer = new ISY.MapImplementation.Leaflet.Sources.Tms(baselayerconfig);
                break;
            case "WMS":
                baselayer = new ISY.MapImplementation.Leaflet.Sources.Wms(baselayerconfig);
                break;
        }

        map = new L.Map(targetId, {
            //crs: crs,
            //layers: [baselayer, marker],
            layers: [baselayer],
            //layers: [],
            //center: new L.LatLng(44, -12.1),
            //center: new L.LatLng(7039762, 270661),
            center: new L.LatLng(63.4, 255250),
            //center: new L.LatLng(mapConfig.center[1], mapConfig.center[0]),
            crs: crs,
            zoom: 3,
            //zoomControl: false,
            reuseTiles: true,
            continuousWorld: true,
            worldCopyJump: false,
            //scale: function(zoom) {return 1 / (234.375 / Math.pow(2, zoom));},
            scale: function(zoom) {return 1 / (mapConfig.newMaxRes / Math.pow(2, zoom));},
            resolutions: newMapRes
        });

        /*var options = {
            attributionControl: true,
            bounceAtZoomLimits: true,
            boxZoom: true,
            //center: o.LatLng,
            closePopupOnClick: true,
            continuousWorld: true,
            //crs: Object,
            doubleClickZoom: true,
            dragging: true,
            easeLinearity: 0.25,
            fadeAnimation: true,
            inertia: true,
            inertiaDeceleration: 3400,
            inertiaMaxSpeed: Infinity,
            inertiaThreshold: 18,
            keyboard: true,
            keyboardPanOffset: 80,
            keyboardZoomOffset: 1,
            //layers: Array[1],
            markerZoomAnimation: true,
            reuseTiles: true,
            scrollWheelZoom: true,
            tap: true,
            tapTolerance: 15,
            touchZoom: false,
            trackResize: true,
            worldCopyJump: false,
            zoom: 3,
            zoomAnimation: true,
            zoomAnimationThreshold: 4,
            zoomControl: false
    };*/

        L.control.scale({ imperial: false }).addTo(map);
        L.control.mousePosition().addTo(map);
        //map.addControl(L.Control.loading({ spinjs: true }));

        /*
        map = new ol.Map({
            target: targetId,
            renderer: mapConfig.renderer,
            layers: [],
            view: new ol.View({
                projection: sm,
                center: mapConfig.center,
                zoom: mapConfig.zoom,
                resolutions: newMapRes,
                maxResolution: mapConfig.newMaxRes,
                numZoomLevels: numZoomLevels
            }),
            controls: [],
            overlays: []
        });
        */

        _registerMapCallbacks();
    }

    function _registerMapCallbacks(){
        //var view = map.getView();

        /*var changeCenter = function(){
            var mapViewChangedObj = _getUrlObject();
            eventHandler.TriggerEvent(ISY.Events.EventTypes.ChangeCenter, mapViewChangedObj);
        };*/

        /*var changeResolution = function(){
            var mapViewChangedObj = _getUrlObject();
            eventHandler.TriggerEvent(ISY.Events.EventTypes.ChangeResolution, mapViewChangedObj);
        };*/

        var mapMoveend = function(){
            var mapViewChangedObj = _getUrlObject();
            eventHandler.TriggerEvent(ISY.Events.EventTypes.MapMoveend, mapViewChangedObj);
        };

        //view.on('change:center', changeCenter);
        //view.on('change:resolution', changeResolution);
        map.on('moveend', mapMoveend);
    }

    function changeView(viewPropertyObject){
        var view = map.getView();
        var lon, lat, zoom;
        if(viewPropertyObject.lon){
            lon = viewPropertyObject.lon;
        }
        if(viewPropertyObject.lat){
            lat = viewPropertyObject.lat;
        }
        if(viewPropertyObject.zoom){
            zoom = viewPropertyObject.zoom;
        }

        if(lon !== undefined && lat !== undefined){
            var latitude = parseFloat(lat.replace(/,/g, '.'));
            var longitude = parseFloat(lon.replace(/,/g, '.'));
            if (isFinite(latitude) && isFinite(longitude)) {
                view.setCenter([longitude, latitude]);
            }
        }

        if(zoom !== undefined){
            view.setZoom(zoom);
        }
    }

    /*
     Start up functions End
     */

    /*
     Layer functions Start
     Functionality to be moved to ISY.MapImplementation.Leaflet.Layers
     */

    function showLayer(isySubLayer){
        var layer = _createLayer(isySubLayer);
        map.addLayer(layer);

        _trigLayersChanged();
    }

    function showBaseLayer(isySubLayer){
        if (console){
            console.log(isySubLayer.name);
        }
        //var layer = _createLayer(isySubLayer);
        //map.getLayers().insertAt(0, layer);

        _trigLayersChanged();
    }

    function hideLayer(isySubLayer){
        if (console){
            console.log(isySubLayer.name);
        }
        return null;
        /*var layer = _getLayerByGuid(isySubLayer.id);
        if(layer){
            map.removeLayer(layer);
            _trigLayersChanged();
        }*/
    }

    function _createLayer(isySubLayer){
        var layer;
        var source;
        var layerFromPool = _getLayerFromPool(isySubLayer);

        if(layerFromPool != null){
            layer = layerFromPool;
        }
        else{
            switch(isySubLayer.source){
                case ISY.Domain.SubLayer.SOURCES.wmts:
                    source = new ISY.MapImplementation.Leaflet.Sources.Wmts(isySubLayer);
                    break;

                case ISY.Domain.SubLayer.SOURCES.proxyWmts:
                    isySubLayer.url = proxyHost + isySubLayer.url;
                    source = new ISY.MapImplementation.Leaflet.Sources.Wmts(isySubLayer);
                    break;

                case ISY.Domain.SubLayer.SOURCES.wms:
                    source = new ISY.MapImplementation.Leaflet.Sources.Wms(isySubLayer);
                    break;
                case ISY.Domain.SubLayer.SOURCES.tms:
                    source = new ISY.MapImplementation.Leaflet.Sources.Tms(isySubLayer);
                    break;
                case ISY.Domain.SubLayer.SOURCES.proxyWms:
                    isySubLayer.url = proxyHost + isySubLayer.url;
                    source = new ISY.MapImplementation.Leaflet.Sources.Wms(isySubLayer);
                    break;
                case ISY.Domain.SubLayer.SOURCES.vector:
                    source = new ISY.MapImplementation.Leaflet.Sources.Vector(isySubLayer, map.getView().getProjection());
                    _loadVectorLayer(isySubLayer, source);
                    break;
                default:
                    throw "Unsupported source: ISY.Domain.SubLayer.SOURCES.'" +
                    isySubLayer.source +
                    "'. For SubLayer with url " + isySubLayer.url +
                    " and name " + isySubLayer.name + ".";
            }

            if(isySubLayer.source === ISY.Domain.SubLayer.SOURCES.vector){
                layer = new ol.layer.Vector({
                    source: source
                });
            }
            else if (isySubLayer.tiled) {
                layer = source;
            } else {
                layer = source;
            }

            layer.layerIndex = isySubLayer.layerIndex;
            layer.guid = isySubLayer.id;

            layerPool.push(layer);
        }

        return layer;
    }

    function _loadVectorLayer(isySubLayer, source){
        var callback = function(data){
            var fromProj = ol.proj.get(isySubLayer.coordinate_system);
            var toProj = ol.proj.get(source.getProjection().getCode());
            var features = source.parser.readFeatures(data);
            for(var i = 0; i < features.length; i++) {
                var feature = features[i];
                feature.getGeometry().transform(fromProj, toProj);
            }
            source.addFeatures(features);
        };
        httpHelper.get(isySubLayer.url).success(callback);
    }

    function _getLayerFromPool(isySubLayer){
        for(var i = 0; i < layerPool.length; i++){
            var layerInPool = layerPool[i];
            if(layerInPool.guid == isySubLayer.id){
                return layerInPool;
            }
        }
        return null;
    }

    function setLayerBrightness(isySubLayer, value){
        // Require WebGL-rendering of map
        var layer = _getLayerByGuid(isySubLayer.id);
        if(layer && !isNaN(value)){
            layer.setBrightness(Math.min(value,1));
        }
    }
    function setLayerContrast(isySubLayer, value){
        // Require WebGL-rendering of map
        var layer = _getLayerByGuid(isySubLayer.id);
        if(layer && !isNaN(value)){
            layer.setContrast(Math.min(value,1));
        }
    }
    function setLayerOpacity(isySubLayer, value){
        var layer = _getLayerByGuid(isySubLayer.id);
        if(layer && !isNaN(value)){
            layer.setOpacity(Math.min(value,1));
        }
    }
    function setLayerSaturation(isySubLayer, value){
        // Require WebGL-rendering of map
        var layer = _getLayerByGuid(isySubLayer.id);
        if(layer && !isNaN(value)){
            layer.setSaturation(Math.min(value,1));
        }
    }
    function setLayerHue(isySubLayer, value){
        // Require WebGL-rendering of map
        var layer = _getLayerByGuid(isySubLayer.id);
        if(layer && !isNaN(value)){
            layer.setHue(Math.min(value,1));
        }
    }

    /*
    function _getLayersWithGuid(){
        return map.getLayers().getArray().filter(function(elem){
            return elem.guid !== undefined;
        });
    }

    function _getLayerByGuid(guid){
        var layers = _getLayersWithGuid();
        for(var i = 0; i < layers.length; i++){
            var layer = layers[i];
            if(layer.guid == guid){
                return layer;
            }
        }
        return null;
    }

    function getLayerIndex(isySubLayer){
        var layers = _getLayersWithGuid();
        for(var i = 0; i < layers.length; i++){
            var layer = layers[i];
            if(layer.guid == isySubLayer.id){
                return i;
            }
        }
        return null;
    }

    function getLayerByName(layerTitle) {
        var layers = _getLayersWithGuid();
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].get('title') == layerTitle) {
                return layers[i];
            }
        }
        return null;
    }

    function moveLayerToIndex(isySubLayer, index){
        var subLayerIndex = getLayerIndex(isySubLayer);
        var layersArray = map.getLayers().getArray();
        layersArray.splice(index, 0, layersArray.splice(subLayerIndex, 1)[0]);

        _trigLayersChanged();
    }

    */
    function _trigLayersChanged(){
        var eventObject = _getUrlObject();
        eventHandler.TriggerEvent(ISY.Events.EventTypes.ChangeLayers, eventObject);
    }
    /*

    function _getGuidsForVisibleLayers() {
        var visibleLayers = [];
        var layers = _getLayersWithGuid();
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (layer.getVisible() === true) {
                visibleLayers.push(layers[i]);
            }
        }

        visibleLayers.sort(_compareMapLayerIndex);
        var result = [];
        for(var j = 0; j < visibleLayers.length; j++){
            result.push(visibleLayers[j].guid);
        }
        return result.join(",");
    }

    function _compareMapLayerIndex(a, b) {
        if (a.mapLayerIndex < b.mapLayerIndex){
            return -1;
        }
        if (a.mapLayerIndex > b.mapLayerIndex){
            return 1;
        }
        return 0;
    }
    */

    /*
     Layer functions End
     */

    /*
     Map Export Start
     Functionality in ISY.;ap.Leaflet.Export
     */

    var _resizeEvent = function(){
        mapExport.WindowResized(map);
    };

    function activateExport(options) {
        mapExport.Activate(options, map, redrawMap);
        window.addEventListener('resize', _resizeEvent, false);
    }

    function deactivateExport() {
        window.removeEventListener('resize', _resizeEvent, false);
        mapExport.Deactivate(redrawMap);
    }

    function exportMap(callback){
        mapExport.ExportMap(callback, map);
    }

    function redrawMap(){
        map.updateSize();
    }

    function renderSync(){
        map.renderSync();
    }

    /*
     Map Export End
     */

    /*
     Feature Info Start
     Functionality in ISY.MapImplementation.Leaflet.FeatureInfo
     */

    function activateInfoClick(callback){
        featureInfo.ActivateInfoClick(callback, map);
    }

    function deactivateInfoClick(){
        featureInfo.DeactivateInfoClick(map);
    }

    function getFeatureInfoUrl(isySubLayer, coordinate){
        return featureInfo.GetFeatureInfoUrl(isySubLayer, _getLayerFromPool(isySubLayer), coordinate, map.getView());
    }

    function showHighlightedFeatures(layerguid, features){
        featureInfo.ShowHighlightedFeatures(layerguid, features, map);
    }

    function clearHighlightedFeatures(){
        featureInfo.ClearHighlightedFeatures();
    }

    function showInfoMarker(coordinate, element){
        featureInfo.ShowInfoMarker(coordinate, element, map);
    }

    function removeInfoMarker(element){
        featureInfo.RemoveInfoMarker(element, map);
    }

    function setHighlightStyle(style){
        featureInfo.SetHighlightStyle(style);
    }

    function activateBoxSelect(callback){
        featureInfo.ActivateBoxSelect(callback, map);
    }

    function deactivateBoxSelect(){
        featureInfo.DeactivateBoxSelect(map);
    }

    function getExtentForCoordinate(coordinate, pixelTolerance){
        return featureInfo.GetExtentForCoordinate(coordinate, pixelTolerance, map.getView().getResolution());
    }

    function getFeaturesInExtent(isySubLayer, extent){
        return featureInfo.GetFeaturesInExtent(extent, _getLayerFromPool(isySubLayer), map.getView().getResolution());
    }

    /*
     Feature Info End
     */

    /*
     Measure Start
     Functionality in ISY.MapImplementation.Leaflet.Measure
     */

    function activateMeasure(callback){
        measure.Activate(map, callback);
        //var vector = measure.Activate(map, callback);

    }

    function deactivateMeasure(){
        measure.Deactivate(map);
    }

    /*
     Measure End
     */

    /*
     Utility functions start
     */

    var _getUrlObject = function(){

        var center = map.getCenter();
        var retVal = {
            lon: center.lng,
            lat: center.lat,
            z: map.getZoom()
        };
        return retVal;
    };

    var getCenter = function(){
        var center = map.getCenter();
        var zoom = map.getZoom();
        var retVal = {
            lon: center.lng,
            lat: center.lat,
            zoom: zoom
        };
        return retVal;
    };

    function transformBox(fromCrs, toCrs, boxExtent){
        var returnExtent = boxExtent;

        if(fromCrs !== "" && toCrs !== ""){
            var fromProj = ol.proj.get(fromCrs);
            var toProj = ol.proj.get(toCrs);
            var transformedExtent = ol.proj.transformExtent(boxExtent, fromProj, toProj);

            returnExtent = transformedExtent;
            if(toCrs === "EPSG:4326"){
                returnExtent = transformedExtent[1] + "," + transformedExtent[0] + "," + transformedExtent[3] + "," + transformedExtent[2];
            }
        }

        return returnExtent;
    }

    function convertGmlToGeoJson(gml){
        var xmlParser = new ol.format.WMSCapabilities();
        var xmlFeatures = xmlParser.read(gml);
        var gmlParser = new ol.format.GML();
        var features = gmlParser.readFeatures(xmlFeatures);
        var jsonParser = new ol.format.GeoJSON();
        return jsonParser.writeFeatures(features);
    }

    function extentToGeoJson(x, y){
        var point = new ol.geom.Point([x, y]);
        var feature = new ol.Feature();
        feature.setGeometry(point);
        var geoJson = new ol.format.GeoJSON();
        return geoJson.writeFeature(feature);
    }

    function addZoom() {
        var zoom = new ol.control.Zoom();
        map.addControl(zoom);
    }

    function addZoomSlider() {
        var zoomslider = new ol.control.ZoomSlider();
        map.addControl(zoomslider);
    }

    /*
     Utility functions End
     */

    return {
        // Start up start
        InitMap: initMap,
        ChangeView: changeView,
        // Start up end

        /***********************************/

        // Layer start
        ShowLayer: showLayer,
        ShowBaseLayer: showBaseLayer,
        HideLayer: hideLayer,
        GetLayerByName: undefined,//getLayerByName,
        SetLayerOpacity: setLayerOpacity,
        SetLayerSaturation: setLayerSaturation,
        SetLayerHue: setLayerHue,
        SetLayerBrightness: setLayerBrightness,
        SetLayerContrast: setLayerContrast,
        MoveLayerToIndex: undefined,//moveLayerToIndex,
        GetLayerIndex: undefined,//getLayerIndex,
        // Layer end

        /***********************************/

        // Export start
        RedrawMap: redrawMap,
        RenderSync: renderSync,
        ExportMap: exportMap,
        ActivateExport: activateExport,
        DeactivateExport: deactivateExport,
        // Export end

        /***********************************/

        // Feature Info start
        ActivateInfoClick: activateInfoClick,
        DeactivateInfoClick: deactivateInfoClick,
        GetInfoUrl: getFeatureInfoUrl,
        ShowHighlightedFeatures: showHighlightedFeatures,
        ClearHighlightedFeatures: clearHighlightedFeatures,
        ShowInfoMarker: showInfoMarker,
        SetHighlightStyle: setHighlightStyle,
        RemoveInfoMarker: removeInfoMarker,
        ActivateBoxSelect: activateBoxSelect,
        DeactivateBoxSelect: deactivateBoxSelect,
        GetFeaturesInExtent: getFeaturesInExtent,
        GetExtentForCoordinate: getExtentForCoordinate,
        // Feature Info end

        /***********************************/

        // Measure start
        ActivateMeasure: activateMeasure,
        DeactivateMeasure: deactivateMeasure,
        // Measure end

        /***********************************/

        // Utility start
        TransformBox: transformBox,
        ConvertGmlToGeoJson: convertGmlToGeoJson,
        ExtentToGeoJson: extentToGeoJson,
        AddZoom: addZoom,
        AddZoomSlider: addZoomSlider,
        GetCenter: getCenter

        // Utility end
    };
};

ISY.MapImplementation.Leaflet.Map.RENDERERS = {
    canvas: 'canvas',
    webgl: 'webgl'
};
/**
 * Created by to on 2015-01-29.
 */
var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.Leaflet = ISY.MapImplementation.Leaflet || {};
ISY.MapImplementation.Leaflet.Sources = ISY.MapImplementation.Leaflet.Sources || {};

ISY.MapImplementation.Leaflet.Sources.Tms = function(isySubLayer){
    /*
    var projection = new ol.proj.Projection({
        code: isySubLayer.coordinate_system,
        extent: isySubLayer.extent,
        units: isySubLayer.extentUnits
    });

    var projectionExtent = projection.getExtent();
    var size = ol.extent.getWidth(projectionExtent) / 256;
    var resolutions = new Array(14);
    var matrixIds = new Array(14);
    */
    var numZoomLevels = 18;
    /*
    var matrixSet = isySubLayer.matrixSet;
    if (matrixSet === null || matrixSet === '' || matrixSet === undefined)
    {
        matrixSet=isySubLayer.coordinate_system;
    }
    for (var z = 0; z < numZoomLevels; ++z) {
        resolutions[z] = size / Math.pow(2, z);
        matrixIds[z] = matrixSet + ":" + z;
    }
    */

    var imageformat = isySubLayer.format;

    var ipos = isySubLayer.format.indexOf("/");
    if (ipos > 0){
        imageformat = imageformat.substr(ipos + 1);
    }

    var urls = isySubLayer.url; //test
    if (Array.isArray(urls)){
        urls = isySubLayer.url[0];
    }

    return new L.TileLayer(
        //urls + '/tms/1.0.0/' + isySubLayer.name + '@' + isySubLayer.coordinate_system + '@' + imageformat + '/{z}/{x}/{y}.' + imageformat,
        urls + '/tms/1.0.0/' + isySubLayer.name + '@EPSG:32632@' + imageformat + '/{z}/{x}/{y}.' + imageformat,
        {
            attribution: isySubLayer.attribution,
            minZoom: 0,
            maxZoom: numZoomLevels,
            //tileSize: 256,
            tms: true,
            continousWorld: true
        });

    /*
    return new ol.source.WMTS({
        url: isySubLayer.url,
        layer: isySubLayer.name,
        format: isySubLayer.format,
        projection: projection,
        matrixSet: matrixSet,
        crossOrigin: isySubLayer.crossOrigin,
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
        })
    });
    */
};

/**
 * Created by to on 2015-01-30.
 */
var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.Leaflet = ISY.MapImplementation.Leaflet || {};
ISY.MapImplementation.Leaflet.Sources = ISY.MapImplementation.Leaflet.Sources || {};

ISY.MapImplementation.Leaflet.Sources.Wms = function(isySubLayer){
    var urls = isySubLayer.url;
    if (Array.isArray(urls)){
        for (var i = 0; i < urls.length; i++){
            urls[i] += '?';
        }
    } else {
        urls += '?';
    }
    return new L.TileLayer.WMS(
        urls,
        {
            attribution: isySubLayer.attribution,
            layers: isySubLayer.name,
            format: isySubLayer.format,
            transparent: true,
            version: "1.0.0"
        });
};

// It is not not currently possible to do manually append points to the OpenLayers 3 ol.interaction.Draw

var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.AddFeatureGps = function(eventHandler){

    var isActive = false;
    var translate;
    var typeObject;
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
     * Handle pointer move.
     * @param {ol.MapBrowserEvent} evt
     */
    var startModify = false;

    var pointerMoveHandler = function(evt) {
        //if (!startModify || !isActive) {
        if (!isActive) {
            return;
        }
        /** @type {string} */
        var helpMsg = translate['add_layer_start_drawing'];//'Click to start drawing';

        if (sketch && !startModify) {
            helpMsg = translate['add_layer_continue_drawing'];//continuePolygonMsg;
        }
        if (startModify){
            helpMsg = translate['add_layer_modify_object'];//'Click to start drawing';
        }
        helpTooltipElement.innerHTML = helpMsg;
        helpTooltip.setPosition(evt.coordinate);

        $(helpTooltipElement).removeClass('hidden');
    };

    var draw; // global so we can remove it later
    var drawLayer;
    var modify;
    var snapping;
    var listener;

    function addInteraction(map) {
        var source = new ol.source.Vector();
        var drawStyle = new ISY.MapImplementation.OL3.Styles.Measure();

        if (typeObject === "Line"){
            typeObject = "LineString";
        }

        draw = new ol.interaction.Draw({
            source: source,
            style: drawStyle.Styles(),
            type: /** @type {ol.geom.GeometryType} */ (typeObject)
        });
        drawLayer = new ol.layer.Vector({
            source: source,
            style: drawStyle.DrawStyles()
        });

        map.addInteraction(draw);
        map.addLayer(drawLayer);

        //var snappingFeaturesCollection = new ol.Collection(snappingFeatures);
        //snapping = new ol.interaction.Snap({
        //    features: snappingFeaturesCollection
        //});
        //
        //map.addInteraction(snapping);
        initSnapping(map);

        //createMeasureTooltip(map);
        createHelpTooltip(map);

        //var listener;
        draw.on('drawstart',
            function(evt) {
                // set sketch
                sketch = evt.feature;

                var tooltipCoord = evt.coordinate;

                listener = sketch.getGeometry().on('change', function(evt) {
                    var geom = evt.target;
                    var output;
                    if (geom instanceof ol.geom.Polygon) {
                        output = "";//formatArea(/** @type {ol.geom.Polygon} */ (geom));
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    } else if (geom instanceof ol.geom.LineString) {
                        output = "";//formatLength( /** @type {ol.geom.LineString} */ (geom));
                        tooltipCoord = geom.getLastCoordinate();
                    }
                    //measureTooltipElement.innerHTML = output.string;
                    eventHandler.TriggerEvent(ISY.Events.EventTypes.MeasureMouseMove, output);
                    //measureTooltip.setPosition(tooltipCoord);
                });




            }, this);

        draw.on('drawend',
            function(evt) {
                map.removeInteraction(snapping);
                sketch = null;
                ol.Observable.unByKey(listener);

                sketch = evt.feature;
                var newFeatures = new ol.Collection([sketch]);
                modify = new ol.interaction.Modify({
                    features: newFeatures,

                    deleteCondition: function(event) {
                        return ol.events.condition.shiftKeyOnly(event) &&
                            ol.events.condition.singleClick(event);
                    }
                });

                map.addInteraction(modify);

                initSnapping(map);

                eventHandler.TriggerEvent(ISY.Events.EventTypes.AddLayerFeatureEnd, sketch);

                startModify = true;
                modify.on('modifyend',
                    function(evt) {
                        sketch = null;
                        ol.Observable.unByKey(listener);
                        sketch = evt.features.getArray()[0];  //evt.feature;
                        eventHandler.TriggerEvent(ISY.Events.EventTypes.AddLayerFeatureEnd, sketch);
                    }, this);
                map.removeInteraction(draw);

            }, this);
    }

    function initSnapping(map){
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
            if (helpTooltipElement.parentNode !== null){
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

    function  activate(map, options){

        console.log(map, options);

        //if (true){
        //    return;
        //}

        isActive = true;
        translate = options.translate;
        typeObject = options.toolType;//type;
        snappingFeatures = options.snappingFeatures;
        //console.log(options.features);

        map.on('pointermove', pointerMoveHandler);

        $(map.getViewport()).on('mouseout', function() {
            $(helpTooltipElement).addClass('hidden');
        });
        addInteraction(map);
    }

    function _removeOverlays(map){

        map.removeInteraction(draw);

        map.removeOverlay(helpTooltip);
        if (helpTooltipElement !== null) {
            if (helpTooltipElement.parentNode !== null){
                helpTooltipElement.parentNode.removeChild(helpTooltipElement);
            }
        }

        var tooltipStaticElements = document.getElementsByClassName('tooltip tooltip-static');
        while(tooltipStaticElements.length > 0){
            var staticElement = tooltipStaticElements[0];
            staticElement.parentNode.removeChild(staticElement);
        }
    }

    function deactivate(map){
        if (isActive) {
            isActive = false;
            startModify = false;
            sketch = null;
            if (map !== undefined) {
                map.removeLayer(drawLayer);
                map.removeInteraction(modify);
                map.removeInteraction(snapping);
                _removeOverlays(map);
            }
        }
    }

    function addCoordinates(coordinates){
        console.log(coordinates);
        //var point = new ol.geom.Point([coordinates[0], coordinates[1]]);
        //var feature = new ol.Feature();
        //feature.setGeometry(point);
        //var geom = sketch.getGeometry();
        //var coord = geom.getCoordinates();
        //coord.push(coordinates);
        //geom.setCoordinates(coord);
        //console.log(geom);
        //geom.appendCoordinate(coordinates);
        //sketch.setGeometry(geom);
        //draw.extend(feature);
        //sketch.setGeometry(point);
    }

    return {
        Activate: activate,
        AddCoordinates: addCoordinates,
        Deactivate: deactivate
    };
};
var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.AddLayerFeature = function(eventHandler){

    var isActive = false;
    var translate;
    var typeObject;
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
     * Handle pointer move.
     * @param {ol.MapBrowserEvent} evt
     */
    var startModify = false;

    var pointerMoveHandler = function(evt) {
        //if (!startModify || !isActive) {
        if (!isActive) {
            return;
        }
        /** @type {string} */
        var helpMsg = translate['add_layer_start_drawing'];//'Click to start drawing';

        if (sketch && !startModify) {
            helpMsg = translate['add_layer_continue_drawing'];//continuePolygonMsg;
        }
        if (startModify){
            helpMsg = translate['add_layer_modify_object'];//'Click to start drawing';
        }
        helpTooltipElement.innerHTML = helpMsg;
        helpTooltip.setPosition(evt.coordinate);

        $(helpTooltipElement).removeClass('hidden');
    };

    var draw; // global so we can remove it later
    var drawLayer;
    var modify;
    var snapping;

    function addInteraction(map) {
        var source = new ol.source.Vector();
        var drawStyle = new ISY.MapImplementation.OL3.Styles.Measure();

        if (typeObject === "Line"){
            typeObject = "LineString";
        }

        draw = new ol.interaction.Draw({
            source: source,
            style: drawStyle.Styles(),
            type: /** @type {ol.geom.GeometryType} */ (typeObject)
        });
        drawLayer = new ol.layer.Vector({
            source: source,
            style: drawStyle.DrawStyles()
        });

        map.addInteraction(draw);
        map.addLayer(drawLayer);

        //var snappingFeaturesCollection = new ol.Collection(snappingFeatures);
        //snapping = new ol.interaction.Snap({
        //    features: snappingFeaturesCollection
        //});
        //
        //map.addInteraction(snapping);
        initSnapping(map);

        //createMeasureTooltip(map);
        createHelpTooltip(map);

        var listener;
        draw.on('drawstart',
            function(evt) {
                // set sketch
                sketch = evt.feature;

                var tooltipCoord = evt.coordinate;

                listener = sketch.getGeometry().on('change', function(evt) {
                    var geom = evt.target;
                    var output;
                    if (geom instanceof ol.geom.Polygon) {
                        output = "";//formatArea(/** @type {ol.geom.Polygon} */ (geom));
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    } else if (geom instanceof ol.geom.LineString) {
                        output = "";//formatLength( /** @type {ol.geom.LineString} */ (geom));
                        tooltipCoord = geom.getLastCoordinate();
                    }
                    //measureTooltipElement.innerHTML = output.string;
                    eventHandler.TriggerEvent(ISY.Events.EventTypes.MeasureMouseMove, output);
                    //measureTooltip.setPosition(tooltipCoord);
                });




            }, this);

        draw.on('drawend',
            function(evt) {
                map.removeInteraction(snapping);
                sketch = null;
                ol.Observable.unByKey(listener);

                sketch = evt.feature;
                var newFeatures = new ol.Collection([sketch]);
                modify = new ol.interaction.Modify({
                    features: newFeatures,

                    deleteCondition: function(event) {
                        return ol.events.condition.shiftKeyOnly(event) &&
                            ol.events.condition.singleClick(event);
                    }
                });

                map.addInteraction(modify);

                initSnapping(map);

                eventHandler.TriggerEvent(ISY.Events.EventTypes.AddLayerFeatureEnd, sketch);

                startModify = true;
                modify.on('modifyend',
                    function(evt) {
                        sketch = null;
                        ol.Observable.unByKey(listener);
                        sketch = evt.features.getArray()[0];  //evt.feature;
                        eventHandler.TriggerEvent(ISY.Events.EventTypes.AddLayerFeatureEnd, sketch);
                    }, this);
                map.removeInteraction(draw);

            }, this);
    }

    function initSnapping(map){
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
            if (helpTooltipElement.parentNode !== null){
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

    function  activate(map, options){
        isActive = true;
        translate = options.translate;
        typeObject = options.toolType;//type;
        snappingFeatures = options.snappingFeatures;
        //console.log(options.features);

        map.on('pointermove', pointerMoveHandler);

        $(map.getViewport()).on('mouseout', function() {
            $(helpTooltipElement).addClass('hidden');
        });
        addInteraction(map);
    }

    function _removeOverlays(map){

        map.removeInteraction(draw);

        map.removeOverlay(helpTooltip);
        if (helpTooltipElement !== null) {
            if (helpTooltipElement.parentNode !== null){
                helpTooltipElement.parentNode.removeChild(helpTooltipElement);
            }
        }

        var tooltipStaticElements = document.getElementsByClassName('tooltip tooltip-static');
        while(tooltipStaticElements.length > 0){
            var staticElement = tooltipStaticElements[0];
            staticElement.parentNode.removeChild(staticElement);
        }
    }

    function deactivate(map){
        if (isActive) {
            isActive = false;
            startModify = false;
            sketch = null;
            if (map !== undefined) {
                map.removeLayer(drawLayer);
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
var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.DrawFeature = function(eventHandler){

    var eventHandlers={
        modify:[],
        source:[]
    };
    var isActive = false;
    var draw; // global so we can remove it later
    var modify;
    var modificationActive=false;
    var format = new ol.format.GeoJSON({
            defaultDataProjection: 'EPSG:25833',
            projection: 'EPSG:25833'
        }
    );
    var features= new ol.Collection();
    var source = new ol.source.Vector({features:features});
    var drawStyle = new ISY.MapImplementation.OL3.Styles.Measure();
    var drawLayer = new ol.layer.Vector({
        source: source,
        style: drawStyle.DrawStyles()
    });

    function addEventHandlers(){
        eventHandlers['source'].push(source.on('addfeature',
            function() {
                drawFeatureEnd();
            }, this));
        eventHandlers['source'].push(source.on('removefeature',
            function() {
                drawFeatureEnd();
            }, this));
        eventHandlers['modify'].push(modify.on('modifystart',
            function(){
                modificationActive=true;
            }, this));
        eventHandlers['modify'].push(modify.on('modifyend',
            function(){
                modificationActive=false;
                drawFeatureEnd();
            }, this));
    }

    function removeEventHandlers() {
        for (var modifyEvent = 0; modifyEvent<eventHandlers['modify'].length; modifyEvent++) {
            modify.unByKey(eventHandlers['modify'][modifyEvent]);
        }
        for (var sourceEvent = 0; sourceEvent<eventHandlers['source'].length; sourceEvent++) {
            source.unByKey(eventHandlers['source'][sourceEvent]);
        }
    }

    function drawFeatureEnd(){
        if(!modificationActive) {
            eventHandler.TriggerEvent(ISY.Events.EventTypes.DrawFeatureEnd, format.writeFeatures(source.getFeatures()));
        }
    }

    function addDrawInteraction(map, type) {
        if(draw && draw.type==type){
            return;
        }

        draw = new ol.interaction.Draw({
            source: source,
            type: (type)
        });
        map.addInteraction(draw);
    }

    function addMoveInteraction(map) {
        modify = new ol.interaction.Modify({
            features: features,
            // the SHIFT key must be pressed to delete vertices, so
            // that new vertices can be drawn at the same position
            // of existing vertices
            deleteCondition: function(event) {
                return ol.events.condition.shiftKeyOnly(event) &&
                    ol.events.condition.singleClick(event);
            }
        });
        map.addInteraction(modify);
    }

    function importGeoJSON(GeoJSON){
        if(GeoJSON){
            features=new ol.Collection(format.readFeatures(GeoJSON));
            source = new ol.source.Vector({features:features});
            drawLayer = new ol.layer.Vector({
                source: source,
                style: drawStyle.DrawStyles()
            });
        }
    }


    function activate(map, options){
        isActive = true;
        importGeoJSON(options.GeoJSON);
        map.addLayer(drawLayer);
        addMoveInteraction(map);
        addDrawInteraction(map, options.type);
        addEventHandlers();
    }

    function deactivate(map){
        if (isActive) {
            isActive = false;
            if (map !== undefined) {
                map.removeLayer(drawLayer);
                map.removeInteraction(draw);
                map.removeInteraction(modify);
                removeEventHandlers();
            }
        }
    }

    return {
        Activate: activate,
        Deactivate: deactivate
    };
};
var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.Export = function(){
    var layout = "";
    var mapExportEvents;
    var printRectangle;
    var exportActive = false;

    function activate(options, map, redrawFunction) {
        layout = options.layout;
        exportActive = true;
        printRectangle = _getScreenRectangle(map);
        mapExportEvents = [
            map.on('precompose', _handlePreCompose),
            map.on('postcompose', _handlePostCompose)
        ];
        redrawFunction();
    }

    function deactivate(redrawFunction) {
        exportActive = false;
        if (mapExportEvents) {
            for (var i = 0; i < mapExportEvents.length; i++) {
                mapExportEvents[i].src.unByKey(mapExportEvents[i]);
            }
            redrawFunction();
        }
    }

    function exportMap(callback, map){
        map.once('postcompose', function (event) {
         var canvas = event.context.canvas;
         callback(canvas, printRectangle);
         });
    }

    function windowResized(map){
        if (exportActive){
            printRectangle = _getScreenRectangle(map);
            map.render();
        }
    }

    function _getScreenRectangle(map) {
        var A4_RATIO = 210/297;
        var mapSize = map.getSize();
        var h,w;
        if (layout.value === "a4portrait") {
            w = mapSize[1] * A4_RATIO;
            if (w>mapSize[0]){
                w = mapSize[0];
                h = mapSize[0] / A4_RATIO;
            } else {
                h = mapSize[1];
            }
        } else {
            h = mapSize[0] * A4_RATIO;
            if (h>mapSize[1]){
                h = mapSize[1];
                w = mapSize[1] / A4_RATIO;
            } else {
                w = mapSize[0];
            }
        }

        var center = [mapSize[0] * ol.has.DEVICE_PIXEL_RATIO / 2 ,
            mapSize[1] * ol.has.DEVICE_PIXEL_RATIO / 2];

        return {
            minx: center[0] - (w / 2),
            miny: center[1] - (h / 2),
            maxx: center[0] + (w / 2),
            maxy: center[1] + (h / 2)
        };
    }

    var _handlePreCompose = function(evt) {
        var ctx = evt.context;
        ctx.save();
    };

    var _handlePostCompose = function(evt) {
        var ctx = evt.context;
        var mapSize = _getMapSize(evt.target);

        // Create polygon-overlay for export-area
        ctx.beginPath();
        // Outside polygon (clockwise)
        ctx.moveTo(0, 0);
        ctx.lineTo(mapSize.width, 0);
        ctx.lineTo(mapSize.width, mapSize.height);
        ctx.lineTo(0, mapSize.height);
        ctx.lineTo(0, 0);
        ctx.closePath();

        // Inner polygon (counter-clockwise)
        ctx.moveTo(printRectangle.minx, printRectangle.miny);
        ctx.lineTo(printRectangle.minx, printRectangle.maxy);
        ctx.lineTo(printRectangle.maxx, printRectangle.maxy);
        ctx.lineTo(printRectangle.maxx, printRectangle.miny);
        ctx.lineTo(printRectangle.minx, printRectangle.miny);
        ctx.closePath();

        ctx.fillStyle = 'rgba(25, 25, 25, 0.75)';
        ctx.fill();

        ctx.restore();
    };

    function _getMapSize(map) {
        var mapSize = map.getSize();
        return {
            height: mapSize[1] * ol.has.DEVICE_PIXEL_RATIO,
            width: mapSize[0] * ol.has.DEVICE_PIXEL_RATIO
        };
    }

    return {
        Activate: activate,
        Deactivate: deactivate,
        ExportMap: exportMap,
        WindowResized: windowResized
    };
};
var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};
ISY.MapImplementation.OL3.Sources = ISY.MapImplementation.OL3.Sources || {};

ISY.MapImplementation.OL3.FeatureEditor = function(eventHandler) {

    var editKey_ = "";
    var points_ = []; // ol.geom.Point[]
    var geometryName_ = "";
    var transactionManager_ = null; // ISY.MapImplementation.OL3.Sources.WfsT

    function init(url, featureType, featureNS, srsName, source, geometryName) {
        if (featureNS === undefined){
            featureNS = "http://kart4.nois.no/skjema/va";
        }
        transactionManager_ = new ISY.MapImplementation.OL3.Sources.WfsT(url, featureType, featureNS, srsName, source, eventHandler);
        geometryName_ = geometryName;
    }

    function activateEditSelect(callback, map){
        if (map !== undefined){
            editKey_ = map.on('singleclick', function(evt) {
                callback(evt.coordinate);
            });
        }
    }

    function deactivateEditSelect(map){
        if (map !== undefined){
            map.unByKey(editKey_);
            editKey_ = "";
        }
    }

    function handlePointSelect(coordinate) {
        var point = new ol.geom.Point(coordinate);
        points_.push(point);

        // Temporary test
        var feature = new ol.Feature({"navn": "ISY.MapLib-" + transactionManager_.GetFeatureType() + "-Insert"});
        feature.setGeometryName(geometryName_);
        feature.setGeometry(point);
        transactionManager_.InsertFeature(feature);
    }

    function updateFeature(feature) {
        transactionManager_.UpdateFeature(feature);
    }

    function insertFeature(feature, source){
        return transactionManager_.InsertFeature(feature, source);
    }

    function deleteFeature(feature){
        return transactionManager_.DeleteFeature(feature);
    }

    return {
        Init: init,
        ActivateEditSelect: activateEditSelect,
        DeactivateEditSelect: deactivateEditSelect,
        HandlePointSelect: handlePointSelect,
        UpdateFeature: updateFeature,
        InsertFeature: insertFeature,
        DeleteFeature: deleteFeature
    };
};

var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.FeatureInfo = function(){
    var highLightLayer = null;
    var highlightStyle = null;
    var infoKey = "";
    var boundingBox;
    var infoMarkerOverlay;
    var infoMarkersOverlay = [];

    function showHighlightedFeatures(features, map){
        _ensureHighlightLayer(map);
        clearHighlightedFeatures();

        var geoJsonParser = new ol.format.GeoJSON();
        for(var i = 0; i < features.length; i++){
            var feature = features[i];
            if (feature.geometryObject !== undefined){
                var mapFeature = geoJsonParser.readFeature(feature.geometryObject);
                if (feature.crs) {
                    mapFeature.getGeometry().transform(ol.proj.get(feature.crs), ol.proj.get(map.getView().getProjection().getCode()));
                }
                if (feature.hoverstyle) {
                    mapFeature.setStyle(feature.hoverstyle);
                }
                highLightLayer.getSource().addFeature(mapFeature);
            }else{
                highLightLayer.getSource().addFeature(feature);
            }
        }
    }

    function clearHighlightedFeatures(){
        if (highLightLayer !== null){
            var vectorSource = highLightLayer.getSource();
            vectorSource.clear();
        }
    }

    function showInfoMarker(coordinate, element, map){
        var $element = $(element);
        var height = $element[0].height;
        var width = $element[0].width;
        infoMarkerOverlay = new ol.Overlay({
            element: element,
            stopEvent: false,
            offset: [-width / 2, -height]
        });
        infoMarkerOverlay.setPosition(coordinate);
        map.addOverlay(infoMarkerOverlay);
    }

    function showInfoMarkers(coordinates,element, map){
        for (var i = 0; i < coordinates.length; i++){
            var infoMarkerElement = document.createElement("img");
            infoMarkerElement.src= "assets/img/pin-md-blueish.png";
            infoMarkerElement.style.visibility = "visible";
            var width = 0;
            var height = 0;
            var $element = $(element);
            if ( $element[0].height !== 0 &&  $element[0].width !== 0){
                width = $element[0].width;
                height = $element[0].height;
            }
            var infoMarker = new ol.Overlay({
                element: infoMarkerElement,
                stopEvent: false,
                offset:  [-width / 2, -height]
            });
            infoMarker.setPosition(coordinates[i]);
            map.addOverlay(infoMarker);
            infoMarkersOverlay.push(infoMarker);
        }
    }

    function removeInfoMarker(element, map){
        if (infoMarkerOverlay !== undefined){
            map.removeOverlay(infoMarkerOverlay);
        }
    }

    function removeInfoMarkers(element, map){
        if (infoMarkersOverlay !== undefined){
            for (var i = 0; i < infoMarkersOverlay.length; i++){
                map.removeOverlay(infoMarkersOverlay[i]);
            }
        }
    }

    function getFeatureInfoUrl(isySubLayer, mapLayer, coordinate, view){
        var viewResolution = view.getResolution();

        var layerSource = mapLayer.getSource();
        var projection = view.getProjection();

        var url = layerSource.getGetFeatureInfoUrl(coordinate, viewResolution, projection, {'INFO_FORMAT': isySubLayer.featureInfo.getFeatureInfoFormat, 'feature_count': 10});
        var decodedUrl = decodeURIComponent(url);
        var queryString = decodedUrl.substring(decodedUrl.lastIndexOf('?'), decodedUrl.length).replace('?', '');
        var queryStringEncoded = encodeURIComponent(queryString);
        return isySubLayer.url[0] + '?' + queryStringEncoded;
    }

    function activateInfoClick(callback, map){
        if (map !== undefined){
        infoKey = map.on('singleclick', function(evt) {
            callback(evt.coordinate);
        });
    }
    }

    function deactivateInfoClick(map){
        if (map !== undefined){
        map.unByKey(infoKey);
        infoKey = "";
    }
    }

    function activateBoxSelect(callback, map){
        boundingBox = new ol.interaction.DragBox({
            condition: ol.events.condition.always
        });

        map.addInteraction(boundingBox);

        boundingBox.on('boxend', function(){
            callback(boundingBox.getGeometry().getExtent());
        });
    }

    function deactivateBoxSelect(map) {
        if (map !== undefined) {
            map.removeInteraction(boundingBox);
        }
    }

    function _isVisible(mapLayer, resolution){
        var minResolution = mapLayer.getMinResolution();
        if (minResolution > 0 && minResolution > resolution){
            return false;
        }
        var maxResolution = mapLayer.getMaxResolution();
        if (maxResolution !== Infinity && maxResolution < resolution){
            return false;
        }

        return true;
    }

    function getFeaturesInExtent(extent, mapLayer, resolution){
        if (mapLayer === undefined || extent === undefined) {
            return undefined;
        }

       if (!_isVisible(mapLayer, resolution)){
            return undefined;
       }

        var source = mapLayer.getSource();
        var features = [];
        source.forEachFeatureInExtent(extent, function(feature){
            var featureGeometry = feature.getGeometry();
            var hidden = feature.get("isHidden");
            hidden = hidden === undefined ? false : hidden;
            if (!hidden) {
                if (featureGeometry !== undefined && featureGeometry.intersectsExtent(extent)) {
                    features.push(feature);
                }
            }
        });
        var geoJson = new ol.format.GeoJSON();
        var featureCollection = geoJson.writeFeaturesObject(features);
        if (Array.isArray(featureCollection.features)) {
            for (var i = 0; i < featureCollection.features.length; i++) {
                featureCollection.features[i].olFeature = features[i];
            }
        } else {
            featureCollection.features.olFeature = Array.isArray(features) ? features[0] : features;
        }
        var projection = source.getProjection();
        if (projection) {
            featureCollection.crs = _createCrsObjectForGeoJson(projection.getCode());
        }
        return featureCollection;
    }

    function getFeatureCollection(mapLayer){
        if (mapLayer !== null){
            var source = mapLayer.getSource();
            var features = source.getFeatures();
            var geoJson = new ol.format.GeoJSON();
            var featureCollection = geoJson.writeFeaturesObject(features);
            var projection = source.getProjection();
            if (projection) {
                featureCollection.crs = _createCrsObjectForGeoJson(source.getProjection().getCode());
            }
            return featureCollection;
        }
    }

    function getFeaturesInMap(mapLayer){
        if (mapLayer !== null){
            var source = mapLayer.getSource();
            return source.getFeatures();
        }
    }

    function getFeatureExtent(feature){
        var geoJsonParser = new ol.format.GeoJSON();
        var mapFeature = geoJsonParser.readFeature(feature.geometryObject);
        return mapFeature.getGeometry().getExtent();
    }

    function _createCrsObjectForGeoJson(crsCode){
        return new CrsObject(crsCode.split(':'));
    }

    function CrsObject(codes){
        this.type = codes[0];
        this.properties = new CrsProperties(codes[1]);
    }

    function CrsProperties(code){
        this.code = code;
    }

    function getExtentForCoordinate(coordinate, pixelTolerance, resolution){
        var toleranceInMapUnits = pixelTolerance * resolution;
        var n = coordinate[0];
        var e = coordinate[1];
        var minN = n - toleranceInMapUnits;
        var minE = e - toleranceInMapUnits;
        var maxN = n + toleranceInMapUnits;
        var maxE = e + toleranceInMapUnits;
        return [minN, minE, maxN, maxE];
    }

    function _ensureHighlightLayer(map){
        if(highLightLayer == null){

            if(highlightStyle == null){
                _setDefaultHighlightStyle();
            }

            var vectorSource = new ol.source.Vector({
                projection: 'EPSG:4326',
                // this is bogus, just to get the source initialized, can for sure be done a lot more appropriate.
                object: {
                    "type":"FeatureCollection",
                    "totalFeatures":1,
                    "features":[
                        {
                            "type":"Feature",
                            "id":"thc.1",
                            "geometry":
                            {
                                "type":"Point",
                                "coordinates":[21.7495,71.721]},
                            "geometry_name":"the_geom",
                            "properties":
                            {
                                "Year":2003
                            }
                        }
                    ],
                    "crs":
                    {
                        "type":"EPSG",
                        "properties":
                        {
                            "code":"4326"
                        }
                    }
                }
            });
            highLightLayer = new ol.layer.Vector({
                source: vectorSource,
                style: highlightStyle
            });
            map.addLayer(highLightLayer);
        }
        else {
            map.removeLayer(highLightLayer);
            map.addLayer(highLightLayer);
        }
    }

    function setHighlightStyle(style){
        highlightStyle = style;
        highLightLayer.setStyle(highlightStyle);
    }

    function _setDefaultHighlightStyle(){
        var defaultStyle = new ISY.MapImplementation.OL3.Styles.Default();
        highlightStyle = defaultStyle.Styles;
    }

    return {
        ShowHighlightedFeatures: showHighlightedFeatures,
        ClearHighlightedFeatures: clearHighlightedFeatures,
        SetHighlightStyle: setHighlightStyle,
        ShowInfoMarker: showInfoMarker,
        ShowInfoMarkers: showInfoMarkers,
        RemoveInfoMarker: removeInfoMarker,
        RemoveInfoMarkers: removeInfoMarkers,
        GetFeatureInfoUrl: getFeatureInfoUrl,
        ActivateInfoClick: activateInfoClick,
        DeactivateInfoClick: deactivateInfoClick,
        ActivateBoxSelect: activateBoxSelect,
        DeactivateBoxSelect: deactivateBoxSelect,
        GetFeaturesInExtent: getFeaturesInExtent,
        GetExtentForCoordinate: getExtentForCoordinate,
        GetFeatureCollection: getFeatureCollection,
        GetFeatureExtent: getFeatureExtent,
        GetFeaturesInMap: getFeaturesInMap
    };
};
 ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.HoverInfo = function(){
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
    var mousePixel;
    var mouseCoordinate;

    function activateHoverInfo(map, a, mapImpl, options){
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

    function _setOptions(options){
        if (options){
            if (options.multiSelect){
                multiSelect = options.multiSelect;
            }
        }
    }

    function _removePopup(){
        if (popup === undefined){
            return;
        }
        var element = popup.getElement();
        $(element).popover('destroy');
        if (highlight && featureOverlay) {
            featureOverlay.getSource().removeFeature(highlight);
            highlight = undefined;
        }
    }

    function _getFeatureByZIndexFromPixel(map, pixel){
        var features = [];
        map.forEachFeatureAtPixel(pixel, function (feature) {
            var zindex = parseInt(mapImplementation.GetLayerByFeature(feature).guid, 10);
            features.push({feature: feature, zindex: zindex});
        });
        features = _orderArrayByZIndex(features);
        if (features === undefined) {
            return undefined;
        }
        return features[0].feature;
    }

    function _getFeatureByZIndex(featureArray){
        var features = [];
        featureArray.forEach(function (feature){
            var layer = mapImplementation.GetLayerByFeature(feature);
            if (layer) {
                var zindex = parseInt(layer.guid, 10);
                features.push({feature: feature, zindex: zindex});
            }
        });
        features = _orderArrayByZIndex(features);
        if (features === undefined) {
            return undefined;
        }
        return features[0].feature;
    }

    function _compare(a,b) {
        if (a.zindex < b.zindex) {
            return 1;
        }
        if (a.zindex > b.zindex) {
            return -1;
        }
        return 0;
    }

    function _orderArrayByZIndex(features){
        if (features.length === 0) {
            return undefined;
        }
        features.sort(_compare);
        return features;
    }

    function _setMouseCoordinates(map, evt){
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
        switch(hoverVersion){
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
                switch(hoverVersion){
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
                        'placement': 'top',
                        'animation': false,
                        'html': true,
                        'content': '<div class="hover-info">' + tooltip + '</div>'
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

    function _getHoverStyle(feature, resolution){
        return mapImplementation.GetHoverStyle(feature, resolution);
    }

    function _addInteraction(map) {
        if (hoverIsActive) {
            return;
        }
        hoverIsActive = true;
        if (hoverIsInitialized){
            switch (hoverVersion){
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
                    style: function(feature, resolution){
                        return mapImplementation.GetHoverStyle(feature, resolution);
                    }
                });
                map.addInteraction(hoverInteraction);
                hoverInteraction.on('select', function(evt){
                    if (!hoverIsActive){
                        return;
                    }
                    if (evt.dragging){
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
var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.Map = function(repository, eventHandler, httpHelper, measure, featureInfo, mapExport, hoverInfo, measureLine, drawFeature, offline, addLayerFeature, modifyFeature, addFeatureGps, printBoxSelect){
    var map;
    var layerPool = [];
    var isySubLayerPool = [];
    var sldstyles = [];
    var mapResolutions;
    var mapScales;
    var hoverOptions;
    var mapGroups;
    var featureEditor = new ISY.MapImplementation.OL3.FeatureEditor(eventHandler);
    var initialGeolocationChange = false;

    var proxyHost = "";
    var tokenHost = "";
    var gktLifetime = 3000;
    var lastGktCheck = 0;
    var geolocation;
    var translateOptions;
    var isyToken;

    var describedSubLayer;
    var describedSource;
    var isyLayerGeometryType;

    var customMessageHandler;

    /*
        Start up functions Start
     */

    function initMap(targetId, mapConfig){
        proxyHost = mapConfig.proxyHost;
        tokenHost = mapConfig.tokenHost;
        mapGroups = mapConfig.groups;
        hoverOptions = mapConfig.hoverOptions;
        var numZoomLevels = mapConfig.numZoomLevels;
        var newMapRes = [];
        newMapRes[0]= mapConfig.newMaxRes;
        mapScales = [];
        mapScales[0] = mapConfig.newMaxScale;
        for (var t = 1; t < numZoomLevels; t++) {
            newMapRes[t] = newMapRes[t - 1] / 2;
            mapScales[t] = mapScales[t - 1] / 2;
        }
        mapResolutions = newMapRes;
        var sm = new ol.proj.Projection({
            code: mapConfig.coordinate_system,
            extent: mapConfig.extent,
            units: mapConfig.extentUnits
        });

        map = new ol.Map({
            target: targetId,
            renderer: mapConfig.renderer,
            layers: [],
            loadTilesWhileAnimating: true, // Improve user experience by loading tiles while animating. Will make animations stutter on mobile or slow devices.
            view: new ol.View({
                projection: sm,
                //constrainRotation: 4,
                enableRotation: false,
                center: mapConfig.center,
                zoom: mapConfig.zoom,
                resolutions: newMapRes,
                maxResolution: mapConfig.newMaxRes,
                numZoomLevels: numZoomLevels
            }),
            controls: [],
            overlays: []
        });
        _initOffline();

        _registerMapCallbacks();

        if (mapConfig.showProgressBar){
            _registerProgressBar();
        }
        if (mapConfig.showMousePosition){
            _registerMousePositionControl(mapConfig.mouseProjectionPrefix);
        }
        _registerMessageHandler();
    }

    function _registerMapCallbacks(){
        var view = map.getView();

        var changeCenter = function(){
            var mapViewChangedObj = _getUrlObject();
            eventHandler.TriggerEvent(ISY.Events.EventTypes.ChangeCenter, mapViewChangedObj);
        };

        var changeResolution = function(){
            var mapViewChangedObj = _getUrlObject();
            eventHandler.TriggerEvent(ISY.Events.EventTypes.ChangeResolution, mapViewChangedObj);
        };

        var mapMoveend = function(){
            _checkGktToken();
            var mapViewChangedObj = _getUrlObject();
            eventHandler.TriggerEvent(ISY.Events.EventTypes.MapMoveend, mapViewChangedObj);
        };

        view.on('change:center', changeCenter);
        view.on('change:resolution', changeResolution);
        map.on('moveend', mapMoveend);
    }

    function _registerMessageHandler(){
        var layerMessageHandler = new ISY.MapImplementation.OL3.Sources.CustomMessageHandler(eventHandler, _getIsySubLayerFromPool);
        layerMessageHandler.Init(map);

        customMessageHandler = new ISY.MapImplementation.OL3.Sources.CustomMessageHandler();
        customMessageHandler.InitMessage('');
    }

    function _registerProgressBar(){
        var progressBar = new ISY.MapImplementation.OL3.ProgressBar(eventHandler);
        progressBar.Init(map);
    }

    function _registerMousePositionControl(prefix){
        var element = document.getElementById('mouseposition');
        if (element) {
            var units = map.getView().getProjection().getUnits();
            var epsg = getEpsgCode();
            //var coordinateFunction = ol.coordinate.createStringXY(0);
            if (prefix === undefined){
                prefix = '';
            }
            var coordinate2string = function(coord){
                var mousehtml = '' + prefix;
                var geographic = false;
                if (mousehtml.length > 0) {
                    switch (units) {
                        case 'degrees':
                            mousehtml = '';
                            geographic = true;
                            break;
                        case 'm':
                            switch(epsg){
                                case 'EPSG:25831':
                                case 'EPSG:32631':
                                    mousehtml += '31 ';
                                    break;
                                case 'EPSG:25832':
                                case 'EPSG:32632':
                                    mousehtml += '32 ';
                                    break;
                                case 'EPSG:25833':
                                case 'EPSG:32633':
                                    mousehtml += '33 ';
                                    break;
                                case 'EPSG:25834':
                                case 'EPSG:32634':
                                    mousehtml += '34 ';
                                    break;
                                case 'EPSG:25835':
                                case 'EPSG:32635':
                                    mousehtml += '35 ';
                                    break;
                                case 'EPSG:25836':
                                case 'EPSG:32636':
                                    mousehtml += '36 ';
                                    break;
                                case 'EPSG:25837':
                                case 'EPSG:32637':
                                    mousehtml += '37 ';
                                    break;
                                case 'EPSG:25838':
                                case 'EPSG:32638':
                                    mousehtml += '38 ';
                                    break;
                            }
                            break;
                    }
                }
                if (geographic){
                    mousehtml += Math.round(coord[1]*10000)/10000 + translateOptions['north'] + Math.round(coord[0]*10000)/10000 + translateOptions['east'];
                } else {
                    mousehtml += parseInt(coord[1], 10) + translateOptions['north'] + parseInt(coord[0], 10) + translateOptions['east'];
                }
                return mousehtml;
            };
            var mousePositionControl = new ol.control.MousePosition({
                coordinateFormat: coordinate2string,
                projection: epsg,
                //undefinedHTML: '&nbsp;',
                // comment the following two lines to have the mouse position
                // be placed within the map.
                className: 'mousePosition',
                target: element
            });
            map.addControl(mousePositionControl);
        }
    }

    function _checkGktToken(){
        var currentTime = (new Date()).getTime();
        if (currentTime < (lastGktCheck + 60000)) {
            // check if token has expired each minute
            return;
        }
        lastGktCheck = currentTime;
        if (map.getLayers()) {
            map.getLayers().forEach(function (layer) {
                var source = layer.getSource();
                if (source && source.getParams){
                    var params = source.getParams();
                    if (params && params.GKT) {
                        //console.log(layer.typename + ' ' + params.GKT);
                        var initTime = source.get("timestamp");
                        if (initTime) {
                            var elapsedTime = Math.round((currentTime - initTime)/1000);
                            if (elapsedTime > gktLifetime) {
                                _setToken(source);
                            }
                        }
                    }
                }
            });
        }
    }

    // Adds GKT-token to existing source
    function _setToken(source){
        //console.log("updating token");
        //console.log(layer.typename + ' - ' + source.get("timestamp") + ' - ' + params.GKT);
        source.updateParams({GKT: _getToken()});
        source.set("timestamp", (new Date()).getTime());
    }

    function changeView(viewPropertyObject){
        if (map !== undefined) {
            var view = map.getView();
            var lon, lat, zoom;
            if (viewPropertyObject.lon) {
                lon = viewPropertyObject.lon;
            }
            if (viewPropertyObject.lat) {
                lat = viewPropertyObject.lat;
            }
            if (viewPropertyObject.zoom) {
                zoom = viewPropertyObject.zoom;
            }

            if (lon !== undefined && lat !== undefined) {
                var latitude = typeof(lat) === 'number' ? lat : parseFloat(lat.replace(/,/g, '.'));
                var longitude = typeof(lon) === 'number' ? lon : parseFloat(lon.replace(/,/g, '.'));
                if (isFinite(latitude) && isFinite(longitude)) {
                    view.setCenter([longitude, latitude]);
                }
            }

            if (zoom !== undefined) {
                view.setZoom(zoom);
            }
        }
    }

    /*
        Start up functions End
     */

    /*
        Layer functions Start
        Functionality to be moved to ISY.MapImplementation.OL3.Layers
     */

    function addDataToLayer(isySubLayer, data) {
        var layer = _getLayerFromPool(isySubLayer);
        if (isySubLayer.format === ISY.Domain.SubLayer.FORMATS.geoJson) {
            var geoJson = JSON.parse(data);
            var geoJsonParser = new ol.format.GeoJSON();
            var features = geoJsonParser.readFeatures(geoJson);

            //for (var i = 0; i < features.length; ++i) {
            //    if (features[i].getProperties().Guid) {
            //        features[i].setId(features[i].getProperties().Guid);
            //    }
            //}
            if (isySubLayer.id && isySubLayer.name) {
                for (var i = 0; i < features.length; ++i) {
                    if (features[i].getProperties().Guid === undefined){
                        features[i].setProperties({"Guid": new ISY.Utils.Guid().NewGuid()});
                    }
                    features[i].setId(isySubLayer.name + '.' + features[i].getProperties().Guid);
                }
            }

            layer.getSource().addFeatures(features);
        }
    }

    function removeDataFromLayer(isySubLayer, data) {
        var layer = _getLayerFromPool(isySubLayer);
        if (isySubLayer.format === ISY.Domain.SubLayer.FORMATS.geoJson) {
            var geoJson = JSON.parse(data);
            var geoJsonParser = new ol.format.GeoJSON();
            var features = geoJsonParser.readFeatures(geoJson);
            for (var i = 0; i < features.length; ++i) {
                if (features[i].getProperties().Guid) {
                    var feature = layer.getSource().getFeatureById(isySubLayer.name + '.' + features[i].getProperties().Guid);
                    if (feature) {
                        layer.getSource().removeFeature(feature);
                    }
                }
            }
        }
    }

    function clearLayer(isySubLayer) {
        var layer = _getLayerFromPool(isySubLayer);
        if (layer !== undefined) {
            layer.getSource().clear();
        }
    }

    function _isLayerVisible(isySubLayer){
        var layerexists = false;
        map.getLayers().forEach(function (maplayer) {
            if (!layerexists && maplayer.guid === isySubLayer.id) {
                layerexists = true;
            }
        });
        return layerexists;
    }

    function showLayer(isySubLayer){
        if (!_isLayerVisible(isySubLayer)) {
            var layer = _createLayer(isySubLayer);
            if (layer) {
                layer.sortingIndex = isySubLayer.sortingIndex;
                map.addLayer(layer);
                _trigLayersChanged();
            }
        }
    }

    function getLegendStyles(isySubLayer){
        var layer = _getLayerFromPool(isySubLayer);
        if (layer !== null){
            return getLegendStyleFromLayer(layer);
        }
        return undefined;
    }

    function showBaseLayer(isySubLayer){
        if (!_isLayerVisible(isySubLayer)) {
            var layer = _createLayer(isySubLayer);
            if (layer) {
                map.getLayers().insertAt(0, layer);
                _trigLayersChanged();
            }
        }
    }

    function hideLayer(isySubLayer){
        if (_isLayerVisible(isySubLayer)) {
            var layer = _getLayerByGuid(isySubLayer.id);
            if (layer) {
                map.removeLayer(layer);
                _trigLayersChanged();
            }
        }
    }

    function _getProxyUrl(layerUrl, flattenproxy){
        if (Array.isArray(layerUrl)){
            layerUrl = layerUrl[0];
        }
        if (flattenproxy){
            if (Array.isArray(proxyHost)) {
                return proxyHost[0] + layerUrl;
            }
            return proxyHost + layerUrl;
        }
        if (!Array.isArray(proxyHost)) {
            return proxyHost + layerUrl;
        }
        var newLayerUrl = [];
        for (var i = 0; i < proxyHost.length; i++){
            newLayerUrl.push(proxyHost[i] + layerUrl);
        }
        return newLayerUrl;
    }

    function _getToken(){
        if (!tokenHost){
            return null;
        }
        return $.ajax({
            type: "GET",
            url: tokenHost,
            async: false
        }).responseText.trim().replace(/\"/g, "");
    }

    function _setLayerProperties(layer, isySubLayer){
        // For caching, remember layer config
        layer.set('config', isySubLayer);
        layer.on('change',function(){
            layer.set('loading', true);
        }, layer);
        layer.on('render',function(){
            // usikker på om render er riktig funksjon...
            if (layer.get('loading')){
                layer.set('loading', undefined);
                eventHandler.TriggerEvent(ISY.Events.EventTypes.LoadingLayerEnd, layer);
            }
        }, layer);
    }

    function _createLayer(isySubLayer){
        var layer;
        var source;
        var layerFromPool = _getLayerFromPool(isySubLayer);
        var returnlayer = true;
        var parameters;
        if (isyToken && isyToken.length > 0){
            parameters = {isyToken: isyToken};
        }

        var styleCallback = function(response){
            // For caching, remember layer config
            layer.set('config', isySubLayer);
            var scales = sldstyles[isySubLayer.id].ParseSld(response, parseInt(isySubLayer.id, 10));
            if (scales.maxScaleDenominator) {
                _setLayerMaxresolution(layer, _getResolutionByScale(scales.maxScaleDenominator), 'styleCallback');
            }
            if (scales.minScaleDenominator) {
                _setLayerMinresolution(layer, _getResolutionByScale(scales.minScaleDenominator), 'styleCallback');
            }
            _addIsySubLayer(isySubLayer);
            layerPool.push(layer);
            layer.sortingIndex = isySubLayer.sortingIndex;
            map.addLayer(layer);
            eventHandler.TriggerEvent(ISY.Events.EventTypes.LayerCreated, layerPool);
            sortLayerBySortIndex();
            _trigLayersChanged();
        };

        if(layerFromPool != null){
            layer = layerFromPool;
            // For caching, remember layer config
            layer.set('config', isySubLayer);
        } else {
            switch(isySubLayer.source){
                case ISY.Domain.SubLayer.SOURCES.wmts:
                    source = new ISY.MapImplementation.OL3.Sources.Wmts(isySubLayer, parameters);
                    break;
                case ISY.Domain.SubLayer.SOURCES.proxyWmts:
                    isySubLayer.url = _getProxyUrl(isySubLayer.url);
                    source = new ISY.MapImplementation.OL3.Sources.Wmts(isySubLayer, parameters);
                    break;
                case ISY.Domain.SubLayer.SOURCES.wms:
                    source = new ISY.MapImplementation.OL3.Sources.Wms(isySubLayer, parameters);
                    if (isySubLayer.gatekeeper && isySubLayer.tiled && ((offline === undefined) ? true : !offline.IsActive())){
                        _setToken(source);
                    }
                    break;
                case ISY.Domain.SubLayer.SOURCES.proxyWms:
                    isySubLayer.url = _getProxyUrl(isySubLayer.url);
                    source = new ISY.MapImplementation.OL3.Sources.Wms(isySubLayer, parameters);
                    break;
                case ISY.Domain.SubLayer.SOURCES.vector:
                    source = new ISY.MapImplementation.OL3.Sources.Vector(isySubLayer);
                    if (isySubLayer.url !== "") {
                        if (!isySubLayer.noProxy) {
                            isySubLayer.url = _getProxyUrl(isySubLayer.url);
                        }
                        _loadVectorLayer(isySubLayer, source);
                    }
                    break;
                case ISY.Domain.SubLayer.SOURCES.wfs:
                    if (!isySubLayer.noProxy) {
                        isySubLayer.url = _getProxyUrl(isySubLayer.url, true);
                    }
                    source = new ISY.MapImplementation.OL3.Sources.Wfs(isySubLayer, offline, parameters);
                    break;

                default:
                    throw "Unsupported source: ISY.Domain.SubLayer.SOURCES.'" +
                            isySubLayer.source +
                            "'. For SubLayer with url " + isySubLayer.url +
                            " and name " + isySubLayer.name + ".";
            }

            if(isySubLayer.source === ISY.Domain.SubLayer.SOURCES.vector){
                if (isySubLayer.style) {
                    if (typeof isySubLayer.style == "object" || isySubLayer.style.indexOf("http") < 0) {
                        sldstyles[isySubLayer.id] = new ISY.MapImplementation.OL3.Styles.Json(isySubLayer.style);
                        layer = new ol.layer.Vector({
                            source: source,
                            style: function (feature, resolution) {
                                return sldstyles[isySubLayer.id].GetStyle(feature, _getScaleByResolution(resolution));
                            }

                        });
                    } else {
                        sldstyles[isySubLayer.id] = new ISY.MapImplementation.OL3.Styles.Sld();
                        layer = new ol.layer.Vector({
                            source: source,
                            style: function (feature, resolution) {
                                return sldstyles[isySubLayer.id].GetStyle(feature, _getScaleByResolution(resolution));
                            }
                        });
                        if (isySubLayer.style){
                            returnlayer = false;
                            getConfigResource(isySubLayer.style, 'application/xml', styleCallback);
                        }
                        _setLayerProperties(layer, isySubLayer);
                    }
                } else {
                    layer = new ol.layer.Vector({
                        source: source
                    });
                }
            }
            else if (isySubLayer.source === ISY.Domain.SubLayer.SOURCES.wfs){
                sldstyles[isySubLayer.id] = new ISY.MapImplementation.OL3.Styles.Sld();
                layer = new ol.layer.Vector({
                    source: source,
                    style: function (feature, resolution) {
                        return sldstyles[isySubLayer.id].GetStyle(feature, _getScaleByResolution(resolution));
                    }
                });
                if (isySubLayer.style){
                    returnlayer = false;
                    getConfigResource(isySubLayer.style, 'application/xml', styleCallback);
                }
                _setLayerProperties(layer, isySubLayer);
            }
            else if (isySubLayer.tiled) {
                layer = new ol.layer.Tile({
                    extent: isySubLayer.extent,
                    opacity: isySubLayer.opacity,
                    source: source
                });
            } else {
                layer = new ol.layer.Image({
                    extent: isySubLayer.extent,
                    opacity: isySubLayer.opacity,
                    source: source
                });
            }

            // For caching, remember layer config
            layer.set('config', isySubLayer);
            layer.layerIndex = isySubLayer.layerIndex;
            layer.guid = isySubLayer.id;
            layer.typename = isySubLayer.name;
            layer.tooltipTemplate = isySubLayer.tooltipTemplate;
            if (isySubLayer.minResolution !== undefined) {
                layer.setMinResolution(isySubLayer.minResolution);
            }
            if (isySubLayer.maxResolution !== undefined) {
                layer.setMaxResolution(isySubLayer.maxResolution);
            }
            if (isySubLayer.maxScale){
                _setLayerMinresolution(layer, _getResolutionByScale(isySubLayer.maxScale), 'layer');
            }
            if (isySubLayer.minScale){
                _setLayerMaxresolution(layer, _getResolutionByScale(isySubLayer.minScale), 'layer');
            }
            if (returnlayer){
                _addIsySubLayer(isySubLayer);
                layerPool.push(layer);
            }
        }

        if (returnlayer) {
            return layer;
        }
    }

    function _setLayerMinresolution(layer, scale){ //}, debuginfo) {
        if (layer && scale) {
            var minRes = layer.getMinResolution();
            if (minRes && minRes >= scale){
                //console.log(minRes + ' > ' + scale);
                return;
            }
            //console.log(debuginfo + ' setLayerMinresolution() ' + layer.get('config').name + ': ' + scale);
            layer.setMinResolution(scale);
        }
    }

    function _setLayerMaxresolution(layer, scale){ //, debuginfo) {
        if (layer && scale) {
            var maxRes = layer.getMaxResolution();
            if (maxRes && maxRes <= scale){
                //console.log(maxRes + ' < ' + scale);
                return;
            }
            //console.log(debuginfo + ' setLayerMaxresolution() ' + layer.get('config').name + ': ' + scale);
            layer.setMaxResolution(scale);
        }
    }

    function _loadVectorLayer(isySubLayer, source){
        var callback = function(data){
            var format = new ol.format.GeoJSON();
            for(var i = 0; i < data.features.length; i++) {
                var feature = data.features[i];
                if (feature.type){
                    source.addFeature(format.readFeature(feature));
                }
            }
        };
        $.ajax({
            url: isySubLayer.url + "request=GetFeature&typeName="+isySubLayer.name+"&outputFormat=json",
            async: false
        }).done(function(response) {
            callback(response);
        });
    }

    function _getLayerFromPool(isySubLayer){
        for(var i = 0; i < layerPool.length; i++){
            var layerInPool = layerPool[i];
            if(layerInPool.guid == isySubLayer.id){
                return layerInPool;
            }
        }
        return null;
    }

    function _getLayerFromPoolByGuid(guid){
        for(var i = 0; i < layerPool.length; i++){
            var layerInPool = layerPool[i];
            if(layerInPool.guid == guid){
                return layerInPool;
            }
        }
        return null;
    }

    function _addIsySubLayer(isySubLayer){
        var itemExists = false;
        for (var i = 0; i < isySubLayerPool.length; i++){
            if (isySubLayer.id === isySubLayerPool[i].id){
                itemExists = true;
                break;
            }
        }
        if (!itemExists){
            isySubLayerPool.push(isySubLayer);
        }
    }

    function _getIsySubLayerFromPool(layer){
        var isySubLayer;
        for (var i = 0; i < isySubLayerPool.length; i++){
            if (isySubLayerPool[i].id === layer.guid){
                isySubLayer = isySubLayerPool[i];
                break;
            }
        }
        return isySubLayer;
    }

    function _getLayerFromPoolByFeature(feature){
        var featureId = feature.get("layerguid");
        if (featureId === undefined) {
            featureId = feature.getId();

            if (featureId === undefined) {
                return null;
            }

            if (featureId.indexOf('.') > 0) {
                featureId = featureId.slice(0, featureId.indexOf('.'));
            } else {
                var tempFeatureId = featureId.substr(0, featureId.indexOf('_')) + ':' + featureId.substr(featureId.indexOf('_') + 1);
                featureId = tempFeatureId.slice(0, tempFeatureId.indexOf('_'));
            }
            for (var i = 0; i < layerPool.length; i++) {
                var layerInPool = layerPool[i];
                var typename = layerInPool.typename;
                if (typename.indexOf(':') > 0) {
                    typename = typename.slice(typename.indexOf(':') + 1);
                }
                if (typename === featureId) {
                    return layerInPool;
                }
            }
        } else {
            for (var j = 0; j < layerPool.length; j++){
                if (featureId === layerPool[j].guid){
                    return layerPool[j];
                }
            }
        }
        return null;
    }

    var _getScaleByResolution = function(resolution){
        if (resolution === undefined){
            return;
        }
        var scale;
        for (var i = 0; i < mapResolutions.length; i++){
            if (mapResolutions[i] === resolution){
                scale = mapScales[i];
                break;
            }
        }
        return scale;
    };

    var _getResolutionByScale = function(scale){
        if (scale === undefined){
            scale = getScale();
        }
        if (scale == 1) {
            return mapResolutions[mapResolutions.length - 1];
        }
        if (scale == Infinity){
            return undefined;
        }
        var zoomlevel = -1;
        for (var i = 0; i < mapScales.length; i++){
            if (mapScales[i] < scale){
                zoomlevel = i - 1;
                break;
            }
        }
        if (zoomlevel < 0){
            return mapResolutions[mapResolutions.length - 1];
        }
        return mapResolutions[zoomlevel];
    };

    function setLayerBrightness(isySubLayer, value){
        // Require WebGL-rendering of map
        var layer = _getLayerByGuid(isySubLayer.id);
        if(layer && !isNaN(value)){
            layer.setBrightness(Math.min(value,1));
        }
    }
    function setLayerContrast(isySubLayer, value){
        // Require WebGL-rendering of map
        var layer = _getLayerByGuid(isySubLayer.id);
        if(layer && !isNaN(value)){
            layer.setContrast(Math.min(value,1));
        }
    }
    function setLayerOpacity(isySubLayer, value){
        var layer = _getLayerByGuid(isySubLayer.id);
        if(layer && !isNaN(value)){
            layer.setOpacity(Math.min(value,1));
        }
    }
    function setLayerSaturation(isySubLayer, value){
        // Require WebGL-rendering of map
        var layer = _getLayerByGuid(isySubLayer.id);
        if(layer && !isNaN(value)){
            layer.setSaturation(Math.min(value,1));
        }
    }
    function setLayerHue(isySubLayer, value){
        // Require WebGL-rendering of map
        var layer = _getLayerByGuid(isySubLayer.id);
        if(layer && !isNaN(value)){
            layer.setHue(Math.min(value,1));
        }
    }

    function _getLayersWithGuid(){
        return map.getLayers().getArray().filter(function(elem){
            return elem.guid !== undefined;
        });
    }

    function _getLayerByGuid(guid){
        var layers = _getLayersWithGuid();
        for(var i = 0; i < layers.length; i++){
            var layer = layers[i];
            if(layer.guid == guid){
                return layer;
            }
        }
        return null;
    }

    function getLayerIndex(isySubLayer){
        var layers = _getLayersWithGuid();
        for(var i = 0; i < layers.length; i++){
            var layer = layers[i];
            if(layer.guid == isySubLayer.id){
                return i;
            }
        }
        return null;
    }

    function getLayerByName(layerTitle) {
        var layers = _getLayersWithGuid();
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].get('title') == layerTitle) {
                return layers[i];
            }
        }
        return null;
    }

    function moveLayerToIndex(isySubLayer, index){
        var subLayerIndex = getLayerIndex(isySubLayer);
        var layersArray = map.getLayers().getArray();

        for(var i=0; i<layersArray.length; i++){
            if (layersArray[i].guid === undefined){
                layersArray.splice(i, 1);
                break;
            }
        }
        layersArray.splice(index, 0, layersArray.splice(subLayerIndex, 1)[0]);

        _trigLayersChanged();
    }

    function sortLayerBySortIndex(){
        var layersArray = map.getLayers().getArray();
        _sortByKey(layersArray, 'sortingIndex');
        _trigLayersChanged();
    }

    function _sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    }

    function _getLayerById(layerId){
        var layers = map.getLayers().getArray();
        for (var i = 0; i<layers.length; i++){
            if (layers[i].guid === layerId){
                return layers[i];
            }
        }
        return undefined;
    }

    function updateLayerSortIndex(groups){
        for (var i = 0; i < groups.length; i++){
            if (groups[i].isyLayers !== undefined){
                for (var j = 0; j < groups[i].isyLayers.length; j++){
                    for (var k = 0; k < groups[i].isyLayers[j].subLayers.length; k++){
                        var layer = _getLayerById(groups[i].isyLayers[j].subLayers[k].id);
                        if (layer !== undefined){
                            layer.sortingIndex = groups[i].isyLayers[j].subLayers[k].sortingIndex;
                        }
                    }
                }
                }else{
                    break;
                }
        }
    }

    function _trigLayersChanged(){
        var eventObject = _getUrlObject();
        eventHandler.TriggerEvent(ISY.Events.EventTypes.ChangeLayers, eventObject);
    }

    function _getGuidsForVisibleLayers() {
        var visibleLayers = [];
        var layers = _getLayersWithGuid();
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (layer.getVisible() === true) {
                visibleLayers.push(layers[i]);
            }
        }

        visibleLayers.sort(_compareMapLayerIndex);
        var result = [];
        for(var j = 0; j < visibleLayers.length; j++){
            result.push(visibleLayers[j].guid);
        }
        return result.join(",");
    }

    function _compareMapLayerIndex(a, b) {
        if (a.mapLayerIndex < b.mapLayerIndex){
            return -1;
        }
        if (a.mapLayerIndex > b.mapLayerIndex){
            return 1;
        }
        return 0;
    }

    /*
        Layer functions End
     */

    /*
        Map Export Start
        Functionality in ISY.;ap.OL3.Export
     */

    var _resizeEvent = function(){
        mapExport.WindowResized(map);
    };

    function activateExport(options) {
        mapExport.Activate(options, map, redrawMap);
        window.addEventListener('resize', _resizeEvent, false);
    }

    function deactivateExport() {
        window.removeEventListener('resize', _resizeEvent, false);
        mapExport.Deactivate(redrawMap);
    }

    function exportMap(callback){
        mapExport.ExportMap(callback, map);
    }

    function redrawMap() {
        if (map) {
            map.updateSize();
        }
    }

    function refreshMap() {
        map.getLayers().forEach(function(layer){
            refreshLayer(layer);
        });
    }

    function refreshLayerByGuid(guid, featureObj){
        if (guid){
            refreshLayer(_getLayerFromPoolByGuid(guid), undefined, featureObj);
        }
    }

    function refreshIsyLayer(isySubLayer, featureObj){
        refreshLayer(_getLayerFromPool(isySubLayer), isySubLayer, featureObj);
    }

    function refreshLayer(layer, isySubLayer, featureObj){
        if (layer === undefined){
            return;
        }
        if (isySubLayer === undefined) {
            isySubLayer = _getIsySubLayerFromPool(layer);
        }
        if (isySubLayer === undefined){
            return;
        }
        var parameters;
        if (isyToken && isyToken.length > 0){
            parameters = {isyToken: isyToken};
        }
        var source;
        switch(isySubLayer.source){
            case ISY.Domain.SubLayer.SOURCES.wmts:
                source = new ISY.MapImplementation.OL3.Sources.Wmts(isySubLayer, parameters);
                break;
            case ISY.Domain.SubLayer.SOURCES.proxyWmts:
                source = new ISY.MapImplementation.OL3.Sources.Wmts(isySubLayer, parameters);
                break;
            case ISY.Domain.SubLayer.SOURCES.wms:
                source = new ISY.MapImplementation.OL3.Sources.Wms(isySubLayer, parameters);
                if (isySubLayer.gatekeeper && isySubLayer.tiled && ((offline === undefined) ? true : !offline.IsActive())){
                    _setToken(source);
                }
                break;
            case ISY.Domain.SubLayer.SOURCES.proxyWms:
                source = new ISY.MapImplementation.OL3.Sources.Wms(isySubLayer, parameters);
                break;
            case ISY.Domain.SubLayer.SOURCES.vector:
                source = new ISY.MapImplementation.OL3.Sources.Vector(isySubLayer);
                if (isySubLayer.url !== "") {
                    _loadVectorLayer(isySubLayer, source);
                }
                break;
            case ISY.Domain.SubLayer.SOURCES.wfs:
                parameters._olSalt = Math.random();
                source = new ISY.MapImplementation.OL3.Sources.Wfs(isySubLayer, offline, parameters, featureObj, eventHandler);
                break;
        }
        if (source) {
            layer.setSource(source);
        }
    }

    var setIsyToken = function(token){
        if (token.length === 0){
            return;
        }
        if (isyToken && isyToken === token){
            return;
        }
        isyToken = token;
        var parameters = {isyToken: isyToken};
        for (var i = 0; i < isySubLayerPool.length; i++) {
            isySubLayerPool[i].isyToken = isyToken;
            var isySubLayer = isySubLayerPool[i];
            var source;
            var layer = _getLayerFromPool(isySubLayer);
            var isVector = false;
            switch (isySubLayer.source) {
                case ISY.Domain.SubLayer.SOURCES.wms:
                case ISY.Domain.SubLayer.SOURCES.wmts:
                case ISY.Domain.SubLayer.SOURCES.proxyWms:
                case ISY.Domain.SubLayer.SOURCES.proxyWmts:
                    source = layer.getSource();
                    break;
                case ISY.Domain.SubLayer.SOURCES.vector:
                    isVector = true;
                    source = new ISY.MapImplementation.OL3.Sources.Vector(isySubLayer);
                    if (isySubLayer.url !== "") {
                        _loadVectorLayer(isySubLayer, source);
                    }
                    break;
                case ISY.Domain.SubLayer.SOURCES.wfs:
                    isVector = true;
                    source = new ISY.MapImplementation.OL3.Sources.Wfs(isySubLayer, offline, parameters);
                    break;
            }
            if (source) {
                if (isVector) {
                    layer.setSource(source);
                } else {
                    source.updateParams(parameters);
                }
            }
        }
    };

    var removeIsyToken = function(){
        isyToken = undefined;
        var parameters = {isyToken: ''};
        for (var i = 0; i < isySubLayerPool.length; i++) {
            isySubLayerPool[i].isyToken = isyToken;
            var isySubLayer = isySubLayerPool[i];
            var source;
            var layer = _getLayerFromPool(isySubLayer);
            var isVector = false;
            switch (isySubLayer.source) {
                case ISY.Domain.SubLayer.SOURCES.wms:
                case ISY.Domain.SubLayer.SOURCES.wmts:
                case ISY.Domain.SubLayer.SOURCES.proxyWms:
                case ISY.Domain.SubLayer.SOURCES.proxyWmts:
                    source = layer.getSource();
                    break;
                case ISY.Domain.SubLayer.SOURCES.vector:
                    isVector = true;
                    source = new ISY.MapImplementation.OL3.Sources.Vector(isySubLayer);
                    if (isySubLayer.url !== "") {
                        _loadVectorLayer(isySubLayer, source);
                    }
                    break;
                case ISY.Domain.SubLayer.SOURCES.wfs:
                    isVector = true;
                    source = new ISY.MapImplementation.OL3.Sources.Wfs(isySubLayer, offline);
                    break;
            }
            if (source) {
                if (isVector) {
                    layer.setSource(source);
                } else {
                    source.updateParams(parameters);
                }
            }
        }
    };

    function showCustomMessage(message){
        customMessageHandler.ShowCustomMessage(message);
    }

    function renderSync(){
        map.renderSync();
    }

    /*
        Map Export End
     */

    /*
        Feature Info Start
        Functionality in ISY.MapImplementation.OL3.FeatureInfo
     */

    function activateInfoClick(callback){
        featureInfo.ActivateInfoClick(callback, map);
    }

    function deactivateInfoClick(){
        featureInfo.DeactivateInfoClick(map);
    }

    function getFeatureInfoUrl(isySubLayer, coordinate){
        return proxyHost + featureInfo.GetFeatureInfoUrl(isySubLayer, _getLayerFromPool(isySubLayer), coordinate, map.getView());
    }

    function showHighlightedFeatures(layerguid, features){
        featureInfo.ShowHighlightedFeatures(_getFeaturesAndAddHoverStyle(layerguid, features), map);
    }

    function clearHighlightedFeatures(){
        featureInfo.ClearHighlightedFeatures();
    }

    function showInfoMarker(coordinate, element){
        featureInfo.ShowInfoMarker(coordinate, element, map);
    }

    function showInfoMarkers(coordinates, element){
        featureInfo.ShowInfoMarkers(coordinates, element, map);
    }

    function removeInfoMarker(element){
        featureInfo.RemoveInfoMarker(element, map);
    }

    function removeInfoMarkers(element){
        featureInfo.RemoveInfoMarkers(element, map);
    }

    function setHighlightStyle(style){
        featureInfo.SetHighlightStyle(style);
    }

    function activateBoxSelect(callback){
        featureInfo.ActivateBoxSelect(callback, map);
    }

    function deactivateBoxSelect(){
        featureInfo.DeactivateBoxSelect(map);
    }

    function initEdit(isySubLayer) {
        if (isySubLayer.featureNS === '' || isySubLayer.featureNS === undefined){
            //_describeFeature(isySubLayer);
            return false;
        }
        var layerFromPool = _getLayerFromPool(isySubLayer);
        if (layerFromPool != null){
            featureEditor.Init(
                isySubLayer.url,
                isySubLayer.name,
                isySubLayer.featureNS,
                isySubLayer.coordinate_system,
                layerFromPool.getSource(),
                isySubLayer.geometryName
            );
            return true;
        }else{
            _createLayer(isySubLayer);
            initEdit(isySubLayer);
        }
    }

    Array.prototype.where = function(matcher) {
        var result = [];
        for (var i = 0; i < this.length; i++) {
            if (matcher(this[i])) {
                result.push(this[i]);
            }
        }
        return result;
    };

    function _getElementsByAttribute(tag, attr, attrValue, response, exactName) {
        //Get elements and convert to array
        var elems = Array.prototype.slice.call(response.getElementsByTagName(tag), 0);

        var matcher = function(el) {
            if (exactName){
                return el.getAttribute(attr).toLowerCase() === attrValue.toLowerCase();
            }else{
                return el.getAttribute(attr).indexOf(attrValue) > -1 || attrValue.indexOf(el.getAttribute(attr)) > -1;
            }
        };

        return elems.where(matcher);
    }


    function _parseResponse(response){

        var subLayerName = describedSubLayer.name.split(":");
        if (subLayerName.length > 0){
            subLayerName = subLayerName[subLayerName.length - 1];
        }else{
            return;
        }

        var elementNodeByName = _getElementsByAttribute("element", "name", subLayerName, response, true)[0];

        var elementGeometryName = _getElementsByAttribute("element", "type", isyLayerGeometryType, elementNodeByName, false)[0];

        if (elementGeometryName === undefined){
            return;
        }else{
            elementGeometryName = elementGeometryName.getAttribute("name");
        }

        var featureNamespace = response.firstChild.getAttribute("targetNamespace");

        if (typeof describedSource.format == 'undefined') {
            var gmlFormat;
            switch (describedSubLayer.version) {
                case '1.0.0':
                    gmlFormat = new ol.format.GML2();
                    break;
                case '1.1.0':
                    gmlFormat = new ol.format.GML3();
                    break;
                case '2.0.0':
                    gmlFormat = new ol.format.GML3();
                    break;
                default:
                    gmlFormat = new ol.format.GML();
                    break;
            }

            describedSource.format = new ol.format.WFS({
                featureType: describedSubLayer.providerName,
                featureNS: featureNamespace,
                gmlFormat: gmlFormat
            });
        }

        describedSubLayer.featureNS = featureNamespace;
        describedSubLayer.geometryName = elementGeometryName;

        eventHandler.TriggerEvent(ISY.Events.EventTypes.FeatureHasBeenDescribed, [describedSubLayer, describedSource]);
    }

    function describeFeature(isySubLayer, geometryType) {
        describedSubLayer = isySubLayer;
        isyLayerGeometryType = geometryType;
        var projection = ol.proj.get(isySubLayer.coordinate_system);
        describedSource = new ol.source.Vector({
            projection: projection
        });
        describedSource.set('type', 'ol.source.Vector');
        var url = isySubLayer.url;
        if (Array.isArray(isySubLayer.url)){
            url = isySubLayer.url[0];
        }
        if (url.toLowerCase().indexOf("service=wfs") < 0){
            url += "service=WFS&";
        }
        url += 'request=DescribeFeatureType&' +
            'version=' + isySubLayer.version + '&typename=' + isySubLayer.name;

        $.ajax({
            url: url
        }).done(function(response) {
            _parseResponse(response);
        });
    }

    function activateEditSelect(callback) {
        featureEditor.ActivateEditSelect(callback, map);
    }

    function deactivateEditSelect() {
        featureEditor.DeactivateEditSelect(map);
    }

    function handlePointSelect(coordinate) {
        featureEditor.HandlePointSelect(coordinate);
    }

    function updateFeature(feature) {
        featureEditor.UpdateFeature(feature);
    }

    function insertFeature(feature, source){
        return featureEditor.InsertFeature(feature, source);
    }

    function deleteFeature(feature){
        return featureEditor.DeleteFeature(feature);
    }

    function getExtentForCoordinate(coordinate, pixelTolerance){
        return featureInfo.GetExtentForCoordinate(coordinate, pixelTolerance, map.getView().getResolution());
    }

    function getFeaturesInExtent(isySubLayer, extent){
        return featureInfo.GetFeaturesInExtent(extent, _getLayerFromPool(isySubLayer), map.getView().getResolution());
    }

    function getFeatureCollection(isySubLayer){
        return featureInfo.GetFeatureCollection(_getLayerFromPool(isySubLayer));
    }

    function getFeaturesInMap(isySubLayer){
        return featureInfo.GetFeaturesInMap(_getLayerFromPool(isySubLayer));
    }

    function getLayerByFeature(feature){
        return _getLayerFromPoolByFeature(feature);
    }

    function getHoverStyle(feature, resolution){
        //var featureId = feature.getId();
        //if (featureId.indexOf('.') > 0) {
        //    featureId = featureId.slice(0, featureId.indexOf('.'));
        //}
        //else {
        //    var tempFeatureId = featureId.substr(0,featureId.indexOf('_')) + ':' + featureId.substr(featureId.indexOf('_') + 1);
        //    featureId = tempFeatureId.slice(0, tempFeatureId.indexOf('_'));
        //}
        var layer = this.GetLayerByFeature(feature);
        if (layer){
            if (sldstyles[layer.guid]) {
                return sldstyles[layer.guid].GetHoverStyle(feature, _getScaleByResolution(resolution));
            } else {
                return layer.getStyle ? layer.getStyle() : undefined;
            }
        }
    }

    function _getFeaturesAndAddHoverStyle(layerguid, features){
        if (layerguid === undefined) {
            return features;
        }
        var scale = _getScaleByResolution(map.getView().getResolution());
        var feature;
        var featureAttribute = function(attr){
            for (var j = 0; j < feature.attributes.length; j++){
                if (attr === feature.attributes[j][0]){
                    return feature.attributes[j][1];
                }
            }
        };
        for (var i = 0; i < features.length; i++){
            feature = features[i];
            if (features[i].get === undefined){
                features[i].get = featureAttribute;
            }
            var hoverstyle = sldstyles[layerguid].GetHoverStyle(features[i], scale);
            if (hoverstyle) {
                features[i].hoverstyle = hoverstyle;
            }
        }
        return features;
    }

    function getFeatureExtent(feature){
        return featureInfo.GetFeatureExtent(feature);
    }
    /*
        Feature Info End
     */

    /*
     HoverInfo Start
     */

    function activateHoverInfo(callback){
        hoverInfo.ActivateHoverInfo(map, callback, this, hoverOptions);
    }

    function deactivateHoverInfo(){
        hoverInfo.DeactivateHoverInfo(map);
    }

    /*
     HoverInfo End
     */

    /*
     Measure Start
     Functionality in ISY.MapImplementation.OL3.Measure
     */
    function activateMeasure(callback, options){
        measure.Activate(map, callback, options);
    }

    function deactivateMeasure(){
        measure.Deactivate(map);
    }

    function activateMeasureLine(callback, options){
        measureLine.Activate(map, callback, options);
        //var vector = measure.Activate(map, callback);

    }

    function deactivateMeasureLine(){
        measureLine.Deactivate(map);
    }

    /*
     Measure End
     */

    /*
     AddLayerFeature Start
     Functionality in ISY.MapImplementation.OL3.AddLayerFeature
     */
    function activateAddLayerFeature(options){
        addLayerFeature.Activate(map, options);
    }

    function deactivateAddLayerFeature(){
        addLayerFeature.Deactivate(map);
    }

    /*
     AddLayerFeature End
     */

    /*
     AddFeatureGps Start
     Functionality in ISY.MapImplementation.OL3.AddFeatureGps
     */
    function activateAddFeatureGps(options){
        addFeatureGps.Activate(map, options);
    }

    function addCoordinatesGps(coordinates){
        addFeatureGps.AddCoordinates(coordinates);
    }

    function deactivateAddFeatureGps(){
        addFeatureGps.Deactivate(map);
    }

    /*
     AddLayerFeature End
     */


    /*
     Modify Feature Start
     */

    function activateModifyFeature(options){
        modifyFeature.Activate(map, options);
    }

    function deactivateModifyFeature(){
        modifyFeature.Deactivate(map);
    }

    /*
     Modify Feature End
     */


    /*
     DrawFeature Start
     */

    function activateDrawFeature(callback, options){
        drawFeature.Activate(map, callback, options);
    }

    function deactivateDrawFeature(){
        drawFeature.Deactivate(map);
    }

    /*
     DrawFeature End
     */

    /*
     Offline Start
     Functionality in ISY.MapImplementation.OL3.Offline
     */

    function _initOffline() {
        if (offline) {
            offline.Init(map, eventHandler);
        }
    }

    function activateOffline() {
        if (offline) {
            offline.Activate();
        }
    }

    function startCaching(zoomLevelMin, zoomLevelMax, extentView) {
        if (offline) {
            offline.StartCaching(zoomLevelMin, zoomLevelMax, extentView, eventHandler);
        }
    }

    function stopCaching(){
        offline.StopCaching();
    }

    function deleteDatabase(callback, zoomlevels, eventhandler){
        offline.DeleteDatabase(callback, zoomlevels, eventhandler);
    }

    function cacheDatabaseExist(){
        return offline.CacheDatabaseExist();
    }

    function calculateTileCount(zoomLevelMin, zoomLevelMax, extentView){
        if (offline){
           return offline.CalculateTileCount(zoomLevelMin, zoomLevelMax, extentView);
        }
    }

    function getResource(url, contentType, callback) {
        if (offline) {
            offline.GetResource(url, contentType, callback);
        }
    }

    function getConfigResource(url, contentType, callback) {
        if (offline) {
            offline.GetConfigResource(url, contentType, callback);
        }
    }

    function getResourceFromJson(url, contentType, callback){
        if (offline){
            offline.GetResourceFromJson(url, contentType, callback);
        }
    }



    function getLayerResource(key, name, url) {
        if (offline) {
            offline.GetLayerResource(key, name, url);
        }
    }

    function deactivateOffline() {
        if (offline) {
            offline.Deactivate();
        }
    }

    /*
     Offline End
     */


    /*
      PrintBoxSelect Start
     */
    var activatePrintBoxSelect = function (options){
        printBoxSelect.Activate(map, options);
    } ;

    var deactivatePrintBoxSelect = function (){
        printBoxSelect.Deactivate(map);
    } ;

    /*
        Utility functions start
     */

    var _getUrlObject = function(){
        if (map !== undefined){
            var retVal = {
                layers: _getGuidsForVisibleLayers()
            };

            var view = map.getView();
            var center = view.getCenter();
            var zoom = view.getZoom();
            if(zoom){
                retVal.zoom = zoom.toString();
            }
            if(center){
                retVal.lat = center[1].toFixed(2);
                retVal.lon = center[0].toFixed(2);
            }
            return retVal;
        }
    };

    var zoomToLayer = function(isySubLayer){
        var layer = _getLayerFromPool(isySubLayer);
        if (layer){
            var extent = layer.getSource().getExtent();
            if (Array.isArray(extent) && extent[0] != Infinity) {
                map.getView().fit(extent, map.getSize());
            }
        }
    };

    var zoomToLayers = function(isySubLayers){
        var layersExtent = [Infinity, Infinity, -Infinity, -Infinity];
        var setNewExtent = function(newExtent){
            if (layersExtent[0] > newExtent[0]){
                layersExtent[0] = newExtent[0];
            }
            if (layersExtent[1] > newExtent[1]){
                layersExtent[1] = newExtent[1];
            }
            if (layersExtent[2] < newExtent[2]){
                layersExtent[2] = newExtent[2];
            }
            if (layersExtent[3] < newExtent[3]){
                layersExtent[3] = newExtent[3];
            }
        };
        isySubLayers.forEach(function(isySubLayer){
            var layer = _getLayerFromPool(isySubLayer);
            if (layer){
                var extent = layer.getSource().getExtent();
                if (Array.isArray(extent) && extent[0] != Infinity) {
                    setNewExtent(extent);
                }
            }
        });
        if (Array.isArray(layersExtent) && layersExtent[0] != Infinity) {
            map.getView().fit(layersExtent, map.getSize());
        }
    };

    var fitExtent = function(extent){
        map.getView().fit(extent, map.getSize());
    };

    var getCenter = function(){
        var retVal;
        var view = map.getView();
        var center = view.getCenter();
        var zoom = view.getZoom();
        retVal = {
            lon: center[0],
            lat: center[1],
            zoom: zoom
        };
        return retVal;
    };

    var setCenter = function(center) {
        var view = map.getView();
        if (center.epsg){
            center = transformEpsgCoordinate(center, getEpsgCode());
        }
        view.setCenter([center.lon, center.lat]);
        if (center.zoom) {
            view.setZoom(center.zoom);
        }
    };

    var getZoom = function(){
        var view = map.getView();
        return view.getZoom();
    };

    var setZoom = function(zoom){
        var view = map.getView();
        return view.setZoom(zoom);
    };

    var getRotation = function(){
        var view = map.getView();
        return view.getRotation();
    };

    var setRotation = function(angle, anchor){
        var view = map.getView();
        if (anchor) {
            view.rotate(angle, anchor);
        } else {
            view.setRotation(angle);
        }
    };

    var getEpsgCode = function() {
        var view = map.getView();
        var projection = view.getProjection();
        return projection.getCode();
    };

    function transformEpsgCoordinate(coord, toCrs){
        if(coord.epsg !== "" && toCrs !== "" && coord.epsg != toCrs){
            //var fromProj = ol.proj.get(coord.epsg);
            //var toProj = ol.proj.get(toCrs);
            var transformedCoord = ol.proj.transform([coord.lon, coord.lat], coord.epsg, toCrs);

            if(toCrs === "EPSG:4326"){
                transformedCoord = [transformedCoord[1], transformedCoord[0]];
            }
            coord.lon = transformedCoord[0];
            coord.lat = transformedCoord[1];
            coord.epsg = toCrs;
        }

        return coord;
    }

    function transformBox(fromCrs, toCrs, boxExtent){
        var returnExtent = boxExtent;
        if(fromCrs !== "" && toCrs !== "" && fromCrs != toCrs){
            //var fromProj = ol.proj.get(fromCrs);
            //var toProj = ol.proj.get(toCrs);
            //var transformedExtent = ol.proj.transformExtent(boxExtent, fromProj, toProj);
            var transformedExtent = ol.proj.transformExtent(boxExtent, fromCrs, toCrs);

            returnExtent = transformedExtent;
            if(toCrs === "EPSG:4326"){
                returnExtent = transformedExtent[1] + "," + transformedExtent[0] + "," + transformedExtent[3] + "," + transformedExtent[2];
            }
        }

        return returnExtent;
    }

    function convertGmlToGeoJson(gml){
        var xmlParser = new ol.format.WMSCapabilities();
        var xmlFeatures = xmlParser.read(gml);
        var gmlParser = new ol.format.GML();
        var features = gmlParser.readFeatures(xmlFeatures);
        var jsonParser = new ol.format.GeoJSON();
        return jsonParser.writeFeatures(features);
    }

    function extentToGeoJson(x, y){
        var point = new ol.geom.Point([x, y]);
        var feature = new ol.Feature();
        feature.setGeometry(point);
        var geoJson = new ol.format.GeoJSON();
        return geoJson.writeFeature(feature);
    }

    function addZoom() {
        var zoom = new ol.control.Zoom();
        map.addControl(zoom);
    }

    function addZoomSlider() {
        var zoomslider = new ol.control.ZoomSlider();
        map.addControl(zoomslider);
    }

    function addZoomToExtent(extent) {
        var zoomToExtent = new ol.control.ZoomToExtent({"extent": extent});
        map.addControl(zoomToExtent);
    }

    var getVectorLayers = function(isySubLayer, data){
        var vectors = [];
        var source = ISY.MapImplementation.OL3.Sources.Vector(isySubLayer.subLayers[0], map.getView().getProjection());

        var fromProj = ol.proj.get(isySubLayer.subLayers[0].coordinate_system);
        var toProj = ol.proj.get(source.getProjection().getCode());
        var features = source.parser.readFeatures(data);
        for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            feature.getGeometry().transform(fromProj, toProj);
            vectors.push(feature);
        }

        return vectors;
    };

    var getLayerCount = function(){
        if (map) {
            return map.getLayers().getArray().length;
        }
        return 0;
    };

    var getCenterFromExtent = function(extent){
      return ol.extent.getCenter(extent);
    };

    var getScale = function(){
        return mapScales[map.getView().getZoom()];
    };

    var getLegendStyleFromLayer = function(layer){
            if (sldstyles[layer.guid] !== undefined){
                return sldstyles[layer.guid].GetStyleForLegend();
            }else{
                return undefined;
            }
    };

    var getExtent = function(){
        return map.getView().calculateExtent(map.getSize());
    };

    var getUrlObject = function(){
        return _getUrlObject();
    };

    function _addGeolocationLayer(guid) {
        var geolocationLayer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            projection: map.getView().getProjection()
        });
        geolocationLayer.guid = guid;
        map.addLayer(geolocationLayer);
        _trigLayersChanged();
    }

    function _drawGeolocation(center, radius){
        var geolocationLayer = _getLayerByGuid(99999);
        if (geolocationLayer !== null){
            var geolocationSource = geolocationLayer.getSource();
            geolocationSource.clear();
            var geolocationStyle = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 6,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255,255,255,0.8)',
                        width: 2
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(32,170,172,0.8)'
                    })
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(0,102,204,0.15)'
                }),
                zIndex: Infinity
            });
            var geolocationFeature = new ol.Feature({
                geometry: new ol.geom.GeometryCollection([
                    new ol.geom.Point(center),
                    new ol.geom.Circle(center, parseInt(radius, 10))
                ]),
                name: 'geolocation_center'
            });
            geolocationFeature.setStyle(geolocationStyle);
            geolocationSource.addFeature(geolocationFeature);
            if (initialGeolocationChange){
                initialGeolocationChange = false;
                var geolocextent = geolocationFeature.getGeometry().getExtent();
                geolocextent[0] -= 5*radius;
                geolocextent[1] -= 5*radius;
                geolocextent[2] += 5*radius;
                geolocextent[3] += 5*radius;
                map.getView().fit(geolocextent, map.getSize());
            }
        }
    }

    function _geolocationChange(){
        var view = map.getView();
        var center = geolocation.getPosition();
        if (center === undefined){
            return;
        }
        view.setCenter(center);
        _drawGeolocation(center, geolocation.getAccuracy());
        var geolocationObject = {
            center: center,
            accuracy: Math.round(geolocation.getAccuracy()*10)/10,
            altitude: geolocation.getAltitude(),
            altitudeAccuracy: geolocation.getAltitudeAccuracy(),
            heading: geolocation.getHeading(),
            speed: geolocation.getSpeed()
        };
        eventHandler.TriggerEvent(ISY.Events.EventTypes.GeolocationUpdated, geolocationObject);
    }

    var getGeolocation = function(){
        var view = map.getView();
        var mapProjection = view.getProjection();
        geolocation = new ol.Geolocation({
            projection:  mapProjection,
            tracking: true,
            trackingOptions: {
                //enableHighAccuracy: true,
                //timeout: 5000,
                maximumAge: 0
            }
        });

        _addGeolocationLayer(99999);

        initialGeolocationChange = true;

        geolocation.on('change:position', _geolocationChange);
        geolocation.on('change:accuracy', _geolocationChange);
    };

    var removeGeolocation = function(){
        var geolocationLayer = _getLayerByGuid(99999);
        if (geolocationLayer !== null){
            map.removeLayer(geolocationLayer);
            _trigLayersChanged();
        }

        if (geolocation !== undefined){
            geolocation.un('change:position', _geolocationChange);
            geolocation.un('change:accuracy', _geolocationChange);
            geolocation = undefined;
        }
    };

    var getProxyHost = function(){
        return proxyHost;
    };

    var setTranslateOptions = function(translate){
        translateOptions = translate;
    };

    var transformCoordinates = function(fromEpsg, toEpsg, coordinates){
        if (proj4.defs(fromEpsg) && proj4.defs(toEpsg)) {
            var transformObject = proj4(fromEpsg, toEpsg);
            return transformObject.forward(coordinates);
        }
    };

    var transformFromGeographic = function(coordinates){
        // If no coordinates are given an object with two methods is returned,
        // its methods are forward which projects from the first projection to
        // the second and inverse which projects from the second to the first.
        var fromEpsg = getEpsgCode();
        if (proj4.defs(fromEpsg)) {
            var transformObject = proj4(fromEpsg);
            return transformObject.forward(coordinates);
        }
    };

    var transformToGeographic = function(coordinates){
        // If no coordinates are given an object with two methods is returned,
        // its methods are forward which projects from the first projection to
        // the second and inverse which projects from the second to the first.
        var fromEpsg = getEpsgCode();
        if (proj4.defs(fromEpsg)) {
            var transformObject = proj4(fromEpsg);
            return transformObject.inverse(coordinates);
        }
    };

    /*
        Utility functions End
     */

    return {
        // Start up start
        InitMap: initMap,
        ChangeView: changeView,
        // Start up end

        /***********************************/

        // Layer start
        AddDataToLayer: addDataToLayer,
        RemoveDataFromLayer: removeDataFromLayer,
        ClearLayer: clearLayer,
        ShowLayer: showLayer,
        ShowBaseLayer: showBaseLayer,
        HideLayer: hideLayer,
        GetLayerByName: getLayerByName,
        SetLayerOpacity: setLayerOpacity,
        SetLayerSaturation: setLayerSaturation,
        SetLayerHue: setLayerHue,
        SetLayerBrightness: setLayerBrightness,
        SetLayerContrast: setLayerContrast,
        MoveLayerToIndex: moveLayerToIndex,
        GetLayerIndex: getLayerIndex,
        GetLegendStyles: getLegendStyles,
        RefreshLayer: refreshLayer,
        RefreshIsyLayer: refreshIsyLayer,
        // Layer end

        /***********************************/

        // Export start
        RedrawMap: redrawMap,
        RefreshMap: refreshMap,
        RefreshLayerByGuid: refreshLayerByGuid,
        RenderSync: renderSync,
        ExportMap: exportMap,
        ActivateExport: activateExport,
        DeactivateExport: deactivateExport,
        // Export end

        /***********************************/

        // Feature Info start
        ActivateInfoClick: activateInfoClick,
        DeactivateInfoClick: deactivateInfoClick,
        GetInfoUrl: getFeatureInfoUrl,
        ShowHighlightedFeatures: showHighlightedFeatures,
        ClearHighlightedFeatures: clearHighlightedFeatures,
        ShowInfoMarker: showInfoMarker,
        ShowInfoMarkers: showInfoMarkers,
        SetHighlightStyle: setHighlightStyle,
        RemoveInfoMarker: removeInfoMarker,
        RemoveInfoMarkers: removeInfoMarkers,
        ActivateBoxSelect: activateBoxSelect,
        DeactivateBoxSelect: deactivateBoxSelect,
        GetFeaturesInExtent: getFeaturesInExtent,
        GetExtentForCoordinate: getExtentForCoordinate,
        GetFeatureCollection: getFeatureCollection,
        GetFeatureExtent: getFeatureExtent,
        GetFeaturesInMap: getFeaturesInMap,
        GetLayerByFeature: getLayerByFeature,
        GetHoverStyle: getHoverStyle,
        GetLegendStyleFromLayer: getLegendStyleFromLayer,
        // Feature Info end

        /***********************************/

        // Feature edit start
        InitEdit: initEdit,
        ActivateEditSelect: activateEditSelect,
        DeactivateEditSelect: deactivateEditSelect,
        HandlePointSelect: handlePointSelect,
        UpdateFeature: updateFeature,
        InsertFeature: insertFeature,
        DeleteFeature: deleteFeature,
        // Feature edit end

        /***********************************/

        // Hover Info start
        ActivateHoverInfo: activateHoverInfo,
        DeactivateHoverInfo: deactivateHoverInfo,
        // Hover Info end

        /***********************************/

        // Measure start
        ActivateMeasure: activateMeasure,
        DeactivateMeasure: deactivateMeasure,
        // Measure end

        /***********************************/

        // Measure line start
        ActivateMeasureLine: activateMeasureLine,
        DeactivateMeasureLine: deactivateMeasureLine,
        // Measure line end

        /***********************************/

        // AddLayerFeature start
        ActivateAddLayerFeature: activateAddLayerFeature,
        DeactivateAddLayerFeature: deactivateAddLayerFeature,
        // AddLayerFeature end

        /***********************************/

        // AddFeatureGps start
        ActivateAddFeatureGps: activateAddFeatureGps,
        AddCoordinatesGps: addCoordinatesGps,
        DeactivateAddFeatureGps: deactivateAddFeatureGps,
        // AddLayerFeature end

        /***********************************/

        // ModifyFeature start
        ActivateModifyFeature: activateModifyFeature,
        DeactivateModifyFeature: deactivateModifyFeature,
        // ModifyFeature end

        /***********************************/

        // DrawFeature start
        ActivateDrawFeature: activateDrawFeature,
        DeactivateDrawFeature: deactivateDrawFeature,
        // DrawFeature end

        /***********************************/

        // Offline startS
        ActivateOffline: activateOffline,
        StartCaching: startCaching,
        StopCaching: stopCaching,
        DeleteDatabase: deleteDatabase,
        CacheDatabaseExist: cacheDatabaseExist,
        CalculateTileCount: calculateTileCount,
        GetResource: getResource,
        GetConfigResource: getConfigResource,
        GetLayerResource: getLayerResource,
        DeactivateOffline: deactivateOffline,
        GetResourceFromJson: getResourceFromJson,
        // Offline end

        /***********************************/

        // PrintBoxSelect Start
        ActivatePrintBoxSelect: activatePrintBoxSelect,
        DeactivatePrintBoxSelect: deactivatePrintBoxSelect,
        // PrintBoxSelect End

        /***********************************/

        // Utility start
        TransformBox: transformBox,
        ConvertGmlToGeoJson: convertGmlToGeoJson,
        ExtentToGeoJson: extentToGeoJson,
        AddZoom: addZoom,
        AddZoomSlider: addZoomSlider,
        AddZoomToExtent: addZoomToExtent,
        ZoomToLayer: zoomToLayer,
        ZoomToLayers: zoomToLayers,
        FitExtent: fitExtent,
        GetCenter: getCenter,
        SetCenter: setCenter,
        GetZoom: getZoom,
        SetZoom: setZoom,
        GetRotation: getRotation,
        SetRotation: setRotation,
        GetEpsgCode: getEpsgCode,
        GetVectorLayers: getVectorLayers,
        GetLayerCount: getLayerCount,
        GetCenterFromExtent: getCenterFromExtent,
        GetScale: getScale,
        SortLayerBySortIndex: sortLayerBySortIndex,
        UpdateLayerSortIndex: updateLayerSortIndex,
        GetExtent: getExtent,
        GetUrlObject: getUrlObject,
        GetGeolocation: getGeolocation,
        RemoveGeolocation: removeGeolocation,
        GetProxyHost: getProxyHost,
        SetTranslateOptions: setTranslateOptions,
        TransformCoordinates: transformCoordinates,
        TransformFromGeographic: transformFromGeographic,
        TransformToGeographic: transformToGeographic,
        DescribeFeature: describeFeature,
        RemoveIsyToken: removeIsyToken,
        SetIsyToken: setIsyToken,
        ShowCustomMessage: showCustomMessage
        // Utility end
    };
};

ISY.MapImplementation.OL3.Map.RENDERERS = {
    canvas: 'canvas',
    webgl: 'webgl'
};
var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.Measure = function(eventHandler){

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
    var pointerMoveHandler = function(evt) {
        if (evt.dragging || !isActive) {
            return;
        }
        /** @type {string} */
        var helpMsg = translate['start_measure'];//'Click to start drawing';

        if (sketch) {
            var geom = (sketch.getGeometry());
            if (geom instanceof ol.geom.Polygon) {
                helpMsg = translate['continue_measure'];//continuePolygonMsg;
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
        var type ='Polygon';// (typeSelect.value == 'area' ? 'Polygon' : 'LineString');
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
            function(evt) {
                // set sketch
                sketch = evt.feature;

                var firstPoint = sketch.getGeometry().getCoordinates()[0][0];
                circleFeature = new ol.Feature(new ol.geom.Circle(firstPoint, 0));
                circleOverlay.getSource().addFeature(circleFeature);

                /** @type {ol.Coordinate|undefined} */
                var tooltipCoord = evt.coordinate;

                listener = sketch.getGeometry().on('change', function(evt) {
                    var geom = evt.target;
                    var output;
                    var circleArea;
                    if (geom instanceof ol.geom.Polygon) {
                        output = formatArea(/** @type {ol.geom.Polygon} */ (geom));
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                        _formatPolygonLength(geom);
                        var circleGeom = _drawCircle(geom);
                        if (circleGeom !== null){
                            circleArea = formatArea(circleGeom);
                        }
                    } else if (geom instanceof ol.geom.LineString) {
                        output = formatLength( /** @type {ol.geom.LineString} */ (geom));
                        tooltipCoord = geom.getLastCoordinate();
                    }
                    var circleCoordinates = geom.getCoordinates()[0];
                    if (circleCoordinates.length == 2){
                        measureTooltipElement.innerHTML = circleArea.string;
                    }else{
                        measureTooltipElement.innerHTML = output.string;
                    }

                    eventHandler.TriggerEvent(ISY.Events.EventTypes.MeasureMouseMove, output);
                    measureTooltip.setPosition(tooltipCoord);
                });
            }, this);

        draw.on('drawend',
            function() {
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

    function _drawCircle(geom){
        var circleCoordinates = geom.getCoordinates()[0];
        if (circleCoordinates.length == 2) {
            circleFeature.getGeometry().setRadius(circleRadius);
            return Math.PI * Math.pow(circleRadius, 2);
        }
        else{
            circleFeature.getGeometry().setRadius(0);
            return null;
        }
    }

    function _formatPolygonLength(polygon){
            return _formatLength(polygon.getCoordinates()[0]);
        }

    /**
     * Creates a new help tooltip
     */
    function createHelpTooltip(map) {
        if (helpTooltipElement) {
            if (helpTooltipElement.parentNode !== null){
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
            if (measureTooltipElement.parentNode !== null){
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
    function _formatLength (coordinates) {
        var length = _getLength(coordinates);
        circleRadius = length;
        length = Math.round(length*100)/100;
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

    var formatLength = function(line) {
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

    function _getLength(coordinates){
        var length;
        if(coordinates.length > 0){
            var stride = coordinates[0].length; // 2D or 3D
            var flatCoordinates = _flatternCoordinates(coordinates);
            length = _getFlatLength(flatCoordinates, 0, flatCoordinates.length, stride);
        }
        return length;
    }

    function _flatternCoordinates(coordinates){
        var flatCoordinates = [];
        for(var i = 0; i < coordinates.length; i++){
            var thisCoordinate = coordinates[i];
            for(var j = 0; j < thisCoordinate.length; j++){
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
    var formatArea = function(polygon) {
            var output;
            var unit;
            var value;
            var area;// = polygon.getArea();
            if (polygon.getArea === undefined){
                area = polygon;
            }else{
                area = polygon.getArea();
            }


            if (area > 100000) {
                unit = 'km<sup>2</sup>';
                value = Math.round(area / 1000000 * 100) / 100;
                output = value + ' ' + unit;
            }else if(area < 100000 && area > 1000){
                unit = 'da';
                value = Math.round(area / 1000 * 100) / 100;
                output = value + ' ' + unit;
            } else {
                unit = 'm<sup>2</sup>';
                value = Math.round(area * 100) / 100;
                output = value + ' ' + unit;
            }
            return  {
                string: output,
                unit: unit,
                value: value,
                order: 2
            };
    };

    function  activate(map, options){
        isActive = true;
        translate = options.translate;
        map.on('pointermove', pointerMoveHandler);

        $(map.getViewport()).on('mouseout', function() {
            $(helpTooltipElement).addClass('hidden');
        });
        addInteraction(map);
    }

    function deactivate(map){
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
                while(tooltipStaticElements.length > 0){
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
var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.MeasureLine = function(eventHandler){

    var isActive = false;
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
    var continuePolygonMsg = 'Click to continue drawing the polygon';


    /**
     * Message to show when the user is drawing a line.
     * @type {string}
     */
    //var continueLineMsg = 'Click to continue drawing the line';


    /**
     * Handle pointer move.
     * @param {ol.MapBrowserEvent} evt
     */
    var pointerMoveHandler = function(evt) {
        if (evt.dragging || !isActive) {
            return;
        }
        /** @type {string} */
        var helpMsg = translate['start_measure_line'];//'Click to start drawing';

        if (sketch) {
            var geom = (sketch.getGeometry());
            if (geom instanceof ol.geom.Polygon) {
                helpMsg = continuePolygonMsg;
            } else if (geom instanceof ol.geom.LineString) {
                helpMsg = translate['continue_measure_line'];
            }
        }
        helpTooltipElement.innerHTML = helpMsg;
        helpTooltip.setPosition(evt.coordinate);

        $(helpTooltipElement).removeClass('hidden');
    };

    var draw; // global so we can remove it later
    var drawLayer;
    function addInteraction(map) {
        var type ='LineString';// (typeSelect.value == 'area' ? 'Polygon' : 'LineString');
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
            function(evt) {
                // set sketch
                sketch = evt.feature;

                /** @type {ol.Coordinate|undefined} */
                var tooltipCoord = evt.coordinate;

                listener = sketch.getGeometry().on('change', function(evt) {
                    var geom = evt.target;
                    var output;
                    if (geom instanceof ol.geom.Polygon) {
                        output = formatArea(/** @type {ol.geom.Polygon} */ (geom));
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    } else if (geom instanceof ol.geom.LineString) {
                        output = formatLength( /** @type {ol.geom.LineString} */ (geom));
                        tooltipCoord = geom.getLastCoordinate();
                    }
                    measureTooltipElement.innerHTML = output.string;
                    eventHandler.TriggerEvent(ISY.Events.EventTypes.MeasureMouseMove, output);
                    measureTooltip.setPosition(tooltipCoord);
                });
            }, this);

        draw.on('drawend',
            function() {
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


    /**
     * Creates a new help tooltip
     */
    function createHelpTooltip(map) {
        if (helpTooltipElement) {
            if (helpTooltipElement.parentNode !== null){
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
            if (measureTooltipElement.parentNode !== null){
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
    var formatLength = function(line) {
        var length = Math.round(line.getLength() * 100) / 100;
        var output;
        var unit;
        var value;
        if (length > 1000) {
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
            value: value,
            order: 1
        };
    };


    /**
     * format length output
     * @param {ol.geom.Polygon} polygon
     * @return {string}
     */
    var formatArea = function(polygon) {
        var area = polygon.getArea();
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

    function  activate(map, options){
        isActive = true;
        translate = options.translate;
        map.on('pointermove', pointerMoveHandler);

        $(map.getViewport()).on('mouseout', function() {
            $(helpTooltipElement).addClass('hidden');
        });
        addInteraction(map);
    }

    function deactivate(map){
            if (isActive) {
                isActive = false;
                if (map !== undefined) {
                    map.removeLayer(drawLayer);
                    measureTooltipElement.className = 'tooltip tooltip-static';
                    measureTooltip.setOffset([0, -7]);
                    measureTooltipElement = null;
                    map.removeInteraction(draw);
                    map.removeOverlay(measureTooltip);
                    map.removeOverlay(helpTooltip);
                    if (helpTooltipElement) {
                        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
                    }
                    if (measureTooltipElement) {
                        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
                    }
                    var tooltipStaticElements = document.getElementsByClassName('tooltip tooltip-static');
                    while(tooltipStaticElements.length > 0){
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
var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.ModifyFeature = function(eventHandler){

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
    var pointerMoveHandler = function(evt) {
        if (!isActive) {
            return;
        }
        /** @type {string} */
        var helpMsg = translate['start_modify'];//'Click to start drawing';

        //if (sketch) {
        //    var geom = (sketch.getGeometry());
        //    if (geom instanceof ol.geom.Polygon) {
        //        helpMsg = translate['continue_drawing'];//continuePolygonMsg;
        //    } else if (geom instanceof ol.geom.LineString) {
        //        helpMsg = continueLineMsg;
        //    }
        //}
        if (helpTooltipElement !== undefined){
        helpTooltipElement.innerHTML = helpMsg;
        helpTooltip.setPosition(evt.coordinate);

        $(helpTooltipElement).removeClass('hidden');
        }
    };

    var modify; // global so we can remove it later
    var snapping;

    function addInteraction(map) {
        if (typeObject === "Line"){
            typeObject = "LineString";
        }
        var newFeatures = new ol.Collection(features);
        modify = new ol.interaction.Modify({
            features: newFeatures,

            deleteCondition: function(event) {
                return ol.events.condition.shiftKeyOnly(event) &&
                    ol.events.condition.singleClick(event);
            }
        });

        map.addInteraction(modify);
        initSnapping(map);
        createHelpTooltip(map);

        var listener;
        modify.on('modifyend',
            function(evt) {
                sketch = null;
                ol.Observable.unByKey(listener);

                sketch = evt.features.getArray()[0];  //evt.feature;

                eventHandler.TriggerEvent(ISY.Events.EventTypes.ModifyFeatureEnd, sketch);
            }, this);

    }

    function initSnapping(map){
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
            if (helpTooltipElement.parentNode !== null){
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

    function  activate(map, options){
        isActive = true;
        translate = options.translate;
        features = [];
        if (!Array.isArray(options.features)){
            features.push(options.features);
        } else {

            for (var i = 0; i < options.features.length; i++) {
                features.push(options.features[i]);
            }
        }
        snappingFeatures = options.snappingFeatures;

        map.on('pointermove', pointerMoveHandler);

        $(map.getViewport()).on('mouseout', function() {
            $(helpTooltipElement).addClass('hidden');
        });
        addInteraction(map);
    }

    function _removeOverlays(map){

        map.removeOverlay(helpTooltip);
        if (helpTooltipElement !== null) {
            if (helpTooltipElement.parentNode !== null){
                helpTooltipElement.parentNode.removeChild(helpTooltipElement);
            }
        }

        var tooltipStaticElements = document.getElementsByClassName('tooltip tooltip-static');
        while(tooltipStaticElements.length > 0){
            var staticElement = tooltipStaticElements[0];
            staticElement.parentNode.removeChild(staticElement);
        }
    }

    function deactivate(map){
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
var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.Offline = function(){
    /* jshint -W024 */
    var offlineActive = false;
    var dbKeyConfig = 'config';
    var dbKeyMaptiles = 'map';
    var pouchDB = {};
    var pouchTiles = 'pouchtiles:';
    //var pouchTilesDB;       // the database
    var tilesRemaining = 0; // Keep count of tiles waiting to load
    var cacheReady = true;  // True if caching of current view is ready
    var cacheDone = true;   // True if whole caching task is done
    var lonTiles;           // calculated number of tiles to fetch in longtitude direction
    var latTiles;           // calculated number of tiles to fetch in latitude (north/south) direction
    var lonTilesArray = []; // calculated number of tiles to fetch in longtitude direction
    var latTilesArray = []; // calculated number of tiles to fetch in latitude (north/south) direction
    var zoomLevels = 0;         // zoom levels to fetch
    //var iter = 0;         // iteration while fetching tiles
    var iterArray = [];     // iteration while fetching tiles
    var cachingZoom = 0;    // caching cachezoomlevel
    var zoom;               // starting zoom level for caching
    var center;             // starting center for caching
    var coord1;             // corners of area to cache
    var coord2;
    var icons = [];         // markers showing the fetching progress
    var markerLayer;        // temporary layer with markings
    var map;                // the map object
    var view;               // current view
    var eventHandler;
    var dbsInfo;

    var init = function(mapobj, event){
        map = mapobj;
        view = map.getView();
        if (!eventHandler){
            eventHandler = event;
        }
        getDatabase(dbKeyConfig);
        getStatusFromPouchDb("settings");
    };

    var isActive = function(){
        return offlineActive;
    };

    var cacheDatabaseExist = function(){
        return dbsInfo;
    };

    var activate = function() {
        if (!offlineActive) {
            offlineActive = true;
            center = view.getCenter();
            icons.length = 0;
            markerLayer = new ol.layer.Vector({
                source: new ol.source.Vector({features: icons})
            });
            map.addLayer(markerLayer);
            getDatabase(dbKeyMaptiles);
            _initializeLayerCaching();
        }
    };

    var _initializeLayerCaching = function() {
        tilesRemaining = 0;
        // Prepare caching by setting layers to do caching.
        var layers = map.getLayers().getArray();
        for (var i = 0; i<layers.length; i++){
            console.log('checking ' + layers[i].typename + ' for offline activation');
            var config = layers[i].get('config');
            if (config) {
                if (config.source.toLowerCase() === "wms" || config.source.toLowerCase() === "proxywms") {
                    _addWmsCacheLayer(layers[i]);
                    console.log('wms ' + layers[i].typename + ' activated offline');
                } else if (config.source.toLowerCase() === "wfs") {
                    var source = layers[i].getSource();
                    if (source) {
                        source.clear(); //remove features
                        source.set('caching', true);
                        console.log('wfs ' + layers[i].typename + ' activated offline');
                    }
                }
            }
        }
    };

    var deactivate = function() {
        if (map !== undefined && markerLayer !== undefined) {
            icons.length = 0;
            markerLayer.getSource().clear();
            map.removeLayer(markerLayer);
        }
        if (offlineActive) {
            offlineActive = false;
            _disableLayerCaching();
        }
    };

    var _disableLayerCaching = function(){
        // Stop caching of layers
        var layers = map.getLayers().getArray();
        for (var i = 0; i<layers.length; i++){
            var config = layers[i].get('config');
            if (config) {
                if (config.source.toLowerCase() === "wms" || config.source.toLowerCase() === "proxywms") {
                    _removeWmsCacheLayer(layers[i]);
                } else if (config.source.toLowerCase() === "wfs") {
                    var source = layers[i].getSource();
                    if (source) {
                        source.set('caching', false);
                    }
                }
            }
        }
    };

    var getDatabase = function(index) {
        if (!pouchDB[index]) {
            pouchDB[index] = new PouchDB(pouchTiles + index, {size: 50});
        }
        return pouchDB[index];
    };

    var _addWmsCacheLayer = function(layer) {
        var layerSource = layer.getSource();
        _setLayerTileLoadFunction(layerSource, _wmsTileLoadCacheFunction);

        layerSource.on('tileloadstart', function(/*event*/) {
            ++tilesRemaining;
            cacheReady = false;
            //$('#tiles-remaining').html("remaining tiles: " + tilesRemaining + ", iter: " + iter + "/" + (lonTiles * latTiles * zoomLevels) + ", cacheDone: " + cacheDone + ", cacheReady: " + cacheReady);
        });

        layerSource.on('tileloadend', function(/*event*/) {
            _tileLoaded();
        });
        layerSource.on('tileloaderror', function(/*event*/) {
            _tileLoaded();
        });
    };

    var _removeWmsCacheLayer = function(layer) {
        var layerSource = layer.getSource();

        _setLayerTileLoadFunction(layerSource, undefined);  // reset original TileLoadFunction

        // unregister events
        layerSource.un('tileloadstart', function(/*event*/) {});
        layerSource.un('tileloadend', function(/*event*/) {});
        layerSource.un('tileloaderror', function(/*event*/) {});
    };

    var getStatusFromPouchDb = function(id){
        dbsInfo = false;
        if (pouchDB[dbKeyConfig]){
            pouchDB[dbKeyConfig].get(id).then(function(doc){
                if (doc.hasOwnProperty("title")){
                    if (doc["title"] === "cacheCreated"){
                        dbsInfo = doc["isCacheCreated"];
                        eventHandler.TriggerEvent(ISY.Events.EventTypes.StatusPouchDbChanged, dbsInfo);
                    }
                }
            });
        }
        return dbsInfo;
    };

    var saveDbsStatusToPouchDb = function(status){
        if (pouchDB[dbKeyConfig]){
            pouchDB[dbKeyConfig].get("settings").then(function (doc) {
                // settings exist, rewrite with revision
                dbsInfo = status;
                eventHandler.TriggerEvent(ISY.Events.EventTypes.StatusPouchDbChanged, dbsInfo);
                return pouchDB[dbKeyConfig].put({
                    _id: "settings",
                    _rev: doc._rev,
                    title: "cacheCreated",
                    isCacheCreated: status
                });
            }).then(function (response) {
                // handle response
                log(response);
            }).catch(function (err) {
                if (err && err.name == 'not_found') {
                    // Not found in database, add it
                    dbsInfo = status;
                    eventHandler.TriggerEvent(ISY.Events.EventTypes.StatusPouchDbChanged, dbsInfo);
                    pouchDB[dbKeyConfig].put({
                        _id: "settings",
                        title: "cacheCreated",
                        isCacheCreated: status

                    }).then(function (response) {
                        // handle response
                        console.log(response);
                    }).catch(function (err) {
                        console.log(err);
                    });
                }
                else {
                    log(err);
                }
            });
        }
    };

    //var saveSettings = function() {
    //    pouchTilesDB.get('settings').then(function (doc) {
    //        // settings exist, rewrite with revision
    //        return pouchTilesDB.put({
    //            _id: 'settings',
    //            _rev: doc._rev,
    //            title: 'maplib-settings',
    //            _attachments: {
    //                "geoinnsyn.config": {
    //                    "content_type": "text/plain",
    //                    "data": _compileSettings()
    //                }
    //            }
    //        });
    //    }).then(function (response) {
    //        // handle response
    //        log(response);
    //    }).catch(function (err) {
    //        if (err && err.name == 'not_found') {
    //            // Not found in database, add it
    //            pouchTilesDB.put({
    //                _id: 'settings',
    //                title: 'maplib-settings',
    //                _attachments: {
    //                    "geoinnsyn.config": {
    //                        "content_type": "text/plain",
    //                        "data": _compileSettings()
    //                    }
    //                }
    //
    //            }).then(function (response) {
    //                // handle response
    //                console.log(response);
    //            }).catch(function (err) {
    //                console.log(err);
    //            });
    //        }
    //        else {
    //            log(err);
    //        }
    //    });
    //};

    var _getOfflineResource = function(url, isConfig, callback) {
        //if (!offlineActive){
        //
        //}
        var dbkey = isConfig ? dbKeyConfig : dbKeyMaptiles;
        getDatabase(dbkey);
        pouchDB[dbkey].getAttachment(url, 'resource').then(function (blob) {
            // handle result
            blobUtil.blobToBinaryString(blob).then(function (bs) {
                resource = JSON.parse(bs);
                callback(resource, true);
            }).catch(function(err){
                console.log("_getOfflineResource ny feil: " + err);
                callback(undefined, false);
            });
        }).catch(function (err) {
            console.log(err);
            callback(undefined, false);
        });
    };

    var _addPouchAttachment = function(key, name, url, index, callback) {
        if (!navigator.onLine || !isActive())
        {
            return;
        }
        $.ajax({
            url: url
        }).done(function(response) {
            if (typeof response == 'object'){
                if (response.firstChild.childElementCount === 0) {
                    return;
                }
            } else {
                return;
            }
            if (callback){
                callback(response);
            }

            var s = new XMLSerializer();
            var type = 'text/plain';
            getDatabase(index);
            pouchDB[index].putAttachment(key, name, btoa(s.serializeToString(response)), type).then(function () {
                console.log(key + " added wfs " + name + " to cache!");
            }).catch(function (putAttachmentErr) {
                console.log(key + " add wfs " + name + " failed! " + putAttachmentErr);
                if (putAttachmentErr.status === 409) {
                    // Document created since addPouchAttachment were called, try again
                    console.log("Retry:" + key + " add wfs " + name);
                    _getPouchAttachment(key, name, url, index);
                }
            });
        });
    };

    var _addPouchAttachmentWithRevision = function(key, name, url, index, rev, callback) {
        if (!navigator.onLine) {return;}
        $.ajax({
            url: url
        }).done(function(response) {
            if (typeof response == 'object'){
                if (response.firstChild.childElementCount === 0) {
                    return;
                }
            } else {
                return;
            }
            if (callback){
                callback(response);
            }

            var s = new XMLSerializer();
            var type = 'text/plain';
            getDatabase(index);
            pouchDB[index].putAttachment(key, name, rev, btoa(s.serializeToString(response)), type).then(function () {
                console.log(key + " added wfs " + name + " to cache!");
            }).catch(function (putAttachmentErr) {
                console.log(key + " add wfs " + name + " failed! " + putAttachmentErr);
            });
        });
    };

    var _getPouchAttachment = function(key, name, url, index) {
        getLayerResource(key, name, url, index);
    };

    var getResource = function(url, contentType, callback) {
        _getResource(url, contentType, callback, false);
    };

    var getConfigResource = function(url, contentType, callback) {
        _getResource(url, contentType, callback, true);
    };

    var getResourceFromJson = function(url, contentType, callback){
        _getResourceFromJson(url, contentType, callback, false);
    };

    var getLayerResource = function(key, name, url, callback){
        var index = dbKeyMaptiles;
        getDatabase(index);
        // This function will get it from the database if it exist, otherwise it will try to add or update it.
        pouchDB[index].get(key).then(function (res) {
            // document is found OR no error , find the revision and update it
            pouchDB[index].getAttachment(key, name, function (err, attachmentRes) {
                if (err && err.error == 'not_found' || !attachmentRes) {
                    // attachment not found, but document do, add revision
                    // Add it!
                    _addPouchAttachmentWithRevision(key, name, url, index, res._rev, callback);

                } else {
                    // Attachment found in cache, use it
                    // This is where we want to end up if we're offline.
                    blobUtil.blobToBase64String(attachmentRes).then(function(xml){
                        if (callback){
                            callback($.parseXML(atob(xml)));
                        }
                        console.log(key + " retrieved " + name + " wfs from cache!");
                    }).catch(function (blobErr) {
                        console.log(key + " retrieve " + name + " wfs failed! " + blobErr);
                    });
                }
            });
        }).catch(function(err){
            console.log("getLayerResource ny feil: " + err);
            if (err.status === 404) {
                // this means document is not found
                // Add it!
                _addPouchAttachment(key,name, url, index);
            }
        });
    };

    var _getResourceFromJson = function(url, contentType, callback, isConfig){
        // get content of url online if available
        var projectXml,pouchAttachment,addrevision;
        var dbkey = isConfig ? dbKeyConfig : dbKeyMaptiles;
        getDatabase(dbkey); // Make sure database is up and running
        if (offlineActive) {
            _getOfflineResource(url, isConfig, callback);
            return;
        }
        else {
            try {
                $.ajax(
                    { type: 'GET', url: url, async: false }
                ).done(function(response){
                    addrevision = true;
                    projectXml = response;
                    pouchAttachment = btoa(JSON.stringify(response));
                }).error(function(){
                    addrevision = false;
                    _getOfflineResource(url, isConfig, callback);
                    return;
                });
                //projectXml = $.ajax(
                //    { type: 'GET', url: url, async: false }
                //).responseJSON;
                //
                //if (projectXml){
                //    resource = projectXml;
                //    pouchAttachment = btoa(JSON.stringify(resource));
                //
                //} else {
                //    // Not found, try offline
                //    _getOfflineResource(url, isConfig, callback);
                //    return;
                //}
            } catch(exception) {
                addrevision = false;
                // Resource retrival failed, try offline before giving up
                _getOfflineResource(url, isConfig, callback);
                return;
            }
        }

        // resource was successfully retrieved from url. store in pouchDB for later
        if (addrevision) {
            // check if it already exist in pouchDB
            pouchDB[dbkey].get(url).then(function (doc) {
                // resource exist in database, rewrite with revision
                pouchDB[dbkey].put({
                    _id: url,
                    //title: isConfig,
                    _rev: doc._rev,
                    _attachments: {
                        "resource": {
                            "content_type": "text/plain",
                            "data": pouchAttachment
                        }
                    }
                }).catch(function (err) {
                    console.log("ny feil: " + err);
                });
            }).then(function (/*response*/) {
                // handle response
                //log(response);
            }).catch(function (err) {
                if (err && err.name == 'not_found') {
                    // Not found in database, add it
                    pouchDB[dbkey].put({
                        _id: url,
                        //title: isConfig,
                        _attachments: {
                            "resource": {
                                "content_type": "text/plain",
                                "data": pouchAttachment
                            }
                        }

                        //}).then(function (response) {
                        //    // handle response
                        //    console.log(response);
                    }).catch(function (err) {
                        console.log(err);
                    });
                }
                else {
                    log(err);
                }
            });
            callback(projectXml, false);    // Callback with the result
        }
    };


    var _getResource = function(url, contentType, callback, isConfig) {
        // get content of url online if available
        var projectXml,resource,pouchAttachment;
        if (isConfig){
            getDatabase(dbKeyConfig);  // Make sure database is up and running
        } else {
            getDatabase(dbKeyMaptiles);
        }
        var index = isConfig ? dbKeyConfig : dbKeyMaptiles;
        if (offlineActive) {
            _getOfflineResource(url, isConfig, callback);
            return;
        }
        else {
            try {
                projectXml = $.ajax(
                    { type: 'GET', url: url, async: false }
                ).responseText;

                if (projectXml){
                    if (contentType.toLowerCase() === 'application/json'){
                        resource = xml2json.parser(projectXml);
                    }
                    else {
                        resource = projectXml;
                    }
                    pouchAttachment = btoa(JSON.stringify(resource));

                } else {
                    // Not found, try offline
                    _getOfflineResource(url, isConfig, callback);
                    return;
                }
            } catch(exception) {
                // Resource retrival failed, try offline before giving up
                 _getOfflineResource(url, isConfig, callback);
                callback(resource, false);
                return;
            }
        }

        // resource was successfully retrieved from url. store in pouchDB for later

        getDatabase(index); // Make sure database is up and running
        // check if it already exist in pouchDB
        pouchDB[index].get(url).then(function (doc) {
            // resource exist in database, rewrite with revision
            pouchDB[index].put({
                _id: url,
                //title: isConfig,
                _rev: doc._rev,
                _attachments: {
                    "resource": {
                        "content_type": "text/plain",
                        "data": pouchAttachment
                    }
                }
            }).catch(function(err){
                console.log("ny feil: " + err);
            });
        }).then(function (/*response*/) {
            // handle response
            //log(response);
        }).catch(function (err) {
            if (err && err.name == 'not_found') {
                // Not found in database, add it
                pouchDB[index].put({
                    _id: url,
                    //title: isConfig,
                    _attachments: {
                        "resource": {
                            "content_type": "text/plain",
                            "data": pouchAttachment
                        }
                    }

                //}).then(function (response) {
                //    // handle response
                //    console.log(response);
                }).catch(function (err) {
                    console.log(err);
                    callback(resource, false);
                });
            }
            else {
                log(err);
            }
        });
        callback(resource, false);    // Callback with the result
    };

    var _tileLoaded = function(){
        --tilesRemaining;
        if (tilesRemaining <= 0) {
            cacheReady=true;
            if (!cacheDone){
                _goCache();
            }
        }
        //$('#tiles-remaining').html("remaining tiles: " + tilesRemaining + ", iter: " + iter + "/" + (lonTiles * latTiles * zoomLevels) + ", cacheDone: " + cacheDone + ", cacheReady: " + cacheReady);
    };

    var _goCache = function(){
        var dZoom = cachingZoom;
        if (iterArray[dZoom] >= (lonTilesArray[dZoom] * latTilesArray[dZoom])) {
            if (dZoom >= iterArray.length - 1) {
                cacheDone = true;
                deactivate();
                view.setZoom(zoom);
                view.setCenter(center);
                map.removeLayer(markerLayer);
                eventHandler.TriggerEvent(ISY.Events.EventTypes.CachingEnd, _getCacheTileProgressCount());
                return; // done
            }
            dZoom = ++cachingZoom;
        }

        if (eventHandler) {
            eventHandler.TriggerEvent(ISY.Events.EventTypes.CachingProgress, _getCacheTileProgressCount());
            //var dLon = Math.floor(iter / (latTiles)) % (latTiles - (latTiles - lonTiles));
            //var dLat = iter % latTiles;
            if (view.getZoom() != zoom + dZoom) {
                view.setZoom(zoom + dZoom);
            }
            //var c1 = coord1[0] + (dLon * (coord2[0] - coord1[0]) / (lonTiles - 1));
            //var c2 = coord1[1] + (dLat * (coord2[1] - coord1[1]) / (latTiles - 1));

            var c1;
            var c2;
            if (latTilesArray[dZoom] === 1){
                c1 = coord1[0] + ((coord2[0] - coord1[0]) / 2);
                c2 = coord2[1] + ((coord1[1] - coord2[1]) / 2);
                view.setCenter([c1, c2]);
                iterArray[dZoom] = Infinity;
            } else {
                var dLon = Math.floor(iterArray[dZoom] / (latTilesArray[dZoom])) % (latTilesArray[dZoom] - (latTilesArray[dZoom] - lonTilesArray[dZoom]));
                var dLat = iterArray[dZoom] % latTilesArray[dZoom];
                c1 = coord1[0] + (dLon * (coord2[0] - coord1[0]) / (lonTilesArray[dZoom] - 1));
                c2 = coord1[1] + (dLat * (coord2[1] - coord1[1]) / (latTilesArray[dZoom] - 1));

                //log("iter: " + iter + ", dLon: " + dLon + ", dLat: " + dLat + ", dZoom: " + dZoom);
                //log("lon: " + c1 + " lat: " + c2 + " zoom: " + zoom +dZoom);
                view.setCenter([c1, c2]);
                _addCircle([c1, c2]);
                //iter++;
                iterArray[dZoom]++;
            }
            setTimeout(function () {
                if (cacheReady && !cacheDone) {  // If ready then it has probably stopped for nothing to cache, start it again
                    _goCache();
                }
            }, 100);
        }
    };

    var _setLayerTileLoadFunction = function(source, func){
        if(source){
            if (func) {
                var oldTLF = source.getTileLoadFunction();
                // todo: check if source type (eg. TileWMS) is correct/same as func
                source.setTileLoadFunction(func);
                source.set('onlineTLF', oldTLF);    // store old function for later
            } else {    // reset old TileLoadFunction if it exist
                var onlineTLF = source.get('onlineTLF');
                if (typeof onlineTLF === 'function') {
                    source.setTileLoadFunction(onlineTLF);
                }
            }
        }
    };

    var _wmsAddOrUpdatePouchAttachment = function(key, name, src, imageTile) {
        getDatabase(dbKeyMaptiles); // Make sure database is up and running
        pouchDB[dbKeyMaptiles].get(key).then(function (res) {
            // document is found OR no error , find the revision and update it
            pouchDB[dbKeyMaptiles].getAttachment(key, name).then(function (attachmentRes) {
                if (!attachmentRes) {
                    // attachment not found, but document do, add revision
                    _wmsAddPouchAttachmentWithRevision(key, name, src, res._rev);
                    imageTile.getImage().src = src; // Image from layer (if not in cache)
                } else {
                    // attachment found, use it
                    imageTile.getImage().src = window.URL.createObjectURL(attachmentRes); // Tile from cache
                    log(key + " wms " + name + " retrieved from cache!");
                }
            }).catch(function(err){
                console.log("_wmsAddOrUpdatePouchAttachment - Ny feil: " + err);
            });
        }).catch(function(err){
            if (err.status === 404) {
                // this means document is not found, Add it!
                _wmsAddPouchAttachment(key,name, src, imageTile);
                imageTile.getImage().src = src; // Image from layer (if not in cache)

            }
        });
    };

    var _wmsAddPouchAttachment = function(key, name, src, imageTile) {
        getDatabase(dbKeyMaptiles); // Make sure database is up and running
        blobUtil.imgSrcToBlob(src,  'image/jpeg', 'Anonymous').then(function (blob) {
            pouchDB[dbKeyMaptiles].putAttachment(key, name, blob, 'image/png').then(function (/*result*/) {
                log(key + " wms added to cache!");
            }).catch(function (putAttachmentErr) {
                console.log(key + " add wms " + name + " failed! " + putAttachmentErr);
                if (putAttachmentErr.status === 409) {
                    // Document created since addPouchAttachment were called, try again
                    console.log("Retry:" + key + " add wms " + name);
                    _wmsAddOrUpdatePouchAttachment(key, name, src, imageTile);
                }
            });
        }).catch(function(err){
            console.log("ny feil: " + err);
        });

    };

    var _wmsAddPouchAttachmentWithRevision = function(key, name, src, rev) {
        getDatabase(dbKeyMaptiles); // Make sure database is up and running
        blobUtil.imgSrcToBlob(src,  'image/jpeg', 'Anonymous').then(function (blob) {
            pouchDB[dbKeyMaptiles].putAttachment(key, name, rev, blob, 'image/png').then(function (/*result*/) {
                log(key + " wms added to cache!");
            }).catch(function (err) {
                log(key + " add wms failed! " + err);
            });
        }).catch(function(putAttachmentErr){
            console.log(key + " add wms " + name + " failed! " + putAttachmentErr);
            if (putAttachmentErr.status === 409) {
                // Document created since addPouchAttachment were called, try again
                console.log("Retry:" + key + " add wms " + name);
                _wmsAddPouchAttachmentWithRevision(key, name, src, rev);
            }

        });
    };

    var _wmsTileLoadCacheFunction = function(imageTile, src){
        // Need to find a layer name so that it is possible to store several different layer-tiles in the same record
        var layerKey = "LAYERS=";
        var tmp = src.substr(src.search(layerKey,"i"));
        var layername = tmp.substr(layerKey.length, tmp.indexOf("&") - layerKey.length);
        if (!layername) {layername = "layer";}

        // Make a key from zoom and tile grid position
        var key = this.getTileCoord().join('-');
        var attachmentName = layername + '.png';

        _wmsAddOrUpdatePouchAttachment(key, attachmentName, src, imageTile);
    };

    var startCaching = function(zoomLevelMin, zoomLevelMax, extentView, eventhandler){
        //deleteDatabase(_startCacheProcessCurrentView, zoomlevels, eventhandler);
        _startCacheProcessCurrentView(zoomLevelMin, zoomLevelMax, extentView,  eventhandler);
    };

    var stopCaching = function(){
        cacheDone = true;
        eventHandler.TriggerEvent(ISY.Events.EventTypes.CachingEnd, _getCacheTileProgressCount());
        deactivate();
        view.setZoom(zoom);
        view.setCenter(center);
        map.removeLayer(markerLayer);
    };

    var calculateTileCount = function(zoomLevelMin, zoomLevelMax, extentView){
    //var calculateTileCount = function(zoomlevels){
        var tilecount = 0;
        if (map !== undefined){
            var extent = extentView;//view.calculateExtent(map.getSize());
            //var extent = view.calculateExtent(map.getSize());
            var currentResolution = view.getResolution();
            //var mapwidth = (extent[2] - extent[0]) / view.getResolution();
            //var mapheight = (extent[3] - extent[1]) / view.getResolution();
            coord1 = [extent[0], extent[3]];
            coord2 = [extent[2], extent[1]];
            var zoomlevels = zoomLevelMax - zoomLevelMin;

            // get resolution for zoomLevelMin
            var currentZoom = view.getZoom();
            if (zoomLevelMin < currentZoom){
                currentResolution *= Math.pow(2, currentZoom - zoomLevelMin);
            }

            for (var i = 0; i < zoomlevels; i++){
                //tilecount += Math.abs(Math.ceil((coord2[0]-coord1[0]) / currentResolution * Math.pow(2,i + 1) / mapwidth)) * Math.abs(Math.ceil((coord1[1]-coord2[1]) / currentResolution * Math.pow(2,i + 1) / mapheight)); // counts number of windows...
                tilecount += Math.abs(Math.ceil((coord2[0]-coord1[0]) / currentResolution * Math.pow(2, i + 1) / 256 / 2)) * Math.abs(Math.ceil((coord1[1]-coord2[1]) / currentResolution * Math.pow(2, i + 1) / 256 / 2));
            }
        }
        return tilecount;
    };

    var _startCacheProcessCurrentView = function(zoomLevelMin, zoomLevelMax, extentView, eventhandler) {
        activate();
        eventHandler = eventhandler;
        var currentZoom = view.getZoom();
        var currentResolution = view.getResolution();
        var singleZoomLevels = currentZoom - zoomLevelMin;
        if (singleZoomLevels > 0){
            currentResolution *= Math.pow(2, singleZoomLevels);
        }
        zoomLevels = zoomLevelMax - zoomLevelMin;
        view.setZoom(zoomLevelMin);
        var extent = extentView;//view.calculateExtent(map.getSize());


        coord1 = [extent[0], extent[3]];
        coord2 = [extent[2], extent[1]];
        _addSquare(coord1, coord2);
        //iter = 0;
        //cachingZoom = 0;
        zoom = view.getZoom();//currentZoom;
        cacheDone = false;
        saveDbsStatusToPouchDb(true);
        // Calculate window size in pixels

        var mapwidth = (extent[2] - extent[0]) / view.getResolution();
        var mapheight = (extent[3] - extent[1]) / view.getResolution();

        // Calculate # of tiles from deepest zoom level based on a tile size of 256
        lonTiles = Math.abs(Math.ceil((coord2[0]-coord1[0]) / currentResolution * Math.pow(2,zoomLevels) / mapwidth));
        latTiles = Math.abs(Math.ceil((coord1[1]-coord2[1]) / currentResolution * Math.pow(2,zoomLevels) / mapheight));
        lonTilesArray.length = 0;
        latTilesArray.length = 0;
        iterArray.length = 0;
        var j = 0;
        for (var i = 0; i < zoomLevels; i++){
            iterArray[i] = 0;
            if (singleZoomLevels > 0){
                lonTilesArray[i] = 1;
                latTilesArray[i] = 1;
                singleZoomLevels--;
            } else {
                lonTilesArray[i] = Math.abs(Math.ceil((coord2[0]-coord1[0]) / currentResolution * Math.pow(2,j + 1) / mapwidth));
                latTilesArray[i] = Math.abs(Math.ceil((coord1[1]-coord2[1]) / currentResolution * Math.pow(2,j + 1) / mapheight));
                j++;
            }
        }
        if (lonTiles>1 && latTiles>1) { // Needs tp be at least 2 x 2
            //eventHandler.TriggerEvent(ISY.Events.EventTypes.CachingStart, lonTiles * latTiles * zoomLevels);
            eventHandler.TriggerEvent(ISY.Events.EventTypes.CachingStart, _getCacheTileCount());
            _goCache();
        } else {
            log("Area too small! Increase area or number of zoom levels!");
        }
    };

    var _getCacheTileProgressCount = function(){
        var tilecount = 0;
        if (iterArray.length > 0 && iterArray.length > 0) {
            for (var i = 0; i < zoomLevels; i++) {
                if (iterArray[i] === Infinity){
                    tilecount++;
                } else {
                    tilecount += iterArray[i];
                }
            }
        }
        return tilecount;
    };

    var _getCacheTileCount = function(){
        var tilecount = 0;
        if (lonTilesArray.length > 0 && latTilesArray.length > 0) {
            for (var i = 0; i < zoomLevels; i++) {
                tilecount += lonTilesArray[i] * latTilesArray[i];
            }
        }
        return tilecount;
    };

    var deleteDatabase = function(callback, zoomlevels, eventhandler) {
        saveDbsStatusToPouchDb(false);
        getDatabase(dbKeyMaptiles); // Make sure database is up and running
        if (pouchDB[dbKeyMaptiles]) {
            pouchDB[dbKeyMaptiles].destroy(pouchTiles + dbKeyMaptiles, function (err, info) {
                if (err) {
                    log('Database destroy error: ' + err + ' ' + info);
                    return;
                }
                log('Deleted ' + pouchTiles + dbKeyMaptiles + ' database.');
                pouchDB[dbKeyMaptiles] = undefined;
                if (callback) {
                    callback(zoomlevels, eventhandler);
                }
            });
        }
    };

    //var _compileSettings = function _compileSettings() {
    //    var settings = {};
    //    // todo: fix
    //    settings.title = "Test"; //$('#name').val();
    //    settings.two = "Test2"; //$('#two').val();
    //    settings.zoomLevels = 3; //$('#zoom-levels').val();
    //
    //    return btoa(JSON.stringify(settings));
    //};

    var _getCircleStyle = function() {
        var iconStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(0,0,0,0.3)',
                width: 1
            }),
            fill: new ol.style.Fill({
                color: 'rgba(160,0,0,0.9)'
            })
        });
        return iconStyle;
    };

    var _getSquareStyle = function() {
        var iconStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(160,0,0,0.7)',
                width: 2
            })
        });
        return iconStyle;
    };

    var _addCircle = function(c) {
        var markerSource = markerLayer.getSource();
        var iconFeature = new ol.Feature({
            geometry: new ol.geom.Circle(c, 5*view.getResolution())
        });
        iconFeature.setStyle(_getCircleStyle());
        icons[icons.length] = iconFeature;
        icons[icons.length - 1][0] = "circle";
        markerSource.addFeature(iconFeature);
        return iconFeature;
    };

    var _addSquare = function(c1, c2) {
        var markerSource = markerLayer.getSource();
        p1 = c1;
        p2 = [c1[0], c2[1]];
        p3 = c2;
        p4 = [c2[0], c1[1]];
        var coords = [p1,p2,p3,p4,p1];
        var iconFeature = new ol.Feature({
            geometry: new ol.geom.LineString(coords)
        });
        iconFeature.setStyle(_getSquareStyle());
        icons[icons.length] = iconFeature;
        icons[icons.length - 1][0] = "square";
        markerSource.addFeature(iconFeature);
        return iconFeature;
    };

    var log = function(text) {
        if (text && console){
            console.log(text);
        }
    };

    return {
        Init: init,
        IsActive: isActive,
        CacheDatabaseExist: cacheDatabaseExist,
        Activate: activate,
        Deactivate: deactivate,
        StartCaching: startCaching,
        StopCaching: stopCaching,
        CalculateTileCount: calculateTileCount,
        //SaveSettings: saveSettings,
        GetResource: getResource,
        GetConfigResource: getConfigResource,
        GetLayerResource: getLayerResource,
        DeleteDatabase: deleteDatabase,
        GetDatabase: getDatabase,
        GetResourceFromJson: getResourceFromJson
    };
};
var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.PrintBoxSelect = function(eventHandler) {

    var isActive = false;
    var printBoxSelectionLayer;
    var oldCenter = {};
    var oldUTM = "";
    var scale = 25000;
    var oldInteraction={};
    var cols = 4;
    var rows = 3;
    var pageMargin = 1.7; // cm
    var pageWidth = 21 - (pageMargin * 2); // 21cm = A4 width
    var pageHeight = 29.7 -(pageMargin * 2);
    var eventKeys ={};

    function _UTMZoneNotChanged(map) {
        if (!isActive) {
            return;
        }
        var mapCenterGeographic=_getMapCenterGeographic(_getMapCenter(map));
        var UTM = _getUTMZoneFromGeographicPoint(mapCenterGeographic.getCoordinates()[0], mapCenterGeographic.getCoordinates()[1]);
        if (UTM != oldUTM){
            _createFrame(map);
            return false;
        }
        return true;
    }

    var _deregisterMouseEvents = function(map){
        for (var eventKey in eventKeys){
            map.unByKey(eventKeys[eventKey]);
            eventKeys[eventKey]=false;
        }
    };

    var _registerMouseEvents = function (map) {
        eventKeys['change_center']=map.getView().on('change:center', function() {
            if(_UTMZoneNotChanged(map)) {
                var deltaCenter = _findDelta(map);
                _moveLayer(map, deltaCenter);
            }
        });

        eventKeys['moveend']=map.on('moveend', function() {
            _getExtentOfPrintBox(map);
        });
    };

    var _getExtentOfPrintBox = function (map) {
        var mapCenter = _getMapCenter(map);
        var mapCenterActiveUTMZone =_getMapCenterActiveUTMZone(mapCenter);
        var printBox = _getPrintBox(mapCenterActiveUTMZone);
        var extent = {
            bbox: [printBox.left, printBox.bottom, printBox.right, printBox.top],
            center: mapCenterActiveUTMZone.getCoordinates(),
            projection: oldUTM.localProj,
            sone: oldUTM.sone,
            scale: scale
        };
        eventHandler.TriggerEvent(ISY.Events.EventTypes.PrintBoxSelectReturnValue, extent);
    };

    var _getMapCenter = function (map){
        return map.getView().getCenter();
    };

    var _getMapCenterGeographic = function(mapCenter){
        var mapCenterGeographic = new ol.geom.Point(mapCenter);
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

    var _getUTMZoneFromGeographicPoint = function(lon, lat) {
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
        _getExtentOfPrintBox(map);
        if(printBoxSelectionLayer)
        {
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
            name:'PrintBoxSelect',
            source: vectorSource,
            updateWhileAnimating: true,
            updateWhileInteracting: true
        });

        map.addLayer(printBoxSelectionLayer);
        printBoxSelectionLayer.setZIndex(2000);

    };

    var _getUTMZoneFromMapCenter = function (mapCenter) {
        var mapCenterGeographic =_getMapCenterGeographic(mapCenter);
        var UTM = _getUTMZoneFromGeographicPoint(mapCenterGeographic.getCoordinates()[0], mapCenterGeographic.getCoordinates()[1]);
        oldUTM = UTM;
        return UTM;
    };

    var _getMultiPolygonGeometry = function (coordinates, mapCenter) {
        var multiPolygonGeometry = new ol.geom.MultiPolygon(coordinates);
        multiPolygonGeometry.applyTransform(ol.proj.getTransform(_getUTMZoneFromMapCenter(mapCenter).localProj, 'EPSG:32633'));
        return multiPolygonGeometry;
    };

    var _getMapCenterActiveUTMZone = function (mapCenter) {
        var mapCenterActiveUTMZone= new ol.geom.Point(mapCenter);
        mapCenterActiveUTMZone.applyTransform(ol.proj.getTransform('EPSG:32633',_getUTMZoneFromMapCenter(mapCenter).localProj));
        return mapCenterActiveUTMZone;
    };

    var _getPrintBox = function(mapCenterActiveUTMZone){
        var printBoxSelect={};
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
                var tempBox =  new ol.geom.Polygon([[lowerLeft.getCoordinates(), upperLeft.getCoordinates(), upperRight.getCoordinates(), lowerRight.getCoordinates(), lowerLeft.getCoordinates()]]);
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
                map.removeLayer(printBoxSelectionLayer);
                _deregisterMouseEvents(map);
                _applyOriginalInteraction(map);
            }
        }
    }

    return {
        Activate: activate,
        Deactivate: deactivate
    };
};
var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.ProgressBar = function(eventHandler){
    var olMap;
    var _progress;
    /*
     Start up functions Start
     */

    function init(map){
        olMap = map;
        eventHandler.RegisterEvent(ISY.Events.EventTypes.ChangeLayers, _registerProgress);
    }

    function _registerProgress(){
        var element = document.getElementById('progressbar');
        if (element === undefined || element === null){
            return;
        }
        _progress = new Progress(element);
        olMap.getLayers().forEach(function(layer){
            var source = layer.getSource();
            if (source) {
                var sourceType = source.get('type');
                switch (sourceType) {
                    case 'ol.source.Vector':
                        source.on('vectorloadstart', function () {
                            _progress.addLoading();
                        });
                        source.on('vectorloadend', function () {
                            _progress.addLoaded();
                        });
                        break;
                    case 'ol.source.ImageWMS':
                        source.on('imageloadstart', function () {
                            _progress.addLoading();
                        });

                        source.on('imageloadend', function () {
                            _progress.addLoaded();
                        });
                        source.on('imageloaderror', function () {
                            _progress.addLoaded();
                        });
                        break;
                    case 'ol.source.TileWMS':
                        source.on('tileloadstart', function () {
                            _progress.addLoading();
                        });

                        source.on('tileloadend', function () {
                            _progress.addLoaded();
                        });
                        source.on('tileloaderror', function () {
                            _progress.addLoaded();
                        });
                        break;
                    case undefined:
                        break;
                    default:
                        console.log(source.get('type'));
                        break;
                }
            }
        });
    }

    /**
     * Renders a progress bar.
     * @param {Element} el The target element.
     * @constructor
     */
    function Progress(el) {
        this.el = el;
        this.loading = 0;
        this.loaded = 0;
    }


    /**
     * Increment the count of loading tiles.
     */
    Progress.prototype.addLoading = function() {
        if (this.loading === 0) {
            this.show();
        }
        ++this.loading;
        this.update();
    };


    /**
     * Increment the count of loaded tiles.
     */
    Progress.prototype.addLoaded = function() {
        var this_ = this;
        ++this_.loaded;
        if (this_.loaded > this_.loading){
            this_.loaded = this_.loading;
        }
        this_.update();
    };


    /**
     * Update the progress bar.
     */
    Progress.prototype.update = function() {
        var width = (this.loaded / this.loading * 100).toFixed(1) + '%';
        this.el.style.width = width;
        if (this.loading === this.loaded) {
            this.loading = 0;
            this.loaded = 0;
            var this_ = this;
            setTimeout(function() {
                this_.hide();
            }, 500);
        }
    };


    /**
     * Show the progress bar.
     */
    Progress.prototype.show = function() {
        this.el.style.visibility = 'visible';
    };


    /**
     * Hide the progress bar.
     */
    Progress.prototype.hide = function() {
        if (this.loading === this.loaded) {
            this.el.style.visibility = 'hidden';
            this.el.style.width = 0;
        }
    };

    return {
        // Start up start
        Init: init
        // Start up end
    };
};

var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.Utilities = function(){
    function convertGmlToGeoJson(gml){
        var xmlParser = new ol.format.WMSCapabilities();
        var xmlFeatures = xmlParser.read(gml);
        var gmlParser = new ol.format.GML();
        var features = gmlParser.readFeatures(xmlFeatures);
        var jsonParser = new ol.format.GeoJSON();
        return jsonParser.writeFeatures(features);
    }

    function extentToGeoJson(x, y){
        var point = new ol.geom.Point([x, y]);
        var feature = new ol.Feature();
        feature.setGeometry(point);
        var geoJson = new ol.format.GeoJSON();
        return geoJson.writeFeature(feature);
    }

    return {
        ConvertGmlToGeoJson: convertGmlToGeoJson,
        ExtentToGeoJson: extentToGeoJson
    };
};
var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};
ISY.MapImplementation.OL3.Sources = ISY.MapImplementation.OL3.Sources || {};

ISY.MapImplementation.OL3.Sources.CustomMessageHandler = function(eventHandler, _getIsySubLayerFromPool){
    var olMap;
    var _message = 'Service down: ';
    var _messageHandler;
    var getIsySubLayerFromPool;
    /*
     Start up functions Start
     */

    function init(map, message){
        olMap = map;
        if (message && message.length > 0) {
            _message = message;
        }
        getIsySubLayerFromPool = _getIsySubLayerFromPool;
        eventHandler.RegisterEvent(ISY.Events.EventTypes.ChangeLayers, _registerMessageHandler);
    }

    function initMessage(message){
        if (message !== undefined) {
            _message = message;
        }
        _registerMessageHandler();
    }

    function showCustomMessage(message){
        if (_messageHandler) {
            _messageHandler.showMessage(message);
        }
    }

    function _registerMessageHandler(){
        var element = document.getElementById('messagecontainer');
        if (element === undefined || element === null){
            return;
        }
        _messageHandler = new CustomMessageHandler(element);
        if (olMap) {
            olMap.getLayers().forEach(function (layer) {
                var isySubLayer = getIsySubLayerFromPool(layer);
                var source = layer.getSource();
                if (source) {
                    var sourceType = source.get('type');
                    switch (sourceType) {
                        case 'ol.source.ImageWMS':
                            source.on('imageloaderror', function (event) {
                                _messageHandler.showMessage(isySubLayer.title, event);
                            });
                            break;
                        case 'ol.source.TileWMS':
                            source.on('tileloaderror', function (event) {
                                _messageHandler.showMessage(isySubLayer.title, event);
                            });
                            break;
                        //case undefined:
                        //    break;
                        //default:
                        //    //console.log(source.get('type'));
                        //    break;
                    }
                }
            });
        }
    }

    function CustomMessageHandler(el){
        this.el = el;
        this.messages = [];
        this.looping = false;
        this.visible = false;
    }

    CustomMessageHandler.prototype.showMessage = function(message, event){
        var self = this;
        message = self.getResponse(message, event);
        if (self.messages.length === 0) {
            self.messages.push(message);
        } else {
            var addItem = true;
            self.messages.forEach(function(item){
                if (addItem && item === message){
                    addItem = false;
                }
            });
            if (addItem){
                self.messages.push(message);
            }
        }
        self.show();
    };

    CustomMessageHandler.prototype.getResponse = function(message, event){
        try{
            var image = event.tile.getImage();
            if (image && image.src && (image.src.toLowerCase().indexOf('&gkt=') < 0 || image.src.toLowerCase().indexOf('?gkt=') < 0)){
                var response = $.ajax({
                    type: "GET",
                    url: image.src,
                    async: false
                }).responseText;
                var responseObject = xml2json.parser(response);
                if (responseObject && responseObject.serviceexceptionreport && responseObject.serviceexceptionreport.serviceexception){
                    var gkterror = responseObject.serviceexceptionreport.serviceexception.split('\n');
                    return message + '<br>' + gkterror[2] + ' ' + gkterror[3].substr(0, gkterror[3].indexOf(' Token:'));
                }
            }
        } catch(err) { }
        return message;
    };


    CustomMessageHandler.prototype.show = function(){
        var self = this;
        if (self.visible){
            return;
        }
        self.visible = true;
        self.el.innerHTML = '';
        self.el.style.opacity = 1;
        self.el.style.visibility = 'visible';
        if (!self.looping){
            self.looping = true;
            self.loopMessages();
        }
    };

    CustomMessageHandler.prototype.hide = function(){
        var self = this;
        if (!self.visible){
            return;
        }
        self.looping = false;
        self.visible = false;
        self.el.style.opacity = 0;
        setTimeout(function(){
            self.el.style.visibility = 'hidden';
        }, 2000);
    };

    CustomMessageHandler.prototype.loopMessages = function(self){
        if (self === undefined){
            self = this;
        }
        if (self.messages.length > 0){
            self.el.innerHTML = _message + self.messages.pop();
            setTimeout(function(){
                self.loopMessages(self);
            }, 1000);
        } else {
            self.hide();
        }
    };

    return {
        // Start up start
        Init: init,
        InitMessage: initMessage,
        // Start up end
        ShowCustomMessage: showCustomMessage
    };
};

var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};
ISY.MapImplementation.OL3.Sources = ISY.MapImplementation.OL3.Sources || {};

ISY.MapImplementation.OL3.Sources.Vector = function(isySubLayer){
    var source;
    var projection = ol.proj.get(isySubLayer.coordinate_system);

    switch (isySubLayer.format){
        case ISY.Domain.SubLayer.FORMATS.geoJson:
            source = new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                projection: projection
            });
            source.set('type', 'ol.source.Vector');
            break;
    }

    return source;
};
var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};
ISY.MapImplementation.OL3.Sources = ISY.MapImplementation.OL3.Sources || {};

ISY.MapImplementation.OL3.Sources.Wfs = function(isySubLayer, offline, parameters, featureObj, eventHandler){
    /* jshint -W024 */
    var strategy;
    //isySubLayer.tiled = true; // todo: just for testing, remove before merge!

    if (isySubLayer.tiled) {
        var newMapRes = [];
        newMapRes[0] = 21664;
        for (var t = 1; t < 18; t++) {
            newMapRes[t] = newMapRes[t - 1] / 2;
        }
        strategy = ol.loadingstrategy.tile(new ol.tilegrid.TileGrid({
            origin: [0, 0, 0],
            resolutions: newMapRes
            //strategy = ol.loadingstrategy.tile(new ol.tilegrid.XYZ({
            //maxZoom: 19
        }));
    } else {
        strategy = ol.loadingstrategy.bbox;
    }
    var projection = ol.proj.get(isySubLayer.coordinate_system);

    var parseResponse = function(response){
        source.dispatchEvent('vectorloadend');
        var featureNamespace;

        if (typeof source.format == 'undefined') {
            var gmlFormat;
            switch (isySubLayer.version) {
                case '1.0.0':
                    gmlFormat = new ol.format.GML2();
                    break;
                case '1.1.0':
                    gmlFormat = new ol.format.GML3();
                    break;
                case '2.0.0':
                    gmlFormat = new ol.format.GML3();
                    break;
                default:
                    gmlFormat = new ol.format.GML();
                    break;
            }

            // TODO: Remove this gigahack when the number of returned coordinates is static (or implement an algorithm that can find the dimension dynamically).
            if (isySubLayer.srs_dimension && isySubLayer.srs_dimension.length > 0) {
                featureNamespace = response.firstChild.firstElementChild.firstElementChild.namespaceURI;
                source.format = new ol.format.WFS({
                    featureType: response.firstChild.firstElementChild.firstElementChild.localName,
                    featureNS: featureNamespace,
                    gmlFormat: gmlFormat
                });

            } else {
                featureNamespace = response.firstChild.namespaceURI;
                source.format = new ol.format.WFS({
                    featureType: isySubLayer.name,
                    featureNS: featureNamespace,
                    gmlFormat: gmlFormat
                });
            }
        }
        if (isySubLayer.srs_dimension === "3") {
            featureNamespace = response.firstChild.firstElementChild.firstElementChild.namespaceURI;
            if (response.firstChild.nodeName.toLowerCase() === "gml:featurecollection") {
                for (var i = 0; i < response.firstChild.childNodes.length; i++) {
                    var member = response.firstChild.childNodes.item(i);
                    if (member.nodeName.toLowerCase() === "gml:featuremember") {
                        for (var j = 0; j < member.childNodes.length; j++) {
                            var feature = member.childNodes.item(j);
                            if (feature.nodeName.toLowerCase() === isySubLayer.name.toLowerCase()) {
                                for (var k = 0; k < feature.childNodes.length; k++) {
                                    var attribute = feature.childNodes.item(k);
                                    for (var l = 0; l < attribute.childNodes.length; l++) {
                                        var attributeType = attribute.childNodes.item(l).nodeName;
                                        if (attributeType.toLowerCase() === "gml:linestring" || attributeType.toLowerCase() === "gml:point") {
                                            var srsAttribute = document.createAttribute("srsDimension");
                                            srsAttribute.value = isySubLayer.srs_dimension;
                                            attribute.firstElementChild.attributes.setNamedItem(srsAttribute);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        var features = source.format.readFeatures(response);
        //
        //var featureIsValid = function (feature){
        //    var geometryIsOk = false;
        //    var getZCoordinate = function (c) {
        //        if (Array.isArray(c)) {
        //            return getZCoordinate(c[c.length - 1]);
        //        }
        //        return c;
        //    };
        //    var geometry = feature.getGeometry();
        //    var coords = geometry.getCoordinates();
        //    var z = getZCoordinate(coords);
        //    if (!isNaN(z)){
        //        geometryIsOk = true;
        //    }
        //    return geometryIsOk;
        //};

        if (features && features.length > 0) {
            //var featureIsOk = true;
            //if (!featureIsValid(features[0])) {
            //    if (console && console.log) {
            //        featureIsOk = false;
            //        console.log(isySubLayer.name + ' does not have valid coordinates!');
            //    }
            //}
            features.forEach(function(featureitem){
                featureitem.set("layerguid", isySubLayer.id);
                //if (!featureIsOk){
                //    var geometry = featureitem.getGeometry();
                //    var coords = geometry.getCoordinates().join(',').split(',');
                //    var newcoords = [];
                //    for (var i = 0; i < coords.length; i+=2){
                //        if(!isNaN(coords[i])) {
                //            newcoords.push([parseFloat(coords[i]), parseFloat(coords[i + 1]), 0]);
                //        }
                //    }
                //    geometry.setCoordinates(newcoords);
                //}
                //if (featureObj) {
                //    if (featureObj.getId() === featureitem.getId()) {
                //        featureObj = featureitem;
                //    }
                //}
            });
            source.addFeatures(features);
        }

        if (features.length > 0) {
            isySubLayer.geometryName = features[0].getGeometryName();
        }
        isySubLayer.featureNS = featureNamespace;

        if (featureObj) {
            if (eventHandler){
                eventHandler.TriggerEvent(ISY.Events.EventTypes.RefreshSourceDone, featureObj);
            }
        }

    };

    var loader = function(extent) {
        source.dispatchEvent('vectorloadstart');
        var url = isySubLayer.url;
        if (Array.isArray(isySubLayer.url)){
            url = isySubLayer.url[0];
        }
        if (url.toLowerCase().indexOf("service=wfs") < 0){
            url += "service=WFS&";
        }
        url += 'request=GetFeature&' +
            'version=' + isySubLayer.version + '&typename=' + isySubLayer.name + '&' +
            'srsname=' + isySubLayer.coordinate_system + '&' +
            'bbox=' + extent.join(',');

        if (parameters){
            // source is refreshed
            for (var index in parameters) {
                url += '&' + index + '=' + parameters[index];
            }
        }
        var isCaching = source.get('caching');
        if (isCaching || offline.IsActive()){
            // We are either offline or in caching mode
            // problem finding unique key here, using extent og zoom for now
            //var key = view.getZoom() + '-' + extent[0] + '-' + extent[1];
            var key = extent[0] + '-' + extent[1];
            // todo: should not use zoom in key, but rather cache the tiles from outmost zoom level
            offline.GetLayerResource(key, isySubLayer.name, url, parseResponse);
        } else {
                $.ajax({
                    url: url
                }).done(function(response) {
                    if (typeof response == 'object'){
                        if (response.firstChild.childElementCount === 0) {
                            return;
                        }
                    } else {
                        return;
                    }
                    parseResponse(response);
                });
        }
    };

    var source = new ol.source.Vector({
        loader: loader,
        strategy: strategy,
        projection: projection
    });
    source.set('type', 'ol.source.Vector');

    //// v3.11.2 bugfix:
    //if (source.getProjection() == null){
    //    if (source.setProjection) {
    //        source.setProjection(projection);
    //    } else if (source.f !== undefined) {
    //        source.f = projection;
    //    }
    //}

    return source;
};

/**
 * Created by Magne Tondel on 2015-05-27.
 */

var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};
ISY.MapImplementation.OL3.Sources = ISY.MapImplementation.OL3.Sources || {};

/**
 * @class
 * Transaction manager to handle inserts, updates and deletes using WFS-T.
 *
 * @constructor
 * @param {string} url.
 * @param {string} featureType.
 * @param {string} featureNS.
 * @param {string} srsName.
 * @param {ol.source.Vector} source.
 */
ISY.MapImplementation.OL3.Sources.WfsT = function (url, featureType, featureNS, srsName, source, eventHandler) {
    var url_ = url;
    var featureType_ = featureType;
    var featureNS_ = featureNS;
    var srsName_ = srsName;
    var source_ = source;
    var serializer_ = new XMLSerializer();

    /**
     * Insert a new feature and handle response.
     * @param {ol.Feature} feature.
     * @return {ol.Feature} feature.
     * @throws {Error} error message.
     */
    function insertFeature(feature, describedSource) {
        if (source_.format === undefined && describedSource === undefined){
            eventHandler.TriggerEvent(ISY.Events.EventTypes.TransactionInsertEnd, false);
            return false;
        }
        if (describedSource !== undefined){
            source_ = describedSource;
        }

        var featureNode = source_.format.writeTransaction([feature], null, null, {
            gmlOptions: {srsName: srsName_},
            featureNS: featureNS_,
            featureType: featureType_
        });

        var featureData = serializer_.serializeToString(featureNode);

        featureData = featureData.replace(/geometry/g, feature.getGeometryName());
        featureData = featureData.replace(/&/g, '&amp;');
        //featureData = featureData.replace("xmlns=\"http://www.opengis.net/gml\"", "xmlns=\"http://www.opengis.net/gml/3.2\"");

        var message = "Error inserting feature: ";
        var okResult = true;

        $.ajax({
            type: "POST",
            url: url_,
            data: featureData,
            async: false,
            success: function (data) {
                var result = readResponse(data);
                if (result === undefined) {
                    okResult = false;
                    message += "Response parse error.";
                }
                else if (typeof result === 'string') {
                    okResult = false;
                    message += result;
                }else if (result.transactionSummary === undefined){
                    okResult = false;
                }
                else if (result && result.transactionSummary.totalInserted === 1) {
                    var gmlId = result.insertIds[0];
                    feature.setId(gmlId);
                    var localId = getLocalId(gmlId);
                    feature.set("lokalId", localId);
                    source_.addFeature(feature);
                }
                else {
                    okResult = false;
                    message += "Feature not inserted.";
                }

                eventHandler.TriggerEvent(ISY.Events.EventTypes.TransactionInsertEnd, okResult);
            },
            error: function (e) {
                var errorMsg = e ? (e.status + ' ' + e.statusText) : "";
                if (errorMsg === "200 parsererror") {
                    errorMsg = "Response parse error.";
                }
                okResult = false;
                message += errorMsg;
                eventHandler.TriggerEvent(ISY.Events.EventTypes.TransactionInsertEnd, okResult);
            }
        });

        if (!okResult) {
            throw new Error(message);
        }
    }

    /**
     * Updates an existing feature and handle response.
     * @param {ol.Feature} feature.
     * @return {boolean} update result.
     * @throws {Error} error message.
     */
    function updateFeature(feature) {
        if (source_.format === undefined){
            eventHandler.TriggerEvent(ISY.Events.EventTypes.TransactionUpdateEnd, false);
            return false;
        }
        var gmlId = feature.getId();
        var properties = feature.getProperties();
        delete properties.bbox;
        var clone = new ol.Feature(properties);
        clone.setId(gmlId);
        //clone.setGeometryName('geometri');
        var featureNamespace = getFeatureNamespace(featureType_);

        var featureNode;
        var featureData;

        if (featureNamespace !== "") {
            featureNode = source_.format.writeTransaction(null, [clone], null, {
                gmlOptions: {srsName: srsName_},
                featureNS: featureNS_,
                featureType: getFeatureName(featureType_),
                featurePrefix: featureNamespace
            });

            featureData = _convertXmlToString(featureNode);//serializer_.serializeToString(featureNode);
            featureData = featureData.replace(/<Name>/g, "<Name>" + featureNamespace + ":");
            //featureData = featureData.replace("xmlns=\"http://www.opengis.net/gml\"", "xmlns=\"http://www.opengis.net/gml/3.2\"");
        }
        else {
            featureNode = source_.format.writeTransaction(null, [clone], null, {
                gmlOptions: {srsName: srsName_},
                featureNS: featureNS_,
                featureType: getFeatureName(featureType_)
            });
            featureData = _convertXmlToString(featureNode);//serializer_.serializeToString(featureNode);
        }

        featureData = featureData.replace('xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"', 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" xmlns="http://www.opengis.net/wfs"');
        featureData = featureData.replace('Filter', 'Filter xmlns="http://www.opengis.net/ogc"');

        featureData = featureData.replace('Point', 'Point xmlns="http://www.opengis.net/gml"');
        featureData = featureData.replace('Polygon', 'Polygon xmlns="http://www.opengis.net/gml"');
        featureData = featureData.replace('LineString', 'LineString xmlns="http://www.opengis.net/gml"');
        featureData = featureData.replace(/&/g, '&amp;');

        var message = "Error updating feature: ";
        var okResult = true;

        $.ajax({
            type: "POST",
            url: url_,
            data: featureData,
            success: function (data) {
                var result = readResponse(data);
                if (result === undefined) {
                    okResult = false;
                    message += "Response parse error.";
                }
                else if (typeof result === 'string') {
                    okResult = false;
                    message += result;
                }else if (result.transactionSummary === undefined){
                    okResult = false;
                }
                else if (result && result.transactionSummary.totalUpdated === undefined) {
                    okResult = false;
                    message += "Response parse error.";
                }
                else if (result && result.transactionSummary.totalUpdated != 1) {
                    okResult = false;
                    message += "Feature not updated.";
                }
                else {
                    var sourceFeature = source_.getFeatureById(gmlId);
                    if (sourceFeature !== undefined) {
                        sourceFeature.setProperties(properties);
                    }
                }
                eventHandler.TriggerEvent(ISY.Events.EventTypes.TransactionUpdateEnd, okResult);
            },
            error: function (e) {
                var errorMsg = e ? (e.status + ' ' + e.statusText) : "";
                if (errorMsg === "200 parsererror") {
                    errorMsg = "Response parse error.";
                }
                okResult = false;
                message += errorMsg;
                eventHandler.TriggerEvent(ISY.Events.EventTypes.TransactionUpdateEnd, okResult);
            }
        });

        if (!okResult) {
            throw new Error(message);
        }
    }

    //var nodeElements = [];
    var resultString = "";

    function _getChildElementToString(node){
        if (node.childElementCount > 0){
            for (var i = 0; i < node.childNodes.length; i++){

                resultString += '<'+node.childNodes[i].nodeName;
                if (node.childNodes[i].attributes.length > 0){
                    for (var j = 0; j < node.childNodes[i].attributes.length; j++){
                        var attribute = node.childNodes[i].attributes[j];
                        resultString += ' ' + attribute.name + '=' + '"' + attribute.value + '"';
                    }
                }
                if (node.childNodes[i].childNodes.length > 0) {
                    resultString += ">";
                }
                if (node.childNodes[i].childElementCount > 0){
                    _getChildElementToString(node.childNodes[i]);
                }else{
                    if (node.childNodes[i].childNodes.length > 0){
                        resultString += node.childNodes[i].childNodes[0].nodeValue;
                        resultString += "</" + node.childNodes[i].nodeName + ">";
                    }else{
                        resultString += "/>";
                    }
                }
            }
        }else{
            resultString += '<'+node.nodeName;
            if (node.attributes.length > 0){
                for (var k = 0; k < node.attributes.length; k++){
                    var attribute1 = node.attributes[k];
                    resultString += ' ' + attribute1.name + '=' + '"' + attribute1.value + '"';
                }
            }
            if (node.childNodes[0].childNodes.length > 0){
                resultString += ">";
                resultString += node.childNodes[0].nodeValue;
                resultString += "</" + node.nodeName + ">";
            }else{
                resultString += "/>";
            }
        }
        resultString += "</" + node.nodeName + ">";
    }

    function _convertXmlToString(xmlDoc){
        var tags = xmlDoc.getElementsByTagName('*');
        var xmlString = '';
        var tagNodeName = [];
        var parentNode = tags[0].parentNode;

        //parent node
        xmlString += '<'+parentNode.nodeName;
        tagNodeName.push(parentNode.nodeName);
        for (var m = 0; m < parentNode.attributes.length; m++){
            var parentAttribute = parentNode.attributes[m];
            xmlString += ' ' + parentAttribute.name + '=' + '"' + parentAttribute.value + '"';
        }
        xmlString += ">";

        //main node
        xmlString += '<'+tags[0].nodeName;
        tagNodeName.push(tags[0].nodeName);
        for (var c = 0; c < tags[0].attributes.length; c++){
            var mainAttribute = tags[0].attributes[c];
            xmlString += ' ' + mainAttribute.name + '=' + '"' + mainAttribute.value + '"';
        }
        xmlString += ">";

        var tag = tags[0]; // tags[0] has all children - not necessary to loop tags
        for (var i = 0; i < tag.childElementCount; i++){
            xmlString += '<'+tag.childNodes[i].nodeName;
            if (tag.childNodes[i].attributes.length > 0){
                for (var b = 0; b < tag.childNodes[i].attributes.length; b++){
                    var attribute = tag.childNodes[i].attributes[b];
                    xmlString += ' ' + attribute.name + '=' + '"' + attribute.value + '"';
                }
            }
            xmlString += ">";
            _getChildElementToString(tag.childNodes[i]);
            xmlString += resultString;
            resultString = "";
        }

        for (var k = tagNodeName.length - 1; k >= 0; k--){
            xmlString += "</" + tagNodeName[k] + ">";
        }
        return xmlString;
    }

    /**
     * Deletes an existing feature and handle response.
     * @param {ol.Feature} feature.
     * @return {boolean} delete result.
     * @throws {Error} error message.
     */
    function deleteFeature(feature) {
        if (source_.format === undefined){
            eventHandler.TriggerEvent(ISY.Events.EventTypes.TransactionRemoveEnd, false);
            return false;
        }

        var featureNode = source_.format.writeTransaction(null, null, [feature], {
            featureNS: featureNS_,
            featureType: getFeatureName(featureType_)
        });

        var featureData = _convertXmlToString(featureNode);//serializer_.serializeToString(featureNode);
        featureData = featureData.replace('xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"', 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" xmlns="http://www.opengis.net/wfs"');
        featureData = featureData.replace('Filter', 'Filter xmlns="http://www.opengis.net/ogc"');

        var message = "Error deleting feature: ";
        var okResult = true;

        $.ajax({
            type: "POST",
            url: url_,
            data: featureData,
            success: function (data) {
                var result = readResponse(data);
                if (result === undefined) {
                    okResult = false;
                    message += "Response parse error.";
                }
                else if (typeof result === 'string') {
                    okResult = false;
                    message += result;
                }
                else if (result.transactionSummary === undefined){
                    okResult = false;
                }
                else if (result && result.transactionSummary.totalDeleted != 1) {
                        okResult = false;
                        message += "Feature not deleted.";
                }

                eventHandler.TriggerEvent(ISY.Events.EventTypes.TransactionRemoveEnd, okResult);
            },
            error: function (e) {
                var errorMsg = e ? (e.status + ' ' + e.statusText) : "";
                if (errorMsg === "200 parsererror") {
                    errorMsg = "Response parse error.";
                }
                okResult = false;
                message += errorMsg;
                eventHandler.TriggerEvent(ISY.Events.EventTypes.TransactionRemoveEnd, okResult);
            }
        });

        if (!okResult) {
            throw new Error(message);
        }
    }

    /**
     * Read the response and handle exceptions.
     * @param {Document} data.
     * @return {Object|string|undefined} result, error text or parse error (undefined).
     */
    function readResponse(data) {
        var result;
        if (window.Document && data instanceof Document && data.documentElement && data.documentElement.localName == 'ExceptionReport') {
            result = (data.getElementsByTagNameNS('http://www.opengis.net/ows', 'ExceptionText').item(0).textContent);
        }
        else {
            result = source_.format.readTransactionResponse(data);
        }
        return result;
    }

    /**
     * Get feature type.
     * @return {String} featureType.
     */
    function getFeatureType() {
        return featureType_;
    }

    /**
     * Get local id from gml id.
     * @param {String} gmlId.
     * @return {String} localId.
     */
    function getLocalId(gmlId) {
        var startIndex = gmlId.indexOf('{');
        if (startIndex != -1) {
            var localId = gmlId.substr(startIndex);
            return localId;
        }
        else {
            return "";
        }
    }

    /**
     * Get feature name from feature type (without namespace).
     * @param {String} featureType.
     * @return {String} featureName.
     */
    function getFeatureName(featureType) {
        var startIndex = featureType.indexOf(':');
        if (startIndex != -1) {
            startIndex++;
            var featureName = featureType.substr(startIndex);
            return featureName;
        }
        else {
            return featureType;
        }
    }

    /**
     * Get feature namespace from feature type (without name).
     * @param {String} featureType.
     * @return {String} featureNamespace.
     */
    function getFeatureNamespace(featureType) {
        var startIndex = featureType.indexOf(':');
        if (startIndex != -1) {
            var featureNamespace = featureType.substr(0, startIndex);
            return featureNamespace;
        }
        else {
            return "";
        }
    }

    return {
        InsertFeature: insertFeature,
        UpdateFeature: updateFeature,
        DeleteFeature: deleteFeature,

        GetFeatureType: getFeatureType
    };
};

var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};
ISY.MapImplementation.OL3.Sources = ISY.MapImplementation.OL3.Sources || {};

ISY.MapImplementation.OL3.Sources.Wms = function(isySubLayer, parameters){
    var url;
    var urls;
    var getUrlParameter = function(url){
        var urlParameter = '';
        if (parameters) {
            for (var index in parameters) {
                if (urlParameter.length > 0){
                    urlParameter += '&';
                }
                urlParameter += index + '=' + parameters[index];
            }
            if (url.indexOf('?') > 0){
                url += '&';
            } else {
                url += '?';
            }
            url += urlParameter;
        }
        return url;
    };
    if (Array.isArray(isySubLayer.url)){
        urls = isySubLayer.url;
        for (var i = 0; i < urls.length; i++){
            urls[i] = getUrlParameter(urls[i]);
        }
    } else {
        url = isySubLayer.url;
        url = getUrlParameter(url);
    }
    var source;

    if (isySubLayer.tiled) {
        source = new ol.source.TileWMS({
            params: {
                LAYERS: isySubLayer.name,
                VERSION: "1.1.1",
                FORMAT: isySubLayer.format
            },
            url: url,
            urls: urls,
            crossOrigin: isySubLayer.crossOrigin,
            transparent: isySubLayer.transparent
        });
        source.set('type', 'ol.source.TileWMS');
    } else {
        if (url === undefined){
            url = urls[urls.length - 1];
        }
        source = new ol.source.ImageWMS({
            params: {
                LAYERS: isySubLayer.name,
                VERSION: "1.1.1",
                FORMAT: isySubLayer.format
            },
            ratio: 1,
            url: url,
            crossOrigin: isySubLayer.crossOrigin,
            transparent: isySubLayer.transparent
        });
        source.set('type', 'ol.source.ImageWMS');
    }
    return source;
};

var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};
ISY.MapImplementation.OL3.Sources = ISY.MapImplementation.OL3.Sources || {};

ISY.MapImplementation.OL3.Sources.Wmts = function(isySubLayer, parameters){
    var projection = new ol.proj.Projection({
        code: isySubLayer.coordinate_system,
        extent: isySubLayer.extent,
        units: isySubLayer.extentUnits
    });
    var getUrlParameter = function(){
        var urlParameter = '';
        if (parameters) {
            for (var index in parameters) {
                urlParameter += '&' + index + '=' + parameters[index];
            }
        }
        return urlParameter;
    };

    var projectionExtent = projection.getExtent();
    var size = isySubLayer.matrixPrefix ? ol.extent.getWidth(projectionExtent) / 256 : 4096;
    var resolutions = new Array(isySubLayer.numZoomLevels);
    var matrixIds = new Array(isySubLayer.numZoomLevels);
    var matrixSet = isySubLayer.matrixSet;
    if (matrixSet === null || matrixSet === '' || matrixSet === undefined)
    {
        matrixSet = isySubLayer.matrixPrefix ? isySubLayer.coordinate_system : parseInt(isySubLayer.coordinate_system.substr(isySubLayer.coordinate_system.indexOf(':') + 1), 10);
    }
    for (var z = 0; z < isySubLayer.numZoomLevels; ++z) {
        resolutions[z] = size / Math.pow(2, z);
        matrixIds[z] = isySubLayer.matrixPrefix ? matrixSet + ":" + z : matrixIds[z] = z;
    }

    var url;
    var urls;
    if (!Array.isArray(isySubLayer.url) || isySubLayer.url.length === 1) {
        url = isySubLayer.url[0];
        url += getUrlParameter();
    } else {
        urls = isySubLayer.url;
        for (var i = 0; i < urls.length; i++){
            urls[i] += getUrlParameter();
        }
    }

    var source = new ol.source.WMTS({
        url: url,
        urls: urls,
        layer: isySubLayer.name,
        format: isySubLayer.format,
        projection: projection,
        matrixSet: matrixSet,
        crossOrigin: isySubLayer.crossOrigin,
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
        }),
        style: 'default',
        wrapX: true
    });
    source.set('type', 'ol.source.WMTS');

    var oldTileLoadFunction = source.tileLoadFunction;

    var newTileLoadFunction = function(extent, url){
        var tmpurl = url.split('&');
        var newurl = '';
        for (var i = 0; i < tmpurl.length; i++){
            var aurl = tmpurl[i].split('=');
            if (i === 0) {
                var pos = aurl[0].indexOf('?');
                newurl = aurl[0].substr(0, pos + 1);
                newurl += aurl[0].substr(pos + 1).toUpperCase();
            } else {
                newurl += '&' + aurl[0].toUpperCase();
            }
            newurl += '=' + aurl[1];
        }
        //console.log(newurl);
        oldTileLoadFunction(extent, newurl);
    };
    source.tileLoadFunction = newTileLoadFunction;

    return source;
};

var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};
ISY.MapImplementation.OL3.Styles = ISY.MapImplementation.OL3.Styles || {};

ISY.MapImplementation.OL3.Styles.Default = function () {
    var styles = function() {
        var fill = new ol.style.Fill({
            color: 'rgba(255,0,0,0.8)'
        });
        var stroke = new ol.style.Stroke({
            color: '#3399CC',
            width: 2.25
        });
        var styles = [
            new ol.style.Style({
                image: new ol.style.Circle({
                    fill: fill,
                    stroke: stroke,
                    radius: 8
                }),
                fill: fill,
                stroke: stroke
            })
        ];
        return styles;
    };

    return {
        Styles: styles
    };
};
var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};
ISY.MapImplementation.OL3.Styles = ISY.MapImplementation.OL3.Styles || {};

ISY.MapImplementation.OL3.Styles.Json = function (style) {

    var _zIndex = 0;

    function _createStyle(feature, jsonstyle, hover){
        var jsonobject = (typeof jsonstyle == "object") ? jsonstyle : JSON.parse(jsonstyle);
        var currentstyle = [];
        _zIndex++;
        currentstyle.push(new ol.style.Style({
            fill: _createFillStyle(jsonobject),
            icon: _createIconStyle(jsonobject, hover),
            image: _createImageStyle(jsonobject, hover),
            stroke: _createStrokeStyle(jsonobject, hover),
            text: _createTextStyle(feature, jsonobject, hover),
            zIndex: _zIndex
        }));
        return currentstyle;
    }

    function _createFillStyle(jsonstyle){
        if (jsonstyle.fill){
            return new ol.style.Fill(jsonstyle.fill);
        }
    }

    function _createIconStyle(jsonstyle){
        if (jsonstyle.icon){
            return new ol.style.Icon(jsonstyle.icon);
        }
    }

    function _createImageStyle(jsonstyle, hover){
        if (jsonstyle.image){
            return new ol.style.Circle({
                radius: hover ? jsonstyle.image.radius * 1.2 : jsonstyle.image.radius,
                fill: _createFillStyle(jsonstyle.image),
                stroke: _createStrokeStyle(jsonstyle.image)
            });
        } else if (jsonstyle.regularshape){
            var angle = parseInt(jsonstyle.regularshape.angle, 10);
            var rotation = parseInt(jsonstyle.regularshape.rotation, 10);
            return new ol.style.RegularShape({
                fill: _createFillStyle(jsonstyle.regularshape),
                stroke: _createStrokeStyle(jsonstyle.regularshape),
                radius: hover ? jsonstyle.regularshape.radius * 1.2 : jsonstyle.regularshape.radius,
                radius2: hover ? jsonstyle.regularshape.radius2 * 1.2 : jsonstyle.regularshape.radius2,
                points: jsonstyle.regularshape.points,
                rotation: (rotation > 0) ? Math.PI / rotation : 0,
                angle: (angle > 0) ? Math.PI / angle : 0
            });
        }
    }

    function _createStrokeStyle(jsonstyle, hover){
        if (jsonstyle.stroke){
            if (hover){
                jsonstyle.stroke.width *= 2;
            }
            return new ol.style.Stroke(jsonstyle.stroke);
        }
    }

    function _createTextStyle(feature, jsonstyle, hover){
        if (jsonstyle.text){
            if (hover){
                if (jsonstyle.text.scale){
                    jsonstyle.text.scale *= 1.2;
                }
                if (jsonstyle.text.rotation){
                    jsonstyle.text.rotation *= -1;
                }
            }
            jsonstyle.text.text = _parseTextFilter(feature, jsonstyle.text.text);
            jsonstyle.text.fill = _createFillStyle(jsonstyle.text);
            jsonstyle.text.stroke = _createStrokeStyle(jsonstyle.text);
            return new ol.style.Text(jsonstyle.text);
        }
    }

    function _parseTextFilter(feature, text) {
        if (text) {
            var pos0 = text.indexOf('{');
            if (pos0 < 0) {
                return text;
            }
            var label = '';
            while (pos0 >= 0) {
                if (pos0 > 0) {
                    label += text.substr(0, pos0);
                    text = text.slice(pos0);
                    pos0 = text.indexOf('{');
                }
                var pos1 = text.indexOf('}');
                var fieldname = text.substr(pos0 + 1, pos1 - pos0 - 1);
                var fieldvalue = feature.get(fieldname);
                if (fieldvalue) {
                    label += fieldvalue;
                }
                text = text.slice(pos1 + 1);
                pos0 = text.indexOf('{');
            }
            return label + text;
        }
    }

    var getStyle = function(feature){
        if (feature) {
            var properties = feature.getProperties();
            if (properties.style){
                feature.setStyle(_createStyle(feature, properties.style));
                return;
            }
            return _createStyle(feature, style);
        }
    };

    var getHoverStyle = function(feature){
        if (feature) {
            return _createStyle(feature, style, true);
        }
    };

    return {
        GetStyle: getStyle,
        GetHoverStyle: getHoverStyle
    };
};
var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};
ISY.MapImplementation.OL3.Styles = ISY.MapImplementation.OL3.Styles || {};

ISY.MapImplementation.OL3.Styles.Measure = function(){
    var styles = function(){
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.8)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        });
    };

    var drawStyles = function(){
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.5)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(160, 0, 0, 0.5)',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: 'rgba(160, 0, 0, 0.8)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(255, 255, 255, 0.8)',
                    width: 2
                })
            })
        });
    };

    return {
        DrawStyles: drawStyles,
        Styles: styles
    };
};
var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};
ISY.MapImplementation.OL3.Styles = ISY.MapImplementation.OL3.Styles || {};

ISY.MapImplementation.OL3.Styles.Sld = function () {
    var styles = [
        new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.6)'
            }),
            stroke: new ol.style.Stroke({
                color: '#319FD3',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 3,
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.6)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#319FD3',
                    width: 2
                })
            }),
            text: new ol.style.Text({
                font: '12px Calibri,sans-serif',
                fill: new ol.style.Fill({
                    color: '#000'
                }),
                stroke: new ol.style.Stroke({
                    color: '#fff',
                    width: 3
                })
            })
        })
    ];

    var sld;

    /*
     ol.style.Style({
     fill: new ol.style.Fill(),
     image: new ol.style.Image(),
     stroke: new ol.style.Stroke(),
     text: new ol.style.Text()
     }
     */

    /*
     var parseSymbolizer = function(symbolizernode){
     return symbolizernode;
     };
     var parseStyle = function(stylenode){
     var rulenodes = stylenode.getElementsByTagName('Rule');
     $(rulenodes).each(function(ruleindex, rulenode){
     $(rulenode.childNodes).each(function(index, childnode) {
     if (childnode.nodeName.indexOf('Symbolizer') > 0) {
     var symbolizer = parseSymbolizer(childnode, ruleindex);
     //console.log(ruleindex + ':');
     console.log(symbolizer);
     }
     });
     });
     };
     */

    var readers = {
        "sld": {
            "StyledLayerDescriptor": function(node, sld) {
                sld.version = node.getAttribute("version");
                this.readChildNodes(node, sld);
            },
            "Name": function(node, obj) {
                obj.name = this.getChildValue(node);
            },
            "Title": function(node, obj) {
                obj.title = this.getChildValue(node);
            },
            "Abstract": function(node, obj) {
                obj.description = this.getChildValue(node);
            },
            "NamedLayer": function(node, sld) {
                var layer = {
                    userStyles: [],
                    namedStyles: []
                };
                this.readChildNodes(node, layer);
                // give each of the user styles this layer name
                for(var i=0, len=layer.userStyles.length; i<len; ++i) {
                    layer.userStyles[i].layerName = layer.name;
                }
                if(Array.isArray(sld.namedLayers)) {
                    sld.namedLayers.push(layer);
                } else {
                    sld.namedLayers[layer.name] = layer;
                }
            },
            "NamedStyle": function(node, layer) {
                layer.namedStyles.push(
                    this.getChildName(node.firstChild)
                );
            },
            "UserStyle": function(node, layer) {
                var self = this;
                var obj = {defaultsPerSymbolizer: true, rules: []};
                this.featureTypeCounter = -1;
                this.readChildNodes(node, obj);
                var style;
                var isDefault = obj.isDefault ? obj.isDefault : false;
                if (this.multipleSymbolizers) {
                    delete obj.defaultsPerSymbolizer;
                    style = new ol.style.Style(obj);
                } else {
                    $(obj.rules).each(function(item, rule){
                        var polygonstyle = rule.symbolizer.Polygon;
                        var pointstyle = rule.symbolizer.Point;
                        var linestyle = rule.symbolizer.Line;
                        var textstyle = rule.symbolizer.Text;

                        var fillstyle, strokestyle, imagestyle;
                        if (polygonstyle) {
                            if (polygonstyle.fill) {
                                fillstyle = new ol.style.Fill({
                                    color: self.getColorValue(polygonstyle.fillColor, polygonstyle.fillOpacity)
                                });
                            }
                            if (polygonstyle.stroke) {
                                if (polygonstyle.strokeColor !== undefined && polygonstyle.strokeWidth !== undefined){
                                    strokestyle = new ol.style.Stroke({
                                        color: self.getColorValue(polygonstyle.strokeColor, polygonstyle.strokeOpacity),
                                        width: parseInt(polygonstyle.strokeWidth.trim(), 10),
                                        lineDash: polygonstyle.strokeDashstyle ? polygonstyle.strokeDashstyle.split(' ') : undefined
                                    });
                                }
                            }
                        } else if (pointstyle) {
                            if (pointstyle.fill){
                                fillstyle = new ol.style.Fill({
                                    color: self.getColorValue(pointstyle.fillColor, pointstyle.fillOpacity)
                                });
                            }
                            if (pointstyle.stroke){
                                if (pointstyle.strokeColor !== undefined || pointstyle.strokeWidth !== undefined) {
                                    strokestyle = new ol.style.Stroke({
                                        color: self.getColorValue(pointstyle.strokeColor, pointstyle.strokeOpacity),
                                        width: pointstyle.strokeWidth ? parseInt(pointstyle.strokeWidth.trim(), 10) : undefined,
                                        lineDash: pointstyle.strokeDashstyle ? pointstyle.strokeDashstyle.split(' ') : undefined
                                    });
                                }
                            }
                            if (pointstyle.label){
                                if (pointstyle.outlineColor === undefined){
                                    pointstyle.outlineColor = '#ffffff';
                                }
                                if (pointstyle.outlineWidth === undefined){
                                    pointstyle.outlineWidth = '3';
                                }
                                textstyle = new ol.style.Text({
                                    textAlign: self.getAlignValue(pointstyle.labelAnchorPointX),
                                    textBaseline: self.getBaselineValue(pointstyle.labelAnchorPointY),
                                    font: self.getFontValue(pointstyle),
                                    text: pointstyle.label,
                                    fill: new ol.style.Fill({
                                        color: self.getColorValue(pointstyle.fontColor, pointstyle.fontOpacity)
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: pointstyle.outlineColor ? self.getColorValue(pointstyle.outlineColor) : self.getColorValue(pointstyle.fontColor, pointstyle.fontOpacity),
                                        width: pointstyle.outlineWidth ? parseInt(pointstyle.outlineWidth, 10) : undefined
                                    }),
                                    offsetX: pointstyle.labelXOffset ? parseInt(pointstyle.labelXOffset, 10) : undefined,
                                    offsetY: pointstyle.labelYOffset ? parseInt(pointstyle.labelYOffset, 10) : undefined,
                                    rotation: pointstyle.rotation ? parseFloat(pointstyle.rotation) : undefined
                                });
                            }
                            if (pointstyle.graphic){
                                if (pointstyle.externalGraphic){
                                    var imageopacity = pointstyle.fillOpacity ? parseFloat(pointstyle.fillOpacity) : undefined;
                                    imagestyle = new ol.style.Icon({
                                        opacity: imageopacity,
                                        //size: [2*pointstyle.pointRadius, 2*pointstyle.pointRadius],
                                        //scale: 0.4,
                                        src: pointstyle.externalGraphic
                                    });
                                    fillstyle = undefined;
                                    strokestyle = undefined;
                                } else {
                                    switch (pointstyle.graphicName) {
                                        case 'circle':
                                            imagestyle = new ol.style.Circle({
                                                radius: parseInt(pointstyle.pointRadius, 10),
                                                stroke: strokestyle,
                                                fill: fillstyle
                                            });
                                            break;
                                        case 'cross':
                                            imagestyle = new ol.style.RegularShape({
                                                radius: parseInt(pointstyle.pointRadius, 10),
                                                radius2: 0,
                                                points: 4,
                                                stroke: strokestyle,
                                                fill: fillstyle
                                            });
                                            break;
                                        case 'star':
                                            imagestyle = new ol.style.RegularShape({
                                                radius: parseInt(pointstyle.pointRadius, 10),
                                                radius2: parseInt(pointstyle.pointRadius, 10) / 3,
                                                points: 5,
                                                stroke: strokestyle,
                                                fill: fillstyle
                                            });
                                            break;
                                        case 'square':
                                            imagestyle = new ol.style.RegularShape({
                                                radius: parseInt(pointstyle.pointRadius, 10),
                                                points: 4,
                                                angle: Math.PI / 4,
                                                stroke: strokestyle,
                                                fill: fillstyle
                                            });
                                            break;
                                        case 'triangle':
                                            imagestyle = new ol.style.RegularShape({
                                                radius: parseInt(pointstyle.pointRadius, 10),
                                                points: 3,
                                                stroke: strokestyle,
                                                fill: fillstyle
                                            });
                                            break;
                                        case 'x':
                                            imagestyle = new ol.style.RegularShape({
                                                radius: parseInt(pointstyle.pointRadius, 10),
                                                radius2: 0,
                                                points: 4,
                                                angle: Math.PI / 4,
                                                stroke: strokestyle,
                                                fill: fillstyle
                                            });
                                            break;
                                    }
                                }
                            }
                        } else if (linestyle){
                            if (linestyle.fill){
                                fillstyle = new ol.style.Fill({
                                    color: self.getColorValue(linestyle.fillColor, linestyle.fillOpacity)
                                });
                            }
                            if (linestyle.stroke){
                                strokestyle = new ol.style.Stroke({
                                    color: self.getColorValue(linestyle.strokeColor, linestyle.strokeOpacity),
                                    width: self.getStrokeWidth(linestyle.strokeWidth),
                                    lineDash: self.getStrokeDashstyle(linestyle.strokeDashstyle)
                                });
                            }
                            if (linestyle.graphic && linestyle.graphicName == 'circle'){
                                imagestyle = new ol.style.Circle({
                                    radius: parseInt(linestyle.pointRadius, 10),
                                    fill: fillstyle
                                });
                                fillstyle = undefined;
                            }
                        }
                        style = new ol.style.Style({
                            fill: fillstyle,
                            image: imagestyle,
                            stroke: strokestyle
                        });
                        layer.userStyles.push({isDefault: isDefault, style: style, rule: rule});
                        if (textstyle){
                            style = new ol.style.Style({
                                text: textstyle
                            });
                            layer.userStyles.push({isDefault: isDefault, style: style, rule: rule});
                        }
                    });
                }
            },
            "IsDefault": function(node, style) {
                if(this.getChildValue(node) == "1") {
                    style.isDefault = true;
                }
            },
            "FeatureTypeStyle": function(node, style) {
                ++this.featureTypeCounter;
                var obj = {
                    rules: this.multipleSymbolizers ? style.rules : []
                };
                this.readChildNodes(node, obj);
                if (!this.multipleSymbolizers) {
                    style.rules = obj.rules;
                }
            },
            "Rule": function(node, obj) {
                var config;
                if (this.multipleSymbolizers) {
                    config = {symbolizers: []};
                }
                //var rule = new OpenLayers.Rule(config);
                var rule = {symbolizer:[]};
                rule.symbolizer = {
                    fill: false,
                    stroke: false,
                    graphic: false
                };
                this.readChildNodes(node, rule);
                obj.rules.push(rule);
            },
            "ElseFilter": function(node, rule) {
                rule.elseFilter = true;
            },
            "MinScaleDenominator": function(node, rule) {
                rule.minScaleDenominator = parseFloat(this.getChildValue(node));
            },
            "MaxScaleDenominator": function(node, rule) {
                rule.maxScaleDenominator = parseFloat(this.getChildValue(node));
            },
            "LabelPlacement": function(node, symbolizer) {
                this.readChildNodes(node, symbolizer);
            },
            "PointPlacement": function(node, symbolizer) {
                var config = {};
                this.readChildNodes(node, config);
                config.labelRotation = config.rotation;
                delete config.rotation;
                var labelAlign,
                    x = symbolizer.labelAnchorPointX,
                    y = symbolizer.labelAnchorPointY;
                if (x <= 1/3) {
                    labelAlign = 'l';
                } else if (x > 1/3 && x < 2/3) {
                    labelAlign = 'c';
                } else if (x >= 2/3) {
                    labelAlign = 'r';
                }
                if (y <= 1/3) {
                    labelAlign += 'b';
                } else if (y > 1/3 && y < 2/3) {
                    labelAlign += 'm';
                } else if (y >= 2/3) {
                    labelAlign += 't';
                }
                config.labelAlign = labelAlign;
                console.error("PointPlacement is not implemented");
                //OpenLayers.Util.applyDefaults(symbolizer, config);
            },
            "AnchorPoint": function(node, symbolizer) {
                this.readChildNodes(node, symbolizer);
            },
            "AnchorPointX": function(node, symbolizer) {
                var labelAnchorPointX = this.readers.ogc._expression.call(this, node);
                // always string, could be empty string
                if(labelAnchorPointX) {
                    symbolizer.labelAnchorPointX = labelAnchorPointX;
                }
            },
            "AnchorPointY": function(node, symbolizer) {
                var labelAnchorPointY = this.readers.ogc._expression.call(this, node);
                // always string, could be empty string
                if(labelAnchorPointY) {
                    symbolizer.labelAnchorPointY = labelAnchorPointY;
                }
            },
            "Displacement": function(node, symbolizer) {
                this.readChildNodes(node, symbolizer);
            },
            "DisplacementX": function(node, symbolizer) {
                var labelXOffset = this.readers.ogc._expression.call(this, node);
                // always string, could be empty string
                if(labelXOffset) {
                    symbolizer.labelXOffset = labelXOffset;
                }
            },
            "DisplacementY": function(node, symbolizer) {
                var labelYOffset = this.readers.ogc._expression.call(this, node);
                // always string, could be empty string
                if(labelYOffset) {
                    symbolizer.labelYOffset = labelYOffset;
                }
            },
            "LinePlacement": function(node, symbolizer) {
                this.readChildNodes(node, symbolizer);
            },
            "PerpendicularOffset": function(node, symbolizer) {
                var labelPerpendicularOffset = this.readers.ogc._expression.call(this, node);
                // always string, could be empty string
                if(labelPerpendicularOffset) {
                    symbolizer.labelPerpendicularOffset = labelPerpendicularOffset;
                }
            },
            "Label": function(node, symbolizer) {
                var value = this.readers.ogc._expression.call(this, node);
                if (value) {
                    symbolizer.label = value;
                }
            },
            "Font": function(node, symbolizer) {
                this.readChildNodes(node, symbolizer);
            },
            "Halo": function(node, symbolizer) {
                // halo has a fill, so send fresh object
                var obj = {};
                this.readChildNodes(node, obj);
                symbolizer.haloRadius = obj.haloRadius;
                symbolizer.haloColor = obj.fillColor;
                symbolizer.haloOpacity = obj.fillOpacity;
            },
            "Radius": function(node, symbolizer) {
                var radius = this.readers.ogc._expression.call(this, node);
                if(radius != null) {
                    // radius is only used for halo
                    symbolizer.haloRadius = radius;
                }
            },
            "RasterSymbolizer": function(node, rule) {
                var config = {};
                this.readChildNodes(node, config);
                if (this.multipleSymbolizers) {
                    config.zIndex = this.featureTypeCounter;
                    rule.symbolizers.push(
                        new OpenLayers.Symbolizer.Raster(config)
                    );
                } else {
                    rule.symbolizer["Raster"] = OpenLayers.Util.applyDefaults(
                        config, rule.symbolizer["Raster"]
                    );
                }
            },
            "Geometry": function(node, obj) {
                obj.geometry = {};
                this.readChildNodes(node, obj.geometry);
            },
            "ColorMap": function(node, symbolizer) {
                symbolizer.colorMap = [];
                this.readChildNodes(node, symbolizer.colorMap);
            },
            "ColorMapEntry": function(node, colorMap) {
                var q = node.getAttribute("quantity");
                var o = node.getAttribute("opacity");
                colorMap.push({
                    color: node.getAttribute("color"),
                    quantity: q !== null ? parseFloat(q) : undefined,
                    label: node.getAttribute("label") || undefined,
                    opacity: o !== null ? parseFloat(o) : undefined
                });
            },
            "LineSymbolizer": function(node, rule) {
                var config = {};
                this.readChildNodes(node, config);
                if (this.multipleSymbolizers) {
                    config.zIndex = this.featureTypeCounter;
                    rule.symbolizers.push(
                        new OpenLayers.Symbolizer.Line(config)
                    );
                } else {
                    rule.symbolizer["Line"] = config;
                }
            },
            "PolygonSymbolizer": function(node, rule) {
                var config = {
                    fill: false,
                    stroke: false
                };
                if (!this.multipleSymbolizers) {
                    config = rule.symbolizer["Polygon"] || config;
                }
                this.readChildNodes(node, config);
                if (this.multipleSymbolizers) {
                    config.zIndex = this.featureTypeCounter;
                    rule.symbolizers.push(
                        new OpenLayers.Symbolizer.Polygon(config)
                    );
                } else {
                    rule.symbolizer["Polygon"] = config;
                }
            },
            "PointSymbolizer": function(node, rule) {
                var config = {
                    fill: false,
                    stroke: false,
                    graphic: false
                };
                if (!this.multipleSymbolizers) {
                    config = rule.symbolizer["Point"] || config;
                }
                this.readChildNodes(node, config);
                if (this.multipleSymbolizers) {
                    config.zIndex = this.featureTypeCounter;
                    rule.symbolizers.push(
                        new OpenLayers.Symbolizer.Point(config)
                    );
                } else {
                    rule.symbolizer["Point"] = config;
                }
            },
            "TextSymbolizer": function(node, rule) {
                var config = {};
                this.readChildNodes(node, config);
                if (this.multipleSymbolizers) {
                    config.zIndex = this.featureTypeCounter;
                    rule.symbolizers.push(
                        new OpenLayers.Symbolizer.Text(config)
                    );
                } else {
                    rule.symbolizer["Text"] = config;
                }
            },
            "Stroke": function(node, symbolizer) {
                symbolizer.stroke = true;
                this.readChildNodes(node, symbolizer);
            },
            "Fill": function(node, symbolizer) {
                symbolizer.fill = true;
                this.readChildNodes(node, symbolizer);
            },
            "CssParameter": function(node, symbolizer) {
                var cssProperty = node.getAttribute("name");
                var symProperty = this.cssMap[cssProperty];
                // for labels, fill should map to fontColor and fill-opacity
                // to fontOpacity
                if (symbolizer.label) {
                    if (cssProperty === 'fill') {
                        symProperty = "fontColor";
                    } else if (cssProperty === 'fill-opacity') {
                        symProperty = "fontOpacity";
                    }
                }
                if(symProperty) {
                    // Limited support for parsing of OGC expressions
                    var value = this.readers.ogc._expression.call(this, node);
                    // always string, could be an empty string
                    if(value) {
                        symbolizer[symProperty] = value;
                    }
                }
            },
            "Graphic": function(node, symbolizer) {
                symbolizer.graphic = true;
                var graphic = {};
                // painter's order not respected here, clobber previous with next
                this.readChildNodes(node, graphic);
                // directly properties with names that match symbolizer properties
                var properties = [
                    "stroke", "strokeColor", "strokeWidth", "strokeOpacity",
                    "strokeLinecap", "fill", "fillColor", "fillOpacity",
                    "graphicName", "rotation", "graphicFormat"
                ];
                var prop, value;
                for(var i=0, len=properties.length; i<len; ++i) {
                    prop = properties[i];
                    value = graphic[prop];
                    if(value !== undefined) {
                        symbolizer[prop] = value;
                    }
                }
                // set other generic properties with specific graphic property names
                if(graphic.opacity !== undefined) {
                    symbolizer.graphicOpacity = graphic.opacity;
                }
                if(graphic.size !== undefined) {
                    var pointRadius = graphic.size / 2;
                    if (isNaN(pointRadius)) {
                        // likely a property name
                        symbolizer.graphicWidth = graphic.size;
                    } else {
                        symbolizer.pointRadius = graphic.size / 2;
                    }
                }
                if(graphic.href !== undefined) {
                    symbolizer.externalGraphic = graphic.href;
                }
                if(graphic.rotation !== undefined) {
                    symbolizer.rotation = graphic.rotation;
                }
            },
            "ExternalGraphic": function(node, graphic) {
                this.readChildNodes(node, graphic);
            },
            "Mark": function(node, graphic) {
                this.readChildNodes(node, graphic);
            },
            "WellKnownName": function(node, graphic) {
                graphic.graphicName = this.getChildValue(node);
            },
            "Opacity": function(node, obj) {
                var opacity = this.readers.ogc._expression.call(this, node);
                // always string, could be empty string
                if(opacity) {
                    obj.opacity = opacity;
                }
            },
            "Size": function(node, obj) {
                var size = this.readers.ogc._expression.call(this, node);
                // always string, could be empty string
                if(size) {
                    obj.size = size;
                }
            },
            "Rotation": function(node, obj) {
                var rotation = this.readers.ogc._expression.call(this, node);
                // always string, could be empty string
                if(rotation) {
                    obj.rotation = rotation;
                }
            },
            "OnlineResource": function(node, obj) {
                obj.href = this.getAttributeNS(
                    node, this.namespaces.xlink, "href"
                );
            },
            "Format": function(node, graphic) {
                graphic.graphicFormat = this.getChildValue(node);
            }
        },
        "ogc": {
            "_expression": function(node) {
                // only the simplest of ogc:expression handled
                // "some text and an <PropertyName>attribute</PropertyName>"}
                var obj, value = "";
                for(var child=node.firstChild; child; child=child.nextSibling) {
                    switch(child.nodeType) {
                        case 1:
                            obj = this.readNode(child);
                            if (obj.property) {
                                value += "${" + obj.property + "}";
                            } else if (obj.value !== undefined) {
                                value += obj.value;
                            }
                            break;
                        case 3: // text node
                        case 4: // cdata section
                            value += child.nodeValue;
                    }
                }
                return value;
            },
            "Filter": function(node, parent) {
                // Filters correspond to subclasses of OpenLayers.Filter.
                // Since they contain information we don't persist, we
                // create a temporary object and then pass on the filter
                // (ogc:Filter) to the parent obj.
                var obj = {
                    fids: [],
                    filters: []
                };
                this.readChildNodes(node, obj);
                if(obj.fids.length > 0) {
                    parent.filter = {
                        fids: obj.fids
                    };
                } else if(obj.filters.length > 0) {
                    parent.filter = obj.filters[0];
                }
            },
            "FeatureId": function(node, obj) {
                var fid = node.getAttribute("fid");
                if(fid) {
                    obj.fids.push(fid);
                }
            },
            "And": function(node, obj) {
                var filter = {
                    filters: ["&&"]
                };
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "Or": function(node, obj) {
                var filter = {
                    filters:["||"]
                };
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "Not": function(node, obj) {
                var filter = {
                    filters:["!"]
                };
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsLike": function(node, obj) {
                var filter = {
                    operator: "=="
                };
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsEqualTo": function(node, obj) {
                var filter = {
                    operator: "=="
                };
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsNotEqualTo": function(node, obj) {
                var filter = {
                    operator: "!="
                };
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsLessThan": function(node, obj) {
                var filter = {
                    operator: "<"
                };
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsGreaterThan": function(node, obj) {
                var filter = {
                    operator: ">"
                };
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsLessThanOrEqualTo": function(node, obj) {
                var filter = {
                    operator: "<="
                };
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsGreaterThanOrEqualTo": function(node, obj) {
                var filter = {
                    operator: ">="
                };
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "PropertyIsBetween": function(node, obj) {
                var filter = {
                    operator: ".."
                };
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            },
            "Literal": function(node, obj) {
                obj.value = this.getChildValue(node);
            },
            "PropertyName": function(node, filter) {
                filter.property = this.getChildValue(node);
            },
            "LowerBoundary": function(node, filter) {
                filter.lowerBoundary = this.readers.ogc._expression.call(this, node);
            },
            "UpperBoundary": function(node, filter) {
                filter.upperBoundary = this.readers.ogc._expression.call(this, node);
            },
            /*"Intersects": function(node, obj) {
             this.readSpatial(node, obj, OpenLayers.Filter.Spatial.INTERSECTS);
             },
             "Within": function(node, obj) {
             this.readSpatial(node, obj, OpenLayers.Filter.Spatial.WITHIN);
             },
             "Contains": function(node, obj) {
             this.readSpatial(node, obj, OpenLayers.Filter.Spatial.CONTAINS);
             },
             "DWithin": function(node, obj) {
             this.readSpatial(node, obj, OpenLayers.Filter.Spatial.DWITHIN);
             },
             "Distance": function(node, obj) {
             obj.distance = parseInt(this.getChildValue(node), 10);
             obj.distanceUnits = node.getAttribute("units");
             },*/
            /*"Function": function(node, obj) {
             //TODO write decoder for it
             return;
             },*/
            "PropertyIsNull": function(node, obj) {
                var filter = {
                    operator: "NULL"
                };
                this.readChildNodes(node, filter);
                obj.filters.push(filter);
            }
        }
    };

    var parseSld = function(response, zindex){
        if (typeof response == 'undefined'){
            return styles;
        }
        if (typeof response == 'string'){
            response = ol.xml.parse(response);
        }

        sld = {namedLayers: []};
        this.readChildNodes(response, sld);

        //console.log(sld);
        /*
         var userStyles = response.getElementsByTagName('UserStyle');

         var thisstyle = [];
         $(userStyles).each(function(index, userstyle){
         if (index === 0) {
         thisstyle.push(parseStyle(userstyle));
         }
         });
         console.log(thisstyle.length);
         */
        styles = [];
        //styles.push(sld.namedLayers[0].userStyles[1]);
        //styles.push(sld.namedLayers[0].userStyles[0].style);
        var scales = {
            maxScaleDenominator: 1,
            minScaleDenominator: Infinity
        };
        $(sld.namedLayers[0].userStyles).each(function(index, userstyle){
            var style = userstyle.style;
            if (zindex) {
                style.setZIndex(zindex);
            }
            styles.push(style);
            if (userstyle.rule){
                if (userstyle.rule.maxScaleDenominator && (scales.maxScaleDenominator < userstyle.rule.maxScaleDenominator)) {
                    scales.maxScaleDenominator = userstyle.rule.maxScaleDenominator;
                }
                if (userstyle.rule.minScaleDenominator && (scales.minScaleDenominator > userstyle.rule.minScaleDenominator)) {
                    scales.minScaleDenominator = userstyle.rule.minScaleDenominator;
                }
            }
        });
        if (scales.maxScaleDenominator == 1){
            scales.maxScaleDenominator = undefined;
        }
        if (scales.minScaleDenominator == Infinity){
            scales.minScaleDenominator = undefined;
        }
        return scales;
    };

    var parseFilterProperty = function(filter, feature){
        if (feature === undefined){
            return false;
        }
        if (filter === undefined){
            return false;
        }
        var featurevalue, value;
        var condition = false;
        featurevalue = feature.get(filter.property);
        if (featurevalue) {
            switch (filter.operator) {
                case '==':
                    switch (typeof(featurevalue)) {
                        case 'string':
                            value = filter.value;
                            condition = featurevalue == value;
                            break;
                        case 'number':
                            value = parseInt(filter.value, 10);
                            condition = parseInt(featurevalue, 10) == value;
                            break;
                    }
                    break;
                case '>':
                    value = parseInt(filter.value, 10);
                    condition = parseInt(featurevalue, 10) > value;
                    break;
                case '<':
                    value = parseInt(filter.value, 10);
                    condition = parseInt(featurevalue, 10) < value;
                    break;
                case '>=':
                    value = parseInt(filter.value, 10);
                    condition = parseInt(featurevalue, 10) >= value;
                    break;
                case '<=':
                    value = parseInt(filter.value, 10);
                    condition = parseInt(featurevalue, 10) <= value;
                    break;
                case '!=':
                    switch (typeof(featurevalue)) {
                        case 'string':
                            value = filter.value;
                            condition = featurevalue != value;
                            break;
                        case 'number':
                            value = parseInt(filter.value, 10);
                            condition = parseInt(featurevalue, 10) != value;
                            break;
                    }
                    break;
                case 'NULL':
                    switch (typeof(featurevalue)) {
                        case 'string':
                            condition = featurevalue.length === 0;
                            break;
                        case 'number':
                            value = parseInt(filter.value, 10);
                            condition = parseInt(featurevalue, 10) != value;
                            break;
                    }
                    break;
                case '..':
                    featurevalue = parseInt(featurevalue, 10);
                    condition = ((featurevalue >= parseInt(filter.lowerBoundary, 10)) && (featurevalue <= parseInt(filter.upperBoundary, 10)));
                    break;
            }
        } else {
            switch (filter.operator) {
                case 'NULL':
                    condition = true;
                    break;
            }
        }
        return condition;
    };

    var setHidden = function(feature, hidden){
        var ishidden = feature.get("isHidden");
        if (ishidden === undefined)
        {
            feature.set("isHidden", hidden);
        }
    };

    var parseFilter = function(filter, feature){
        if (feature === undefined){
            return false;
        }
        if (filter === undefined){
            return true;
        }
        if (filter.filters === undefined){
            return parseFilterProperty(filter, feature);
        }
        if (filter.filters.length <= 1){
            return true;
        }

        var i;
        var condition = false;
        switch (filter.filters[0]){
            case '&&':
                for (i = 1; i < filter.filters.length; i++){
                    condition = parseFilter(filter.filters[i], feature);
                    if (!condition){
                        break;
                    }
                }
                break;
            case '||':
                for (i = 1; i < filter.filters.length; i++){
                    condition = parseFilter(filter.filters[i], feature);
                    if (condition){
                        break;
                    }
                }
                break;
            case '!':
                break;
        }
        return condition;
    };

    var getStyle = function(feature, scale){
        return _getValidStyle(feature, scale);
    };

    var getHoverStyle = function(feature, scale){
        var style = _getValidStyle(feature, scale, true);
        if (style === undefined){
            // No hoverstyle, use ordinary style
            style = _getValidStyle(feature, scale);
        }
        return style;
    };

    var _getValidStyle = function(feature, scale, hover){
        if (hover === undefined){
            hover = false;
        }
        var userStyles = [];
        var textstyle, label, featurelabel;
        //var geometrytype = feature.getGeometry().getType();
        if (sld) {
            $(sld.namedLayers[0].userStyles).each(function (item, userStyle) {
                if (hover && !userStyle.isDefault) {
                    //if (_validateGeometryStyle(geometrytype, userStyle.style)) {
                    if (parseFilter(userStyle.rule.filter, feature)) {
                        if (_validateScale(userStyle.rule, scale)) {
                            textstyle = userStyle.style.getText();
                            if (textstyle) {
                                label = textstyle.getText();
                                textstyle = angular.copy(userStyle.style);
                                featurelabel = _getAttributeValue(label, feature);
                                textstyle.getText().setText(featurelabel);
                            } else {
                                userStyles.push(userStyle.style);
                            }
                        }
                    }
                    //}
                } else if (!hover && userStyle.isDefault){
                    //if (_validateGeometryStyle(geometrytype, userStyle.style)) {
                    if (parseFilter(userStyle.rule.filter, feature)) {
                        if (_validateScale(userStyle.rule, scale)) {
                            textstyle = userStyle.style.getText();
                            if (textstyle) {
                                label = textstyle.getText();
                                textstyle = angular.copy(userStyle.style);
                                featurelabel = _getAttributeValue(label, feature);
                                textstyle.getText().setText(featurelabel);
                            } else {
                                userStyles.push(userStyle.style);
                            }
                        }
                    }
                }
                //}
            });
            if (textstyle){
                userStyles.push(textstyle);
            }
            if (userStyles.length > 0){
                return userStyles;
            } else {
                if (!hover){
                    setHidden(feature, true);
                }
            }
            return undefined;
        }
        return styles;//sld.namedLayers[0].userStyles;
    };

    var _getAttributeValue = function(label, feature){
        if (label.indexOf('${') >= 0){
            label = label.slice(label.indexOf('${')+2);
            if (label.indexOf('}') >= 0){
                label = label.slice(0, label.indexOf('}'));
            }
        }
        return feature.get(label);
    };

    var _validateScale = function(rule, scale){
        if (rule === undefined){
            return true;
        }
        var maxScale = rule.maxScaleDenominator ? rule.maxScaleDenominator : Infinity;
        var minScale = rule.minScaleDenominator ? rule.minScaleDenominator : 1;
        if (scale <= maxScale && scale >= minScale){
            return true;
        }
        return false;
    };

    //var _validateGeometryStyle = function(geometrytype, style){
    //    var validstyle = true;
    //    switch (geometrytype){
    //        case 'Polygon':
    //        case 'MultiPolygon':
    //            break;
    //        case 'Point':
    //        case 'MultiPoint':
    //            if (style.getImage() || style.getText()){
    //                break;
    //            }
    //            validstyle = false;
    //            break;
    //        case 'LineString':
    //            break;
    //        default:
    //            console.log(geometrytype);
    //            break;
    //    }
    //    return validstyle;
    //};

    var getStyleForLegend = function(){
        if (sld) {
            return $(sld.namedLayers[0].userStyles);
        }
        return undefined;
    };

    return {
        Sld: sld,
        Styles: styles,
        ParseSld: parseSld,
        GetStyle: getStyle,
        GetStyleForLegend: getStyleForLegend,
        GetHoverStyle: getHoverStyle,
        defaultPrefix: "sld",
        namespaces: {
            sld: "http://www.opengis.net/sld",
            ogc: "http://www.opengis.net/ogc",
            gml: "http://www.opengis.net/gml",
            xlink: "http://www.w3.org/1999/xlink",
            xsi: "http://www.w3.org/2001/XMLSchema-instance"
        },
        namespaceAlias: {
            "http://www.opengis.net/sld": "sld",
            "http://www.opengis.net/ogc": "ogc",
            "http://www.opengis.net/gml": "gml",
            "http://www.w3.org/1999/xlink": "xlink",
            "http://www.w3.org/2001/XMLSchema-instance": "xsi"
        },
        getChildValue: function(node, def) {
            var value = def || "";
            if(node) {
                for(var child=node.firstChild; child; child=child.nextSibling) {
                    switch(child.nodeType) {
                        case 3: // text node
                        case 4: // cdata section
                            value += child.nodeValue;
                    }
                }
            }
            return value;
        },
        readChildNodes: function(node, obj) {
            if(!obj) {
                obj = {};
            }
            var children = node.childNodes;
            var child;
            for(var i=0, len=children.length; i<len; ++i) {
                child = children[i];
                if(child.nodeType == 1) {
                    this.readNode(child, obj);
                }
            }
            return obj;
        },
        readNode: function(node, obj) {
            if(!obj) {
                obj = {};
            }
            var group = this.readers[node.namespaceURI ? this.namespaceAlias[node.namespaceURI]: this.defaultPrefix];
            if(group) {
                var local = node.localName || node.nodeName.split(":").pop();
                var reader = group[local] || group["*"];
                if(reader) {
                    reader.apply(this, [node, obj]);
                }
            }
            return obj;
        },
        readers: readers,
        cssMap: {
            "stroke": "strokeColor",
            "stroke-opacity": "strokeOpacity",
            "stroke-width": "strokeWidth",
            "stroke-linecap": "strokeLinecap",
            "stroke-dasharray": "strokeDashstyle",
            "fill": "fillColor",
            "fill-opacity": "fillOpacity",
            "font-family": "fontFamily",
            "font-size": "fontSize",
            "font-weight": "fontWeight",
            "font-style": "fontStyle"
        },
        getCssProperty: function(sym) {
            var css = null;
            for(var prop in this.cssMap) {
                if(this.cssMap[prop] == sym) {
                    css = prop;
                    break;
                }
            }
            return css;
        },
        getAttributeNodeNS: function(node, uri, name) {
            var attributeNode = null;
            if(node.getAttributeNodeNS) {
                attributeNode = node.getAttributeNodeNS(uri, name);
            } else {
                var attributes = node.attributes;
                var potentialNode, fullName;
                for(var i=0, len=attributes.length; i<len; ++i) {
                    potentialNode = attributes[i];
                    if(potentialNode.namespaceURI == uri) {
                        fullName = (potentialNode.prefix) ?
                            (potentialNode.prefix + ":" + name) : name;
                        if(fullName == potentialNode.nodeName) {
                            attributeNode = potentialNode;
                            break;
                        }
                    }
                }
            }
            return attributeNode;
        },
        getAttributeNS: function(node, uri, name) {
            var attributeValue = "";
            if(node.getAttributeNS) {
                attributeValue = node.getAttributeNS(uri, name) || "";
            } else {
                var attributeNode = this.getAttributeNodeNS(node, uri, name);
                if(attributeNode) {
                    attributeValue = attributeNode.nodeValue;
                }
            }
            return attributeValue;
        },
        pixelRatio: 1,
        getStrokeDashstyle: function(dashstyle){
            if (dashstyle){
                dashstyle = dashstyle.split(' ');
                for (var i = 0; i < dashstyle.length; i++){
                    dashstyle[i] = parseInt(dashstyle[i], 10) * this.pixelRatio;// * (3/4);
                }
                return dashstyle;
            } else {
                return undefined;
            }
        },
        getStrokeWidth: function(width){
            return parseInt(width.trim(), 10) * this.pixelRatio;
        },
        getFontValue: function(style){
            var self = this;
            // "bold 10px Verdana"
            var font = '';
            font = self.addFontValue(font, style.fontStyle);
            font = self.addFontValue(font, style.fontWeight);
            if (style.fontSize){
                if (style.fontSize.indexOf('px')<0){
                    font = self.addFontValue(font, style.fontSize);
                    font += 'px';
                } else {
                    font = self.addFontValue(font, style.fontSize);
                }
            }
            font = self.addFontValue(font, style.fontFamily);
            return font.trim();
        },
        addFontValue: function(font, value){
            if (value === undefined){
                return font;
            }
            if (font.length > 0){
                font += ' ';
            }
            return font + value;
        },
        getAlignValue: function(align){
            if (align === undefined){
                return 'center';
            }
            var alignvalue = parseFloat(align);
            if (alignvalue === 0){
                return 'left';
            } else if (alignvalue > 0 && alignvalue < 1){
                return 'center';
            } else {
                return 'right';
            }
            return 'left';
        },
        getBaselineValue: function(baseline){
            if (baseline === undefined){
                return 'middle';
            }
            var baselinevalue = parseFloat(baseline);
            if (baselinevalue === 0){
                return 'bottom';
            } else if (baselinevalue > 0 && baselinevalue < 1){
                return 'middle';
            } else {
                return 'top';
            }
            return 'bottom';
        },
        getColorValue: function(colorvalue, opacityvalue){
            //if (colorvalue === undefined){
            //    return colorvalue;
            //}
            if (colorvalue === undefined){
                colorvalue = "#000000";
            }

            var color = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorvalue.trim());
            if (color.length < 4){
                return undefined;
            }
            var rgb = {
                r: parseInt(color[1], 16),
                g: parseInt(color[2], 16),
                b: parseInt(color[3], 16),
                a: opacityvalue ? parseFloat(opacityvalue.trim()) : 1,
                getValue: function () {
                    return [this.r, this.g, this.b, this.a];
                }
            };
            return rgb.getValue();
        },
        getGraphicFormat: function(href) {
            var format;
            for(var key in this.graphicFormats) {
                if(this.graphicFormats[key].test(href)) {
                    format = key;
                    break;
                }
            }
            return format || this.defaultGraphicFormat;
        },
        defaultGraphicFormat: "image/png",
        graphicFormats: {
            "image/jpeg": /\.jpe?g$/i,
            "image/gif": /\.gif$/i,
            "image/png": /\.png$/i
        },
        multipleSymbolizers: false,
        featureTypeCounter: null,
        defaultSymbolizer: {
            fillColor: "#808080",
            fillOpacity: 1,
            strokeColor: "#000000",
            strokeOpacity: 1,
            strokeWidth: 1,
            pointRadius: 3,
            graphicName: "square"
        }
    };
};
var ISY = ISY || {};
ISY.Repository = ISY.Repository || {};

ISY.Repository.Category = function(config){
    var defaults = {
        "catId": "",
        "name": "",
        "parentId": "",
        "subCategories": [],
        "isOpen": false
    };
    return $.extend({}, defaults, config);
};
var ISY = ISY || {};
ISY.Repository = ISY.Repository || {};

ISY.Repository.ConfigRepository = function (configFacade, eventHandler) {

    function _createConfig(config) {
        var result = {
            numZoomLevels: 18,
            newMaxRes: 21664.0,
            center: [570130,7032300],
            zoom:  4,
            extent: [-2000000.0, 3500000.0, 3545984.0, 9045984.0],
            layers: [],
            proxyHost: "http://geoinnsyn.norconsultad.com/services/isy.gis.isyproxy/?",
            tools: []
        };
        $.extend(result, config);

        var layers = [];
        for(var i = 0; i < config.layers.length; i++){
            layers.push(new ISY.Domain.Layer(config.layers[i]));
        }

        result.layers = layers;

        return new ISY.Repository.MapConfig(result);
    }

    function getMapConfig(url){
        configFacade.GetMapConfig(url, function (data) {
            var mapConfig = _createConfig(data);
            eventHandler.TriggerEvent(ISY.Events.EventTypes.MapConfigLoaded, mapConfig);
        });
    }

    function getMapConfigFromJson(jsonConfig){
        eventHandler.TriggerEvent(ISY.Events.EventTypes.MapConfigLoaded, jsonConfig);
    }


    return {
        GetMapConfig: getMapConfig,
        GetMapConfigFromJson:getMapConfigFromJson
    };
};
var ISY = ISY || {};
ISY.Repository = ISY.Repository || {};

ISY.Repository.MapConfig = function(config){
    var defaults = {
        name: "",
        comment: "",
        useCategories: true,
        categories: [],
        numZoomLevels: 10,
        newMaxRes: 21664,
        newMaxScale: 81920000,
        renderer: "canvas",
        center: [-1, 1],
        zoom: 5,
        layers:[],
        coordinate_system: "EPSG:32633",
        matrixSet: "EPSG:32633",
        extent: [-1, -1, -1, -1],
        extentUnits: 'm',
        proxyHost: "",
        groups: []
    };
    return $.extend({}, defaults, config); // mapConfigInstance
};
var ISY = ISY || {};
ISY.Repository = ISY.Repository || {};

ISY.Repository.StaticRepository = function() {
    var mapConfig = new ISY.Repository.MapConfig({
        numZoomLevels: 18,
        newMaxRes: 21664.0,
        renderer: ISY.MapImplementation.OL3.Map.RENDERERS.canvas,
        center: [570130,7032300],
        zoom: 4,
        coordinate_system: "EPSG:32633",
        extent: [-2000000.0, 3500000.0, 3545984.0, 9045984.0],
        extentunits: 'm',
        proxyHost: '',
        layers:[
            {
                "id": "1992",
                "isBaseLayer": true,
                "subLayers": [
                    {
                        "source": "WMS",
                        "url": ["http://opencache.statkart.no/gatekeeper/gk/gk.open?LAYERS=norges_grunnkart"],
                        "gatekeeper": true,
                        "name": "norges_grunnkart",
                        "format": "image/png",
                        "coordinate_system": "EPSG:32632",
                        "id": "1992",
                        "tiled": true
                    }
                ],
                "visibleOnLoad": true
            },
            {
                "id": "8001",
                "isBaseLayer": false,
                "subLayers": [
                    {
                        "source": "WFS",
                        "url": ["https://kart5.nois.no/trondheim_neste/wfs/default.asp?conname=Regplan&"],
                        "name": "RpOmråde",
                        "version": "1.0.0",
                        //"maxResolution": 3500 / 2834,
                        "coordinate_system": "EPSG:32632",
                        //"extent": [-2000000,3500000,3545984,9045984],
                        //"extentUnits": "m",
                        "id": "8001",
                        "tiled": false,
                        "style": "http://geoinnsyn.norconsultad.com/Services/ISY.GIS.IsyGeoinnsynConfig/api/v1/style?application=GeoInnsyn&name=RegplanVedtatt"
                    }
                ],
                "visibleOnLoad": true
            },
            {
                "id": "8002",
                "isBaseLayer": false,
                "subLayers": [
                    {
                        "source": "WFS",
                        "url": ["https://kart5.nois.no/trondheim_neste/wfs/default.asp?conname=Tiltak&"],
                        "name": "PblTiltak",
                        "version": "1.0.0",
                        //"maxResolution": 3500 / 2834,
                        "coordinate_system": "EPSG:32632",
                        //"extent": [-2000000,3500000,3545984,9045984],
                        //"extentUnits": "m",
                        "id": "8002",
                        "tiled": false,
                        "style": "http://geoinnsyn.norconsultad.com/Services/ISY.GIS.IsyGeoinnsynConfig/api/v1/style?application=GeoInnsyn&name=pblTiltak_type"
                    }],
                "visibleOnLoad": true
            }

        ]
    });

    function _getMapConfig(){
        return mapConfig;
    }

    return {
        GetMapConfig: _getMapConfig
    };
};
var ISY = ISY || {};
ISY.Utils = ISY.Utils || {};

ISY.Utils.Guid = function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);    }

    function newGuid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();

    }
    return {
        NewGuid: newGuid
    };
};

