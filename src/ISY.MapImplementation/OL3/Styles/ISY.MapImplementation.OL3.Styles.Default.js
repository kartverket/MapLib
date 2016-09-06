var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};
ISY.MapImplementation.OL3.Styles = ISY.MapImplementation.OL3.Styles || {};

ISY.MapImplementation.OL3.Styles.Default = function () {
    var styles = function() {
        var fill = new ol.style.Fill({
            color: 'rgba(255,0,0,0.8)'
        });
        var stroke = new ol.style.Stroke({
            color: '#3399CC',
            width: 2.25
        });
        var styles = [
            new ol.style.Style({
                image: new ol.style.Circle({
                    fill: fill,
                    stroke: stroke,
                    radius: 8
                }),
                fill: fill,
                stroke: stroke
            })
        ];
        return styles;
    };

    return {
        Styles: styles
    };
};