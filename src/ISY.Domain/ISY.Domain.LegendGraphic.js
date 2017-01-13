var ISY = ISY || {};
ISY.Domain = ISY.Domain || {};

ISY.Domain.LegendGraphic = function(config){
    var defaults = {
        width : "20",
        height : "20",
        format : "image/png",
        request : "GetLegendGraphic",
        version : "1.0.0",
        service : 'wms',
        layer : '',
        url : ''
    };

    var instance =  $.extend({}, defaults, config);

    function getLegendGraphicUrl (){
        if (instance.url !== "?"){
            return instance.url + "Service=" + instance.service + "&Request=" + instance.request + "&Version=" + instance.version + "&Format=" + instance.format + "&Width=" + instance.width + "&Height=" + instance.height + "&Layer=" + instance.layer;
        }else{
            return "";
        }

    }

    return {
        GetLegendGraphicUrl: getLegendGraphicUrl
    };
};