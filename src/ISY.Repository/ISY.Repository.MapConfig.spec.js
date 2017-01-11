describe('ISY.Repository.MapConfig', function() {

    beforeEach(function(){
        var conf = {
            isBaseLayer: true
        };
        subLayersToShow  = [
            new ISY.Domain.SubLayer(conf),
            new ISY.Domain.SubLayer(conf),
            new ISY.Domain.SubLayer(conf)
        ];

        subLayersToHide = [
            new ISY.Domain.SubLayer(conf),
            new ISY.Domain.SubLayer(conf)
        ];

    });

    it('Can create a default MapConfig', function(){

        mapConf = new ISY.Repository.MapConfig({});

        expect(mapConf.name).toEqual('');
        expect(mapConf.comment).toEqual('');
        expect(mapConf.useCategories).toBeTruthy();
        expect(mapConf.numZoomLevels).toEqual(10);
        expect(mapConf.newMaxRes).toEqual(21664);
        expect(mapConf.newMaxScale).toEqual(81920000);
        expect(mapConf.renderer).toEqual('canvas');
        expect(mapConf.center).toEqual([-1, 1]);
        expect(mapConf.zoom).toEqual(5);
        expect(mapConf.layers).toEqual([]);
        expect(mapConf.coordinate_system).toEqual('EPSG:25833');
        expect(mapConf.matrixSet).toEqual('EPSG:25833');
        expect(mapConf.extent).toEqual([-1, -1, -1, -1]);
        expect(mapConf.extentUnits).toEqual('m');
        expect(mapConf.proxyHost).toEqual('');
    });

    it('Can create a default MapConfig. Name is correct', function(){

        mapConf = new ISY.Repository.MapConfig({
            name: 'test'
        });

        expect(mapConf.name).toEqual('test');
    });

    it('Create a default MapConfig with correct comment', function(){

        mapConf = new ISY.Repository.MapConfig({
            name: 'test',
            comment: 'This is a comment'
        });

        expect(mapConf.comment).toEqual('This is a comment');
    });

    it('Create a default MapConfig with correct useCategories', function(){

        mapConf = new ISY.Repository.MapConfig({
            name: 'test',
            comment: 'This is a comment',
            useCategories: false
        });

        expect(mapConf.useCategories).toBeFalsy();
    });

    it('Create a default MapConfig with correct numZoomLevels', function(){

        mapConf = new ISY.Repository.MapConfig({
            name: 'test',
            comment: 'This is a comment',
            useCategories: false,
            numZoomLevels: 3
        });

        expect(mapConf.numZoomLevels).toEqual(3);
    });

    it('Create a default MapConfig with correct newMaxRes', function(){

        mapConf = new ISY.Repository.MapConfig({
            name: 'test',
            comment: 'This is a comment',
            useCategories: false,
            numZoomLevels: 3,
            newMaxRes: 4
        });

        expect(mapConf.newMaxRes).toEqual(4);
    });

    it('Create a default MapConfig with correct renderer', function(){

        mapConf = new ISY.Repository.MapConfig({
            renderer: 'myrenderer'
        });

        expect(mapConf.renderer).toEqual('myrenderer');
    });

    it('Create a default MapConfig with correct center', function(){

        mapConf = new ISY.Repository.MapConfig({
            center: [-2,4]
        });

        expect(mapConf.center).toEqual([-2,4]);
    });



});
