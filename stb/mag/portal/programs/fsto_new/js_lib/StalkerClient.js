/* 
 * Connecting to StalkerPortal libruary
 * Borshchov Dimitriy (grimstal@bigmir.net)
 */

"use strict";

function StalkerClient() {

    this.authData = null;

    this._mac = '';
    this._AuthURL = "http://ott.briz.ua/stalker_portal/auth/token.php";
    this._DataURL = "http://v2.api.ott.briz.ua/stalker_portal/api/users/";
    this._userActivityTimer = null;
    this._inited = false;

    this.dataRecieveTimeout = null;

    this.init = function () {

        var self = this;

        var checkInit = $.Deferred();

        if (!this._mac) {
            checkInit.reject('MAC not setted. Set MAC address before use init() by setMac method');
            return checkInit.promise();
        }

        if (typeof(authData) != 'function') {
            checkInit.reject('load authData library first');
            return checkInit.promise();
        }

        this.authData = new authData();

        this._loginUser().then(
            function (data) {
                self._inited = true;
                self._updateUserActivity();
                checkInit.resolve(data);
            },
            function (data) {
                checkInit.reject(data);
            });

        return checkInit.promise();
    };

    this.setMac = function (mac) {

        if (!mac) {
            return false;
        }

        var temp = mac.trim().replace(/[-]/g, ':');
        var chanReg = /^(?:[A-Fa-f0-9]{2}(?:[:])){5}[A-Fa-f0-9]{2}$/;

        temp = chanReg.exec(temp);

        if (temp === null || typeof (temp) === undefined) {
            return false;
        }

        this._mac = temp[0];

        return true;
    };

    this._setAjaxRequest = function (paramObj) {

        var df = $.Deferred();

        $.ajax({
            type: paramObj.RestMethod,
            url: paramObj.Url,
            dataType: paramObj.DataType,
            data: paramObj.Data,
            crossDomain: (paramObj.CrosReq != undefined) ? paramObj.CrosReq : false,
            headers: paramObj.Headers,
            success: function (data) {
                paramObj.SuccessFunc(data);
                df.resolve(data);
            },
            error: function (data) {
                paramObj.ErrorFunc(data);
                df.reject(data);
            }
        });

        return df.promise();

    };

    this._lookForLogin = function () {
        var status = $.Deferred();

        if (!this._inited) {
            status.reject('Not inited');
            return status.promise();
        }

        if (this.authData.isLogin() === false) {
            if (this.authData.refreshToken !== null) {
                this._refreshToken().then(
                    function (data) {
                        status.resolve(data);
                    },
                    function (data) {
                        status.reject(data);
                    });
            } else {
                this._loginUser().then(
                    function (data) {
                        status.resolve(data);
                    },
                    function (data) {
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

        self._setAjaxRequest({
            Url: self._AuthURL,
            RestMethod: "POST",
            DataType: "json",
            Headers: {"Content-Type": "application/x-www-form-urlencoded"},
            Data: request_data,
            CrosReq: true,
            SuccessFunc: function (data) {
                self.authData.set(data);
                if (self.authData.isLogin() === true) {
                    self._updateUserActivity();
                    status.resolve(data);
                } else if (data) {
                    status.reject(data);
                }

            },
            ErrorFunc: function (data) {

                if (self._userActivityTimer) {
                    clearTimeout(self._userActivityTimer);
                }

                status.reject(data);
            }
        });

        return status.promise();
    };

    this._sendActivityRequest = function (rest_url, RestMethod, ContentType, Data) {
        var self = this;
        var result = $.Deferred();
        
        if (!rest_url || !RestMethod){
            result.reject(false);
            return result.promise();
        }; 

        this._lookForLogin().then(
            function () {
                self._setAjaxRequest({
                    Url: self._DataURL + self.authData.userID + rest_url,
                    RestMethod: RestMethod,
                    DataType: "json",
                    Headers: {"Authorization": "Bearer " + self.authData.accessToken, "Content-Type": ContentType},
                    Data: Data,
                    CrosReq: true,
                    SuccessFunc: function (data) {
                        result.resolve(data);
                    },
                    ErrorFunc: function (data) {
                        result.reject(data);
                    }
                });
            },
            function (data) {
                result.reject(data);
            });

        return result.promise();
    };

    this._sendDataRecieveRequest = function (rest_url) {

        var self = this;

        var result = $.Deferred();

        this._lookForLogin().then(
            function () {
                var server = self._DataURL + self.authData.userID + rest_url;
                self._setAjaxRequest({
                    Url: server,
                    RestMethod: "GET",
                    DataType: "json",
                    Headers: {"Authorization": "Bearer " + self.authData.accessToken},
                    CrosReq: true,
                    Timeout: this.dataRecieveTimeout,
                    SuccessFunc: function (data) {
                        if (data.status === 'OK') {
                            result.resolve(data.results);
                        } else {
                            result.reject(data.error);
                        }
                        ;
                    },
                    ErrorFunc: function (data) {
                        result.reject(data);
                    }
                });
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
            status.reject('MAC not seted');
        } else {
            data = "grant_type=password&username=&password=&mac=" + this._mac;
            status = this._sendAuthorizationRequest(data);
        }

        return status.promise();
    };

    this._refreshToken = function () {
        var data = null;
        var status = $.Deferred();

        if (!this.authData.refreshToken) {
            status.reject('No refresh token');
        } else {
            data = "grant_type=refresh_token&refresh_token=" + this.authData.refreshToken;
            status = this._sendAuthorizationRequest(data);
        }

        return status.promise();
    };

    this._updateUserActivity = function () {
        var self = this;

        if (this._userActivityTimer) {
            clearTimeout(this._userActivityTimer);
        }

        this._sendActivityRequest("/ping", "GET").then(
            function (data) {
                self._userActivityTimer = setTimeout(function () {
                    self._updateUserActivity();
                }, 2 * 60 * 1000);
                console.log(data);
            }, function(data){
                console.log(data);
            });
    };

    this._updateUserChannelActivity = function (channelID) {
        this._sendActivityRequest("/media-info", "POST", "application/x-www-form-urlencoded", {"type" : "tv-channel","media_id": channelID});
    };

    this._deleteUserChannelActivity = function () {
        this._sendActivityRequest("/media-info", "DELETE", "application/x-www-form-urlencoded");
    };

    this._GenresArrayParser = function (data) {
        var array = [];
        array.push("");
        for (var i = 0; i < data.length; i++) {
            array.push(data[i].id);
        }
        return array;
    };

    this._ChannelsArrayParser = function (data) {
        var array = [];
        if (data.length == 0) {
            array.push(['0', 'ПУСТО', '-']);
        } else {
            for (var i = 0; i < data.length; i++) {
                array.push([data[i].id, data[i].name, data[i].xmltv_id]);
            }

        }

        return array;
    };

    this.getChannels = function (genre_name) {

        var self = this;
        var result = $.Deferred();

        var url = '';

        if (!genre_name) {
            url = '/tv-channels';
        } else {
            url = '/tv-genres/' + genre_name + '/tv-channels';
        }

        this._sendDataRecieveRequest(url).then(
            function (data) {
                result.resolve(self._ChannelsArrayParser(data));
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
                result.resolve(self._GenresArrayParser(data));
            },
            function (data) {
                result.reject(data);
            });

        return result.promise();
    };

    this.getChannelLink = function (channelID, genre) {

        var self = this;

        var result = $.Deferred();
        var chanReg = /[0-9]+/;

        if (!channelID || !chanReg.exec(channelID)) {
            result.reject('No channelID');
        } else {
            /*self._deleteUserChannelActivity();*/
            var url = '/tv-channels/' + channelID + '/link';
            result = this._sendDataRecieveRequest(url);
            result.then(function () {
                self._updateUserChannelActivity(channelID);
            })
        }

        return result.promise();
    };
}
