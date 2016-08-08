/* 
 * Connecting to StalkerPortal libruary
 * Borshchov Dimitriy (grimstal@bigmir.net)
 */

"use strict";

var authData = function () {

    this.tokenType = null;
    this.accessToken = null;
    this.refreshToken = null;
    this.userID = null;
    this.expiresIn = null;

    this.timeLimit = 30; // set in minutes

    this.set = function (data) {

        if (data['token_type']){
            this.tokenType = data['token_type'];
        }

        if (data['access_token']){
            this.accessToken = data['access_token'];
        }

        if (data['refresh_token']){
            this.refreshToken = data['refresh_token'];
        }

        if (data['user_id']){
            this.userID = data['user_id'];
        }

        if (data['expires_in']){
            this.expiresIn = new Date().getTime() + data['expires_in'] * 1000;
        }

        return true;

    }

    this.setTimeLimit = function(minutes){

        if (!minutes){
            return false;
        }

        this.timeLimit = minutes;

    }

    this.isExpire = function (){

        var currentTS = new Date().getTime();
        var checkTS = this.expiresIn - this.timeLimit*60*1000;

        if (currentTS >= checkTS){
            return true;
        }

        return false;

    }

    this.isLogin = function () {

        if (this.expiresIn === null || this.isExpire()) {
            return false;
        }

        return true;

    }
}