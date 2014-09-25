"use strict";
/**
 * Created by jpsantos on 21/07/14.
 */
SGPApp
    .provider("AWSService", function(){
        var self = this;

        //Config
        AWS.config.region = "us-east-1";

        self.arn = null;
        self.awsCredentials = null;

        self.setArn = function(arn) {
            if (arn) {
                self.arn = arn;
            }
        };

        self.setRegion = function(region) {
            if (region) {
                AWS.config.region = region;
            }
        };

        self.setCredentials = function(credentials) {
            self.awsCredentials = credentials;
            AWS.config.credentials = new AWS.Credentials(credentials.AccessKeyId,
                credentials.SecretAccessKey,
                credentials.SessionToken);
        };

        self.$get = function($q, $cacheFactory, UserService) {
            var dynamoCache = $cacheFactory("dynamo"),
                s3Cache = $cacheFactory("s3Cache");

            var service = {
                credentials: function() {
                    var d = $q.defer();

                    if (!(self.awsCredentials && new Date(self.awsCredentials.Expiration) > new Date())) {
                        UserService.awsCredentials().then(function(credentials){
                            self.setCredentials(credentials);
                            d.resolve(self.awsCredentials);
                        });
                    }  else {
                        d.resolve(self.awsCredentials);
                    }

                    return d.promise;
                },
                dynamo: function(params) {
                    var d = $q.defer();
                    service.credentials().then(function(aws_creds) {
                        var table = dynamoCache.get(JSON.stringify(params));
                        if (!table) {
                            table = new AWS.DynamoDB(params);
                            dynamoCache.put(JSON.stringify(params), table);
                        }
                        table.credentials = new AWS.Credentials(aws_creds.AccessKeyId, aws_creds.SecretAccessKey, aws_creds.SessionToken);
                        d.resolve(table);
                    });
                    return d.promise;
                },
                s3: function(params) {
                    var d = $q.defer();
                    service.credentials().then(function(aws_creds) {
                        var s3Obj = s3Cache.get(JSON.stringify(params));
                        if (!s3Obj) {
                            s3Obj = new AWS.S3(params);
                            s3Cache.put(JSON.stringify(params), s3Obj);
                        }
                        s3Obj.credentials = new AWS.Credentials(aws_creds.AccessKeyId, aws_creds.SecretAccessKey, aws_creds.SessionToken);
                        d.resolve(s3Obj);
                    });
                    return d.promise;
                }
            };
            return service;
        };

    });