var ISY = ISY || {};
ISY.MapImplementation = ISY.MapImplementation || {};
ISY.MapImplementation.OL3 = ISY.MapImplementation.OL3 || {};
ISY.MapImplementation.OL3.Sources = ISY.MapImplementation.OL3.Sources || {};

ISY.MapImplementation.OL3.Sources.CustomMessageHandler = function (eventHandler, _getIsySubLayerFromPool) {
    var olMap;
    var _message = 'Service down: ';
    var _messageHandler;
    var getIsySubLayerFromPool;
    /*
     Start up functions Start
     */

  function init(map, message) {
        olMap = map;
        if (message && message.length > 0) {
            _message = message;
        }
        getIsySubLayerFromPool = _getIsySubLayerFromPool;
        eventHandler.RegisterEvent(ISY.Events.EventTypes.ChangeLayers, _registerMessageHandler);
    }

  function initMessage(message) {
        if (message !== undefined) {
            _message = message;
        }
        _registerMessageHandler();
    }

  function showCustomMessage(message) {
        if (_messageHandler) {
            _messageHandler.showMessage(message);
        }
    }

  function _registerMessageHandler() {
        var element = document.getElementById('messagecontainer');
    if (element === undefined || element === null) {
            return;
        }
        _messageHandler = new CustomMessageHandler(element);
        if (olMap) {
            olMap.getLayers().forEach(function (layer) {
                var isySubLayer = getIsySubLayerFromPool(layer);
                var source = layer.getSource();
                if (source) {
                    var sourceType = source.get('type');
                    switch (sourceType) {
                        case 'ol.source.ImageWMS':
                            source.on('imageloaderror', function (event) {
                                _messageHandler.showMessage(isySubLayer.title, event);
                            });
                            break;
                        case 'ol.source.TileWMS':
                            source.on('tileloaderror', function (event) {
                                _messageHandler.showMessage(isySubLayer.title, event);
                            });
                            break;
                        //case undefined:
                        //    break;
                        //default:
                        //    //console.log(source.get('type'));
                        //    break;
                    }
                }
            });
        }
    }

  function CustomMessageHandler(el) {
        this.el = el;
        this.messages = [];
        this.looping = false;
        this.visible = false;
    }

  CustomMessageHandler.prototype.showMessage = function (message, event) {
        var self = this;
        message = self.getResponse(message, event);
        if (self.messages.length === 0) {
            self.messages.push(message);
        } else {
            var addItem = true;
      self.messages.forEach(function (item) {
        if (addItem && item === message) {
                    addItem = false;
                }
            });
      if (addItem) {
                self.messages.push(message);
            }
        }
        self.show();
    };

  CustomMessageHandler.prototype.getResponse = function (message, event) {
    try {
            var image = event.tile.getImage();
      if (image && image.src && (image.src.toLowerCase().indexOf('&gkt=') < 0 || image.src.toLowerCase().indexOf('?gkt=') < 0)) {
                var response = $.ajax({
                    type: "GET",
                    url: image.src,
                    async: false
                }).responseText;
                var responseObject = xml.xmlToJSON(response);
        if (responseObject && responseObject.serviceexceptionreport && responseObject.serviceexceptionreport.serviceexception) {
                    var gkterror = responseObject.serviceexceptionreport.serviceexception.split('\n');
                    return message + '<br>' + gkterror[2] + ' ' + gkterror[3].substr(0, gkterror[3].indexOf(' Token:'));
                }
            }
    } catch (err) {
      return err;
    }
        return message;
    };


  CustomMessageHandler.prototype.show = function () {
        var self = this;
    if (self.visible) {
            return;
        }
        self.visible = true;
        self.el.innerHTML = '';
        self.el.style.opacity = 1;
        self.el.style.visibility = 'visible';
    if (!self.looping) {
            self.looping = true;
            self.loopMessages();
        }
    };

  CustomMessageHandler.prototype.hide = function () {
        var self = this;
    if (!self.visible) {
            return;
        }
        self.looping = false;
        self.visible = false;
        self.el.style.opacity = 0;
    setTimeout(function () {
            self.el.style.visibility = 'hidden';
        }, 2000);
    };

  CustomMessageHandler.prototype.loopMessages = function (self) {
    if (self === undefined) {
            self = this;
        }
    if (self.messages.length > 0) {
            self.el.innerHTML = _message + self.messages.pop();
      setTimeout(function () {
                self.loopMessages(self);
            }, 1000);
        } else {
            self.hide();
        }
    };

    return {
        // Start up start
        Init: init,
        InitMessage: initMessage,
        // Start up end
        ShowCustomMessage: showCustomMessage
    };
};
