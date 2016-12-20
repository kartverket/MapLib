var ISY = ISY || {};
ISY.MapAPI = ISY.MapAPI || {};
ISY.MapAPI.Map = ISY.MapAPI.Map || {};

ISY.MapAPI.FeatureInfo = function(mapImplementation, httpHelper, eventHandler, featureParser) {

    /*
     The reference to document in this class is necessary due to offset.
     When the marker is placed onto the map for the first time offset does not work unless the image is already present in the DOM.
     A possible fix to this is to not use an image and instead use an icon.

     */

    var infoMarker;
    var infoMarkerPath = "assets/img/pin-md-orange.png"; // This path is possible to change by API call.
    var useInfoMarker = false;
    var pixelTolerance = 10;

    /*
     Common feature info functions
     */

    function _trigStartGetInfoRequest(layersToRequest) {
        var responseFeatureCollections = _createResponseFeatureCollections(layersToRequest);
        eventHandler.TriggerEvent(ISY.Events.EventTypes.FeatureInfoStart, responseFeatureCollections);
    }

    function _createResponseFeatureCollections(layersToRequest) {
        var responseFeatureCollections = [];
        for (var i = 0; i < layersToRequest.length; i++) {
            var layerToRequest = layersToRequest[i];
            var responseFeatureCollection = new ISY.Domain.LayerResponse();
            responseFeatureCollection.id = layerToRequest.id;
            responseFeatureCollection.name = layerToRequest.providerName;
            responseFeatureCollection.isLoading = true;
            responseFeatureCollections.push(responseFeatureCollection);
        }
        return responseFeatureCollections;
    }

    function _handleGetInfoRequest(url, subLayer) {
        var callback = function (data) {
            _handleGetInfoResponse(subLayer, data);
        };
        httpHelper.get(url).success(callback);
    }

    function _convertJSONtoArray(data) {
        var results = [];
        Object.keys(data).forEach(function (key) {
            results.push([key, data[key]]);
        });
        return results;
    }

    function readIncludedFields(includedFields) {
        var includedFieldsDict = {};
        if (includedFields.field) {
            if (includedFields.field.constructor != Array) {
                includedFields.field = [includedFields.field];
            }
            includedFields.field.forEach(function (field) {
                includedFieldsDict[field.name] = field.alias ? field.alias : field.name;
            });
        }

        if (includedFields.capitalize == "true") {
            includedFieldsDict['_capitalize'] = true;
        }
        return includedFieldsDict;
    }

    function applyIncludedFields(parsedResult, subLayer) {
        if(!subLayer.featureInfo || !subLayer.featureInfo.includedFields){
            return parsedResult;
        }
        var includedFields = readIncludedFields(subLayer.featureInfo.includedFields);
        var parsedResultsIncluded=[];
        parsedResult.forEach(function (feature) {
            parsedResultsIncluded.push(compareIncludedFields(includedFields, feature));
        });
        return parsedResultsIncluded;
    }

    function compareIncludedFields(includedFields, feature){
        var newFields = {
            attributes : []
        };
        for (var i = 0; i < feature.attributes.length; i++) {
            var fieldName = feature.attributes[i][0];
            var fieldValue = feature.attributes[i][1];
            var newFieldName;
            if (Object.keys(includedFields).indexOf(fieldName) > 0 ) {
                newFieldName = includedFields._capitalize ? includedFields[fieldName].toLowerCase().capitalizeFirstLetter() : includedFields[fieldName];
            }
            else if(Object.keys(includedFields).length == 1){
                newFieldName = includedFields._capitalize ? fieldName.toLowerCase().capitalizeFirstLetter() : fieldName;
            }
            else{
                continue;
            }
            newFields.attributes.push([newFieldName, fieldValue]);
        }
        return newFields;
    }

    String.prototype.capitalizeFirstLetter = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    function _handleGetInfoResponse(subLayer, result){
        var parsedResult;
        var exception;
        //@TODO: Move feature info description json til et file og laste den inn.
        var dict = {
            "friluftsomrade_01": {
                "info": {
                    "name": "FRILUFT - Friluftsomr&aring;de:",
                    "extra": "Friluftsomr&aring;der hvor det er registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Navn:": "navn",
                    "Naturbasenummer:": "naturbase_nr",
                    //"Forbedringsforslag:": "forbed_forslag",
                    "HC-parkering": "hc_parkeringsplass",
                    "Toalett": "toalett",
                    "Turvei": "turvei",
                    "Baderampe": "baderampe",
                    "Fiskeplass": "fiskeplasser",
                    "Grill/b&aring;lplass": "grill_balplass",
                    "Sittegruppe": "sittegruppe",
                    "Gapahuk": "gapahuk",
                    "Informasjon": "informasjon",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "friluftsomrade_02": {
                "info": {
                    "name": "FRILUFT - Friluftsomr&aring;de:",
                    "extra": "Friluftsomr&aring;der hvor det er registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Navn:": "navn",
                    "Naturbasenummer:": "naturbase_nr",
                    //"Forbedringsforslag:": "forbed_forslag",
                    "HC-parkering": "hc_parkeringsplass",
                    "Toalett": "toalett",
                    "Turvei": "turvei",
                    "Baderampe": "baderampe",
                    "Fiskeplass": "fiskeplasser",
                    "Grill/b&aring;lplass": "grill_balplass",
                    "Sittegruppe": "sittegruppe",
                    "Gapahuk": "gapahuk",
                    "Informasjon": "informasjon",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "friluftsomrade_03": {
                "info": {
                    "name": "FRILUFT - Friluftsomr&aring;de:",
                    "extra": "Friluftsomr&aring;der hvor det er registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Navn:": "navn",
                    "Naturbasenummer:": "naturbase_nr",
                    "HC-parkering": "hc_parkeringsplass",
                    "Toalett": "toalett",
                    "Turvei": "turvei",
                    "Baderampe": "baderampe",
                    "Fiskeplass": "fiskeplasser",
                    "Grill/b&aring;lplass": "grill_balplass",
                    "Sittegruppe": "sittegruppe",
                    "Gapahuk": "gapahuk",
                    "Informasjon": "informasjon",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "baderampe_01": {
                "info": {
                    "name": "FRILUFT - Baderampe",
                    "extra": "Baderamper innenfor et friluftsomr&aring;de med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Rampe bredde:": {
                        "rampe_bredde": "cm"
                    },
                    "Rampe stigning:": {
                        "rampe_stig": "&deg;"
                    },
                    "Rampe terskel:": {
                        "rampe_terskel": "cm"
                    },
                    "Rampe tilgjengelig:": "rampe_tilgj",
                    "H&aring;ndlist:": "handlist",
                    "H&aring;ndlist h&oslash;yde 1:": {
                        "hand_hoy_1": "cm"
                    },
                    //"Forbedringsforslag:"           : "forbed_forslag",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "baderampe_02": {
                "info": {
                    "name": "FRILUFT - Baderampe",
                    "extra": "Baderamper innenfor et friluftsomr&aring;de med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Rampe bredde:": {
                        "rampe_bredde": "cm"
                    },
                    "Rampe stigning:": {
                        "rampe_stig": "&deg;"
                    },
                    "Rampe terskel:": {
                        "rampe_terskel": "cm"
                    },
                    "Rampe tilgjengelig:": "rampe_tilgj",
                    "H&aring;ndlist:": "handlist",
                    "H&aring;ndlist h&oslash;yde 1:": {
                        "hand_hoy_1": "cm"
                    },
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "fiskeplass_01": {
                "info": {
                    "name": "FRILUFT - Fiskeplass:",
                    "extra": "Fiskeplasser innenfor et friluftsomr&aring;de med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Flytebrygge:": "flytebrygge",
                    "Rampe bredde:": {
                        "rampe_bredde": "cm"
                    },
                    "Rampe stigning:": {
                        "rampe_stigning": "&deg;"
                    },
                    "Rampe terskel:": {
                        "rampe_terskel": "cm"
                    },
                    "Rampe tilgjengelig:": "rampe_tilgj",
                    "H&aring;ndlist:": "handlist",
                    "H&aring;ndlist h&oslash;yde 1:": {
                        "hand_hoy_1": "cm"
                    },
                    "Dekke:": "dekke",
                    "Planke avstand:": {
                        "plankeavstand": "cm"
                    },
                    "Diameter:": {
                        "diameter": "cm"
                    },
                    "Rekkverk:": "rekkverk",
                    "Stoppkant:": "stoppkant",
                    "Stoppkant h&oslash;yde:": {
                        "stoppka_hoyde": "cm"
                    },
                    //"Forbedringsforslag:"           : "forbed_forslag",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "fiskeplass_02": {
                "info": {
                    "name": "FRILUFT - Fiskeplass:",
                    "extra": "Fiskeplasser innenfor et friluftsomr&aring;de med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Flytebrygge:": "flytebrygge",
                    "Rampe bredde:": {
                        "rampe_bredde": "cm"
                    },
                    "Rampe stigning:": {
                        "rampe_stigning": "&deg;"
                    },
                    "Rampe terskel:": {
                        "rampe_terskel": "cm"
                    },
                    "Rampe tilgjengelig:": "rampe_tilgj",
                    "H&aring;ndlist:": "handlist",
                    "H&aring;ndlist h&oslash;yde 1:": {
                        "hand_hoy_1": "cm"
                    },
                    "Dekke:": "dekke",
                    "Planke avstand:": {
                        "plankeavstand": "cm"
                    },
                    "Diameter:": {
                        "diameter": "cm"
                    },
                    "Rekkverk:": "rekkverk",
                    "Stoppkant:": "stoppkant",
                    "Stoppkant h&oslash;yde:": {
                        "stoppka_hoyde": "cm"
                    },
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "fiskeplass_03": {
                "info": {
                    "name": "FRILUFT - Fiskeplass:",
                    "extra": "Fiskeplasser innenfor et friluftsomr&aring;de med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Flytebrygge:": "flytebrygge",
                    "Rampe bredde:": {
                        "rampe_bredde": "cm"
                    },
                    "Rampe stigning:": {
                        "rampe_stigning": "&deg;"
                    },
                    "Rampe terskel:": {
                        "rampe_terskel": "cm"
                    },
                    "Rampe tilgjengelig:": "rampe_tilgj",
                    "H&aring;ndlist:": "handlist",
                    "H&aring;ndlist h&oslash;yde 1:": {
                        "hand_hoy_1": "cm"
                    },
                    "Dekke:": "dekke",
                    "Planke avstand:": {
                        "plankeavstand": "cm"
                    },
                    "Diameter:": {
                        "diameter": "cm"
                    },
                    "Rekkverk:": "rekkverk",
                    "Stoppkant:": "stoppkant",
                    "Stoppkant h&oslash;yde:": {
                        "stoppka_hoyde": "cm"
                    },
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "gapahukhytte_01": {
                "info": {
                    "name": "FRILUFT - Gapahuk:",
                    "extra": "Gapahuker og hytter innenfor et friluftsomr&aring;de med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Rampe bredde:": {
                        "rampe_bredde": "cm"
                    },
                    "Rampe stigning:": {
                        "rampe_stigning": "&deg;"
                    },
                    "Rampe terskel:": {
                        "rampe_terskel": "cm"
                    },
                    "Rampe tilgjengelig:": "rampe_tilgj",
                    "H&aring;ndlist:": "handlist",
                    "H&aring;ndlist h&oslash;yde 1:": {
                        "hand_hoy_1": "cm"
                    },
                    "Diameter:": {
                        "diameter": "cm"
                    },
                    "Inngang bredde:": {
                        "bredde_inngang": "cm"
                    },
                    "Inngang h&oslash;yde:": {
                        "hoyde_inngang": "cm"
                    },
                    "Terskel h&oslash;yde:": {
                        "terskelhoyde": "cm"
                    },
                    //"Forbedringsforslag:"           : "forbed_forslag",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "gapahukhytte_02": {
                "info": {
                    "name": "FRILUFT - Gapahuk:",
                    "extra": "Gapahuker og hytter innenfor et friluftsomr&aring;de med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Rampe bredde:": {
                        "rampe_bredde": "cm"
                    },
                    "Rampe stigning:": {
                        "rampe_stigning": "&deg;"
                    },
                    "Rampe terskel:": {
                        "rampe_terskel": "cm"
                    },
                    "Rampe tilgjengelig:": "rampe_tilgj",
                    "H&aring;ndlist:": "handlist",
                    "H&aring;ndlist h&oslash;yde 1:": {
                        "hand_hoy_1": "cm"
                    },
                    "Diameter:": {
                        "diameter": "cm"
                    },
                    "Inngang bredde:": {
                        "bredde_inngang": "cm"
                    },
                    "Inngang h&oslash;yde:": {
                        "hoyde_inngang": "cm"
                    },
                    "Terskel h&oslash;yde:": {
                        "terskelhoyde": "cm"
                    },
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "gapahukhytte_03": {
                "info": {
                    "name": "FRILUFT - Gapahuk:",
                    "extra": "Gapahuker og hytter innenfor et friluftsomr&aring;de med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Rampe bredde:": {
                        "rampe_bredde": "cm"
                    },
                    "Rampe stigning:": {
                        "rampe_stigning": "&deg;"
                    },
                    "Rampe terskel:": {
                        "rampe_terskel": "cm"
                    },
                    "Rampe tilgjengelig:": "rampe_tilgj",
                    "H&aring;ndlist:": "handlist",
                    "H&aring;ndlist h&oslash;yde 1:": {
                        "hand_hoy_1": "cm"
                    },
                    "Diameter:": {
                        "diameter": "cm"
                    },
                    "Inngang bredde:": {
                        "bredde_inngang": "cm"
                    },
                    "Inngang h&oslash;yde:": {
                        "hoyde_inngang": "cm"
                    },
                    "Terskel h&oslash;yde:": {
                        "terskelhoyde": "cm"
                    },
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "grillbalplass_01": {
                "info": {
                    "name": "FRILUFT - Grillplass, b&aring;lplass:",
                    "extra": "Grillplasser, b&aring;lplasser innenfor et friluftsomr&aring;de med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Type:": "type",
                    "Dekke:": "dekke",
                    "Dekke tilstand:": "dekke_tilstand",
                    "Helning:": {
                        "helning": "&deg;"
                    },
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "grillbalplass_02": {
                "info": {
                    "name": "FRILUFT - Grillplass, b&aring;lplass:",
                    "extra": "Grillplasser, b&aring;lplasser innenfor et friluftsomr&aring;de med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Type:": "type",
                    "Dekke:": "dekke",
                    "Dekke tilstand:": "dekke_tilstand",
                    "Helning:": {
                        "helning": "&deg;"
                    },
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "grillbalplass_03": {
                "info": {
                    "name": "FRILUFT - Grillplass, b&aring;lplass:",
                    "extra": "Grillplasser, b&aring;lplasser innenfor et friluftsomr&aring;de med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Type:": "type",
                    "Dekke:": "dekke",
                    "Dekke tilstand:": "dekke_tilstand",
                    "Helning:": {
                        "helning": "&deg;"
                    },
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "hc_parkering_friluft_01": {
                "info": {
                    "name": "FRILUFT - HC-parkeringsplass:",
                    "extra": "Enkelte HC-parkeringsplasser i n&aelig;rheten av et friluftsomr&aring;de med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Skiltet:": "skiltet",
                    "Merket:": "merket",
                    "Bredde:": {
                        "bredde": "cm"
                    },
                    "Lengde:": {
                        "lengde": "cm"
                    },
                    "Avstand fasilitet:": {
                        "avstand_serv_bygg": "m"
                    },
                    "Avgift:": "avgift",
                    "Automat h&oslash;yde:": {
                        "aut_hoyde": "cm"
                    },
                    "Automat Tilgjengelig:": "tilgj_aut",
                    //"Forbedringsforslag:"  : "forbed_forslag",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "hc_parkering_friluft_02": {
                "info": {
                    "name": "FRILUFT - HC-parkeringsplass:",
                    "extra": "Enkelte HC-parkeringsplasser i n&aelig;rheten av et friluftsomr&aring;de med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Skiltet:": "skiltet",
                    "Merket:": "merket",
                    "Bredde:": {
                        "bredde": "cm"
                    },
                    "Lengde:": {
                        "lengde": "cm"
                    },
                    "Avstand fasilitet:": {
                        "avstand_serv_bygg": "m"
                    },
                    "Avgift:": "avgift",
                    "Automat h&oslash;yde:": {
                        "aut_hoyde": "cm"
                    },
                    "Automat Tilgjengelig:": "tilgj_aut",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "hc_parkering_friluft_03": {
                "info": {
                    "name": "FRILUFT - HC-parkeringsplass:",
                    "extra": "Enkelte HC-parkeringsplasser i n&aelig;rheten av et friluftsomr&aring;de med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Skiltet:": "skiltet",
                    "Merket:": "merket",
                    "Bredde:": {
                        "bredde": "cm"
                    },
                    "Lengde:": {
                        "lengde": "cm"
                    },
                    "Avstand fasilitet:": {
                        "avstand_serv_bygg": "m"
                    },
                    "Avgift:": "avgift",
                    "Automat h&oslash;yde:": {
                        "aut_hoyde": "cm"
                    },
                    "Automat Tilgjengelig:": "tilgj_aut",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "parkeringsomrader_friluft_01": {
                "info": {
                    "name": "FRILUFT - Parkeringsomr&aring;de:",
                    "extra": "Parkeringsomr&aring;der i n&aelig;rheten av friluftsomr&aring;der med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Kapasitet personbiler:": "kap_personbiler",
                    "Kapasitet HC:": "kap_uu",
                    "Dekke:": "dekke",
                    "Dekke tilstand:": "dekke_tilstand",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "parkeringsomrader_friluft_02": {
                "info": {
                    "name": "FRILUFT - Parkeringsomr&aring;de:",
                    "extra": "Parkeringsomr&aring;der i n&aelig;rheten av friluftsomr&aring;der med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Kapasitet personbiler:": "kap_personbiler",
                    "Kapasitet HC:": "kap_uu",
                    "Dekke:": "dekke",
                    "Dekke tilstand:": "dekke_tilstand",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "parkeringsomrader_friluft_03": {
                "info": {
                    "name": "FRILUFT - Parkeringsomr&aring;de:",
                    "extra": "Parkeringsomr&aring;der i n&aelig;rheten av friluftsomr&aring;der med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Kapasitet personbiler:": "kap_personbiler",
                    "Kapasitet HC:": "kap_uu",
                    "Dekke:": "dekke",
                    "Dekke tilstand:": "dekke_tilstand",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "t_parkeringsomrade": {
                "info": {
                    "name": "TETTSTED - Parkeringsomr&aring;de:",
                    "extra": "Parkeringsomr&aring;der innenfor tettsteder og i n&aelig;rheten av utvalgte offentlige bygninger. Det ble foretatt en vurdering med hensyn til tilgjengelighet for bevegelseshemmede."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Kapasitet personbiler:": "kap_personbiler",
                    "Dekke:": "dekke",
                    "Dekke tilstand:": "dekke_tilstand",
                    "Kapasitet HC:": "kap_uu",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "t_parkeringsomrade_r": {
                "info": {
                    "name": "TETTSTED - Parkeringsomr&aring;de:",
                    "extra": "Parkeringsomr&aring;der innenfor tettsteder og i n&aelig;rheten av utvalgte offentlige bygninger. Det ble foretatt en vurdering med hensyn til tilgjengelighet for bevegelseshemmede."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Kapasitet personbiler:": "kap_personbiler",
                    "Dekke:": "dekke",
                    "Dekke tilstand:": "dekke_tilstand",
                    "Kapasitet HC:": "kap_uu",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "t_parkeringsomrade_el": {
                "info": {
                    "name": "TETTSTED - Parkeringsomr&aring;de:",
                    "extra": "Parkeringsomr&aring;der innenfor tettsteder og i n&aelig;rheten av utvalgte offentlige bygninger. Det ble foretatt en vurdering med hensyn til tilgjengelighet for bevegelseshemmede."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Kapasitet personbiler:": "kap_personbiler",
                    "Dekke:": "dekke",
                    "Dekke tilstand:": "dekke_tilstand",
                    "Kapasitet HC:": "kap_uu",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "t_hc_parkering": {
                "info": {
                    "name": "TETTSTED - HC-parkeringsplass:",
                    "extra": "Enkelte HC-parkeringsplasser innenfor tettsteder vurdert med hensyn til tilgjengelighet for bevegelseshemmede."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Skiltet:": "skiltet",
                    "Merket:": "merket",
                    "Avstand servicebygg:": {
                        "avstand_servicebygg": "m"
                    },
                    "Bredde:": {
                        "bredde": "cm"
                    },
                    "Lengde:": {
                        "lengde": "cm"
                    },
                    "Avgift:": "avgift",
                    "Automat h&oslash;yde:": {
                        "aut_hoyde": "cm"
                    },
                    "Automat tilgjengelig:": "tilgj_automat",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "t_hc_parkering_r": {
                "info": {
                    "name": "TETTSTED - HC-parkeringsplass:",
                    "extra": "Enkelte HC-parkeringsplasser innenfor tettsteder vurdert med hensyn til tilgjengelighet for bevegelseshemmede."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Skiltet:": "skiltet",
                    "Merket:": "merket",
                    "Avstand servicebygg:": {
                        "avstand_servicebygg": "m"
                    },
                    "Bredde:": {
                        "bredde": "cm"
                    },
                    "Lengde:": {
                        "lengde": "cm"
                    },
                    "Avgift:": "avgift",
                    "Automat h&oslash;yde:": {
                        "aut_hoyde": "cm"
                    },
                    "Automat tilgjengelig:": "tilgj_automat",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "t_hc_parkering_el": {
                "info": {
                    "name": "TETTSTED - HC-parkeringsplass:",
                    "extra": "Enkelte HC-parkeringsplasser innenfor tettsteder vurdert med hensyn til tilgjengelighet for bevegelseshemmede."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Skiltet:": "skiltet",
                    "Merket:": "merket",
                    "Avstand servicebygg:": {
                        "avstand_servicebygg": "m"
                    },
                    "Bredde:": {
                        "bredde": "cm"
                    },
                    "Lengde:": {
                        "lengde": "cm"
                    },
                    "Avgift:": "avgift",
                    "Automat h&oslash;yde:": {
                        "aut_hoyde": "cm"
                    },
                    "Automat tilgjengelig:": "tilgj_automat",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "t_inngangbygg": {
                "info": {
                    "name": "TETTSTED - Inngang bygg:",
                    "extra": "Inngangspartier til utvalgte offentlige bygninger innenfor tettsteder vurdert med hensyn til tilgjengelighet for bevegelseshemmede og synshemmede."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Bygg funksjon:": "bygg_funksjon",
                    "Avstand til HC-parkering:": {
                        "avstand_hc_park": "m"
                    },
                    "Stigning ankomstvei:": {
                        "adko_stig_grad": "&deg;"
                    },
                    "Rampe bredde:": {
                        "rampe_bredde": "cm"
                    },
                    "Rampe stigning:": {
                        "rampe_stigning": "&deg;"
                    },
                    "Rampe terskel:": {
                        "rampe_terskel": "cm"
                    },
                    "H&aring;ndlist:": "handlist",
                    "H&aring;ndlist h&oslash;yde 1:": {
                        "hand_hoy_1": "cm"
                    },
                    "Rampe tilgjengelig:": "rampe_tilgjengelig",
                    "D&oslash;rtype:": "dortype",
                    "D&oslash;r&aring;pner:": "dorapner",
                    "Man&oslash;verknapp h&oslash;yde:": {
                        "man_knap_hoyde": "cm"
                    },
                    "Inngang bredde:": {
                        "inngang_bredde": "cm"
                    },
                    "Terskel h&oslash;yde:": "terskel_hoyde",
                    "Inngang kontrast": "kontrast",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "t_inngangbygg_r_01": {
                "info": {
                    "name": "TETTSTED - Inngang bygg:",
                    "extra": "Inngangspartier til utvalgte offentlige bygninger innenfor tettsteder vurdert med hensyn til tilgjengelighet for bevegelseshemmede og synshemmede."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Bygg funksjon:": "bygg_funksjon",
                    "Avstand til HC-parkering:": {
                        "avstand_hc_park": "m"
                    },
                    "Stigning ankomstvei:": {
                        "adko_stig_grad": "&deg;"
                    },
                    "Rampe bredde:": {
                        "rampe_bredde": "cm"
                    },
                    "Rampe stigning:": {
                        "rampe_stigning": "&deg;"
                    },
                    "Rampe terskel:": {
                        "rampe_terskel": "cm"
                    },
                    "H&aring;ndlist:": "handlist",
                    "H&aring;ndlist h&oslash;yde 1:": {
                        "hand_hoy_1": "cm"
                    },
                    "Rampe tilgjengelig:": "rampe_tilgjengelig",
                    "D&oslash;rtype:": "dortype",
                    "D&oslash;r&aring;pner:": "dorapner",
                    "Man&oslash;verknapp h&oslash;yde:": {
                        "man_knap_hoyde": "cm"
                    },
                    "Inngang bredde:": {
                        "inngang_bredde": "cm"
                    },
                    "Terskel h&oslash;yde:": "terskel_hoyde",
                    "Inngang kontrast": "kontrast",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "t_inngangbygg_r_02": {
                "info": {
                    "name": "TETTSTED - Inngang bygg:",
                    "extra": "Inngangspartier til utvalgte offentlige bygninger innenfor tettsteder vurdert med hensyn til tilgjengelighet for bevegelseshemmede og synshemmede."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Bygg funksjon:": "bygg_funksjon",
                    "Avstand til HC-parkering:": {
                        "avstand_hc_park": "m"
                    },
                    "Stigning ankomstvei:": {
                        "adko_stig_grad": "&deg;"
                    },
                    "Rampe bredde:": {
                        "rampe_bredde": "cm"
                    },
                    "Rampe stigning:": {
                        "rampe_stigning": "&deg;"
                    },
                    "Rampe terskel:": {
                        "rampe_terskel": "cm"
                    },
                    "H&aring;ndlist:": "handlist",
                    "H&aring;ndlist h&oslash;yde 1:": {
                        "hand_hoy_1": "cm"
                    },
                    "Rampe tilgjengelig:": "rampe_tilgjengelig",
                    "D&oslash;rtype:": "dortype",
                    "D&oslash;r&aring;pner:": "dorapner",
                    "Man&oslash;verknapp h&oslash;yde:": {
                        "man_knap_hoyde": "cm"
                    },
                    "Inngang bredde:": {
                        "inngang_bredde": "cm"
                    },
                    "Terskel h&oslash;yde:": "terskel_hoyde",
                    "Inngang kontrast": "kontrast",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "sittegruppe_01": {
                "info": {
                    "name": "FRILUFT - Sittegruppe, hvilebenker:",
                    "extra": "Sittegrupper og hvilebenker innenfor et friluftsomr&aring;de med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Dekke:": "dekke",
                    "Dekke tilstand:": "dekke_tilstand",
                    "Helning:": {
                        "helning": "&deg;"
                    },
                    "Bord h&oslash;yde:": {
                        "bord_hoyde": "cm"
                    },
                    "Bord utstikk:": {
                        "bord_utstikk": "cm"
                    },
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "sittegruppe_02": {
                "info": {
                    "name": "FRILUFT - Sittegruppe, hvilebenker:",
                    "extra": "Sittegrupper og hvilebenker innenfor et friluftsomr&aring;de med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Dekke:": "dekke",
                    "Dekke tilstand:": "dekke_tilstand",
                    "Helning:": {
                        "helning": "&deg;"
                    },
                    "Bord h&oslash;yde:": {
                        "bord_hoyde": "cm"
                    },
                    "Bord utstikk:": {
                        "bord_utstikk": "cm"
                    },
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "sittegruppe_03": {
                "info": {
                    "name": "FRILUFT - Sittegruppe, hvilebenker:",
                    "extra": "Sittegrupper og hvilebenker innenfor et friluftsomr&aring;de med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Dekke:": "dekke",
                    "Dekke tilstand:": "dekke_tilstand",
                    "Helning:": {
                        "helning": "&deg;"
                    },
                    "Bord h&oslash;yde:": {
                        "bord_hoyde": "cm"
                    },
                    "Bord utstikk:": {
                        "bord_utstikk": "cm"
                    },
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "statlig_sikra_polygon_01": {
                "info": {
                    "name": "FRILUFT - Statlig sikra friluftsomr&aring;de:",
                    "extra": "Statlig sikra friluftsomr&aring;der vurdert med hensyn til tilgjengelighet for rullestolbrukere og synshemmede."
                },
                "content": {
                    "Navn:": "navn",
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Turomr&aring;de:": "turomraade_tilrettelagt_for",
                    "Fiskeplass:": "fiskeplass_tilrettelagt_for",
                    "Badeplass:": "badeplass_tilrettelagt_for",
                    "Objekt ID:": "ogc_fid",
                    "Link til informasjonsark:": "link_skjema",
                    "Link til bildeark:": "link_bilde"
                }
            },
            "statlig_sikra_polygon_02": {
                "info": {
                    "name": "FRILUFT - Statlig sikra friluftsomr&aring;de:",
                    "extra": "Statlig sikra friluftsomr&aring;der vurdert med hensyn til tilgjengelighet for rullestolbrukere og synshemmede."
                },
                "content": {
                    "Navn:": "navn",
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Turomr&aring;de:": "turomraade_tilrettelagt_for",
                    "Fiskeplass:": "fiskeplass_tilrettelagt_for",
                    "Badeplass:": "badeplass_tilrettelagt_for",
                    "Objekt ID:": "ogc_fid",
                    "Link til informasjonsark:": "link_skjema",
                    "Link til bildeark:": "link_bilde"
                }
            },
            "statlig_sikra_polygon_03": {
                "info": {
                    "name": "FRILUFT - Statlig sikra friluftsomr&aring;de:",
                    "extra": "Statlig sikra friluftsomr&aring;der vurdert med hensyn til tilgjengelighet for rullestolbrukere og synshemmede."
                },
                "content": {
                    "Navn:": "navn",
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Turomr&aring;de:": "turomraade_tilrettelagt_for",
                    "Fiskeplass:": "fiskeplass_tilrettelagt_for",
                    "Badeplass:": "badeplass_tilrettelagt_for",
                    "Objekt ID:": "ogc_fid",
                    "Link til informasjonsark:": "link_skjema",
                    "Link til bildeark:": "link_bilde"
                }
            },
            "t_vei": {
                "info": {
                    "name": "TETTSTED - Veisystem:",
                    "extra": "Veier innenfor tettsteder vurdert med hensyn til tilgjengelighet for bevegelseshemmede og synshemmede."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Gatetype:": "gate_type",
                    "Dekke:": "dekke",
                    "Dekke tilstand:": "dekke_tilstand",
                    "Bredde:": {
                        "bredde": "cm"
                    },
                    "Nedsenk 1:": {
                        "nedsenk_1": "cm"
                    },
                    "Nedsenk 2:": {
                        "nedsenk_2": "cm"
                    },
                    "Stigning:": {
                        "stig_grad": "&deg;"
                    },
                    "Tverrfall:": {
                        "tverrfall_grad": "&deg;"
                    },
                    "Ledelinje:": "ledelinje",
                    "Kommentar:": "kommentar",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "t_vei_r": {
                "info": {
                    "name": "TETTSTED - Veisystem:",
                    "extra": "Veier innenfor tettsteder vurdert med hensyn til tilgjengelighet for bevegelseshemmede og synshemmede."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Gatetype:": "gate_type",
                    "Dekke:": "dekke",
                    "Dekke tilstand:": "dekke_tilstand",
                    "Bredde:": {
                        "bredde": "cm"
                    },
                    "Nedsenk 1:": {
                        "nedsenk_1": "cm"
                    },
                    "Nedsenk 2:": {
                        "nedsenk_2": "cm"
                    },
                    "Stigning:": {
                        "stig_grad": "&deg;"
                    },
                    "Tverrfall:": {
                        "tverrfall_grad": "&deg;"
                    },
                    "Ledelinje:": "ledelinje",
                    "Kommentar:": "kommentar",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "t_vei_el": {
                "info": {
                    "name": "TETTSTED - Veisystem:",
                    "extra": "Veier innenfor tettsteder vurdert med hensyn til tilgjengelighet for bevegelseshemmede og synshemmede."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Gatetype:": "gate_type",
                    "Dekke:": "dekke",
                    "Dekke tilstand:": "dekke_tilstand",
                    "Bredde:": {
                        "bredde": "cm"
                    },
                    "Nedsenk 1:": {
                        "nedsenk_1": "cm"
                    },
                    "Nedsenk 2:": {
                        "nedsenk_2": "cm"
                    },
                    "Stigning:": {
                        "stig_grad": "&deg;"
                    },
                    "Tverrfall:": {
                        "tverrfall_grad": "&deg;"
                    },
                    "Ledelinje:": "ledelinje",
                    "Kommentar:": "kommentar",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "toalett_01": {
                "info": {
                    "name": "FRILUFT - Toalett, omkledningsrom:",
                    "extra": "Toaletter, omkledningsrom eller kombinasjoner av dem innenfor et friluftsomr&aring;de med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Rampe bredde:": {
                        "rampe_bredde": "cm"
                    },
                    "Rampe stigning:": {
                        "rampe_stigning": "&deg;"
                    },
                    "Rampe terskel:": {
                        "rampe_terskel": "cm"
                    },
                    "Rampe tilgjengelig:": "rampe_tilgj",
                    "H&aring;ndlist:": "handlist",
                    "H&aring;ndlist h&oslash;yde 1:": {
                        "hand_hoy_1": "cm"
                    },
                    "D&oslash;rtype:": "inngang_type",
                    "D&oslash;r&aring;pner:": "dorapner",
                    "Inngang bredde:": {
                        "inngang_bredde": "cm"
                    },
                    "Inngang kontrast:": "kontrast_inngang",
                    "Terskel h&oslash;yde:": {
                        "terskel_hoyde": "cm"
                    },
                    "Diameter:": {
                        "diameter": "cm"
                    },
                    "Belysning:": "belysning",
                    "Omkledning:": "omkledning_tilgj",
                    "Servant:": "servant_tilgj",
                    "WC:": "wc_tilgj",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "toalett_02": {
                "info": {
                    "name": "FRILUFT - Toalett, omkledningsrom:",
                    "extra": "Toaletter, omkledningsrom eller kombinasjoner av dem innenfor et friluftsomr&aring;de med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Rampe bredde:": {
                        "rampe_bredde": "cm"
                    },
                    "Rampe stigning:": {
                        "rampe_stigning": "&deg;"
                    },
                    "Rampe terskel:": {
                        "rampe_terskel": "cm"
                    },
                    "Rampe tilgjengelig:": "rampe_tilgj",
                    "H&aring;ndlist:": "handlist",
                    "H&aring;ndlist h&oslash;yde 1:": {
                        "hand_hoy_1": "cm"
                    },
                    "D&oslash;rtype:": "inngang_type",
                    "D&oslash;r&aring;pner:": "dorapner",
                    "Inngang bredde:": {
                        "inngang_bredde": "cm"
                    },
                    "Inngang kontrast:": "kontrast_inngang",
                    "Terskel h&oslash;yde:": {
                        "terskel_hoyde": "cm"
                    },
                    "Diameter:": {
                        "diameter": "cm"
                    },
                    "Belysning:": "belysning",
                    "Omkledning:": "omkledning_tilgj",
                    "Servant:": "servant_tilgj",
                    "WC:": "wc_tilgj",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "toalett_03": {
                "info": {
                    "name": "FRILUFT - Toalett, omkledningsrom:",
                    "extra": "Toaletter, omkledningsrom eller kombinasjoner av dem innenfor et friluftsomr&aring;de med registrert tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Rampe bredde:": {
                        "rampe_bredde": "cm"
                    },
                    "Rampe stigning:": {
                        "rampe_stigning": "&deg;"
                    },
                    "Rampe terskel:": {
                        "rampe_terskel": "cm"
                    },
                    "Rampe tilgjengelig:": "rampe_tilgj",
                    "H&aring;ndlist:": "handlist",
                    "H&aring;ndlist h&oslash;yde 1:": {
                        "hand_hoy_1": "cm"
                    },
                    "D&oslash;rtype:": "inngang_type",
                    "D&oslash;r&aring;pner:": "dorapner",
                    "Inngang bredde:": {
                        "inngang_bredde": "cm"
                    },
                    "Inngang kontrast:": "kontrast_inngang",
                    "Terskel h&oslash;yde:": {
                        "terskel_hoyde": "cm"
                    },
                    "Diameter:": {
                        "diameter": "cm"
                    },
                    "Belysning:": "belysning",
                    "Omkledning:": "omkledning_tilgj",
                    "Servant:": "servant_tilgj",
                    "WC:": "wc_tilgj",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "turisthytte_01": {
                "info": {
                    "name": "FRILUFT - Turisthytte:",
                    "extra": "Turisthytter som er tilrettelagt for bevegelseshemmede"
                },
                "content": {
                    "Navn:": "navn",
                    "Eier:": "eier_tekst",
                    "Kommentar:": "kommentar",
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app"
                }
            },
            "turisthytte_02": {
                "info": {
                    "name": "FRILUFT - Turisthytte:",
                    "extra": "Turisthytter som er tilrettelagt for bevegelseshemmede"
                },
                "content": {
                    "Navn:": "navn",
                    "Eier:": "eier_tekst",
                    "Kommentar:": "kommentar",
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app"
                }
            },
            "turisthytte_03": {
                "info": {
                    "name": "FRILUFT - Turisthytte:",
                    "extra": "Turisthytter som er tilrettelagt for bevegelseshemmede"
                },
                "content": {
                    "Navn:": "navn",
                    "Eier:": "eier_tekst",
                    "Kommentar:": "kommentar",
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app"
                }
            },
            "turvei_01": {
                "info": {
                    "name": "FRILUFT - Turvei:",
                    "extra": "Turveier vurdert med hensyn til tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Veitype": "veitype",
                    "Spesial fottyperute:": "spesialfottyperute",
                    "Dekke:": "dekke",
                    "Dekke tilstand:": "dekke_tilstand",
                    "Bredde:": {
                        "bredde": "cm"
                    },
                    "Stigning:": {
                        "stigning": "&deg;"
                    },
                    "Tverrfall:": {
                        "tverrfall": "&deg;"
                    },
                    "Belysning": "belysning",
                    "Fri høyde:": "frihoyde",
                    "Ledelinje :": "ledelinje",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "turvei_02": {
                "info": {
                    "name": "FRILUFT - Turvei:",
                    "extra": "Turveier vurdert med hensyn til tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Veitype": "veitype",
                    "Spesial fottyperute:": "spesialfottyperute",
                    "Dekke:": "dekke",
                    "Dekke tilstand:": "dekke_tilstand",
                    "Bredde:": {
                        "bredde": "cm"
                    },
                    "Stigning:": {
                        "stigning": "&deg;"
                    },
                    "Tverrfall:": {
                        "tverrfall": "&deg;"
                    },
                    "Belysning": "belysning",
                    "Fri høyde:": "frihoyde",
                    "Ledelinje :": "ledelinje",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "turvei_03": {
                "info": {
                    "name": "FRILUFT - Turvei:",
                    "extra": "Turveier vurdert med hensyn til tilgjengelighet."
                },
                "content": {
                    "Registrert:": "registrert",
                    "Oppdatert:": "oppdat_app",
                    "Veitype": "veitype",
                    "Spesial fottyperute:": "spesialfottyperute",
                    "Dekke:": "dekke",
                    "Dekke tilstand:": "dekke_tilstand",
                    "Bredde:": {
                        "bredde": "cm"
                    },
                    "Stigning:": {
                        "stigning": "&deg;"
                    },
                    "Tverrfall:": {
                        "tverrfall": "&deg;"
                    },
                    "Belysning": "belysning",
                    "Fri høyde:": "frihoyde",
                    "Ledelinje :": "ledelinje",
                    "Kommentar:": "kommentar",
                    "Bildefil:": "bilde",
                    "Objekt ID:": "ogc_fid"
                }
            },
            "stasjoner": {
                "info": {
                    "name": "Fakta om Basestasjoner",
                    "extra": "Stasjonene samler GNSS-data som sendes til kartverkets kontrollsenter. GNSS-dataene brukes bl.a. til drift av kartverkets posisjonstjenester. ",
                    "link": {
                        "href": "http://kartverket.no/Posisjonstjenester/",
                        "target": "_blank",
                        "name": "Les mer om stasjoner"
                    }
                },
                "content": {
                    "Stasjonsnavn:": "sitename",
                    "StasjonsId:": "fourcharid",
                    "Status:": "operstattypename",
                    "X-koordinater:": "x",
                    "Y-koordinater:": "y",
                    "Z-koordinater:": "z",
                    "Koordinatsystem:": "coordsysname"
                },
                "data": {
                    "data_json_array": "data_json_array",
                    "avvik_json_array": "avvik_json_array"
                }
            },
            "stasjoner_planlagt": {
                "info": {
                    "name": "Fakta om Basestasjoner planlagt",
                    "extra": "Stasjonene samler GNSS-data som sendes til kartverkets kontrollsenter. GNSS-dataene brukes bl.a. til drift av kartverkets posisjonstjenester. ",
                    "link": {
                        "href": "http://kartverket.no/Posisjonstjenester/",
                        "target": "_blank",
                        "name": "Les mer om stasjoner"
                    }
                },
                "content": {
                    "Stasjonsnavn:": "sitename",
                    "StasjonsId:": "fourcharid",
                    "Status:": "operstattypename",
                    "X-koordinater:": "x",
                    "Y-koordinater:": "y",
                    "Z-koordinater:": "z",
                    "Koordinatsystem:": "coordsysname"
                },
                "data": {
                    "data_json_array": "data_json_array",
                    "avvik_json_array": "avvik_json_array"
                }
            },
            "stasjoner_temp_outoforder": {
                "info": {
                    "name": "Fakta om Basestasjoner temp out of order",
                    "extra": "Stasjonene samler GNSS-data som sendes til kartverkets kontrollsenter. GNSS-dataene brukes bl.a. til drift av kartverkets posisjonstjenester. ",
                    "link": {
                        "href": "http://kartverket.no/Posisjonstjenester/",
                        "target": "_blank",
                        "name": "Les mer om stasjoner"
                    }
                },
                "content": {
                    "Stasjonsnavn:": "sitename",
                    "StasjonsId:": "fourcharid",
                    "Status:": "operstattypename",
                    "X-koordinater:": "x",
                    "Y-koordinater:": "y",
                    "Z-koordinater:": "z",
                    "Koordinatsystem:": "coordsysname"
                },
                "data": {
                    "data_json_array": "data_json_array",
                    "avvik_json_array": "avvik_json_array"
                }
            },
            "svenske_finske_stasjoner": {
                "info": {
                    "name": "Fakta om CPOS stasjoner",
                    "extra": "CPOS stasjonene samler GNSS-data som sendes til kartverkets kontrollsenter. GNSS-dataene brukes bl.a. til drift av kartverkets posisjonstjenester. ",
                    "link": {
                        "href": "http://kartverket.no/Posisjonstjenester/",
                        "target": "_blank",
                        "name": "Les mer om CPOS stasjoner"
                    }
                },
                "content": {
                    "Stasjonsnavn:": "sitename",
                    "Stasjonsid:": "fourcharid",
                    "Status:": "operstattypename",
                    "X-koordinater:": "x",
                    "Y-koordinater:": "y",
                    "Z-koordinater:": "z",
                    "Koordinatsystem:": "coordsysname"
                },
                "data": {
                    "data_json_array": "data_json_array",
                    "avvik_json_array": "avvik_json_array"
                }
            },
            "niv_fastmerker": {
                "info": {
                    "name": "Fakta om Fastmerker",
                    "extra": "Koordinatbestemte fastmerker er markert i terrenget med metallbolter som vanligvis er satt ned i fast fjell. Fastmerkene er inndelt i Stamnett, landsnett, trekantpunkter og høydefastmerker.",
                    "link": {
                        "href": "http://www.kartverket.no/Kunnskap/Kart-og-kartlegging/Referanseramme/De-koordinatbestemte-fastmerkene",
                        "target": "_blank",
                        "name": "Les mer om Fastmerker"
                    }
                },
                "content": {
                    "Punktnummer:": "punktnummer",
                    "Punktnavn:": "punktnavn",
                    "Nord:": "nord",
                    "Øst:": "ost",
                    "Sone:": "sone",
                    "Høyde_nn2000:": {
                        "hoyde_nn2000": " m"
                    },
                    "Høyde_nn1954:": {
                        "hoyde_nn1954": " m"
                    },
                    "Ellipsoidisk_høyde:": "ellipsoidisk_hoyde",
                    "Punkttype:": "punkttype",
                    "Underlag:": "underlag",
                    "Kvalitet_nn1954:": {
                        "kvalitet_nn1954": " mm"
                    },
                    "Kvalitet_grunnriss:": {
                        "kvalitet_grunnriss": " mm"
                    },
                    "Status:": "status",
                    "Status_år:": "status_ar",
                    "Beskrivelse:": "beskrivelse"
                }
            },
            "trekantpunkt": {
                "info": {
                    "name": "Fakta om Fastmerker",
                    "extra": "Koordinatbestemte fastmerker er markert i terrenget med metallbolter som vanligvis er satt ned i fast fjell. Fastmerkene er inndelt i Stamnett, landsnett, trekantpunkter og høydefastmerker.",
                    "link": {
                        "href": "http://www.kartverket.no/Kunnskap/Kart-og-kartlegging/Referanseramme/De-koordinatbestemte-fastmerkene",
                        "target": "_blank",
                        "name": "Les mer om Fastmerker"
                    }
                },
                "content": {
                    "Punktnummer:": "punktnummer",
                    "Punktnavn:": "punktnavn",
                    "Nord:": "nord",
                    "Øst:": "ost",
                    "Sone:": "sone",
                    "Høyde_nn2000:": {
                        "hoyde_nn2000": " m"
                    },
                    "Høyde_nn1954:": {
                        "hoyde_nn1954": " m"
                    },
                    "Ellipsoidisk_høyde:": "ellipsoidisk_hoyde",
                    "Punkttype:": "punkttype",
                    "Underlag:": "underlag",
                    "Kvalitet_nn1954:": {
                        "kvalitet_nn1954": " mm"
                    },
                    "Kvalitet_grunnriss:": {
                        "kvalitet_grunnriss": " mm"
                    },
                    "Status:": "status",
                    "Status_år:": "status_ar",
                    "Beskrivelse:": "beskrivelse"
                }
            },
            "stamnettpunkt": {
                "info": {
                    "name": "Fakta om Fastmerker",
                    "extra": "Koordinatbestemte fastmerker er markert i terrenget med metallbolter som vanligvis er satt ned i fast fjell. Fastmerkene er inndelt i Stamnett, landsnett, trekantpunkter og høydefastmerker.",
                    "link": {
                        "href": "http://www.kartverket.no/Kunnskap/Kart-og-kartlegging/Referanseramme/De-koordinatbestemte-fastmerkene",
                        "target": "_blank",
                        "name": "Les mer om Fastmerker"
                    }
                },
                "content": {
                    "Punktnummer:": "punktnummer",
                    "Punktnavn:": "punktnavn",
                    "Nord:": "nord",
                    "Øst:": "ost",
                    "Sone:": "sone",
                    "Høyde_nn2000:": {
                        "hoyde_nn2000": " m"
                    },
                    "Høyde_nn1954:": {
                        "hoyde_nn1954": " m"
                    },
                    "Ellipsoidisk_høyde:": "ellipsoidisk_hoyde",
                    "Punkttype:": "punkttype",
                    "Underlag:": "underlag",
                    "Kvalitet_nn1954:": {
                        "kvalitet_nn1954": " mm"
                    },
                    "Kvalitet_grunnriss:": {
                        "kvalitet_grunnriss": " mm"
                    },
                    "Status:": "status",
                    "Status_år:": "status_ar",
                    "Beskrivelse:": "beskrivelse"
                }
            },
            "landsnettpunkt": {
                "info": {
                    "name": "Fakta om Fastmerker",
                    "extra": "Koordinatbestemte fastmerker er markert i terrenget med metallbolter som vanligvis er satt ned i fast fjell. Fastmerkene er inndelt i Stamnett, landsnett, trekantpunkter og høydefastmerker.",
                    "link": {
                        "href": "http://www.kartverket.no/Kunnskap/Kart-og-kartlegging/Referanseramme/De-koordinatbestemte-fastmerkene",
                        "target": "_blank",
                        "name": "Les mer om Fastmerker"
                    }
                },
                "content": {
                    "Punktnummer:": "punktnummer",
                    "Punktnavn:": "punktnavn",
                    "Nord:": "nord",
                    "Øst:": "ost",
                    "Sone:": "sone",
                    "Høyde_nn2000:": {
                        "hoyde_nn2000": " m"
                    },
                    "Høyde_nn1954:": {
                        "hoyde_nn1954": " m"
                    },
                    "Ellipsoidisk_høyde:": "ellipsoidisk_hoyde",
                    "Punkttype:": "punkttype",
                    "Underlag:": "underlag",
                    "Kvalitet_nn1954:": {
                        "kvalitet_nn1954": " mm"
                    },
                    "Kvalitet_grunnriss:": {
                        "kvalitet_grunnriss": " mm"
                    },
                    "Status:": "status",
                    "Status_år:": "status_ar",
                    "Beskrivelse:": "beskrivelse"
                }
            },
            "alle_linjehindre": {
                "info": {
                    "name": "",
                    "extra": "Linjehinder"
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            },
            "alle_linjepunkthindre": {
                "info": {
                    "name": "",
                    "extra": "Endepunkt, knekkpunkt eller mast/stolpe tilknyttet linjehinder"
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            },
            "alle_punkthindre": {
                "info": {
                    "name": "",
                    "extra": "Punkthinder"
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            },
            "andre_linjer_60m_og_over": {
                "info": {
                    "name": "",
                    "extra": "Linjehinder som ikke er kraftledning, med st&oslashrste h&oslashyde over underliggende overflate 60 meter eller mer."
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            },
            "andre_linjer_mellom_40m_60m": {
                "info": {
                    "name": "",
                    "extra": "Linjehinder som ikke er kraftledning, med st&oslashrste h&oslashyde over underliggende overflate mellom 40 og 60 meter."
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            },
            "andre_linjer_under_40m": {
                "info": {
                    "name": "",
                    "extra": "Linjehinder som ikke er kraftledning, med st&oslashrste h&oslashyde over underliggende overflate under 40 meter."
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            },
            "andre_linjer_uten_hoyde": {
                "info": {
                    "name": "",
                    "extra": "Linjehinder som ikke er kraftledning, der st&oslashrste h&oslashyde over underliggende overflate er ukjent."
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            },
            "kraftledning_60m_og_over": {
                "info": {
                    "name": "",
                    "extra": "Kraftledning med st&oslashrste h&oslashyde over underliggende overflate 60 meter eller mer."
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            },
            "kraftledning_mellom_40m_60m": {
                "info": {
                    "name": "",
                    "extra": "Kraftledning med st&oslashrste h&oslashyde over underliggende overflate mellom 40 og 60 meter."
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            },
            "kraftledning_under_40m": {
                "info": {
                    "name": "",
                    "extra": "Kraftledning med st&oslashrste h&oslashyde over underliggende overflate lavere enn 40 meter."
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            },
            "kraftledning_uten_hoyde": {
                "info": {
                    "name": "",
                    "extra": "Kraftledning der st&oslashrste h&oslashyde over underliggende overflate er ukjent."
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            },
            "kraftstolpe_60m_og_over": {
                "info": {
                    "name": "",
                    "extra": "Kraftstolpe med vertikalutstrekning 60 meter eller mer."
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            },
            "kraftstolpe_mellom_40m_60m": {
                "info": {
                    "name": "",
                    "extra": "Kraftstolpe med vertikalutstrekning mellom 40 og 60 meter."
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            },
            "kraftstolpe_under_40m": {
                "info": {
                    "name": "",
                    "extra": "Kraftstolpe med vertikalutstrekning lavere enn 40 meter."
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            },
            "kraftstolpe_uten_hoyde": {
                "info": {
                    "name": "",
                    "extra": "Kraftstolpe der vertikalutstrekning er ukjent."
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            },
            "linjepunkt_60m_og_over": {
                "info": {
                    "name": "",
                    "extra": "Endepunkt, knekkpunkt eller mast/stolpe tilknyttet et linjehinder som ikke er en kraftledning, med vertikalutstrekning 60 meter eller mer."
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            },
            "linjepunkt_mellom_40m_60m": {
                "info": {
                    "name": "",
                    "extra": "Endepunkt, knekkpunkt eller mast/stolpe tilknyttet et linjehinder som ikke er en kraftledning, med vertikalutstrekning mellom 40 og 60 meter."
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            },
            "linjepunkt_under_40m": {
                "info": {
                    "name": "",
                    "extra": "Endepunkt, knekkpunkt eller mast/stolpe tilknyttet et linjehinder som ikke er en kraftledning, med vertikalutstrekning lavere enn 40 meter."
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            },
            "linjepunkt_uten_hoyde": {
                "info": {
                    "name": "",
                    "extra": "Endepunkt, knekkpunkt eller mast/stolpe tilknyttet et linjehinder som ikke er en kraftledning, med ukjent vertikalutstrekning."
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            },
            "punkthindre_60m_og_over": {
                "info": {
                    "name": "",
                    "extra": "Punkthinder med vertikalutstrekning 60 meter eller mer."
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            },
            "punkthindre_mellom_40m_60m": {
                "info": {
                    "name": "",
                    "extra": "Punkthinder med vertikalutstrekning mellom 40 og 60 meter."
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            },
            "punkthindre_under_40m": {
                "info": {
                    "name": "",
                    "extra": "Punkthinder med vertikalutstrekning lavere enn 40 meter."
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            },
            "punkthindre_uten_hoyde": {
                "info": {
                    "name": "",
                    "extra": "Punkthinder der vertikalutstrekning er ukjent."
                },
                "content": {
                    "NRL-ID:": "nrl-id",
                    "Navn:": "navn",
                    "Vertikalutstrekning:": {
                        "vertikalustrekning": " m"
                    },
                    "Lyssetting:": "lyssetting",
                    "Status:": "status",
                    "Verifiseringsdato:": "verifiseringsdato",
                    "Hindertype:": "hindertype",
                    "Datafangstdato:": "datafangstdato",
                    "Merking:": "merking"
                }
            }            
        };
        if (subLayer.featureInfo.supportsGetFeatureInfo && subLayer.source=='WMS'){
            var xmlFile = jQuery.parseXML(result);
            var jsonFile = xml.xmlToJSON(xmlFile);
            if (jsonFile.hasOwnProperty("msGMLOutput")){
                if (jsonFile.msGMLOutput.hasOwnProperty(subLayer.providerName + "_layer")){
                    var getProperties = jsonFile.msGMLOutput[subLayer.providerName + "_layer"][subLayer.providerName + "_feature"];
                    // var features = _convertJSONtoArray(getProperties);
                    parsedResult = [];
                    if (getProperties.constructor != Array){
                        getProperties=[getProperties];
                    }
                    //@TODO: Testing and check if more is needed.
                    for (var i = 0; i < getProperties.length; i++){
                        var dictTmp = JSON.parse(JSON.stringify(dict[subLayer.providerName.toLowerCase()]));
                        if(!!dictTmp) {
                            for (var prop in dictTmp["content"]) {
                                 if (typeof dictTmp['content'][prop] === 'object') {
                                    for (var internprop in dictTmp['content'][prop]) {
                                        if(!!getProperties[i][internprop]){
                                            dictTmp["content"][prop] = getProperties[i][internprop] + dictTmp["content"][prop][internprop];
                                        }
                                    }
                                } else {
                                    if(!!getProperties[i][dictTmp["content"][prop]]) {
                                        dictTmp["content"][prop] = getProperties[i][dictTmp["content"][prop]];
                                    }else{
                                        dictTmp["content"][prop] = "";
                                    }
                                 }
                            }
                            getProperties[i] = dictTmp["content"];
                        }
                    }
                    for (var i = 0; i < getProperties.length; i++){
                        var attr = {
                            "attributes" : {}
                        };
                        attr.attributes = _convertJSONtoArray(getProperties[i]);
                        parsedResult.push(attr);
                    }
                }
            }

        }else{
            try {
                parsedResult = featureParser.Parse(result);
            }
            catch(e){
                exception = e;
            }
        }

        if(!parsedResult){
            return;
        }

        parsedResult=applyIncludedFields(parsedResult, subLayer);

        var responseFeatureCollection = new ISY.Domain.LayerResponse();
        responseFeatureCollection.id = subLayer.id;
        responseFeatureCollection.name = subLayer.providerName;
        responseFeatureCollection.isLoading = false;
        responseFeatureCollection.features = parsedResult;
        responseFeatureCollection.exception = exception;
        responseFeatureCollection.featureInfoTitle = subLayer.featureInfoTitle;
        if(subLayer.source === ISY.Domain.SubLayer.SOURCES.proxyWms || subLayer.source == ISY.Domain.SubLayer.SOURCES.proxyWmts ||
            subLayer.source === ISY.Domain.SubLayer.SOURCES.wms || subLayer.source === ISY.Domain.SubLayer.SOURCES.wmts){
            responseFeatureCollection.wms = true;
        }
        responseFeatureCollection.featureInfoElement = subLayer.featureInfoElement;
        responseFeatureCollection.showDialog = subLayer.showDialog;
        responseFeatureCollection.openNewWindow = subLayer.openNewWindow;
        responseFeatureCollection.openParentWindow = subLayer.openParentWindow;
        responseFeatureCollection.windowWidth = subLayer.windowWidth;
        responseFeatureCollection.editable = subLayer.editable;

        eventHandler.TriggerEvent(ISY.Events.EventTypes.FeatureInfoEnd, responseFeatureCollection);
    }

    function _getSupportedFormatsForService(isySubLayer, service, callback){
        var parseCallback = function(data){
            var jsonCapabilities = parseGetCapabilities(data);
            callback(jsonCapabilities);
        };

        // TODO: This replace is too specific
        var wmsUrl = isySubLayer.url.replace('proxy/wms', 'proxy/');
        var getCapabilitiesUrl;
        var questionMark = '?';
        var urlHasQuestionMark = wmsUrl.indexOf(questionMark) > -1;
        if(!urlHasQuestionMark){
            wmsUrl = wmsUrl + encodeURIComponent(questionMark);
        }

        var request = 'SERVICE=' + service + '&REQUEST=GETCAPABILITIES';
        if(isySubLayer.source === ISY.Domain.SubLayer.SOURCES.proxyWms || isySubLayer.source == ISY.Domain.SubLayer.SOURCES.proxyWmts){
            request = encodeURIComponent(request);
        }
        getCapabilitiesUrl = wmsUrl + request;
        httpHelper.get(getCapabilitiesUrl).success(parseCallback);
    }

    function parseGetCapabilities(getCapabilitiesXml){
        var parser = new ol.format.WMSCapabilities();
        var result = parser.read(getCapabilitiesXml);
        return result;
    }

    /*
        Get Feature Info function
     */

    function handlePointSelect(coordinate, layersSupportingGetFeatureInfo){
        if(useInfoMarker === true){
            _showInfoMarker(coordinate);
        }
        eventHandler.TriggerEvent(ISY.Events.EventTypes.MapClickCoordinate, coordinate);
        _trigStartGetInfoRequest(layersSupportingGetFeatureInfo);

        for(var i = 0; i < layersSupportingGetFeatureInfo.length; i++){
            var subLayer = layersSupportingGetFeatureInfo[i];
            switch (subLayer.source){
                case ISY.Domain.SubLayer.SOURCES.wmts:
                case ISY.Domain.SubLayer.SOURCES.wms:
                case ISY.Domain.SubLayer.SOURCES.proxyWms:
                case ISY.Domain.SubLayer.SOURCES.proxyWmts:
                    _sendGetFeatureInfoRequest(subLayer, coordinate);
                    break;
                case ISY.Domain.SubLayer.SOURCES.wfs:
                case ISY.Domain.SubLayer.SOURCES.vector:
                    var features = mapImplementation.GetFeaturesInExtent(subLayer, mapImplementation.GetExtentForCoordinate(coordinate, pixelTolerance));
                    _handleGetInfoResponse(subLayer, features);
                    break;
            }
        }
    }

    function _sendGetFeatureInfoRequest(subLayer, coordinate){
        var infoUrl = mapImplementation.GetInfoUrl(subLayer, coordinate);
        infoUrl = decodeURIComponent(infoUrl);
        _handleGetInfoRequest(infoUrl, subLayer);
    }

    function getSupportedGetFeatureInfoFormats(isySubLayer, callback){
        var service = 'WMS';
        var getFormatCallback = function(jsonCapabilities){
            var formats = jsonCapabilities.Capability.Request.GetFeatureInfo.Format;
            callback(formats);
        };
        _getSupportedFormatsForService(isySubLayer, service, getFormatCallback);
    }

    /*
        Get Feature functions
     */

    function handleBoxSelect(boxExtent, layersSupportingGetFeature){
        _trigStartGetInfoRequest(layersSupportingGetFeature);

        for(var i = 0; i < layersSupportingGetFeature.length; i++){
            var subLayer = layersSupportingGetFeature[i];
            switch (subLayer.source){
                case ISY.Domain.SubLayer.SOURCES.wmts:
                case ISY.Domain.SubLayer.SOURCES.wms:
                case ISY.Domain.SubLayer.SOURCES.proxyWms:
                case ISY.Domain.SubLayer.SOURCES.proxyWmts:
                    _sendBoxSelectRequest(subLayer, boxExtent);
                    break;
                case ISY.Domain.SubLayer.SOURCES.wfs:
                case ISY.Domain.SubLayer.SOURCES.vector:
                    var features = mapImplementation.GetFeaturesInExtent(subLayer, boxExtent);
                    _handleGetInfoResponse(subLayer, features);
                    break;
            }
        }
    }

    function _sendBoxSelectRequest(isySubLayer, boxExtent){
        var proxyHost = mapImplementation.GetProxyHost();
        var infoUrl = proxyHost + _getFeatureUrl(isySubLayer, boxExtent);
        _handleGetInfoRequest(infoUrl, isySubLayer);
    }

    function _getFeatureUrl(isySubLayer, boxExtent){
        var crs = isySubLayer.featureInfo.getFeatureCrs;
        //var adaptedExtent = mapImplementation.TransformBox(isySubLayer.coordinate_system, isySubLayer.featureInfo.getFeatureCrs, boxExtent);
        //var extent = mapImplementation.GetCenterFromExtent(boxExtent);
        var adaptedExtent = boxExtent;
        //var url = "service=WFS&request=GetFeature&typeName=" + isySubLayer.name + "&srsName=" + crs + "&outputFormat=" + isySubLayer.featureInfo.getFeatureFormat + "&bbox=" + adaptedExtent;
        var url = "service=WMS&version=1.3.0&request=GetFeatureInfo&TRANSPARENT=" + isySubLayer.transparent + "&QUERY_LAYERS=" + isySubLayer.name + "&INFO_FORMAT="+ isySubLayer.featureInfo.getFeatureInfoFormat + "&SRS=" + crs + "&bbox=" + adaptedExtent + "&width=" + 400 + "&height=" + 400 + "&x=" + 150 + "&y=" + 150;
        url = decodeURIComponent(url);
        url = url.substring(url.lastIndexOf('?'), url.length);
        url = url.replace('?', '');
        url = encodeURIComponent(url);
        // TODO: This replace is too specific
        return isySubLayer.url[0].replace('proxy/wms', 'proxy/') + url;
    }

    function getSupportedGetFeatureFormats(isySubLayer, callback){
        //TODO: Handle namespace behaviour, when colon is present the parser fails....Meanwhile, do not use
        var service = 'WFS';
        var getFormatCallback = function(jsonCapabilities){
            var formats = jsonCapabilities.Capability.Request.GetFeature.Format;
            callback(formats);
        };
        _getSupportedFormatsForService(isySubLayer, service, getFormatCallback);
    }

    /*
        Marker functions for Get Feature info click
     */

    function createDefaultInfoMarker(){
        infoMarker = document.createElement("img");
        infoMarker.src= infoMarkerPath;
        _hideInfoMarker();
        _addInfoMarker();
    }

    function _showInfoMarker(coordinate){
        if (infoMarker === undefined){
            createDefaultInfoMarker();
        }
        setInfoMarker(infoMarker, true);
        infoMarker.style.visibility = "visible";
        infoMarker.style.position = "absolute";
        infoMarker.style.zIndex = "11";
        mapImplementation.ShowInfoMarker(coordinate, infoMarker);
    }

    function _showInfoMarkers(coordinates){
        mapImplementation.ShowInfoMarkers(coordinates, infoMarker);
    }

    function setInfoMarker(element, removeCurrent){
        if(useInfoMarker === true) {
            if (removeCurrent === true) {
                if (infoMarker === undefined){
                    createDefaultInfoMarker();
                }
                mapImplementation.RemoveInfoMarker(infoMarker);
                _hideInfoMarker();
                useInfoMarker = false;
            }
            infoMarker = element;
            //_addInfoMarker();
        }
    }
    function _addInfoMarker(){
        document.body.appendChild(infoMarker);
        //useInfoMarker = true;
    }

    function removeInfoMarker(){
        useInfoMarker = true;
        setInfoMarker(infoMarker, true);
    }

    function removeInfoMarkers() {
        mapImplementation.RemoveInfoMarkers(undefined);
    }

    function _hideInfoMarker(){
        infoMarker.style.visibility = "hidden";
    }

    function setInfoMarkerPath(path){
        infoMarkerPath = path;
    }

    function showInfoMarker(coordinate){
        _showInfoMarker(coordinate);
        //mapImplementation.ShowInfoMarker(coordinate);
    }

    function showInfoMarkers(coordinates){
        _showInfoMarkers(coordinates);
        //mapImplementation.ShowInfoMarker(coordinate);
    }

    return {
        HandlePointSelect: handlePointSelect,
        HandleBoxSelect: handleBoxSelect,
        CreateDefaultInfoMarker: createDefaultInfoMarker,
        SetInfoMarker: setInfoMarker,
        RemoveInfoMarker: removeInfoMarker,
        RemoveInfoMarkers: removeInfoMarkers,
        GetSupportedGetFeatureInfoFormats: getSupportedGetFeatureInfoFormats,
        GetSupportedGetFeatureFormats: getSupportedGetFeatureFormats,
        SetInfoMarkerPath: setInfoMarkerPath,
        ShowInfoMarker: showInfoMarker,
        ShowInfoMarkers: showInfoMarkers

    };
};