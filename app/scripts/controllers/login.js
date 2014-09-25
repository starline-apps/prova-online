"use strict";
SGPApp
    .controller("LoginCtrl", ["$scope","$rootScope", "$state", "auth", "Common", function ($scope,$rootScope, $state, auth, Common) {
        /** Views functions **/
        if (!auth.isAuthenticated) {
            auth.signin({
                popup: true,
                standalone:true,
                icon:           'images/sgp_logo_toolbar.png',
                showIcon:       true
            }, function () {

                setTimeout(function () {
                    Common.loadingPage();
                    $rootScope.session = auth;
                    $state.transitionTo("main");
                }, 1000);

            }, function () {
                // Error callback
            });

        }else{
            setTimeout(function () {
                Common.loadingPage();
                $rootScope.session = auth;
                $state.transitionTo("main");
            }, 1000);
        }
    }]);

SGPApp
    .factory("LoginService", ["$q","auth",function ($q, auth) {
        return {
            getAuth: function () {
                var defer = $q.defer();

                defer.resolve(auth);

                return defer.promise;
            }
        };
    }]);