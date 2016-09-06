
describe('new ISY.MapAPI.Categories', function() {
    var categories;
    //var mapConfig;

    beforeEach(function () {
        categories = new ISY.MapAPI.Categories();
        categories[0] = "Cat 1";
    });

    it('should return its public methods', function () {
        expect(categories.Init).toBeDefined();
        expect(categories.GetCategoryById).toBeDefined();
        expect(categories.GetCategories).toBeDefined();
    });

    //it('should return correct categories', function() {
    //    categories.Init(mapConfig);
    //
    //    expect(categories.GetCategories()[0]).toEqual("Cat 1");
    //});


});