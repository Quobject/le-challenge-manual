'use strict';

var Challenge = module.exports;

Challenge.create = function (defaults) {
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
  console.info("");
  console.info("Challenge for '" + domain + "'");
  console.info("");
  console.info("We now present (for you copy-and-paste pleasure) your ACME Challenge");
  console.info("public Token and secret Key, in that order, respectively:");
  console.info(token);
  console.info(secret);
  console.info("");
  console.info(JSON.stringify({
    domain: domain
  , token: token
  , key: secret
  }, null, '  ').replace(/^/gm, '\t'));
  console.info("");
  console.info("hit enter to continue...");
  process.stdin.resume();
  process.stdin.on('data', function () {
    process.stdin.pause();
    cb(null);
  });
};

// nothing to do here, that's why it's manual
Challenge.get = function (args, domain, token, cb) {
  cb(null);
};

// might as well tell the user that whatever they were setting up has been checked
Challenge.remove = function (args, domain, token, cb) {
  console.info("Challenge for '" + domain + "' complete.");
  console.info("");
  cb(null);
};
