"use strict";
SGPApp
    .config(["$stateProvider", "authProvider", "$urlRouterProvider", "$httpProvider",function ($stateProvider, authProvider, $urlRouterProvider, $httpProvider) {
        $httpProvider.defaults.withCredentials = false;

        $httpProvider.interceptors.push("authInterceptor");

        $urlRouterProvider.otherwise("/login");

        $stateProvider
            .state("login", {
                url: "/login",
                controller: "LoginCtrl",
                templateUrl: "views/login.html",
                requiresLogin: false
            })
            .state("main", {
                url: "/",
                templateUrl: "views/main.html",
                controller: "MainCtrl",
                requiresLogin: true
            })
            .state("exam", {
                url: "/",
                templateUrl: "views/exam/index.html",
                controller: "ExamCtrl",
                requiresLogin: true
            })
            .state("result", {
                url: "/",
                templateUrl: "views/exam/result.html",
                controller: "ExamCtrl",
                requiresLogin: true
            });

        authProvider
            .init({
                domain: "starline.auth0.com",
                clientID: "wS56lPAhM97f3odJDQnU73vc2nIl0Gkv",
                callbackURL: location.href,
                // Here we add the URL to go if the user tries to access a resource he can"t because he"s not authenticated
                loginUrl: "/login"
            });

    }])

    .run(["$rootScope", "$state","$location", "auth",function ($rootScope, $state,$location, auth) {

        auth.hookEvents();

        $rootScope.$on("$stateChangeStart", function() {
            if (!auth.isAuthenticated) {
                if ($state.current.url!="/login"){
                    $location.path("/login");
                }
            }
        });


    }]);
