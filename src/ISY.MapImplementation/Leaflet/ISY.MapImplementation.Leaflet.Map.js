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