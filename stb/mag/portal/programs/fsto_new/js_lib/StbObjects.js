/* 
 * Connecting to StalkerPortal library
 * Borshchov Dimitriy (grimstal@bigmir.net)
 */

"use strict";

function authObject() {

    this.tokenType = null;
    this.accessToken = null;
    this.refreshToken = null;
    this.userID = null;
    this.expiresIn = null;

    this.timeLimit = 30; // set in minutes

    this.set = function (data) {

        if (data['token_type']) {
            this.tokenType = data['token_type'];
        }

        if (data['access_token']) {
            this.accessToken = data['access_token'];
        }

        if (data['refresh_token']) {
            this.refreshToken = data['refresh_token'];
        }

        if (data['user_id']) {
            this.userID = data['user_id'];
        }

        if (data['expires_in']) {
            this.expiresIn = new Date().getTime() + data['expires_in'] * 1000;
        }

        return true;

    };

    this.clear = function(){
        this.tokenType = null;
        this.accessToken = null;
        this.refreshToken = null;
        this.userID = null;
        this.expiresIn = null;
    };

    this.setTimeLimit = function (minutes) {

        if (!minutes) {
            return false;
        }

        this.timeLimit = minutes;

    };

    this.isExpire = function () {

        var currentTS = new Date().getTime();
        var checkTS = this.expiresIn - this.timeLimit * 60 * 1000;

        if (currentTS >= checkTS) {
            return true;
        }

        return false;

    };

    this.isLogin = function () {

        if (this.expiresIn === null || this.isExpire()) {
            return false;
        }

        return true;

    };
};

function initObject() {
    this.mac = '';
    this.M3U_url = '';
    this.EPG_url = '';
    this.login = '';
    this.password = '';

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

        this.mac = temp[0];

        return true;
    };

    this.setM3U = function (url) {
        //var urlExp = /.+\.m3u/;
        if (!url) {//|| !urlExp.exec(url)){
            return false;
        }
        this.M3U_url = url;
        return true;
    };

    this.setEPG = function (url) {
        //var urlExp = /.+\.xml/;
        if (!url) {//|| !urlExp.exec(url)){
            return false;
        }
        this.EPG_url = url;
        return true;
    };

    this.setLogin = function (login) {
        var loginExp = /^[0-9a-zA-Z\-_\.@!]+$/;
        if (!login || !loginExp.exec(login)) {
            return false;
        }
        this.login = login;
        return true;
    };

    this.setPassword = function (password) {
        var passwordExp = /^[0-9a-zA-Z\-_\.@!]*$/;
        if (!password || !passwordExp.exec(password)) {
            return false;
        }
        this.password = password;
        return true;
    };
};

function requestParams() {
    this.restMethod;
    this.url;
    this.dataType;
    this.data;
    this.crossDomain;
    this.headers;
    this.timeout = 5000;
    this.successFunction = function () {};
    this.errorFunction = function () {};

    this.setRequest = function (restMethod, url, successFunction, errorFunction) {
        if (!restMethod || !url ||
                (!successFunction || typeof successFunction != 'function') ||
                (!errorFunction || typeof errorFunction != 'function')) {
            return false;
        }

        this.restMethod = restMethod;
        this.url = url;
        this.successFunction = successFunction;
        this.errorFunction = errorFunction;

        return true;
    };

    this.setCrossDomain = function (boolean) {
        if (!boolean) {
            return false;
        }
        this.crossDomain = boolean;
        return true;
    };

    this.setDataType = function (string) {
        if (!string) {
            return false;
        }
        this.dataType = string;
        return true;
    };

    this.setData = function (object) {
        if (!object) {
            return false;
        }
        this.data = object;
        return true;
    };

    this.setHeaders = function (object) {
        if (!object) {
            return false;
        }
        this.headers = object;
        return true;
    };

    this.setTimeout = function (int) {
        if (!int) {
            return false;
        }
        this.timeout = int;
        return true;
    };
};

