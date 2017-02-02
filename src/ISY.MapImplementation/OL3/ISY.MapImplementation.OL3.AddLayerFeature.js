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
    var features;
    var mainColor='rgba(0,0,0,255)';
    var secondaryColor='rgba(255,255,0,255)';
    var elevationStyle= [ new ol.style.Style({
        stroke:  new ol.style.Stroke({
            color: mainColor,
            width: 3
        }),
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: mainColor
            }),
            stroke: new ol.style.Stroke({
                color: secondaryColor ,
                width: 2
            })
        })
    }),
        new ol.style.Style({
            stroke:  new ol.style.Stroke({
                color: secondaryColor,
                width: 3,
                lineDash: [ 15, 30 ]
            })
        })
    ];

    function addInteraction(map) {
        if (typeObject === "Line") {
            typeObject = "LineString";
        }
        draw = new ol.interaction.Draw({
            source: source,
            style: elevationStyle,
            type: (typeObject)
        });
        map.addInteraction(draw);
        initSnapping(map);
        draw.on('drawend',
            function (evt) {
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
                    function (evt) {
                        sketch = evt.features.getArray()[0];
                        eventHandler.TriggerEvent(ISY.Events.EventTypes.AddLayerFeatureEnd, sketch);
                    }, this);
                map.removeInteraction(draw);
            }, this);
    }


    function addLayer(map){
        drawLayer = new ol.layer.Vector({
            source: source,
            style: elevationStyle
        });
        map.addLayer(drawLayer);
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

    var _readFeatures = function (map, gpx){
        if(gpx){
            var format = new ol.format.GPX({
                    dataProjection: 'EPSG:4326',
                    featureProjection: map.getView().getProjection()
                }
            );
            var newFeatures=format.readFeatures(gpx);
            newFeatures[0].getGeometry().transform('EPSG:4326', map.getView().getProjection());
            var featureCollection=new ol.Collection(newFeatures);
            source = new ol.source.Vector({features: featureCollection});
            return newFeatures;
        }
        return undefined;
    };

    function activate(map, options){
        isActive = true;
        translate = options.translate;
        typeObject = options.toolType;
        snappingFeatures = options.snappingFeatures;
        features=_readFeatures(map, options.features);
        addLayer(map, features);
        if (features) {
            map.removeInteraction(draw);
            var extent = features[0].getGeometry().getExtent();
            map.getView().fit(extent,map.getSize());
        }
        else {
            addInteraction(map, features);
        }
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
                map.removeInteraction(draw);
                source = new ol.source.Vector();
            }
        }
    }

    return {
        Activate: activate,
        Deactivate: deactivate
    };
};