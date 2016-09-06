var ISY = ISY || {};
ISY.Repository = ISY.Repository || {};

ISY.Repository.Category = function(config){
    var defaults = {
        "catId": "",
        "name": "",
        "parentId": "",
        "subCategories": [],
        "isOpen": false
    };
    return $.extend({}, defaults, config);
};