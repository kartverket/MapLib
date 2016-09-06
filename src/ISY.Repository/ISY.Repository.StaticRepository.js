var ISY = ISY || {};
ISY.Repository = ISY.Repository || {};

ISY.Repository.StaticRepository = function() {
    var mapConfig = new ISY.Repository.MapConfig({
        numZoomLevels: 18,
        newMaxRes: 21664.0,
        renderer: ISY.MapImplementation.OL3.Map.RENDERERS.canvas,
        center: [570130,7032300],
        zoom: 4,
        coordinate_system: "EPSG:32633",
        extent: [-2000000.0, 3500000.0, 3545984.0, 9045984.0],
        extentunits: 'm',
        proxyHost: '',
        layers:[
            {
                "id": "1992",
                "isBaseLayer": true,
                "subLayers": [
                    {
                        "source": "WMS",
                        "url": ["http://opencache.statkart.no/gatekeeper/gk/gk.open?LAYERS=norges_grunnkart"],
                        "gatekeeper": true,
                        "name": "norges_grunnkart",
                        "format": "image/png",
                        "coordinate_system": "EPSG:32632",
                        "id": "1992",
                        "tiled": true
                    }
                ],
                "visibleOnLoad": true
            },
            {
                "id": "8001",
                "isBaseLayer": false,
                "subLayers": [
                    {
                        "source": "WFS",
                        "url": ["https://kart5.nois.no/trondheim_neste/wfs/default.asp?conname=Regplan&"],
                        "name": "RpOmråde",
                        "version": "1.0.0",
                        //"maxResolution": 3500 / 2834,
                        "coordinate_system": "EPSG:32632",
                        //"extent": [-2000000,3500000,3545984,9045984],
                        //"extentUnits": "m",
                        "id": "8001",
                        "tiled": false,
                        "style": "http://geoinnsyn.norconsultad.com/Services/ISY.GIS.IsyGeoinnsynConfig/api/v1/style?application=GeoInnsyn&name=RegplanVedtatt"
                    }
                ],
                "visibleOnLoad": true
            },
            {
                "id": "8002",
                "isBaseLayer": false,
                "subLayers": [
                    {
                        "source": "WFS",
                        "url": ["https://kart5.nois.no/trondheim_neste/wfs/default.asp?conname=Tiltak&"],
                        "name": "PblTiltak",
                        "version": "1.0.0",
                        //"maxResolution": 3500 / 2834,
                        "coordinate_system": "EPSG:32632",
                        //"extent": [-2000000,3500000,3545984,9045984],
                        //"extentUnits": "m",
                        "id": "8002",
                        "tiled": false,
                        "style": "http://geoinnsyn.norconsultad.com/Services/ISY.GIS.IsyGeoinnsynConfig/api/v1/style?application=GeoInnsyn&name=pblTiltak_type"
                    }],
                "visibleOnLoad": true
            }

        ]
    });

    function _getMapConfig(){
        return mapConfig;
    }

    return {
        GetMapConfig: _getMapConfig
    };
};