"use strict";
SGPApp.controller("MainCtrl", ["$rootScope","$q", "$state", "$scope", "Exam", "Fullscreen", "Common", "LoginService", function ($rootScope,$q, $state, $scope, Exam, Fullscreen, Common, LoginService) {
    if (!$rootScope.loadingPage){
        Common.loadingContent(false);
    }


    setTimeout(function(){
        if ($rootScope.session.profile != undefined) {
            Exam.getExams($rootScope.session.profile.login).then(function (data) {
                $scope.exams = data.data.length;
                Exam.getExamsResult($rootScope.session.profile.login).then(function (data) {
                    $scope.results = data.data.length;
                });
            });
        }
    },1000);

}]);
