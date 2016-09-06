
describe('new ISY.MapAPI.Map', function() {
    var mapModel;
    var map;
    var repository;

    beforeEach(function(){
        repository = new ISY.Repository.StaticRepository();
        spyOn(repository, 'GetMapConfig').and.callThrough();

        map = new ISY.MapImplementation.OL3.Map(repository, new ISY.Events.EventHandler());

        mapModel = new ISY.MapAPI.Map(map);
    });

    it('should return its public methods',  function() {
        expect(mapModel.Init).not.toBe(undefined);
        expect(mapModel.ShowLayer).not.toBe(undefined);
        expect(mapModel.HideLayer).not.toBe(undefined);
        expect(mapModel.GetOverlayLayers).not.toBe(undefined);
        expect(mapModel.GetBaseLayers).not.toBe(undefined);
        expect(mapModel.SetBaseLayer).not.toBe(undefined);
        expect(mapModel.SetLayerOpacity).not.toBe(undefined);
    });
});

describe('ISY.MapAPI.Map.Init', function() {
    var dummyDivId = 'mapDiv',
        mapModel,
        map,
        repository,
        eventHandler,
        featureInfo,
        layerHandler,
        groupHandler,
        categoryHandler,
        subLayersToShow,
        subLayersToHide,
        mapConf,
        subLayers,
        tools,
        toolFactory,
        httpHelper = null;

    beforeEach(function(){
        var conf = {
            isBaseLayer: true
        };
        subLayersToShow  = [
            new ISY.Domain.SubLayer(conf),
            new ISY.Domain.SubLayer(conf),
            new ISY.Domain.SubLayer(conf)
        ];

        subLayersToHide = [
            new ISY.Domain.SubLayer(conf),
            new ISY.Domain.SubLayer(conf)
        ];

        mapConf = new ISY.Repository.MapConfig({
            layers:[
                new ISY.Domain.Layer({
                    visibleOnLoad: true,
                    subLayers: [
                        subLayersToShow[0],
                        subLayersToShow[1]
                    ]
                }),
                new ISY.Domain.Layer({
                    visibleOnLoad: true,
                    subLayers: [
                        subLayersToShow[2]
                    ]
                }),
                new ISY.Domain.Layer({
                    visibleOnLoad: false,
                    subLayers: [
                        subLayersToHide[0],
                        subLayersToHide[1]
                    ]
                })
            ]
        });

        map = new ISY.MapImplementation.OL3.Map(repository, new ISY.Events.EventHandler());
        spyOn(map, 'InitMap').and.callThrough();
        spyOn(map, 'HideLayer');
        spyOn(map, 'ShowLayer');

        eventHandler = new ISY.Events.EventHandler();
        featureInfo = new ISY.MapAPI.FeatureInfo(map, httpHelper, eventHandler);
        layerHandler = new ISY.MapAPI.Layers(map);
        groupHandler = new ISY.MapAPI.Groups();
        categoryHandler = new ISY.MapAPI.Categories();

        mapModel = new ISY.MapAPI.Map(map, eventHandler, featureInfo, layerHandler, groupHandler, categoryHandler);

        tools = new ISY.MapAPI.Tools.Tools(mapModel, eventHandler);
        toolFactory = new ISY.MapAPI.Tools.ToolFactory(mapModel, tools);

        mapModel.Init(dummyDivId, mapConf);

        var layers = mapModel.GetOverlayLayers();
        subLayers = [];
        for(var i = 0 ; i < layers.length; i++){
            subLayers = subLayers.concat(layers[i].subLayers);
        }
    });

    it('calls factory.InitMap', function() {
        //repository.GetMapConfig();
        expect(map.InitMap).toHaveBeenCalledWith('mapDiv', mapConf);
    });

    it('shows the layers which should be shown', function() {
        expect(map.ShowLayer.calls.count()).toEqual(3);
        for(var i = 0; i < subLayersToShow; i++){
            var subLayerToShow = subLayersToShow[i];
            expect(subLayerToShow.isVisible).toBeTruthy();
        }
    });

    it('hides the layers which should not be shown', function() {
        // ISY.MapAPI.Map._showLayer first hides each layer
        expect(map.HideLayer.calls.count()).toEqual(2);

        for(var i = 0; i < subLayersToHide; i++){
            var subLayerToHide = subLayersToHide[i];
            expect(subLayerToHide.isVisible).toBeFalsy();
        }
    });

    it('sets layerIndex in order', function() {
        for(var layerIndex = 0; layerIndex < subLayers.length; layerIndex++){
            expect(subLayers[layerIndex].layerIndex).toEqual(layerIndex);
        }
    });
});
