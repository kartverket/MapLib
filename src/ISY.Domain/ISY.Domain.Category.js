var ISY = ISY || {};
ISY.Domain = ISY.Domain || {};

ISY.Domain.Category = function(config){
    var defaults = {
        catId: -1,
        name: '',
        isOpen: false,
        parentId: -1,
        subCategories: [],
        isyLayers: [],
        isAllLayersSelected: false

    };
    var categoryInstance = $.extend({}, defaults, config); // categoryInstance

    var subCategories = [];
    for(var i = 0; i < config.subCategories.length; i++){
        subCategories.push(new ISY.Domain.Category(config.subCategories[i]));
    }

    categoryInstance.subCategories = subCategories;

    return categoryInstance;
};