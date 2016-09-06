describe('new ISY.Domain.FeatureResponse', function(){
    var testFeatureResponse;// = new ISY.Domain.FeatureResponse();

    beforeEach(function (){
        testFeatureResponse  = new ISY.Domain.FeatureResponse();
    });

    it('should return its public methods', function () {
        expect(testFeatureResponse.geometryObject).toEqual('');
        expect(testFeatureResponse.crs).toEqual('');
        expect(testFeatureResponse.attributes).toEqual([]);
    });
});

