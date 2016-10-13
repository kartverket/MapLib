var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};
ISY.MapImplementation.OL3.Styles = ISY.MapImplementation.OL3.Styles || {};

ISY.MapImplementation.OL3.Styles.Json = function (style) {

    var _zIndex = 0;

    function _createStyle(feature, jsonstyle, hover){
        var jsonobject = (typeof jsonstyle == "object") ? jsonstyle : JSON.parse(jsonstyle);
        var currentstyle = [];
        _zIndex++;
        currentstyle.push(new ol.style.Style({
            fill: _createFillStyle(jsonobject),
            icon: _createIconStyle(jsonobject, hover),
            image: _createImageStyle(jsonobject, hover),
            stroke: _createStrokeStyle(jsonobject, hover),
            text: _createTextStyle(feature, jsonobject, hover),
            zIndex: _zIndex
        }));
        return currentstyle;
    }

    function _createFillStyle(jsonstyle){
        if (jsonstyle.fill){
            return new ol.style.Fill(jsonstyle.fill);
        }
    }

    function _createIconStyle(jsonstyle){
        if (jsonstyle.icon){
            return new ol.style.Icon(jsonstyle.icon);
        }
    }

    function _createImageStyle(jsonstyle, hover){
        if (jsonstyle.image){
            return new ol.style.Circle({
                radius: hover ? jsonstyle.image.radius * 1.2 : jsonstyle.image.radius,
                fill: _createFillStyle(jsonstyle.image),
                stroke: _createStrokeStyle(jsonstyle.image)
            });
        } else if (jsonstyle.regularshape){
            var angle = parseInt(jsonstyle.regularshape.angle, 10);
            var rotation = parseInt(jsonstyle.regularshape.rotation, 10);
            return new ol.style.RegularShape({
                fill: _createFillStyle(jsonstyle.regularshape),
                stroke: _createStrokeStyle(jsonstyle.regularshape),
                radius: hover ? jsonstyle.regularshape.radius * 1.2 : jsonstyle.regularshape.radius,
                radius2: hover ? jsonstyle.regularshape.radius2 * 1.2 : jsonstyle.regularshape.radius2,
                points: jsonstyle.regularshape.points,
                rotation: (rotation > 0) ? Math.PI / rotation : 0,
                angle: (angle > 0) ? Math.PI / angle : 0
            });
        }
    }

    function _createStrokeStyle(jsonstyle, hover){
        if (jsonstyle.stroke){
            if (hover){
                jsonstyle.stroke.width *= 2;
            }
            return new ol.style.Stroke(jsonstyle.stroke);
        }
    }

    function _createTextStyle(feature, jsonstyle, hover){
        if (jsonstyle.text){
            if (hover){
                if (jsonstyle.text.scale){
                    jsonstyle.text.scale *= 1.2;
                }
                if (jsonstyle.text.rotation){
                    jsonstyle.text.rotation *= -1;
                }
            }
            var tmpStyle={
                text: {
                    font: jsonstyle.text.font,
                    text: _parseTextFilter(feature, jsonstyle.text.text),
                    fill: _createFillStyle(jsonstyle.text),
                    stroke: _createStrokeStyle(jsonstyle.text)
                }
            };
            return new ol.style.Text(tmpStyle.text);
        }
    }

    function _parseTextFilter(feature, text) {
        if (text) {
            var pos0 = text.indexOf('{');
            if (pos0 < 0) {
                return text;
            }
            var label = '';
            while (pos0 >= 0) {
                if (pos0 > 0) {
                    label += text.substr(0, pos0);
                    text = text.slice(pos0);
                    pos0 = text.indexOf('{');
                }
                var pos1 = text.indexOf('}');
                var fieldname = text.substr(pos0 + 1, pos1 - pos0 - 1);
                var fieldvalue = feature.get(fieldname);
                if (fieldvalue) {
                    label += fieldvalue;
                }
                text = text.slice(pos1 + 1);
                pos0 = text.indexOf('{');
            }
            return label + text;
        }
    }

    var getStyle = function(feature){
        if (feature) {
            var properties = feature.getProperties();
            if (properties.style){
                feature.setStyle(_createStyle(feature, properties.style));
                return;
            }
            return _createStyle(feature, style);
        }
    };

    var getHoverStyle = function(feature){
        if (feature) {
            return _createStyle(feature, style, true);
        }
    };

    return {
        GetStyle: getStyle,
        GetHoverStyle: getHoverStyle
    };
};