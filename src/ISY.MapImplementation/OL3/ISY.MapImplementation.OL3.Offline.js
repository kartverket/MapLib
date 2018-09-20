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
            pouchDB[index] = new PouchDB(pouchTiles + index);
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
                if (err && err.name === 'not_found') {
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
    //        if (err && err.name === 'not_found') {
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
            if (typeof response === 'object'){
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
            if (typeof response === 'object'){
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
        _getResourceFromJson(url, contentType, callback, true);
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
                if (err && err.error === 'not_found' || !attachmentRes) {
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
                    pouchAttachment = btoa(unescape(encodeURIComponent(JSON.stringify(response))));
                }).fail(function(){
                    addrevision = false;
                    _getOfflineResource(url, isConfig, callback);
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
                if (err && err.name === 'not_found') {
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
                        resource = xml.xmlToJSON(projectXml);
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
            if (err && err.name === 'not_found') {
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
            if (view.getZoom() !== zoom + dZoom) {
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
        return new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(0,0,0,0.3)',
                width: 1
            }),
            fill: new ol.style.Fill({
                color: 'rgba(160,0,0,0.9)'
            })
        });
    };

    var _getSquareStyle = function() {
        return new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(160,0,0,0.7)',
                width: 2
            })
        });
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
