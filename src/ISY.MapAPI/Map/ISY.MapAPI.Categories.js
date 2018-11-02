var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};

ISY.MapAPI.Categories = function () {
  var categories = [];

  function init(mapConfig) {
    categories = mapConfig.categories;
  }

  function reInit(mapConfig){
    categories = [];
    init(mapConfig);
  }

  function getCategories() {
    return categories;
  }

  function getCategoryById(catId) {
    for (var i = 0; i < categories.length; i++) {
      var cat = categories[i];
      if (cat.catId.toString() === catId.toString()) {
        return cat;
      }
      for (var j = 0; j < categories[i].subCategories.length; j++) {
        var subcat = categories[i].subCategories[j];
        if (subcat.catId.toString() === catId.toString()) {
          return subcat;
        }
      }
    }
  }

  return {
    Init: init,
    ReInit: reInit,
    GetCategoryById: getCategoryById,
    GetCategories: getCategories
  };
};
