"use strict";

SGPApp
    .factory("Exam", ["$http","$q","Config","localStorageService","auth","UserService", "AWSService","Common", function($http,$q, Config, localStorageService, auth, UserService, AWSService,Common) {



        function sendAnswersFile(fileName, fileContent) {

            var defer = $q.defer();

            AWSService.s3().then(function (s3) {
                console.log("Saving file on S3...");
                console.log(JSON.stringify(fileContent));
                console.log("------------");

                s3.putObject(
                    {
                        Bucket: "strtec",
                        Key: "Temp/" + fileName + ".json",
                        Body: JSON.stringify(fileContent),
                        //ACL:"public-read",
                        ContentType: "application/json"
                    },
                    function (err, response) {
                        if (response){
                            defer.resolve(response);
                        }else{
                            defer.resolve(null);
                        }
                    }
                );
            });

            return defer.promise;

        }

        function sendMessage(objMessage) {

            return $http.post(Config.getApiUrl() + "/api/v1/ib/rest/updatequestionscores/", objMessage);
            //return {success:function(){return "teste";},error:function(){return "teste";}}
        }


        return {
            getFile : function(file) {
                var defer = $q.defer();
                AWSService.s3()
                    .then(function (s3) {
                        s3.getObject({Bucket: "strtec", Key: file})
                            .on("httpDownloadProgress", function (progress) {
                                if (progress.total===0){
                                    Common.setProgress("loading-exam-progress", "0");
                                }else{
                                    Common.setProgress("loading-exam-progress", Math.round((progress.loaded*100)/progress.total));
                                }
                                console.log("Downloaded", progress.loaded, "of", progress.total, "bytes");

                            })
                            .send(function(err, response) {
                                if (response===null){
                                    defer.resolve(null);
                                }else{
                                    if (response.body===null){
                                        defer.resolve(null);
                                    }else{
                                        defer.resolve(response.Body.toString());
                                    }
                                }

                            });

                    });

                return defer.promise;

            },
            getExams : function(code) {
                return $http.get(Config.getApiUrl() + "/api/v1/ib/rest/availableassessment/" + code + "/", {withCredentials : false});
            },
            getExamsResult : function(code) {
                return $http.get(Config.getApiUrl() + "/api/v1/ib/rest/assessmentresult/" + code + "/", {withCredentials : false});
            },
            getLocal : function(code) {
                return localStorageService.get(code);
            },
            removeLocal : function(code) {
                return localStorageService.remove(code);
            },
            saveLocal : function(code, value) {
                localStorageService.add(code, value);
            },
            sendAnswers : function(mode, fileName, fileContent) {
                var defer = $q.defer();
                if (1===1){
                    sendAnswersFile(fileName, fileContent).then(function(response){
                        if (response === null){
                            defer.resolve(null);
                        }else{
                            var obj = {};
                            obj.code = fileName;
                            obj.url = "https://strtec.s3.amazonaws.com/Temp/" + fileName + ".json";
                            console.log("Sending message to API...");
                            console.log(obj);
                            console.log("------------");
                            if (response){

                                sendMessage(obj)
                                    .success(function(data){
                                        //defer.resolve(data);
                                        defer.resolve("Temp/" + fileName + ".json");
                                    }).error(function(err){
                                        defer.resolve(null);

                                    });

                            }
                        }

                    });
                }else{
                    sendAnswersFile(fileName, fileContent).then(function(response){
                        var obj = {};
                        obj.code = fileName;
                        obj.url = "https://strtec.s3.amazonaws.com/Temp/" + fileName + ".json";
                        console.log("mandando..");
                        console.log(obj);
                        if (response){

                            defer.resolve("Temp/" + fileName + ".json");

                        }
                        //console.log("oh ! to mandando isso aqui : " + "Temp/" + fileName + ".json");
                        // retirar assim que a API estiver pronta
                    });

                }


                return defer.promise;
            }

        };



    }]);

