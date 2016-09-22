var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.PrintBoxSelect = function(eventHandler){

    var isActive = false;

    var panningHandler = function() {
        if (!isActive) {
            return;
        }
     };

    var printBoxSelectionLayer;

    function  activate(map, options){
        isActive = true;
        mapScale = options.mapScale;

        var panning = false;
        map.on('mousedown', function(){
            panning=true;
        });

        map.on('pointermove', function(){
            if(panning) {
                panningHandler;
            }
        });

        $(map.getViewport()).on('mouseout', function() {
            panning = false;
        });
        //addInteraction(map);
        addPrintBoxSelectLayer(map);
    }

    function addPrintBoxSelectLayer(map){
        var source = new ol.source.Vector();
        var drawStyle = new ISY.MapImplementation.OL3.Styles.Measure();

        printBoxSelectionLayer = new ol.layer.Vector({
            source: source,
            style: drawStyle.DrawStyles()
        });

        map.addLayer(printBoxSelectionLayer);
    }

    function deactivate(map){
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