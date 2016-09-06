var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};
ISY.MapAPI.Parsers = ISY.MapAPI.Parsers || {};

ISY.MapAPI.Parsers.GML = function() {
    function parse(result) {
        console.log(result);
    }

    return {
        Parse: parse
    };
};