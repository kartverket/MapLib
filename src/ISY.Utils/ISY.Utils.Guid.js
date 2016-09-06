var ISY = ISY || {};
ISY.Utils = ISY.Utils || {};

ISY.Utils.Guid = function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);    }

    function newGuid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();

    }
    return {
        NewGuid: newGuid
    };
};

