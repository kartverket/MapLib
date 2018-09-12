var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};
ISY.MapImplementation.OL3.Sources = ISY.MapImplementation.OL3.Sources || {};

ISY.MapImplementation.OL3.FeatureEditor = function (eventHandler) {

  var editKey_ = "";
  var points_ = []; // ol.geom.Point[]
  var geometryName_ = "";
  var transactionManager_ = null; // ISY.MapImplementation.OL3.Sources.WfsT

  function init(url, featureType, featureNS, srsName, source, geometryName) {
    if (featureNS === undefined) {
      featureNS = "http://kart4.nois.no/skjema/va";
    }
    transactionManager_ = new ISY.MapImplementation.OL3.Sources.WfsT(url, featureType, featureNS, srsName, source, eventHandler);
    geometryName_ = geometryName;
  }

  function activateEditSelect(callback, map) {
    if (map !== undefined) {
      editKey_ = map.on('singleclick', function (evt) {
        callback(evt.coordinate);
      });
    }
  }

  function deactivateEditSelect() {
    ol.Observable.unByKey(editKey_);
    editKey_ = "";
  }

  function handlePointSelect(coordinate) {
    var point = new ol.geom.Point(coordinate);
    points_.push(point);

    // Temporary test
    var feature = new ol.Feature({
      navn: "ISY.MapLib-" + transactionManager_.GetFeatureType() + "-Insert"
    });
    feature.setGeometryName(geometryName_);
    feature.setGeometry(point);
    transactionManager_.InsertFeature(feature);
  }

  function updateFeature(feature) {
    transactionManager_.UpdateFeature(feature);
  }

  function insertFeature(feature, source) {
    return transactionManager_.InsertFeature(feature, source);
  }

  function deleteFeature(feature) {
    return transactionManager_.DeleteFeature(feature);
  }

  return {
    Init: init,
    ActivateEditSelect: activateEditSelect,
    DeactivateEditSelect: deactivateEditSelect,
    HandlePointSelect: handlePointSelect,
    UpdateFeature: updateFeature,
    InsertFeature: insertFeature,
    DeleteFeature: deleteFeature
  };
};
