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