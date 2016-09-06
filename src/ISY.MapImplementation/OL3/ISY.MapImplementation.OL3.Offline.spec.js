describe('ISY.MapImplementation.OL3.Offline', function() {
    var offline = new ISY.MapImplementation.OL3.Offline();

    it('Expect public methods to be set for Offline', function(){
        expect(offline.Activate).not.toBeUndefined();
        expect(offline.Deactivate).not.toBeUndefined();
        expect(offline.StartCaching).not.toBeUndefined();
        expect(offline.GetResource).not.toBeUndefined();
        //expect(offline.SaveSettings).not.toBeUndefined();
        expect(offline.DeleteDatabase).not.toBeUndefined();
        expect(offline.GetDatabase).not.toBeUndefined();
    });
});