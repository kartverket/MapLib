var ISY = ISY || {};
ISY.Facade = ISY.Facade || {};

ISY.Facade.ServerConfigFacade = function () {

    function getMapConfig(url, callback) {

        $.getJSON(url, function (data) {
            callback(data);
        });
    }

    return {
        GetMapConfig: getMapConfig
    };
};