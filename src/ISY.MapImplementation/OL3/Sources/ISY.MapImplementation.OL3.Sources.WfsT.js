/**
 * Created by Magne Tondel on 2015-05-27.
 */

var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};
ISY.MapImplementation.OL3.Sources = ISY.MapImplementation.OL3.Sources || {};

/**
 * @class
 * Transaction manager to handle inserts, updates and deletes using WFS-T.
 *
 * @constructor
 * @param {string} url.
 * @param {string} featureType.
 * @param {string} featureNS.
 * @param {string} srsName.
 * @param {ol.source.Vector} source.
 */
ISY.MapImplementation.OL3.Sources.WfsT = function (url, featureType, featureNS, srsName, source, eventHandler) {
    var url_ = url;
    var featureType_ = featureType;
    var featureNS_ = featureNS;
    var srsName_ = srsName;
    var source_ = source;
    var serializer_ = new XMLSerializer();

    /**
     * Insert a new feature and handle response.
     * @param {ol.Feature} feature.
     * @return {ol.Feature} feature.
     * @throws {Error} error message.
     */
    function insertFeature(feature, describedSource) {
    if (source_.format === undefined && describedSource === undefined) {
            eventHandler.TriggerEvent(ISY.Events.EventTypes.TransactionInsertEnd, false);
            return false;
        }
    if (describedSource !== undefined) {
            source_ = describedSource;
        }

        var featureNode = source_.format.writeTransaction([feature], null, null, {
      gmlOptions: {
        srsName: srsName_
      },
            featureNS: featureNS_,
            featureType: featureType_
        });

        var featureData = serializer_.serializeToString(featureNode);

        featureData = featureData.replace(/geometry/g, feature.getGeometryName());
        featureData = featureData.replace(/&/g, '&amp;');
        //featureData = featureData.replace("xmlns=\"http://www.opengis.net/gml\"", "xmlns=\"http://www.opengis.net/gml/3.2\"");

        var message = "Error inserting feature: ";
        var okResult = true;

        $.ajax({
            type: "POST",
            url: url_,
            data: featureData,
            async: false,
            success: function (data) {
                var result = readResponse(data);
                if (result === undefined) {
                    okResult = false;
                    message += "Response parse error.";
        } else if (typeof result === 'string') {
                    okResult = false;
                    message += result;
        } else if (result.transactionSummary === undefined) {
                    okResult = false;
        } else if (result && result.transactionSummary.totalInserted === 1) {
                    var gmlId = result.insertIds[0];
                    feature.setId(gmlId);
                    var localId = getLocalId(gmlId);
                    feature.set("lokalId", localId);
                    source_.addFeature(feature);
        } else {
                    okResult = false;
                    message += "Feature not inserted.";
                }

                eventHandler.TriggerEvent(ISY.Events.EventTypes.TransactionInsertEnd, okResult);
            },
            error: function (e) {
                var errorMsg = e ? (e.status + ' ' + e.statusText) : "";
                if (errorMsg === "200 parsererror") {
                    errorMsg = "Response parse error.";
                }
                okResult = false;
                message += errorMsg;
                eventHandler.TriggerEvent(ISY.Events.EventTypes.TransactionInsertEnd, okResult);
            }
        });

        if (!okResult) {
            throw new Error(message);
        }
    }

    /**
     * Updates an existing feature and handle response.
     * @param {ol.Feature} feature.
     * @return {boolean} update result.
     * @throws {Error} error message.
     */
    function updateFeature(feature) {
    if (source_.format === undefined) {
            eventHandler.TriggerEvent(ISY.Events.EventTypes.TransactionUpdateEnd, false);
            return false;
        }
        var gmlId = feature.getId();
        var properties = feature.getProperties();
        delete properties.bbox;
        var clone = new ol.Feature(properties);
        clone.setId(gmlId);
        //clone.setGeometryName('geometri');
        var featureNamespace = getFeatureNamespace(featureType_);

        var featureNode;
        var featureData;

        if (featureNamespace !== "") {
            featureNode = source_.format.writeTransaction(null, [clone], null, {
        gmlOptions: {
          srsName: srsName_
        },
                featureNS: featureNS_,
                featureType: getFeatureName(featureType_),
                featurePrefix: featureNamespace
            });

      featureData = _convertXmlToString(featureNode); //serializer_.serializeToString(featureNode);
            featureData = featureData.replace(/<Name>/g, "<Name>" + featureNamespace + ":");
            //featureData = featureData.replace("xmlns=\"http://www.opengis.net/gml\"", "xmlns=\"http://www.opengis.net/gml/3.2\"");
    } else {
            featureNode = source_.format.writeTransaction(null, [clone], null, {
        gmlOptions: {
          srsName: srsName_
        },
                featureNS: featureNS_,
                featureType: getFeatureName(featureType_)
            });
      featureData = _convertXmlToString(featureNode); //serializer_.serializeToString(featureNode);
        }

        featureData = featureData.replace('xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"', 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" xmlns="http://www.opengis.net/wfs"');
        featureData = featureData.replace('Filter', 'Filter xmlns="http://www.opengis.net/ogc"');

        featureData = featureData.replace('Point', 'Point xmlns="http://www.opengis.net/gml"');
        featureData = featureData.replace('Polygon', 'Polygon xmlns="http://www.opengis.net/gml"');
        featureData = featureData.replace('LineString', 'LineString xmlns="http://www.opengis.net/gml"');
        featureData = featureData.replace(/&/g, '&amp;');

        var message = "Error updating feature: ";
        var okResult = true;

        $.ajax({
            type: "POST",
            url: url_,
            data: featureData,
            success: function (data) {
                var result = readResponse(data);
                if (result === undefined) {
                    okResult = false;
                    message += "Response parse error.";
        } else if (typeof result === 'string') {
                    okResult = false;
                    message += result;
        } else if (result.transactionSummary === undefined) {
                    okResult = false;
        } else if (result && result.transactionSummary.totalUpdated === undefined) {
                    okResult = false;
                    message += "Response parse error.";
        } else if (result && result.transactionSummary.totalUpdated !== 1) {
                    okResult = false;
                    message += "Feature not updated.";
        } else {
                    var sourceFeature = source_.getFeatureById(gmlId);
                    if (sourceFeature !== undefined) {
                        sourceFeature.setProperties(properties);
                    }
                }
                eventHandler.TriggerEvent(ISY.Events.EventTypes.TransactionUpdateEnd, okResult);
            },
            error: function (e) {
                var errorMsg = e ? (e.status + ' ' + e.statusText) : "";
                if (errorMsg === "200 parsererror") {
                    errorMsg = "Response parse error.";
                }
                okResult = false;
                message += errorMsg;
                eventHandler.TriggerEvent(ISY.Events.EventTypes.TransactionUpdateEnd, okResult);
            }
        });

        if (!okResult) {
            throw new Error(message);
        }
    }

    //var nodeElements = [];
    var resultString = "";

  function _getChildElementToString(node) {
    if (node.childElementCount > 0) {
      for (var i = 0; i < node.childNodes.length; i++) {

        resultString += '<' + node.childNodes[i].nodeName;
        if (node.childNodes[i].attributes.length > 0) {
          for (var j = 0; j < node.childNodes[i].attributes.length; j++) {
                        var attribute = node.childNodes[i].attributes[j];
                        resultString += ' ' + attribute.name + '=' + '"' + attribute.value + '"';
                    }
                }
                if (node.childNodes[i].childNodes.length > 0) {
                    resultString += ">";
                }
        if (node.childNodes[i].childElementCount > 0) {
                    _getChildElementToString(node.childNodes[i]);
        } else {
          if (node.childNodes[i].childNodes.length > 0) {
                        resultString += node.childNodes[i].childNodes[0].nodeValue;
                        resultString += "</" + node.childNodes[i].nodeName + ">";
          } else {
                        resultString += "/>";
                    }
                }
            }
    } else {
      resultString += '<' + node.nodeName;
      if (node.attributes.length > 0) {
        for (var k = 0; k < node.attributes.length; k++) {
                    var attribute1 = node.attributes[k];
                    resultString += ' ' + attribute1.name + '=' + '"' + attribute1.value + '"';
                }
            }
      if (node.childNodes[0].childNodes.length > 0) {
                resultString += ">";
                resultString += node.childNodes[0].nodeValue;
                resultString += "</" + node.nodeName + ">";
      } else {
                resultString += "/>";
            }
        }
        resultString += "</" + node.nodeName + ">";
    }

  function _convertXmlToString(xmlDoc) {
        var tags = xmlDoc.getElementsByTagName('*');
        var xmlString = '';
        var tagNodeName = [];
        var parentNode = tags[0].parentNode;

        //parent node
    xmlString += '<' + parentNode.nodeName;
        tagNodeName.push(parentNode.nodeName);
    for (var m = 0; m < parentNode.attributes.length; m++) {
            var parentAttribute = parentNode.attributes[m];
            xmlString += ' ' + parentAttribute.name + '=' + '"' + parentAttribute.value + '"';
        }
        xmlString += ">";

        //main node
    xmlString += '<' + tags[0].nodeName;
        tagNodeName.push(tags[0].nodeName);
    for (var c = 0; c < tags[0].attributes.length; c++) {
            var mainAttribute = tags[0].attributes[c];
            xmlString += ' ' + mainAttribute.name + '=' + '"' + mainAttribute.value + '"';
        }
        xmlString += ">";

        var tag = tags[0]; // tags[0] has all children - not necessary to loop tags
    for (var i = 0; i < tag.childElementCount; i++) {
      xmlString += '<' + tag.childNodes[i].nodeName;
      if (tag.childNodes[i].attributes.length > 0) {
        for (var b = 0; b < tag.childNodes[i].attributes.length; b++) {
                    var attribute = tag.childNodes[i].attributes[b];
                    xmlString += ' ' + attribute.name + '=' + '"' + attribute.value + '"';
                }
            }
            xmlString += ">";
            _getChildElementToString(tag.childNodes[i]);
            xmlString += resultString;
            resultString = "";
        }

    for (var k = tagNodeName.length - 1; k >= 0; k--) {
            xmlString += "</" + tagNodeName[k] + ">";
        }
        return xmlString;
    }

    /**
     * Deletes an existing feature and handle response.
     * @param {ol.Feature} feature.
     * @return {boolean} delete result.
     * @throws {Error} error message.
     */
    function deleteFeature(feature) {
    if (source_.format === undefined) {
            eventHandler.TriggerEvent(ISY.Events.EventTypes.TransactionRemoveEnd, false);
            return false;
        }

        var featureNode = source_.format.writeTransaction(null, null, [feature], {
            featureNS: featureNS_,
            featureType: getFeatureName(featureType_)
        });

    var featureData = _convertXmlToString(featureNode); //serializer_.serializeToString(featureNode);
        featureData = featureData.replace('xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"', 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" xmlns="http://www.opengis.net/wfs"');
        featureData = featureData.replace('Filter', 'Filter xmlns="http://www.opengis.net/ogc"');

        var message = "Error deleting feature: ";
        var okResult = true;

        $.ajax({
            type: "POST",
            url: url_,
            data: featureData,
            success: function (data) {
                var result = readResponse(data);
                if (result === undefined) {
                    okResult = false;
                    message += "Response parse error.";
        } else if (typeof result === 'string') {
                    okResult = false;
                    message += result;
        } else if (result.transactionSummary === undefined) {
                    okResult = false;
        } else if (result && result.transactionSummary.totalDeleted !== 1) {
                        okResult = false;
                        message += "Feature not deleted.";
                }

                eventHandler.TriggerEvent(ISY.Events.EventTypes.TransactionRemoveEnd, okResult);
            },
            error: function (e) {
                var errorMsg = e ? (e.status + ' ' + e.statusText) : "";
                if (errorMsg === "200 parsererror") {
                    errorMsg = "Response parse error.";
                }
                okResult = false;
                message += errorMsg;
                eventHandler.TriggerEvent(ISY.Events.EventTypes.TransactionRemoveEnd, okResult);
            }
        });

        if (!okResult) {
            throw new Error(message);
        }
    }

    /**
     * Read the response and handle exceptions.
     * @param {Document} data.
     * @return {Object|string|undefined} result, error text or parse error (undefined).
     */
    function readResponse(data) {
        var result;
        if (window.Document && data instanceof Document && data.documentElement && data.documentElement.localName === 'ExceptionReport') {
            result = (data.getElementsByTagNameNS('http://www.opengis.net/ows', 'ExceptionText').item(0).textContent);
    } else {
            result = source_.format.readTransactionResponse(data);
        }
        return result;
    }

    /**
     * Get feature type.
     * @return {String} featureType.
     */
    function getFeatureType() {
        return featureType_;
    }

    /**
     * Get local id from gml id.
     * @param {String} gmlId.
     * @return {String} localId.
     */
    function getLocalId(gmlId) {
        var startIndex = gmlId.indexOf('{');
        if (startIndex !== -1) {
            return gmlId.substr(startIndex);
    } else {
            return "";
        }
    }

    /**
     * Get feature name from feature type (without namespace).
     * @param {String} featureType.
     * @return {String} featureName.
     */
    function getFeatureName(featureType) {
        var startIndex = featureType.indexOf(':');
        if (startIndex !== -1) {
            startIndex++;
            return featureType.substr(startIndex);
    } else {
            return featureType;
        }
    }

    /**
     * Get feature namespace from feature type (without name).
     * @param {String} featureType.
     * @return {String} featureNamespace.
     */
    function getFeatureNamespace(featureType) {
        var startIndex = featureType.indexOf(':');
        if (startIndex !== -1) {
            return featureType.substr(0, startIndex);
    } else {
            return "";
        }
    }

    return {
        InsertFeature: insertFeature,
        UpdateFeature: updateFeature,
        DeleteFeature: deleteFeature,

        GetFeatureType: getFeatureType
    };
};
