/**
 * Created by Magne Tondel on 2015-06-02.
 */

describe('ISY.MapImplementation.OL3.FeatureEditor', function(){

    var featureEditor;

    /**
     * Test setup
     */
    beforeEach(function(){
        featureEditor = new ISY.MapImplementation.OL3.FeatureEditor();
    });

    /**
     * Tests
     */
    it('Should return its public methods', function(){
        expect(featureEditor.Init).not.toBeUndefined();
        expect(featureEditor.ActivateEditSelect).not.toBeUndefined();
        expect(featureEditor.DeactivateEditSelect).not.toBeUndefined();
        expect(featureEditor.HandlePointSelect).not.toBeUndefined();
    });
});