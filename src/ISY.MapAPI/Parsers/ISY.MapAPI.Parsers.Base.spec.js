/**
 * Created by liska on 08.06.2015.
 */
/** Parsers are not in use in GeoInnsyn. This code is from BW. Write tests for this if GeoInnsyn start using this code ...*/

describe("Parser base test", function() {

    it("Should parse undefined", function() {

        var parser = new ISY.MapAPI.Parsers.Base();
        var result;

        expect(parser.Parse(result)).toBeNull();

    });

});