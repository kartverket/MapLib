describe('new ISY.MapAPI.Groups', function() {
    var groups;
    //var mapConfig;

    beforeEach(function () {
        groups = new ISY.MapAPI.Groups();
        groups[0] = "Group 1";
    });

    it('should return its public methods', function () {
        expect(groups.Init).toBeDefined();
        expect(groups.GetGroupById).toBeDefined();
        expect(groups.GetGroups).toBeDefined();
    });

    //it('should return correct categories', function() {
    //    categories.Init(mapConfig);
    //
    //    expect(categories.GetCategories()[0]).toEqual("Cat 1");
    //});


});