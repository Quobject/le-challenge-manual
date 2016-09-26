'use strict';

var Challenge = module.exports;
var myDefaults;
var Client = require('ftp');
var path = require('path');
var osTmpdir = require('os-tmpdir');
var fs = require('fs');

Challenge.create = function (defaults) {
  myDefaults = defaults;
  return  {
    getOptions: function () {
      return defaults;
    }
  , set: Challenge.set
  , get: Challenge.get
  , remove: Challenge.remove
  };
};

// Show the user the token and key and wait for them to be ready to continue
Challenge.set = function (args, domain, token, secret, cb) {
  console.info("myDefaults = ", myDefaults);
  console.info("");
  console.info("Challenge for '" + domain + "'");
  console.info("");
  console.info("We now present (for you copy-and-paste pleasure) your ACME Challenge");
  console.info("public Token and secret Key, in that order, respectively:");
  console.info(token);
  console.info(secret);
  console.info("");
  //console.info(JSON.stringify({
  //  domain: domain
  //, token: token
  //, key: secret
  //}, null, '  ').replace(/^/gm, '\t'));
  //console.info("");
  var localPath = path.join(osTmpdir(), token);
  var remotePath = path.join(myDefaults.ftpFilepathRemoteroot, token);

  console.log(`localPath ${localPath}`);
  console.log(`remotePath ${remotePath}`);

  fs.writeFileSync(localPath, secret);



  var c = new Client();
  c.on('ready', function () {
    c.put(localPath, remotePath, function (err) {
      if (err) throw err;
      c.end();

      console.info("hit enter to continue...");
      process.stdin.resume();
      process.stdin.on('data', function () {
        process.stdin.pause();
        cb(null);
      });


    });
  }); 
  c.connect({
    host: myDefaults.ftpUrl,
    user: myDefaults.ftpUsername,
    password: myDefaults.ftpPassword
  });


  



};

// nothing to do here, that's why it's manual
Challenge.get = function (args, domain, token, cb) {
  console.log('Challenge.get called');
  cb(null);
};

// might as well tell the user that whatever they were setting up has been checked
Challenge.remove = function (args, domain, token, cb) {
  console.info("Challenge for '" + domain + "' complete.");
  console.info("");
  cb(null);
};
