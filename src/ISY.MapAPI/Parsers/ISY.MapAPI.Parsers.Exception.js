var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};
ISY.MapAPI.Parsers = ISY.MapAPI.Parsers || {};

ISY.MapAPI.Parsers.Exception = function() {
    function parse(exception){
        var message = exception.replace(/(<([^>]+)>)/ig, '');
        throw message;
    }

    return {
        Parse: parse
    };
};