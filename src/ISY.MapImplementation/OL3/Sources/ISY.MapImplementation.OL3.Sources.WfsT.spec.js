/**
 * Created by Magne Tondel on 2015-06-03.
 */

describe('ISY.MapImplementation.OL3.Sources.WfsT', function(){

    var transactionManager_;

    /**
     * Test configuration
     */
    var url = "http://testWfsServiceUrl?";
    var featureType = "test:FeatureType";
    var featureNamespace = "http://testFeatureNamespace";
    var srsName = "EPSG:XXXXX";
    var featureGmlId = '{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}';

    /**
     * Test WFS-T responses
     */
    var responseStart =
        '<wfs:TransactionResponse ' +
            'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
            'xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" ' +
            'xmlns:wfs="http://www.opengis.net/wfs" ' +
            'xmlns:ogc="http://www.opengis.net/ogc" ' +
            'version="1.1.0">';

    var responseEnd =
        '</wfs:TransactionResponse>';

    var insertResponse =
        responseStart +
            '<wfs:TransactionSummary>' +
                '<wfs:totalInserted>1</wfs:totalInserted>' +
                '<wfs:totalUpdated>0</wfs:totalUpdated>' +
                '<wfs:totalDeleted>0</wfs:totalDeleted>' +
            '</wfs:TransactionSummary>' +
            '<wfs:InsertResults>' +
                '<wfs:Feature>' +
                    '<ogc:FeatureId fid=\"' + featureType +'_'+ featureGmlId +'\"/>' +
                '</wfs:Feature>' +
            '</wfs:InsertResults>' +
        responseEnd;

    var updateResponse =
        responseStart +
            '<wfs:TransactionSummary>' +
                '<wfs:totalInserted>0</wfs:totalInserted>' +
                '<wfs:totalUpdated>1</wfs:totalUpdated>' +
                '<wfs:totalDeleted>0</wfs:totalDeleted>' +
            '</wfs:TransactionSummary>' +
        responseEnd;

    var deleteResponse =
        responseStart +
            '<wfs:TransactionSummary>' +
                '<wfs:totalInserted>0</wfs:totalInserted>' +
                '<wfs:totalUpdated>0</wfs:totalUpdated>' +
                '<wfs:totalDeleted>1</wfs:totalDeleted>' +
            '</wfs:TransactionSummary>' +
        responseEnd;

    var errorResponse =
        '<ows:ExceptionReport ' +
            'xmlns:ows="http://www.opengis.net/ows" ' +
            'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
            'xsi:schemaLocation="http://www.opengis.net/ows http://schemas.opengis.net/ows/1.0.0/owsExceptionReport.xsd" ' +
            'version="1.0.0">' +
                '<ows:Exception>' +
                    '<ows:ExceptionText>TestFeatureError</ows:ExceptionText>' +
                '</ows:Exception>' +
        '</ows:ExceptionReport>';

    /**
     * Test setup
     */
    beforeEach(function(){

        jasmine.Ajax.install();

        var source = new ol.source.Vector();
        source.format = new ol.format.WFS({
            featureType: featureType,
            featureNS: featureNamespace,
            gmlFormat: new ol.format.GML3()
        });
        transactionManager_ = new ISY.MapImplementation.OL3.Sources.WfsT(url, featureType, featureNamespace, srsName, source);
    });

    /**
     * Test tear down
     */
    afterEach(function(){
        jasmine.Ajax.uninstall();
    });

    /**
     * Tests
     */
    it('Should return its public methods', function(){
        expect(transactionManager_.InsertFeature).not.toBeUndefined();
        expect(transactionManager_.UpdateFeature).not.toBeUndefined();
        expect(transactionManager_.DeleteFeature).not.toBeUndefined();
        expect(transactionManager_.GetFeatureType).not.toBeUndefined();
    });

    xit('Get feature type test', function () {
        expect(transactionManager_.GetFeatureType(), featureType);
    });

    xit('Feature insert test', function() {
        jasmine.Ajax.stubRequest(url).andReturn({
            status: 200,
            responseText: insertResponse,
            contentType: "text/xml"
        });

        var newFeature = new ol.Feature();
        newFeature = transactionManager_.InsertFeature(newFeature);
        expect(newFeature.get('lokalId')).toBe(featureGmlId);
    });

    xit('Feature insert error test', function() {
        jasmine.Ajax.stubRequest(url).andReturn({
            status: 200,
            responseText: errorResponse,
            contentType: "text/xml"
        });

        var newFeature = new ol.Feature();
        expect(
            function() {
                transactionManager_.InsertFeature(newFeature);
            }
        ).toThrow(new Error("Error inserting feature: TestFeatureError"));
    });

    xit('Feature insert network failure test', function() {
        jasmine.Ajax.stubRequest(url).andReturn({
            status: 404,
            responseText: "error",
            contentType: "text/html"
        });

        var newFeature = new ol.Feature();
        expect(
            function() {
                transactionManager_.InsertFeature(newFeature);
            }
        ).toThrow(new Error("Error inserting feature: 404 error"));
    });

    xit('Feature insert parse error test', function () {
        jasmine.Ajax.stubRequest(url).andReturn({
            status: 200,
            responseText: '<wfs:TransactionResponse></wfs:TransactionResponse>',
            contentType: "text/xml"
        });

        var newFeature = new ol.Feature();
        expect(
            function() {
                transactionManager_.InsertFeature(newFeature);
            }
        ).toThrow(new Error("Error inserting feature: Response parse error."));
    });

    xit('Feature update test', function() {
        jasmine.Ajax.stubRequest(url).andReturn({
            status: 200,
            responseText: updateResponse,
            contentType: "text/xml"
        });

        var updatedFeature = new ol.Feature();
        var updateResult = transactionManager_.UpdateFeature(updatedFeature);
        expect(updateResult).toBe(true);
    });

    xit('Feature update error test', function() {
        jasmine.Ajax.stubRequest(url).andReturn({
            status: 200,
            responseText: errorResponse,
            contentType: "text/xml"
        });

        var updatedFeature = new ol.Feature();
        expect(
            function() {
                transactionManager_.UpdateFeature(updatedFeature);
            }
        ).toThrow(new Error("Error updating feature: TestFeatureError"));
    });

    xit('Feature update network failure test', function() {
        jasmine.Ajax.stubRequest(url).andReturn({
            status: 404,
            responseText: "error",
            contentType: "text/html"
        });

        var updatedFeature = new ol.Feature();
        expect(
            function() {
                transactionManager_.UpdateFeature(updatedFeature);
            }
        ).toThrow(new Error("Error updating feature: 404 error"));
    });

    xit('Feature update parse error test', function () {
        jasmine.Ajax.stubRequest(url).andReturn({
            status: 200,
            responseText: '<wfs:TransactionResponse></wfs:TransactionResponse>',
            contentType: "text/xml"
        });

        var updatedFeature = new ol.Feature();
        expect(
            function() {
                transactionManager_.UpdateFeature(updatedFeature);
            }
        ).toThrow(new Error("Error updating feature: Response parse error."));
    });

    xit('Feature delete test', function() {
        jasmine.Ajax.stubRequest(url).andReturn({
            status: 200,
            responseText: deleteResponse,
            contentType: "text/xml"
        });

        var deletedFeature = new ol.Feature();
        var deleteResult = transactionManager_.DeleteFeature(deletedFeature);
        expect(deleteResult).toBe(true);
    });

    xit('Feature delete error test', function() {
        jasmine.Ajax.stubRequest(url).andReturn({
            status: 200,
            responseText: errorResponse,
            contentType: "text/xml"
        });

        var deletedFeature = new ol.Feature();
        expect(
            function() {
                transactionManager_.DeleteFeature(deletedFeature);
            }
        ).toThrow(new Error("Error deleting feature: TestFeatureError"));
    });

    it('Feature delete network failure test', function() {
        jasmine.Ajax.stubRequest(url).andReturn({
            status: 404,
            responseText: "error",
            contentType: "text/html"
        });

        var deletedFeature = new ol.Feature();
        expect(
            function() {
                transactionManager_.DeleteFeature(deletedFeature);
            }
        ).toThrow(new Error("Error deleting feature: 404 error"));
    });

    it('Feature delete parse error test', function () {
        jasmine.Ajax.stubRequest(url).andReturn({
            status: 200,
            responseText: '<wfs:TransactionResponse></wfs:TransactionResponse>',
            contentType: "text/xml"
        });

        var deletedFeature = new ol.Feature();
        expect(
            function() {
                transactionManager_.DeleteFeature(deletedFeature);
            }
        ).toThrow(new Error("Error deleting feature: Response parse error."));
    });
});