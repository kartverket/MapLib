describe('new ISY.Domain.LayerResponse', function(){
    var testLayerResponse;// = new ISY.Domain.FeatureResponse();

    beforeEach(function (){
        testLayerResponse  = new ISY.Domain.LayerResponse();
    });

    it('should return its public methods', function () {
        expect(testLayerResponse.id).toEqual(-1);
        expect(testLayerResponse.isLoading).toEqual(false);
        expect(testLayerResponse.exception).toEqual('');
        expect(testLayerResponse.features).toEqual([]);
    });
});