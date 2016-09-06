describe('ISY.MapImplementation.OL3.Map', function(){
    var dummyDivId = 'mapDiv',
        map,
        repository,
        mapConfig,
        measure,
        eventHandler,
        featureInfo,
        mapExport,
        hoverInfo,
        measureLine,
        offline,
        httpHelper;

    beforeEach(function(){
        repository = new ISY.Repository.StaticRepository();
        spyOn(repository, 'GetMapConfig').and.callThrough();
        mapConfig = repository.GetMapConfig();

        measure = new ISY.MapImplementation.OL3.Measure();
        eventHandler = new ISY.Events.EventHandler();
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
        featureInfo = new ISY.MapImplementation.OL3.FeatureInfo();
        mapExport = new ISY.MapImplementation.OL3.Export();
        hoverInfo = new ISY.MapImplementation.OL3.HoverInfo();
        measureLine = new ISY.MapImplementation.OL3.MeasureLine();
        offline = new ISY.MapImplementation.OL3.Offline();
        //addLayerFeature = new ISY.MapImplementation.OL3.AddLayerFeature();
        map = new ISY.MapImplementation.OL3.Map(repository, eventHandler, httpHelper, measure, featureInfo, mapExport, hoverInfo, measureLine, offline);

        spyOn(map, 'InitMap').and.callThrough();
        spyOn(map, 'ShowLayer');
        spyOn(map, 'HideLayer');
        /*spyOn(map, '');
        spyOn(map, '');
        spyOn(map, '');*/

        map.InitMap(dummyDivId, mapConfig);

        map.ShowLayer(mapConfig.layers[0].subLayers[0]);
    });

    it('Should return its public methods', function(){
        expect(map.ActivateInfoClick).not.toBeUndefined();
        expect(map.DeactivateInfoClick).not.toBeUndefined();
        expect(map.GetInfoUrl).not.toBeUndefined();
        expect(map.ShowHighlightedFeatures).not.toBeUndefined();
        expect(map.ClearHighlightedFeatures).not.toBeUndefined();
        expect(map.ShowInfoMarker).not.toBeUndefined();
        expect(map.SetHighlightStyle).not.toBeUndefined();
        expect(map.RemoveInfoMarker).not.toBeUndefined();
        expect(map.ActivateBoxSelect).not.toBeUndefined();
        expect(map.DeactivateBoxSelect).not.toBeUndefined();
        expect(map.GetFeaturesInExtent).not.toBeUndefined();
        expect(map.GetExtentForCoordinate).not.toBeUndefined();
    });

    it('ShowLayer', function(){
        expect(map.ShowLayer).toHaveBeenCalled();
    });

});