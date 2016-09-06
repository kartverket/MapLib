describe("ISY.Domain.MeasureResult", function(){
        var polygonArea = 123;
        var edgeLength = 456;
        var circleArea = 789;

        it("PolygonArea return area", function() {
            var measureResult = new ISY.Domain.MeasureResult(polygonArea, edgeLength, circleArea);
            expect(measureResult.PolygonArea()).toEqual(123);
        });

        it("EdgeLength return area", function() {
            var measureResult = new ISY.Domain.MeasureResult(polygonArea, edgeLength, circleArea);
            expect(measureResult.EdgeLength()).toEqual(456);
        });

        it("CircleArea return area", function() {
            var measureResult = new ISY.Domain.MeasureResult(polygonArea, edgeLength, circleArea);
            expect(measureResult.CircleArea()).toEqual(789);
        });

        it("GetParsedResult return correct string", function() {
            var measureResult = new ISY.Domain.MeasureResult(polygonArea, edgeLength, circleArea);
            expect(measureResult.GetParsedResult()).toEqual('Polygon area: ' + polygonArea + ' Length: ' + edgeLength + ' Circle area: ' + circleArea);
        });
    }
);