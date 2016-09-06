describe('ISY.Domain.SubLayer', function() {
    var tv = 'testValue';
    var config = {
        layerIndex: 0,
        testValue: tv
    };

    it('', function(){
        var subLayer = new ISY.Domain.SubLayer(config);
        if (subLayer.legendGraphicUrl !== ''){
            expect(subLayer.layerIndex).toEqual(0);
            expect(subLayer.testValue).toEqual(tv);
            expect(subLayer.legendGraphicUrl).toMatch(/20/); // Default image with and height
        }
    });
});