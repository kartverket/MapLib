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

        if (typeof source.format === 'undefined') {
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
                    if (typeof response === 'object'){
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
    //if (source.getProjection() === null){
    //    if (source.setProjection) {
    //        source.setProjection(projection);
    //    } else if (source.f !== undefined) {
    //        source.f = projection;
    //    }
    //}

    return source;
};
