describe('ISY.Domain.Category', function() {
    var tv = 'testValue';
    var subCategoryName = 'testName';
    var config = {
        "catId": 1,
        "name": "cat_1",
        "isOpen": true,
        "parentId": -1,
        "isyLayers": [],
        "isAllLayersSelected": false,
        "subCategories": [
            {
                "catId": 4,
                "name": subCategoryName,
                "isOpen": false,
                "parentId": 1,
                "isyLayers": [],
                "isAllLayersSelected": false,
                "subCategories": []
            }],
        testValue: tv
    };

    it('isOpen is set', function(){
        var category = new ISY.Domain.Category(config);
        expect(category.isOpen).toBeTruthy();
        expect(category.testValue).toEqual(tv);
        var subCategory = category.subCategories[0];
        expect(subCategory).toBeDefined();
        expect(subCategory.name).toEqual(subCategoryName);
    });

    it('name is set', function(){
        var category = new ISY.Domain.Category(config);
        expect(category.name).toEqual("cat_1");
        category.name = "testing";
        expect(category.name).not.toEqual("cat_1");
    });

    it('catId is set', function(){
        var category = new ISY.Domain.Category(config);
        expect(category.catId).toEqual(1);
        category.catId = 123456;
        expect(category.catId).not.toEqual(1);
    });

    it('parentId is set', function(){
        var category = new ISY.Domain.Category(config);
        expect(category.parentId).toEqual(-1);
        category.parentId = 123456;
        expect(category.parentId).not.toEqual(-1);
    });

    it('isyLayers is empty array', function(){
        var category = new ISY.Domain.Category(config);
        expect(category.isyLayers).toEqual([]);
    });

    it('isyLayers contain 2 items', function(){
        var category = new ISY.Domain.Category(config);
        category.isyLayers.push("Layer1");
        category.isyLayers.push("Layer2");
        expect(category.isyLayers.length).toEqual(2);
    });


});