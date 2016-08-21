var SimpleOauth = require('simple-oauth2');
var Q = require('q');
var request = require('request');

const sfdc_urls = {
	'production': "https://login.salesforce.com",
	'sandbox': "https://test.salesforce.com"
}

function SfdcOauther(instanceType, consumerId, consumerSecret, instanceUrl) {
	this.instanceUrl = instanceUrl;
	this.oauth2 = SimpleOauth({
		clientID: consumerId,
		clientSecret: consumerSecret,
		site: instanceUrl || sfdc_urls[instanceType],
		authorizationPath: '/services/oauth2/authorize',
		tokenPath: '/services/oauth2/token',
		useBasicAuthorizationHeader: true
	});
}

SfdcOauther.prototype = {

	getAuthorizeUrl: function (scope, redirectUrl) {
        return this.oauth2.authCode.authorizeURL({
            scope: scope,
            redirect_uri: redirectUrl
        });
    },

    getAccessToken: function (code, redirectUrl) {
        var deferred = Q.defer();

        this.oauth2.authCode.getToken({
            code: code,
            redirect_uri: redirectUrl
        }, function (error, result) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(result);
            }
        });

        return deferred.promise;
    },

    refreshAccesstoken: function (accessToken, refreshToken, expiresIn) {
        if(expiresIn === undefined) expiresIn = -1;

        var deferred = Q.defer();

        var token = this.oauth2.accessToken.create({
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: expiresIn
        });

        token.refresh(function (error, result) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(result.token);
            }
        });

        return deferred.promise;
    }
}


module.exports = SfdcOauther;
