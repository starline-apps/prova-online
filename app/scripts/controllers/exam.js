/*jslint evil: true */
/*jshint -W083 */
"use strict";
var refreshResult, refreshExamTime, examListInterval, examResultInterval;
SGPApp
    .controller("ExamCtrl", ["$rootScope", "$scope", "$stateParams", "$state", "$location", "$q","$timeout", "auth", "Fullscreen", "Exam", "Common", "LoginService","$sce",function($rootScope, $scope, $stateParams, $state, $location, $q,$timeout, auth, Fullscreen, Exam, Common, LoginService,$sce) {
        /** View attributes **/
        $scope.currentState = $state;
        $scope.fsSupport = Fullscreen.checkFSSupport();

        $scope.arrAlternatives = ["A","B","C","D","E","F"];

        function clearExam(){
            window.onbeforeunload = null;
            $rootScope.exams = null;
            $rootScope.exam = null;
            $rootScope.examHeader = {
                started : false
            };
            $rootScope.examBody = null;
            $rootScope.examAnswers = {};
        }


        function getExams(legacyKey){
            //var defer = $q.defer();
            //defer.resolve(Common.listExamsTest());
            //return defer.promise;
            return Exam.getExams(legacyKey);
        }


        function loadExamFile(data, code){

            $rootScope.examHeader = {
                "date": "24/01/2014",
                "time": "17:00:00",
                "code": code,
                "examtexts": {
                    "instruction02_body": " - A prova deve ser realizada individualmente e sem consulta",
                    "instruction03_body": " - Durante todo o tempo do exame, mantenha o modo de visualização em tela cheia",
                    "instruction04_body": " - Navegue pelas questões usando o menu horizontal",
                    "instruction05_body": " - Após realizar a avaliação, clique no botão Entregar Prova no canto superior da tela",
                    "instruction06_body": " - No canto direito do rodapé, existe uma contagem regressiva do tempo da prova.",
                    "instruction07_body": " - A nota será disponibilizada de acordo com os critérios da instituição",
                    "instruction08_body": " - Após iniciado a avaliação, não será possível parar",
                    "instruction09_body": " - Você terá um período de 4 horas para finalizar a avaliação",
                    "instruction10_body": " - Não atualize a página ou feche o navegador, caso seja feito, a prova será considerada como entregue",
                    "instruction11_body": " - Se houver qualquer problema, chame o monitor",
                    "field1_name": "Avaliação",
                    "field1_value": "Prova de Testes",
                    "field2_name": "Curso",
                    "field2_value": "Master Bolota Adsnator",
                    "field3_name": "Turma",
                    "field3_value": "Boloticies II 2/2014",
                    "field4_name": "Disciplina",
                    "field4_value": "Boloticies II",
                    "field5_name": "Periodo",
                    "field5_value": "2/2014"
                }
            };
            $rootScope.examBody = data;

            $rootScope.examHeader.sessions = 0;
            $rootScope.examHeader.items = 0;
            $rootScope.examHeader.commands = [];
            $rootScope.examHeader.answers = 0;

            $rootScope.examAnswers = {
                code: $rootScope.examHeader.code,
                answers: {}
            };
            var commandIndex = 0;
            angular.forEach($rootScope.examBody.assessmentsession_set, function(session_set, session_set_index){
                $rootScope.examHeader.sessions++;
                angular.forEach(session_set.assessmentitem_set, function(item_set, item_set_index){

                    $rootScope.examHeader.items++;

                    item_set.item.itemcontent.body = Common.setHtmlImage(item_set.item.itemcontent.body);

                    angular.forEach(item_set.item.itemcontent.command_set, function(command_set, command_set_index){

                        command_set.body = Common.setHtmlImage(command_set.body);
                        if (command_set.alternative_set !== undefined){
                            angular.forEach(command_set.alternative_set, function(alternative_set, alternative_set_index){
                                alternative_set.body = Common.setHtml(alternative_set.body, ["img","br"]);
                            });
                        }
                        $rootScope.examHeader.commands.push({
                            session: session_set_index,
                            itemKey: item_set_index,
                            item: item_set,
                            command: command_set,
                            commandKey: command_set_index,
                            commandIndex: commandIndex
                        });

                        $rootScope.examAnswers.answers[command_set_index] = {alternative_set:[],textanswer_set:""};
                        commandIndex++;

                    });
                });
            });
            var examAnswers = Exam.getLocal($rootScope.session.profile.login + "_" + code);

            if(examAnswers) {
                $rootScope.examAnswers = examAnswers;
                angular.forEach(examAnswers.answers, function(answer_set, answer_set_index){
                    if (answer_set.alternative_set.length > 0 || answer_set.textanswer_set!=""){
                        $rootScope.examHeader.answers++;
                    }
                });
            }

        }

        $scope.list = function() {
            clearInterval(refreshResult);
            clearInterval(refreshExamTime);
            clearInterval(examListInterval);
            clearInterval(examResultInterval);
            clearExam();

            LoginService.getAuth().then(function(auth0){

                if ($rootScope.session.profile !== undefined){
                    getExams($rootScope.session.profile.login).success(function(data){
                        $rootScope.exams = data;
                        Common.loadingContent(false);
                        if ($rootScope.exams.length === 0){
                            examListInterval = setInterval(function(){
                                Common.loading(true);
                                $scope.list();
                            },20000)
                        }
                    }).error(function (data){
                        Common.loadingContent(false);
                        Common.toggleDialog("dialog-system-unavailable");
                    });
                }else{
                    $scope.list();
                }

            });

            if (Fullscreen.isEnabled()) {
                Fullscreen.cancel();
            }

        };

        $scope.listResults = function() {
            clearInterval(refreshResult);
            clearInterval(refreshExamTime);
            clearInterval(examListInterval);
            clearInterval(examResultInterval);
            clearExam();
            LoginService.getAuth().then(function(auth0){

                if ($rootScope.session.profile !== undefined){
                    Exam.getExamsResult($rootScope.session.profile.login).success(function(data){
                        $rootScope.exams = data;
                        Common.loadingContent(false);
                        if ($rootScope.exams.length === 0){
                            examResultInterval = setInterval(function(){
                                Common.loading(true);
                                $scope.listResults();
                            },20000)
                        }
                    }).error(function (data){
                        Common.loadingContent(false);
                        Common.toggleDialog("dialog-system-unavailable");
                    });
                }else{
                    $scope.listResults();
                }

            });

        };

        $scope.instantResult = function() {
            var objResult;

            $timeout(function(){
                Common.toggleDialog("dialog-processing-result");
            });

            refreshResult = setInterval(function() {
                if ($rootScope.resultUrl !== undefined){
                    console.log("Sending result request...");
                    Exam.getFile($rootScope.resultUrl).then(function (response) {
                        objResult = JSON.parse(response);
                        console.log("Received");
                        console.log(objResult);
                        console.log("------------");
                        if (objResult.result !== undefined){
                            if (objResult.result.toString() !== ""){
                                console.log("Result : " + objResult.result);
                                console.log("------------");
                                $rootScope.examResult = objResult.result;
                                clearInterval(refreshResult);
                                clearInterval(refreshExamTime);
                                Common.toggleDialog("dialog-processing-result");
                                $timeout(function(){
                                    Common.toggleDialog("dialog-result-processed");
                                });
                            }
                        }
                    });
                }
            }, 5000);



        };

        $scope.simulateResult = function() {
            var strResult = "13";//prompt("Digite o resultado da prova : ", "");

            Exam.getFile($rootScope.resultUrl).then(function (response) {
                response = JSON.parse(response);
                response.result = strResult;

                Exam.sendAnswers("by_sistem", $stateParams.code, response).then(function (teste) {
                    console.log("Simulating result : ");
                    console.log(response);
                });

            });

        };
        $scope.setFullscreen = function(){
            Fullscreen.all();
        };
        $scope.loadExam = function (exam) {
            Common.setPage("exam-animated-pages","1");
            Common.loading(true);

            $rootScope.exam = exam;

            //exam.assessment_json_url = "pucvirtual/serialized/assessment/8/3307_5d19696c-b302-11e3-a339-1231390974f1.json";
            Exam.getFile(exam.assessment_json_url.replace("http://s3.amazonaws.com/strtec/","")).then(function (response) {
                if (response !== null){
                    console.log("Exam received.");
                    console.log(JSON.parse(response));
                    loadExamFile(JSON.parse(response), exam.pk);

                    $scope.instructions = true;
                    Common.setPage("exam-animated-pages","2");
                    Common.loading(false);

                }else{
                    $rootScope.invalidExam = true;
                    Common.setPage("exam-animated-pages","0");
                    Common.loading(false);
                }
            });

            if ($scope.fsSupport){
                addFullscreenEvent();
            }
        };

        $scope.start = function() {
            Common.toggleDialog("dialog-start-exam");
            Common.loadingPage(true);


            $rootScope.examHeader.started = true;
            $rootScope.actualCommand = 0;
            $rootScope.command = $rootScope.examHeader.commands[0];
            Exam.saveLocal($rootScope.session.profile.login + "_" + $rootScope.examHeader.code, $rootScope.examAnswers);

            if (Fullscreen.isEnabled()) {
                Fullscreen.cancel();
            } else {
                $scope.setFullscreen();
                if(document.documentElement.webkitRequestFullScreen) {
                    document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            }
            $("#content").addClass("fullscreen");
            Common.setPage("exam-animated-pages","3");

            if ($rootScope.examAnswers.examTime !== undefined){
                initExamTime($rootScope.examAnswers.examTime);
            }else{
                initExamTime("04:00:03");
            }


            window.onbeforeunload = function(){return "Atenção !\nSua prova será finalizada."};

            setTimeout(function(){
                Common.loadingPage(false, "hide");

            },3000);

        };
        $scope.executeString = function(str){
            return eval(str);
        };
        $scope.toggleDialog = function(strName) {
            Common.toggleDialog(strName);
        };

        $scope.clearExam = function() {
            clearExam();

            if (Fullscreen.isEnabled()){
                Fullscreen.cancel();
            }
            //$state.transitionTo("/");
        };
        $scope.teste = function(item, commandKey){
           //console.log(item);
            //console.log(commandKey);
          return (item==commandKey);
        };
        $scope.setAlternativeAnswer = function(item, commandKey, alternativeKey) {
            if ($rootScope.examAnswers.answers[commandKey].alternative_set.length === 0){
                $rootScope.examHeader.answers++;
            }

            $rootScope.examAnswers.answers[commandKey].alternative_set = [alternativeKey];
            Exam.saveLocal($rootScope.session.profile.login + "_" + $rootScope.examHeader.code, $rootScope.examAnswers);
        };

        $scope.setTextAnswer = function(commandKey) {
            var newVal = $("#txt"+commandKey).val();
            var oldVal = $rootScope.examAnswers.answers[commandKey].textanswer_set;

            if (oldVal === "" && newVal!==""){
                $rootScope.examHeader.answers++;
            }else if (oldVal !== "" && newVal===""){
                $rootScope.examHeader.answers--;
            }

            $rootScope.examAnswers.answers[commandKey].textanswer_set = newVal;
            Exam.saveLocal($rootScope.session.profile.login + "_" + $rootScope.examHeader.code, $rootScope.examAnswers);
        };

        $scope.confirm = function() {
            Common.toggleDialog("dialog-finish-exam-confirmation");
            removeEventHandlers();
            $scope.finishExam("user");
        };


        /** Event listener **/
        function changeHandler(e) {
            if (!Fullscreen.isEnabled()) {
                Common.toggleDialog("dialog-return-to-fullscreen");
                /*
                if($rootScope.examHeader.code) {
                    removeEventHandlers();
                    $scope.finishExam("browser");
                }
                */
            }
        }

        $scope.finishExam = function(mode){
            if (Fullscreen.isEnabled()){
                Fullscreen.cancel();
            }
            clearInterval(refreshResult);
            clearInterval(refreshExamTime);
            window.onbeforeunload = null;
            Common.loadingPage(true);
            Exam.sendAnswers(mode, $rootScope.examHeader.code, $rootScope.examAnswers).then(function (response) {
                if (response===null){
                    Common.toggleDialog("dialog-system-unavailable");
                }else{
                    Exam.removeLocal($rootScope.session.profile.login + "_" + $rootScope.examHeader.code);
                    Common.toggleDialog("dialog-finished-by-" + mode);
                    $rootScope.resultUrl = response;
                }
            });
        };

        function initExamTime(time){
            $rootScope.examTime = time;
            //$rootScope.examTime = "00:5";
            clearInterval(refreshResult);
            clearInterval(refreshExamTime);

            refreshExamTime = setInterval(function() {

                var arr = $rootScope.examTime.split(":");
                var hours = arr[0];
                var minutes = arr[1];
                var seconds = arr[2];

                if (parseInt(seconds)===0){
                    if (minutes % 10 === 0){
                        console.log("saving time on local storage");
                        $rootScope.examAnswers.examTime = $rootScope.examTime;
                        Exam.saveLocal($rootScope.session.profile.login + "_" + $rootScope.examHeader.code, $rootScope.examAnswers);
                    }


                    if (parseInt(minutes)===0 && parseInt(hours)===0){
                        if ($rootScope.examHeader !== undefined){
                            if ($rootScope.examHeader.code !== undefined){
                                $scope.finishExam("time");
                            }
                        }

                        clearInterval(refreshExamTime);

                        $rootScope.$apply();
                        return;
                    }
                    if (parseInt(minutes)===0){
                        minutes = "59";
                        hours = (parseInt(hours) - 1).toString();
                    }else{
                        minutes = (parseInt(minutes)-1).toString();
                    }
                    seconds = "59";
                }else{
                    seconds = (parseInt(seconds) - 1).toString();
                }
                hours   = (hours.length==1) ? "0"+hours : hours;
                minutes = (minutes.length==1) ? "0"+minutes : minutes;
                seconds = (seconds.length==1) ? "0"+seconds : seconds;

                $rootScope.examTime = hours + ":" + minutes + ":" + seconds;
                $rootScope.$apply();
            },1000);
        }

        $scope.exit = function(){
            ///alert("indo");
            $scope.clearExam();
            window.location.href="/#/main";
            //Common.loadingPage(false);
        };

        $scope.goToItem = function(index) {
            /*Common.setPage('item-animated-pages', index);$rootScope.actualCommand = index;*/
            var actual = $rootScope.actualCommand;
            var count = 0;
            var x;
            var p = document.querySelector("#item-animated-pages");
            if (index > actual){
                for (x = actual; x < index; x++) {
                    count++;
                    setTimeout(function () {
                        p.selected = p.selected + 1;
                        $rootScope.$apply(function(){
                            $scope.paginationToRight();
                            $rootScope.actualCommand = $rootScope.actualCommand + 1;
                        });

                    }, count * 10);
                }
            }else if(index < actual){
                for (x = actual; x > index; x--) {
                    count++;
                    setTimeout(function () {
                        p.selected = p.selected - 1;
                        $rootScope.$apply(function(){
                            $scope.paginationToLeft();
                            $rootScope.actualCommand = $rootScope.actualCommand - 1;
                        });
                    }, count * 10);
                }
            }

        };

        $scope.nextItem = function() {
            //Common.setPage()
            var p = document.querySelector("#item-animated-pages");
            p.selected = p.selected+1;
            $rootScope.actualCommand = $rootScope.actualCommand + 1;
            $scope.paginationToRight();

        };
        $scope.prevItem = function() {
            var p = document.querySelector("#item-animated-pages");
            p.selected = p.selected-1;
            $rootScope.actualCommand = $rootScope.actualCommand - 1;
            $scope.paginationToLeft();
        };
        $scope.paginationToLeft = function(){
            var actual;
            if (parseInt($(".item-pagination").find(".item-index:first").css("left").replace("px",""))!==0){
                $(".item-pagination").find(".item-index").each(function(){
                    actual = parseInt($(this).css("left").replace("px", ""));
                    actual = (actual + 75).toString() + "px";
                    $(this).css("left", actual);
                });
            }

        };
        $scope.paginationToRight = function(){
            var actual;
            var totalWidth = parseInt($(".item-pagination").css("width").replace("px",""));
            var totalLength = $(".item-pagination").find(".item-index").length;
            var max = ((totalLength*75) - totalWidth)*-1;
            if (parseInt($(".item-pagination").find(".item-index:first").css("left").replace("px","")) >= max){
                $(".item-pagination").find(".item-index").each(function(){
                    actual = parseInt($(this).css("left").replace("px", ""));
                    actual = (actual - 75).toString() + "px";
                    $(this).css("left", actual);
                });
            }
        };

        function addFullscreenEvent() {
            document.addEventListener("fullscreenchange", changeHandler, false);
            document.addEventListener("webkitfullscreenchange", changeHandler, false);
            document.addEventListener("mozfullscreenchange", changeHandler, false);
        }
        function removeEventHandlers() {
            document.removeEventListener("fullscreenchange", changeHandler);
            document.removeEventListener("webkitfullscreenchange", changeHandler);
            document.removeEventListener("mozfullscreenchange", changeHandler);
        }
    }]);






