"use strict";
SGPApp
    .controller("HeaderCtrl", ["$rootScope","$q", "$state", "$scope", "Exam","LoginService", "Fullscreen", "Common", function ($rootScope,$q, $state, $scope, Exam, LoginService, Fullscreen, Common) {
        $rootScope.dialogs = Common.getDialogs();
        LoginService.getAuth().then(function(auth){
            $rootScope.loadingPage = true;
            if (auth.isAuthenticated) {
                $rootScope.session = auth;
                setTimeout(function(){
                    $rootScope.loadingPage = false;
                    Common.loadingPage(false);

                },2000);
            }else{
                $state.transitionTo("login");
            }

        });

        $scope.logout = function() {
            Common.loadingPage(true);
            setTimeout(function(){
                if ($rootScope.session){
                    $rootScope.session.signout();
                }
                $state.transitionTo("login");
            },1000);
        };

        $rootScope.changePage = function(strPage) {
            if ($state.current.name !== strPage){
                Common.loadingContent(true);
            }
        };
    }]);