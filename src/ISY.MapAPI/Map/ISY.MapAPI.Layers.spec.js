describe('ISY.MapAPI.Layers', function(){
    var dummyDivId = 'mapDiv',
        map,
        repository,
        mapConfig,
        measure,
        eventHandler,
        featureInfo,
        mapExport,
        httpHelper,
        layers,
        hoverInfo,
        measureLine,
        offline
        ;

    beforeEach(function(){
        repository = new ISY.Repository.StaticRepository();
        spyOn(repository, 'GetMapConfig').and.callThrough();
        mapConfig = repository.GetMapConfig();

        measure = new ISY.MapImplementation.OL3.Measure();
        eventHandler = new ISY.Events.EventHandler();

        featureInfo = new ISY.MapImplementation.OL3.FeatureInfo();
        mapExport = new ISY.MapImplementation.OL3.Export();
        hoverInfo = new ISY.MapImplementation.OL3.HoverInfo();
        measureLine = new ISY.MapImplementation.OL3.MeasureLine();
        offline = new ISY.MapImplementation.OL3.Offline();
        //addLayerFeature = new ISY.MapImplementation.OL3.AddLayerFeature();
        httpHelper = function(){
            function getResult(url, callback){
                $.getJSON(url, function (data) {
                    callback(data);
                });
            }

            return {
                get: getResult
            };
        };
        map = new ISY.MapImplementation.OL3.Map(repository, eventHandler, httpHelper, measure, featureInfo, mapExport, hoverInfo, measureLine, offline);
        map.InitMap(dummyDivId, mapConfig);

        layers = new ISY.MapAPI.Layers(map);

        //spyOn(layers, 'Init').and.callThrough();
        //spyOn(layers, 'GetBaseLayers');
    });

    it('Should return its public methods', function(){
        expect(layers.Init).not.toBeUndefined();
    });

    /*it('', function () {
       expect(layers.GetBaseLayers).toHaveBeenCalled();
    });*/

    it('Test init', function () {
        layers.Init(mapConfig);
        //console.log(layers.GetBaseLayers());
        expect(layers.GetBaseLayers()[0].subLayers[0].name).not.toBeUndefined();
    });

});