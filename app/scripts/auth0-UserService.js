"use strict";
/**
 * Created by jpsantos on 21/07/14.
 */
SGPApp
    .factory("UserService",["$q", "$http", "auth", function ($q, $http, auth) {
        var service = {
            _user: null,
            _targetClientId: "wS56lPAhM97f3odJDQnU73vc2nIl0Gkv",
            _role: "arn:aws:iam::331375578265:role/prova-online-users",
            _principal: "arn:aws:iam::331375578265:saml-provider/auth0-provider",
            currentUser: function () {
                var d = $q.defer();
                if (!service._user) {
                    service._user = auth.profile;
                }

                d.resolve(service._user);

                return d.promise;
            },
            awsCredentials: function() {
                var d = $q.defer();
                service.currentUser().then(function (user_profile){
                    //auth0.getDelegationToken(options.targetClientId, user.get().id_token, { role: options.role, principal: options.principal }, callback);
                    var auth0 = new Auth0({
                        domain:         "starline.auth0.com",
                        clientID:       "wS56lPAhM97f3odJDQnU73vc2nIl0Gkv"
                    });

                    auth0.getDelegationToken(service._targetClientId,auth.idToken,{role: service._role, principal: service._principal },
                        function (err, delegationResult){
                            d.resolve(delegationResult.Credentials);
                        });
                });

                return d.promise;

            }
        };
        return service;
    }]);