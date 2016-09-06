var ISY = ISY || {};
ISY.Domain = ISY.Domain || {};

ISY.Domain.MeasureResult = function(polygonArea, edgeLength, circleArea){
    var pa = polygonArea;
    var el = edgeLength;
    var ca = circleArea;

    function getPolygonArea(){
        return pa;
    }

    function getEdgeLength(){
        return el;
    }

    function getCircleArea(){
        return ca;
    }

    function getParsedResult(){
        return 'Polygon area: ' + getPolygonArea() + ' Length: ' + getEdgeLength() + ' Circle area: ' + getCircleArea();
    }

    return {
        PolygonArea: getPolygonArea,
        EdgeLength: getEdgeLength,
        CircleArea: getCircleArea,
        GetParsedResult: getParsedResult
    };
};
