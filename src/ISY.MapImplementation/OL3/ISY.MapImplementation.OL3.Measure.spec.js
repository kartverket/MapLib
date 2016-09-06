describe('ISY.MapImplementation.OL3.Measure', function() {
    var measure = new ISY.MapImplementation.OL3.Measure();

    it('Expect public methods to be set for Measure', function(){
        expect(measure.Activate).not.toBeUndefined();
        expect(measure.Deactivate).not.toBeUndefined();
    });
});