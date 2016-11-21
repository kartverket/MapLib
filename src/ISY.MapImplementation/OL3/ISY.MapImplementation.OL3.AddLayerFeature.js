var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};

ISY.MapImplementation.OL3.AddLayerFeature = function(eventHandler){

    var isActive = false;
    var translate;
    var typeObject;
    var snappingFeatures;
    var sketch;
    var startModify = false;
    var draw;
    var drawLayer;
    var modify;
    var snapping;
    var source = new ol.source.Vector();
    var drawStyle = new ISY.MapImplementation.OL3.Styles.Default();
    var features;

    function addInteraction(map, features) {


        if (typeObject === "Line"){
            typeObject = "LineString";
        }

        draw = new ol.interaction.Draw({
            source: source,
            style: drawStyle.Styles(),
            type: (typeObject)
        });


        addLayer(map, features);
        if(!features) {
            map.addInteraction(draw);
            initSnapping(map);
        }

         draw.on('drawend',
            function(evt) {
                map.removeInteraction(snapping);
                sketch = evt.feature;
                var newFeatures = new ol.Collection([sketch]);
                modify = new ol.interaction.Modify({
                    features: newFeatures
                });
                map.addInteraction(modify);
                initSnapping(map);
                eventHandler.TriggerEvent(ISY.Events.EventTypes.AddLayerFeatureEnd, sketch);
                startModify = true;
                modify.on('modifyend',
                    function(evt) {
                        sketch = null;
                        sketch = evt.features.getArray()[0];
                        eventHandler.TriggerEvent(ISY.Events.EventTypes.AddLayerFeatureEnd, sketch);
                    }, this);
                map.removeInteraction(draw);
            }, this);
    }

    function addLayer(map, gpx){
        if(gpx){
            var format = new ol.format.GPX({
                    dataProjection: 'EPSG:4326',
                    featureProjection: map.getView().getProjection()
                }
            );
            features=format.readFeatures(gpx);
            features[0].getGeometry().transform('EPSG:4326', map.getView().getProjection());
            var featureCollection=new ol.Collection(features);
            source = new ol.source.Vector({features: featureCollection});
        }
        drawLayer = new ol.layer.Vector({
            source: source,
            style: drawStyle.Styles()
        });
        map.addLayer(drawLayer);
        if(gpx){
            eventHandler.TriggerEvent(ISY.Events.EventTypes.AddLayerFeatureEnd, features[0]);
        }
    }

    function initSnapping(map){
        var snappingFeaturesCollection = new ol.Collection(snappingFeatures);
        snapping = new ol.interaction.Snap({
            features: snappingFeaturesCollection
        });

        map.addInteraction(snapping);
    }

    var _removeDoubleClickZoom = function (map) {
        map.getInteractions().forEach(function (interaction) {
            if (interaction instanceof ol.interaction.DoubleClickZoom) {
                map.removeInteraction(interaction);
            }
        });
    };

    var _applyDoubleClickZoom = function (map){
        _removeDoubleClickZoom(map);
        map.addInteraction(
            new ol.interaction.DoubleClickZoom()
        );
    };

    function activate(map, options){
        isActive = true;
        translate = options.translate;
        typeObject = options.toolType;//type;
        snappingFeatures = options.snappingFeatures;
        var features=options.features;
        addInteraction(map, features);
        _removeDoubleClickZoom(map);
    }

    function deactivate(map){
        _applyDoubleClickZoom(map);
        if (isActive) {
            isActive = false;
            startModify = false;
            sketch = null;
            if (map !== undefined) {
                map.removeLayer(drawLayer);
                map.removeInteraction(modify);
                map.removeInteraction(snapping);
                source = new ol.source.Vector();
            }
        }
    }

    return {
        Activate: activate,
        Deactivate: deactivate
    };
};