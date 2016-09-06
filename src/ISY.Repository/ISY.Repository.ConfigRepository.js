var ISY = ISY || {};
ISY.Repository = ISY.Repository || {};

ISY.Repository.ConfigRepository = function (configFacade, eventHandler) {

    function _createConfig(config) {
        var result = {
            numZoomLevels: 18,
            newMaxRes: 21664.0,
            center: [570130,7032300],
            zoom:  4,
            extent: [-2000000.0, 3500000.0, 3545984.0, 9045984.0],
            layers: [],
            proxyHost: "http://geoinnsyn.norconsultad.com/services/isy.gis.isyproxy/?",
            tools: []
        };
        $.extend(result, config);

        var layers = [];
        for(var i = 0; i < config.layers.length; i++){
            layers.push(new ISY.Domain.Layer(config.layers[i]));
        }

        result.layers = layers;

        return new ISY.Repository.MapConfig(result);
    }

    function getMapConfig(url){
        configFacade.GetMapConfig(url, function (data) {
            var mapConfig = _createConfig(data);
            eventHandler.TriggerEvent(ISY.Events.EventTypes.MapConfigLoaded, mapConfig);
        });
    }

    function getMapConfigFromJson(jsonConfig){
        eventHandler.TriggerEvent(ISY.Events.EventTypes.MapConfigLoaded, jsonConfig);
    }


    return {
        GetMapConfig: getMapConfig,
        GetMapConfigFromJson:getMapConfigFromJson
    };
};