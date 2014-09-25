"use strict";
SGPApp
    .factory("Config", [function () {
        return {
            getApiUrl : function () {
                return "http://teste.sistemasgp.com.br/pucvirtual";
            },
            getStaticContentUrl : function () {
                return "http://sgp.starlinetecnologia.com.br/static";
            }
        };
    }]);