var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.PrintBoxSelect = function() {

    var isActive = false;
    var printBoxSelectionLayer;

    var checkForUtmChange = function () {
        if (!isActive) {
            return;
        }
        console.log(printBoxSelectionLayer.bbox);
    };

    var registerMouseDragEvent = function () {
        var currentPos = [];
        map.on('mousedown', function (evt) {

            currentPos = [evt.pageX, evt.pageY];

            $(document).on('mousemove', function handler(evt) {

                currentPos = [evt.pageX, evt.pageY];
                $(document).off('mousemove', handler);

            });

            $(document).on('mouseup', function handler(evt) {

                if ([evt.pageX, evt.pageY].equals(currentPos)) {
                    console.log("Click");
                }
                else {
                    console.log("Drag");
                    checkForUtmChange();
                }

                $(document).off('mouseup', handler);

            });

        });
    };

    Array.prototype.equals = function (array) {
        // if the other array is a falsy value, return
        if (!array) {
            return false;
        }

        // compare lengths - can save a lot of time
        if (this.length != array.length) {
            return false;
        }

        for (var i = 0, l = this.length; i < l; i++) {
            // Check if we have nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array) {
                // recurse into the nested arrays
                if (!this[i].equals(array[i])) {
                    return false;
                }
            }
            else if (this[i] != array[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    };

    function addPrintBoxSelectLayer(map) {
        var source = new ol.source.Vector();
        var drawStyle = new ISY.MapImplementation.OL3.Styles.Measure();

        printBoxSelectionLayer = new ol.layer.Vector({
            source: source,
            style: drawStyle.DrawStyles()
        });

        map.addLayer(printBoxSelectionLayer);
    }

    function activate(map, options) {
        isActive = true;
        mapScale = options.mapScale;
        registerMouseDragEvent();
        addPrintBoxSelectLayer(map);
    }

    function deactivate(map) {
        if (isActive) {
            isActive = false;
            if (map !== undefined) {
                map.removeLayer(printBoxSelectionLayer);
            }
        }
    }

    return {
        Activate: activate,
        Deactivate: deactivate
    };
};