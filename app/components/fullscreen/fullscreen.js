SGPApp.factory('Fullscreen', ['$document', function ($document) {
    var document = $document[0];

    return {
        all: function() {
            this.enable( document.documentElement );
        },
        enable: function(element) {
            if(element.requestFullScreen) {
                element.requestFullScreen();
            } else if(element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if(element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
            }
        },
        cancel: function() {

            if(document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if(document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if(document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        },
        isEnabled: function(){
            var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
            return fullscreenElement;
        }
    };
}]);

SGPApp.directive('fullscreen', ['Fullscreen', '$document', function(Fullscreen, $document) {
    var document = $document[0];

    return {
        link : function ($scope, $element, $attrs) {
            // Watch for changes on scope if model is provided
            if ($attrs.fullscreen) {
                $scope.$watch($attrs.fullscreen, function(value) {
                    var isEnabled = Fullscreen.isEnabled();
                    if (value && !isEnabled) {
                        Fullscreen.enable($element[0]);
                    } else if (!value && isEnabled) {
                        Fullscreen.cancel();
                    }
                });
            }

            $element.on('click', function (ev) {
                Fullscreen.enable(  $element[0] );
            });
        }
    };
}]);

SGPApp.run(['Fullscreen',function (Fullscreen) {

    //Extendendo o fullscreen
    Fullscreen.checkFSSupport = function () {
        var TEST_NODE = document.createElement('div');
        var REQUEST_FULLSCREEN_FUNCS = {
            'requestFullscreen': {
                'change': 'onfullscreenchange',
                'request': 'requestFullscreen',
                'error': 'onfullscreenerror',
                'enabled': 'fullscreenEnabled',
                'cancel': 'exitFullscreen',
                'fullScreenElement': 'fullscreenElement'
            },
            'mozRequestFullScreen': {
                'change': 'onmozfullscreenchange',
                'request': 'mozRequestFullScreen',
                'error': 'onmozfullscreenerror',
                'cancel': 'mozCancelFullScreen',
                'enabled': 'mozFullScreenEnabled',
                'fullScreenElement': 'mozFullScreenElement'
            },
            'webkitRequestFullScreen': {
                'change': 'onwebkitfullscreenchange',
                'request': 'webkitRequestFullScreen',
                'cancel': 'webkitCancelFullScreen',
                'error': 'onwebkitfullscreenerror',
                'fullScreenElement': 'webkitCurrentFullScreenElement'
            }
        };

        var fullscreen = false;

        for (var prop in REQUEST_FULLSCREEN_FUNCS) {
            if (REQUEST_FULLSCREEN_FUNCS.hasOwnProperty(prop)) {
                if (prop in TEST_NODE) {
                    fullscreen = REQUEST_FULLSCREEN_FUNCS[prop];
                    //Still need to verify all properties are there as
                    //Chrome and Safari have different versions of Webkit
                    for (var item in fullscreen) {
                        if (!(fullscreen[item] in document) && !(fullscreen[item] in TEST_NODE)) {
                            delete fullscreen[item];
                        }
                    }
                }
            }

            if (fullscreen) {
                break;
            }
        }

        return fullscreen;
    }


}]);

