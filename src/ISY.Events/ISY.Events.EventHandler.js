var ISY = ISY || {};
ISY.Events = ISY.Events || {};

ISY.Events.EventHandler = function(){
    var callBacks = [];

    function registerEvent(eventType, callBack){
        callBacks.push({
            eventType: eventType,
            callBack: callBack
        });
    }

    function unRegisterEvent(eventType, callBack){
        // count down to consider all callbacks (don't skip after splice)
        for (var i = callBacks.length - 1; i >= 0; i--) {
            if (callBacks[i].eventType == eventType && (callBacks[i].callBack == callBack || callBack === false)) {
                callBacks.splice(i, 1);
                break;
            }
        }
    }

    function unRegisterAllEvents(){
        callBacks = [];
    }

    function triggerEvent(eventType, args){
        for(var i = 0; i < callBacks.length; i++){
            var callBack = callBacks[i];
            if(callBack.eventType === eventType){
                callBack.callBack(args);
            }
        }
    }

    return {
        RegisterEvent: registerEvent,
        UnRegisterEvent: unRegisterEvent,
        UnRegisterAllEvents: unRegisterAllEvents,
        TriggerEvent: triggerEvent
    };
};

ISY.Events.EventTypes = {
    ChangeCenter: "ChangeCenter",
    ChangeResolution: "ChangeResolution",
    ChangeLayers: "ChangeLayers",
    FeatureInfoStart: "FeatureInfoStart",
    FeatureInfoEnd: "FeatureInfoEnd",
    MapConfigLoaded: "MapConfigLoaded",
    MapLoaded: "MapLoaded",
    MapMoveend: "MapMoveend",
    ShowExportPanel: "ShowExportPanel",
    MeasureMouseMove: "MeasureMouseMove",
    LoadingLayerEnd: "LoadingLayerEnd",
    LayerCreated: "LayerCreated",
    CachingStart: "CachingStart",
    CachingEnd: "CachingEnd",
    CachingProgress: "CachingProgress",
    StatusPouchDbChanged: "StatusPouchDbChanged",
    MeasureEnd: "MeasureEnd",
    DrawFeatureMouseMove: "DrawFeatureMouseMove",
    DrawFeatureEnd: "DrawFeatureEnd",
    DrawFeatureSelect: "DrawFeatureSelect",
    AddLayerFeatureEnd: "AddLayerFeatureEnd",
    ModifyFeatureEnd: "ModifyFeatureEnd",
    RefreshSourceDone: "RefreshSourceDone",
    ZoomIn: "ZoomIn",
    ZoomOut: "ZoomOut",
    TransactionSuccessful: "TransactionSuccessful",
    TransactionFailed: "TransactionFailed",
    TransactionInsertEnd: "TransactionInsertEnd",
    TransactionUpdateEnd: "TransactionUpdateEnd",
    TransactionRemoveEnd: "TransactionRemoveEnd",
    FeatureHasBeenDescribed: "FeatureHasBeenDescribed",
    GeolocationUpdated: "GeolocationUpdated",
    PrintBoxSelectReturnValue: "PrintBoxSelectReturnValue",
    MapClickCoordinate: "MapClickCoordinate",
    AddLayerUrlEnd: "AddLayerUrlEnd"
};