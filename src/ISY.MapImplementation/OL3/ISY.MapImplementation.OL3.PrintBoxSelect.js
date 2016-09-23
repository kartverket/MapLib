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

    var registerMouseDragEvent = function (map) {
        map.on('pointerdrag', function() {
            console.log('Dragging...');
        });

        map.on('moveend', function() {
            checkForUtmChange();
            console.log('Dragging ended.');
        });
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

    function activate(map){ //}, options) {
        isActive = true;
        if (map !== undefined) {
            console.log('PrintBoxSelect activated');
            //mapScale = options.mapScale;
            registerMouseDragEvent(map);
            addPrintBoxSelectLayer(map);
        }
    }

    function deactivate(map) {
        if (isActive) {
            isActive = false;
            if (map !== undefined) {
                console.log('PrintBoxSelect deactivated');
                map.removeLayer(printBoxSelectionLayer);
            }
        }
    }

    return {
        Activate: activate,
        Deactivate: deactivate
    };
};