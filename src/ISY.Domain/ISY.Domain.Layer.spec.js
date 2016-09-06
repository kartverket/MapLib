describe('ISY.Domain.Layer', function() {
    var tv = 'testValue';
    var subLayerName = 'testName';
    var config = {
        isBaseLayer: true,
        testValue: tv,
        subLayers: [
            {
                "name": subLayerName
            }]
    };

    it('', function(){
        var layer = new ISY.Domain.Layer(config);
        expect(layer.isBaseLayer).toBeTruthy();
        expect(layer.testValue).toEqual(tv);
        var subLayer = layer.subLayers[0];
        expect(subLayer).toBeDefined();
        expect(subLayer.name).toEqual(subLayerName);
    });
});