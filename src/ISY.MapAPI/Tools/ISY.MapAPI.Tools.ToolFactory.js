var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};
ISY.MapAPI.Tools = ISY.MapAPI.Tools || {};

ISY.MapAPI.Tools.ToolFactory = function(map, tools){
    var internalTools = [];
    var externalTools = [];
    var mapImplementation = map;
    var toolOptions = {};

    internalTools = tools.GetTools();

    function addTool(tool){
        externalTools.push(tool);
    }

    function getAvailableTools(){
        var toolsId = [];
        for(var i = 0; i < externalTools.length; i++){
            toolsId.push(externalTools[i].id);
        }
        return toolsId;
    }

    function activateTool(toolId){
        var activeToolIsCommand = false;
        for(var i = 0; i < externalTools.length; i++){
            var tool = externalTools[i];
            tool.deactivate();

            if(tool.id === toolId){
                if (!$.isEmptyObject(toolOptions)){
                    tool.activate(toolOptions);
                }else{
                    tool.activate();
                }
                activeToolIsCommand = tool.isCommand;
            }
        }
        return activeToolIsCommand;
    }

    function setupTools(toolsConfig){
        for(var i = 0; i < toolsConfig.length; i++){
            var configTool = toolsConfig[i];
            var correspondingInternalTool = _getInternalTool(configTool.id);
            if(correspondingInternalTool){
                externalTools.push(correspondingInternalTool);
            }
        }
    }

    function _getInternalTool(toolId){
        for(var i = 0; i < internalTools.length; i++){
            var internalTool = internalTools[i];
            if(internalTool.id === toolId){
                return internalTool;
            }
        }
        return false;
    }

    function deactivateTool(toolId) {
        var tool = _getInternalTool(toolId);
        if (tool){
            toolOptions = {};
            tool.deactivate(mapImplementation);
        }
    }

    function additionalToolOptions(options){
        toolOptions = options;
    }

    return {
        AddTool: addTool,
        GetAvailableTools: getAvailableTools,
        ActivateTool: activateTool,
        SetupTools: setupTools,
        DeactivateTool: deactivateTool,
        AdditionalToolOptions: additionalToolOptions
    };
};