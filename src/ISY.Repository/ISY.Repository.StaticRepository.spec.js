describe('ISY.Repository.StaticRepository', function() {
    var utils = ISY.Utils;
    it('Utils namespace exists', function(){
        expect(utils).toBeDefined();
    });

    var repository = new ISY.Repository.StaticRepository();

    it('StaticRepository not to be null', function(){
        expect(repository).toBeDefined();
    });
});
