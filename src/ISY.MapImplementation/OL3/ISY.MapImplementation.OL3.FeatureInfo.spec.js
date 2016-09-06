xdescribe("Can create repository from domain MapImplementation", function(){
    it('is namespace Repository defined', function() {
        expect(ISY.Repository).toBeDefined();
    });

    var repository = new ISY.Repository.StaticRepository();

    it('is StaticRepository defined', function() {
       expect(repository).toBeDefined();
    });

});


xdescribe("ISY.MapImplementation.OL3.FeatureInfo", function() {
    var dummyDivId = 'mapDiv';

    beforeEach(function(){
        this.featureInfo = new ISY.MapImplementation.OL3.FeatureInfo();
        this.mapExport = new ISY.MapImplementation.OL3.Export();
        this.repository = new ISY.Repository.StaticRepository();
        this.mapConfig = this.repository.GetMapConfig();
        this.measure = new ISY.MapImplementation.OL3.Measure();
        this.eventHandler = new ISY.Events.EventHandler();

        this.httpHelper = function(){
            function getResult(url, callback){
                $.getJSON(url, function (data) {
                    callback(data);
                });
            }

            return {
                get: getResult
            };
        };


        this.map = new ISY.MapImplementation.OL3.Map(this.repository, this.eventHandler, this.httpHelper, this.measure, this.featureInfo, this.mapExport);
        this.map.InitMap(dummyDivId, this.mapConfig);
        this.map.ShowLayer(this.mapConfig.layers[0].subLayers[0]);
    });

    it('getFeaturesInExtent with undefined values', function(){
        var extent;
        var mapLayer;
        var featureCollection = this.map.getFeaturesInExtent(undefined, extent, mapLayer);
        expect(featureCollection).toBeNull();
    });

});