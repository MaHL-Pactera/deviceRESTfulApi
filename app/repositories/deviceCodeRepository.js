const userDeviceInfo = require("../models/userDeviceInfo");
var adal = require('adal-node');
let currentId = 0;
var sampleParameters;
    sampleParameters = {
      tenant:"3c33e967-6bae-43fb-80f8-83d093bd41ed",
      authorityHostUrl: "https://login.microsoftonline.com/common",
      clientId: "4b3b5ce3-c09f-49e4-9cd8-1a8b7e70b28b",
      clientSecret: "TW=[oCF8Bg.yY:etFraZUsS74kHww9:d",
      resource: "00000002-0000-0000-c000-000000000000"
    };
const resource2 = "https://graph.microsoft.com"; //URI of resource where token is valid
class deviceCodeRepository {
  constructor(req, res) {
  }

  async getDeviceCode(req, res) {
    
    try {
      var authorityUrl = sampleParameters.authorityHostUrl + '/' + sampleParameters.tenant;
      var context = new adal.AuthenticationContext(authorityUrl, null);
      context.acquireUserCode(sampleParameters.resource, sampleParameters.clientId, 'es-mx', function (err, response) {
        if (err) {
          console.log('well that didn\'t work: ' + err.stack);
          res.json(err);
        } else {
          console.log(response);
          res.json(response);
        }
      });
    } catch (err) {
      req.flash('error_msg', {
        message: 'Could not get access token. Try signing out and signing in again.',
        debug: JSON.stringify(err)
      });
    }
  }

  async postDeviceCode(req, res) {
    sampleParameters = req.body;
    res.end();
  }

  async getToken(req, res) {
    var authorityUrl = sampleParameters.authorityHostUrl + '/' + sampleParameters.tenant;

    var context = new adal.AuthenticationContext(authorityUrl, null);
    context.acquireTokenWithDeviceCode(sampleParameters.resource, sampleParameters.clientId, req.body, function (err, tokenResponse) {
        if (err) {
            console.log(err);
            req.flash('error_msg', {
                message: 'Could not get access token. Try signing out and signing in again.',
                debug: JSON.stringify(err)
              });
        }
        else {
          context.acquireTokenWithClientCredentials(
            resource2,
            sampleParameters.clientId,
            sampleParameters.clientSecret,
            function (err, tokenResponse) {
                if (err) {
                  console.log(err);
                  req.flash('error_msg', {
                      message: 'Could not get access token. Try signing out and signing in again.',
                      debug: JSON.stringify(err)
                    });
                } else {
                  console.log(tokenResponse);
                  res.json(tokenResponse);
                }
            });
        }
    });
  }

  async getTokenWithRefreshToken(req, res) {
    var authorityUrl = sampleParameters.authorityHostUrl + '/' + sampleParameters.tenant;
    var context = new adal.AuthenticationContext(authorityUrl, null);
    context.acquireTokenWithRefreshToken(req.body.refreshToken, sampleParameters.clientId, null, function(err, tokenResponse) {
      if (err) {
        console.log(err);
        req.flash('error_msg', {
            message: 'Could not get access token. Try signing out and signing in again.',
            debug: JSON.stringify(err)
          });
      } else {
        console.log(tokenResponse);
        res.json(tokenResponse);
      }
    });
  }
}
module.exports = new deviceCodeRepository();