var ISY = ISY || {};
ISY.Repository = ISY.Repository || {};

ISY.Repository.MapConfig = function(config){
    var defaults = {
        name: "",
        comment: "",
        useCategories: true,
        categories: [],
        numZoomLevels: 10,
        newMaxRes: 21664,
        newMaxScale: 81920000,
        renderer: "canvas",
        center: [-1, 1],
        zoom: 5,
        layers:[],
        coordinate_system: "EPSG:32633",
        matrixSet: "EPSG:32633",
        extent: [-1, -1, -1, -1],
        extentUnits: 'm',
        proxyHost: "",
        groups: []
    };
    return $.extend({}, defaults, config); // mapConfigInstance
};