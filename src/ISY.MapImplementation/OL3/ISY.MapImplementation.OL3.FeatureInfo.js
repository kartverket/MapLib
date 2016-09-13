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
            var infoMarker = new ol.Overlay({
                element: infoMarkerElement,
                stopEvent: false,
                offset:  [-infoMarkerElement.width / 2, -infoMarkerElement.height]
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