var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};
ISY.MapAPI.Parsers = ISY.MapAPI.Parsers || {};

ISY.MapAPI.Parsers.Exception = function() {
    function parse(exception){
        throw exception.replace(/(<([^>]+)>)/ig, '');
    }

    return {
        Parse: parse
    };
};