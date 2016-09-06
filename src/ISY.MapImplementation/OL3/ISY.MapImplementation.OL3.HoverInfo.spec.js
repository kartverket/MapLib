describe('ISY.MapImplementation.OL3.HoverInfo', function() {
    var hoverInfo = new ISY.MapImplementation.OL3.HoverInfo();

    it('Expect public methods to be set for HoverInfo', function(){
        expect(hoverInfo.ActivateHoverInfo).not.toBeUndefined();
        expect(hoverInfo.DeactivateHoverInfo).not.toBeUndefined();
    });
});