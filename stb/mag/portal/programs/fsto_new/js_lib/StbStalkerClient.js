/* 
 * Connecting to StalkerPortal library
 * Borshchov Dimitriy (grimstal@bigmir.net)
 */

"use strict";

function StalkerClient() {

    this._authData = null;
    this._mac;
    this._AuthURL = "http://ott.briz.ua/stalker_portal/auth/token.php";
    this._DataURL = "http://v2.api.ott.briz.ua/stalker_portal/api/users/";
    this._userActivityTimer = null;
    this._inited = false;
    this._login = '';
    this._password = '';

    this.init = function (initer) {
        var self = this;
        var checkInit = $.Deferred();

        if (typeof (initObject) !== 'function') {
            checkInit.reject('load initObject library first');
            return checkInit.promise();
        }

        if (typeof (authObject) !== 'function') {
            checkInit.reject('load authObject library first');
            return checkInit.promise();
        }

        if (typeof (StalkerParser) !== 'function') {
            checkInit.reject('load Parser library first');
            return checkInit.promise();
        }

        if (!initer.mac) {
            checkInit.reject('MAC not set');
            return checkInit.promise();
        }

        this._mac = initer.mac;
        this._login = initer.login;
        this._password = initer.password;
        this._authData = new authObject();
        this.parser = new StalkerParser();

        this._loginUser().then(
                function (data) {
                    self._inited = true;
                    self._updateUserActivity();
                    checkInit.resolve("Init done");
                },
                function (data) {
                    checkInit.reject(data);
                });

        return checkInit.promise();
    };

    this._setAjaxRequest = function (requestParams) {

        var self = this;
        var df = $.Deferred();

        $.ajax({
            type: requestParams.restMethod,
            url: requestParams.url,
            dataType: requestParams.dataType,
            data: requestParams.data,
            crossDomain: (requestParams.crossDomain != undefined) ? requestParams.crossDomain : false,
            headers: requestParams.headers,
            timeout: (requestParams.timeout != undefined) ? requestParams.timeout : 5000,
            success: function (data) {
                requestParams.successFunction(data);
                df.resolve(data);
            },
            error: function (data) {
                self._authData.clear();
                requestParams.errorFunction(data);
                df.reject(data);
            }
        });

        return df.promise();
    };

    this._lookForLogin = function () {

        var self = this;

        var status = $.Deferred();

        if (this._authData.isLogin() === false) {
            if (this._authData.refreshToken !== null) {
                this._refreshToken().then(
                        function (data) {
                            status.resolve(data);
                        },
                        function (data) {
                            self._authData.clear();
                            status.reject(data);
                        });
            } else {
                this._loginUser().then(
                        function (data) {
                            status.resolve(data);
                        },
                        function (data) {
                            self._authData.clear();
                            status.reject(data);
                        });
            }

        } else {
            status.resolve('Sucessful');
        }

        return status.promise();
    };

    this._sendAuthorizationRequest = function (request_data) {
        var self = this;
        var status = $.Deferred();
        var error;
        var request;

        if (typeof requestParams !== 'function') {
            status.reject("load requestParams library first");
            return status.promise();
        }

        function successFunc(data) {
            if (data) {
                self._authData.set(data);
                if (self._authData.isLogin() === true) {
                    self._updateUserActivity();
                    status.resolve(data);
                } else if (data.error_description) {
                    status.reject(data.error_description);
                } else {
                    status.reject(data);
                }
            } else {
                status.reject("Unknown mistake");
            }
        }

        function errorFunc(data) {
            clearTimeout(self._userActivityTimer);
            if (data) {
                if (data.statusText && data.statusText == "error") {
                    error = "Server doesn't answer";
                } else {
                    error = data;
                }
            } else {
                error = "Unknown mistake";
            }
            status.reject(error);
        }

        request = new requestParams();
        request.setRequest("POST", this._AuthURL, successFunc, errorFunc);
        request.setDataType("json");
        request.setHeaders({"Content-Type": "application/x-www-form-urlencoded"});
        request.setData(request_data);
        request.setCrossDomain(true);
        this._setAjaxRequest(request);

        return status.promise();
    };

    this._sendActivityRequest = function (rest_url, RestMethod, ContentType, Data) {
        var self = this;
        var result = $.Deferred();
        var url;
        var request;
        var error;

        if (!rest_url || !RestMethod) {
            result.reject(false);
            return result.promise();
        }

        if (typeof requestParams !== 'function') {
            result.reject("load requestParams library first");
            return result.promise();
        }

        function successFunc(data) {
            if (data.status && data.status === 'OK') {
                result.resolve("Activity request done");
            } else {
                result.reject('Activity request failed');
            }
            ;
        }

        function errorFunc(data) {
            if (data) {
                if (data.statusText && data.statusText == "error") {
                    error = "Server doesn't answer";
                } else if (data.responseJSON && data.responseJSON.error) {
                    error = data.responseJSON.error;
                } else {
                    error = 'Activity request failed';
                }
            } else {
                error = 'Activity request failed';
            }
            result.reject(error);
        }

        this._lookForLogin().then(
                function () {
                    url = self._DataURL + self._authData.userID + rest_url;
                    request = new requestParams();
                    request.setRequest(RestMethod, url, successFunc, errorFunc);
                    request.setDataType("json");
                    request.setData(Data);
                    request.setHeaders({"Authorization": "Bearer " + self._authData.accessToken, "Content-Type": ContentType});
                    request.setCrossDomain(true);
                    self._setAjaxRequest(request);
                },
                function (data) {
                    result.reject(data);
                });

        return result.promise();
    };

    this._sendDataRecieveRequest = function (rest_url) {
        var self = this;
        var result = $.Deferred();
        var url;
        var request;
        var error;

        if (typeof (requestParams) !== 'function') {
            result.reject("load requestParams library first");
            return result.promise();
        }

        function successFunc(data) {

            if (data.status === 'OK' && data.results) {
                result.resolve(data.results);
            } else {
                result.reject(data);
            }
        }

        function errorFunc(data) {
            if (data) {
                if (data.statusText && data.statusText == "error") {
                    error = "Server doesn't answer";
                } else if (data.responseJSON && data.responseJSON.error) {
                    error = data.responseJSON.error;
                } else {
                    error = data;
                }
            } else {
                error = "Unknown mistake";
            }
            result.reject(error);
        }

        this._lookForLogin().then(
                function () {
                    url = self._DataURL + self._authData.userID + rest_url;
                    request = new requestParams();
                    request.setRequest("GET", url, successFunc, errorFunc);
                    request.setDataType("json");
                    request.setCrossDomain(true);
                    request.setHeaders({"Authorization": "Bearer " + self._authData.accessToken});
                    self._setAjaxRequest(request);
                },
                function (data) {
                    result.reject(data);
                });
        return result.promise();
    };

    this._sendFavoritesRequest = function (rest_method, channelID) {
        var self = this;
        var result = $.Deferred();
        var url;
        var request;
        var error;

        if (typeof (requestParams) !== 'function') {
            result.reject("load requestParams library first");
            return result.promise();
        }

        if (!rest_method) {
            result.reject("REST method not set");
            return result.promise();
        }

        function successFunc(data) {
            if (data.status === 'OK' && data.results) {
                result.resolve(data.results);
            } else {
                result.reject(data);
            }
        }

        function errorFunc(data) {
            if (data) {
                if (data.statusText && data.statusText == "error") {
                    error = "Server doesn't answer";
                } else if (data.responseJSON && data.responseJSON.error) {
                    error = data.responseJSON.error;
                } else {
                    error = data;
                }
            } else {
                error = "Unknown mistake";
            }
            result.reject(error);
        }

        this._lookForLogin().then(
                function () {
                    request = new requestParams();
                    
                    url = self._DataURL + self._authData.userID + "/tv-favorites";
                    
                    if (channelID && typeof channelID == "number") {
                        if (rest_method == "DELETE"){
                            url += "/" + channelID;
                        } else {
                            request.setData({"ch_id": channelID});
                        }
                    }
                    
                    request.setRequest(rest_method, url, successFunc, errorFunc);
                    request.setDataType("json");
                    request.setCrossDomain(true);
                    request.setHeaders({"Authorization": "Bearer " + self._authData.accessToken});
                    self._setAjaxRequest(request);
                },
                function (data) {
                    result.reject(data);
                });
        return result.promise();
    };

    this._loginUser = function () {
        var data = null;
        var status = $.Deferred();

        if (!this._mac) {
            status.reject('MAC not set');
        } else {
            data = "grant_type=password&username=" + this._login + "&password=" + this._password + "&mac=" + this._mac;
            status = this._sendAuthorizationRequest(data);
        }

        return status.promise();
    };

    this._refreshToken = function () {
        var data = null;
        var status = $.Deferred();

        if (!this._authData.refreshToken) {
            status.reject('No refresh token');
        } else {
            data = "grant_type=refresh_token&refresh_token=" + this._authData.refreshToken;
            status = this._sendAuthorizationRequest(data);
        }

        return status.promise();
    };

    this._updateUserActivity = function () {
        var self = this;

        clearTimeout(this._userActivityTimer);

        this._sendActivityRequest("/ping", "GET").then(
                function (response) {
                    /*console.log("User activity: " + response);*/
                    self._userActivityTimer = setTimeout(function () {
                        self._updateUserActivity();
                    }, 2 * 60 * 1000);
                },
                function (response) {
                    /*console.log("User activity: " + response);*/
                });
    };

    this._updateUserChannelActivity = function (channelID) {
        this._sendActivityRequest("/media-info", "POST", "application/x-www-form-urlencoded", {"type": "tv-channel", "media_id": channelID});
    };

    this._deleteUserChannelActivity = function () {
        this._sendActivityRequest("/media-info", "DELETE", "application/x-www-form-urlencoded");
    };

    this.getChannels = function (genre_id, onlyFavorite) {
        var self = this;
        var result = $.Deferred();
        var url = '';

        if (!genre_id || genre_id.length == 0) {
            url = '/tv-channels';
        } else {
            url = '/tv-genres/' + genre_id + '/tv-channels';
        }
        
        if (onlyFavorite){
            url += "?mark=favorite";
        }

        this._sendDataRecieveRequest(url).then(
                function (data) {
                    result.resolve(self.parser.ChannelsArrayParser(data));
                },
                function (data) {
                    result.reject(data);
                });

        return result.promise();
    };

    this.getGenres = function () {
        var self = this;
        var result = $.Deferred();
        var url = '/tv-genres';

        this._sendDataRecieveRequest(url).then(
                function (data) {
                    result.resolve(self.parser.GenresArrayParser(data));
                },
                function (data) {
                    result.reject(data);
                });

        return result.promise();
    };

    this.getChannelLink = function (channelID) {
        var self = this;
        var result = $.Deferred();
        var chanReg = /[0-9]+/;

        if (!channelID || !chanReg.exec(channelID)) {
            result.reject('No channel id');
        } else {
//			self._deleteUserChannelActivity();
            var url = '/tv-channels/' + channelID + '/link';
            result = this._sendDataRecieveRequest(url);
            result.then(function () {
                self._updateUserChannelActivity(channelID);
            });
        }

        return result.promise();
    };

    this.addFavorite = function (channelID) {
        var result = $.Deferred();

        if (!channelID) {
            result.reject("channel id not set");
            return result.promise();
        }

        this._sendFavoritesRequest("POST", channelID).then(
                function (data) {
                    result.resolve(true);
                },
                function (data) {
                    result.reject(data);
                });

        return result.promise();
    };
    
    this.deleteFavorite = function (channelID) {
        var result = $.Deferred();
        
        if (!channelID) {
            result.reject("channel not set");
            return result.promise();
        }

        this._sendFavoritesRequest("DELETE", channelID).then(
                function () {
                    result.resolve(true);
                },
                function (data) {
                    result.reject(data);
                });

        return result.promise();
    };
}
