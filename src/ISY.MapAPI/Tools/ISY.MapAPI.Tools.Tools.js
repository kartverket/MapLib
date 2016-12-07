var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};
ISY.MapAPI.Tools = ISY.MapAPI.Tools || {};

ISY.MapAPI.Tools.Tools = function(mapApi){
    var tools = [];

    var getFeatureInfoConfig = {
        id: 'PointSelect',
        description: 'This tool activates a get feature info click on the map',
        activate: function (){
            mapApi.ActivateInfoClick();
        },
        deactivate: function (){
            mapApi.DeactivateInfoClick();
            //mapApi.RemoveInfoMarker();
        },
        messageObject: []
    };
    var getFeatureInfo = new ISY.MapAPI.Tools.Tool(getFeatureInfoConfig);
    tools.push(getFeatureInfo);

    var zoomAndPanConfig = {
        id: 'DefaultZoom',
        description: 'This is the default tool',
        activate: function(){

        },
        deactivate: function(){

        },
        messageObject: []
    };
    var zoomAndPan = new ISY.MapAPI.Tools.Tool(zoomAndPanConfig);
    tools.push(zoomAndPan);

    var boxSelectConfig = {
        id: 'BoxSelect',
        description: 'This tool activates box select functionality to the map',
        activate: function (){
         mapApi.ActivateBoxSelect();
         },
         deactivate: function (){
         mapApi.DeactivateBoxSelect();
         },
        messageObject: []
    };
    var boxSelect = new ISY.MapAPI.Tools.Tool(boxSelectConfig);
    tools.push(boxSelect);

    /*var exportCommandConfig = {
        id: 'MapExport',
        description: 'This command shows the export panel',
        activate: function (){
            eventHandler.TriggerEvent(ISY.Events.EventTypes.ShowExportPanel);
        },
        isCommand: true
    };
    var exportCommand = new ISY.Tools.Tool(exportCommandConfig);
    tools.push(exportCommand);*/

    var drawFeatureConfig = {
        id: 'DrawFeature',
        description: 'This tool lets the user draw a feature in the map',
        activate: function (options){
            mapApi.ActivateDrawFeature(options);
        },
        deactivate: function (){
            mapApi.DeactivateDrawFeature();
        },
        messageObject: []
    };

    var drawFeature = new ISY.MapAPI.Tools.Tool(drawFeatureConfig);
    tools.push(drawFeature);

    var modifyFeatureConfig = {
        id: 'ModifyFeature',
        description: 'This tool lets the user modify feature in the map.',
        activate: function (options){
            mapApi.ActivateModifyFeature(options);
        },
        deactivate: function (){
            mapApi.DeactivateModifyFeature();
        },
        messageObject: []
    };

    var modifyFeature = new ISY.MapAPI.Tools.Tool(modifyFeatureConfig);
    tools.push(modifyFeature);

    var addLayerFeatureConfig = {
        id: 'AddLayerFeature',
        description: 'This tool lets the user add feature to the map',
        activate: function (options){
            mapApi.ActivateAddLayerFeature(options);
        },
        deactivate: function (){
            mapApi.DeactivateAddLayerFeature();
        },
        messageObject: []
    };

    var addLayerFeature = new ISY.MapAPI.Tools.Tool(addLayerFeatureConfig);
    tools.push(addLayerFeature);

    var addFeatureGpsConfig = {
        id: 'AddFeatureGps',
        description: 'This tool lets the user add feature to the map with geolocation',
        activate: function (options){
            mapApi.ActivateAddFeatureGps(options);
        },
        deactivate: function (){
            mapApi.DeactivateAddFeatureGps();
        },
        messageObject: []
    };

    var addFeatureGps = new ISY.MapAPI.Tools.Tool(addFeatureGpsConfig);
    tools.push(addFeatureGps);


    var measureConfig = {
        id: 'Measure',
        description: 'This tool lets the user measure in the map',
        activate: function (options){
            mapApi.ActivateMeasure(options);
        },
        deactivate: function (){
            mapApi.DeactivateMeasure();
        },
        messageObject: []
    };

    var measure = new ISY.MapAPI.Tools.Tool(measureConfig);
    tools.push(measure);

    var measureLine = {
        id: 'MeasureLine',
        description: 'This tool lets the user measure line in the map',
        activate: function (options){
            mapApi.ActivateMeasureLine(options);
        },
        deactivate: function (){
            mapApi.DeactivateMeasureLine();
        },
        messageObject: []
    };

    var measureLineObject = new ISY.MapAPI.Tools.Tool(measureLine);
    tools.push(measureLineObject);

    var hoverInfoConfig = {
        id: "FeatureHoverInfo",
        description: 'This tool allow user get info via mouse hover',
        activate: function(){
            mapApi.ActivateHoverInfo();
        },
        deactivate: function (){
            mapApi.DeactivateHoverInfo();
        },
        messageObject: []
    };

    var hoverInfo = new ISY.MapAPI.Tools.Tool(hoverInfoConfig);
    tools.push(hoverInfo);

    var featureEditorConfig = {
        id: "FeatureEditor",
        description: 'This tool allow user to edit features',
        activate: function(){
            mapApi.ActivateEditClick();
        },
        deactivate: function (){
            mapApi.DeactivateEditClick();
        },
        messageObject: []
    };

    var featureEditor = new ISY.MapAPI.Tools.Tool(featureEditorConfig);
    tools.push(featureEditor);

    var printBoxSelectConfig = {
        id: 'PrintBoxSelect',
        description: 'This tool activates box select functionality for printing',
        activate: function (options){
            mapApi.ActivatePrintBoxSelect(options);
        },
        deactivate: function (){
            mapApi.DeactivatePrintBoxSelect();
        },
        messageObject: []
    };
    var printBoxSelect = new ISY.MapAPI.Tools.Tool(printBoxSelectConfig);
    tools.push(printBoxSelect);

    var addLayerUrlConfig = {
        id: 'AddLayerUrl',
        description: 'This tool lets the user add features from url to the map',
        activate: function (options){
            mapApi.ActivateAddLayerUrl(options);
        },
        deactivate: function (){
            mapApi.DeactivateAddLayerUrl();
        },
        messageObject: []
    };

    var addLayerUrl = new ISY.MapAPI.Tools.Tool(addLayerUrlConfig);
    tools.push(addLayerUrl);

    function getTools(){
        return tools;
    }

    return {
        GetTools: getTools
    };
};