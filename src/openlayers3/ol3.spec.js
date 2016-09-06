
describe('new ol.source.Vector', function() {
    var source;
    var format;

    beforeEach(function(){
        var loader = function() {
            var url = 'https://kart5.nois.no/trondheim_neste/wfs/default.asp?conname=dek&' +
                'service=WFS&request=GetFeature&' +
                'version=1.1.0&typename=JEiendom&' +
                'srsname=EPSG:32632&' +
                'bbox=571137.4753468372,7029149.1211048085,571213.9123751224,7029225.558133094';
            $.ajax({
                url: url
            })
                .done(function(response) {
                    if (response.firstChild.childElementCount === 0){
                        return;
                    }
                    var features = source.readFeatures(response);
                    if (features){
                        source.addFeatures(features);
                    }
                });
        };

        format = new ol.format.WFS({
            featureType: 'JEiendom',
            featureNS: 'http://www.intergraph.com/geomedia/gml',
            gmlFormat: new ol.format.GML3()
        });

        source = new ol.source.Vector({
            format: format,
            loader: loader
        });


        spyOn(format, 'readFeatures').and.callThrough();
    });

    it('should return its public methods',  function() {

    });
});