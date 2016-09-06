describe('ISY.Utils.Guid', function() {
    var guid = new ISY.Utils.Guid().NewGuid();

    it('NewGuid returns a guid greater than 35', function(){
        expect(guid).toBeDefined();
        expect(guid.length).toBeGreaterThan(35);
    });
});