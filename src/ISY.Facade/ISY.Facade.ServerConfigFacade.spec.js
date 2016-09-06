describe('new ISY.Facade.ServerConfigFacade', function () {

    var facade;

    var config = {
        baseLayerList: [],
        overlayList: []
    };


    beforeEach(function () {
        facade = new ISY.Facade.ServerConfigFacade();
    });

    it('should return its public methods', function () {
        expect(facade.GetMapConfig).not.toBe(undefined);
    });

    it('should call server to get JSON', function () {
        spyOn($, "getJSON").and.returnValue({success: function(c){c(data);}});
        facade.GetMapConfig();
        expect($.getJSON).toHaveBeenCalled();
    });

    it('calls the callback', function () {
       var url = 'testUrl';
        var fn = jasmine.createSpy('callback');
        spyOn($, "getJSON").and.callFake(function(url, fn){fn(config);});
        facade.GetMapConfig(url, fn);
        expect(fn).toHaveBeenCalled();
    });

});
