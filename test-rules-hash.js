var crypto = require('crypto');
var fs = require("fs");

var rules = fs.readFileSync("./node_modules/auction-rules.js");
var rulesHash = crypto.createHash('sha1');
rulesHash.update(JSON.stringify(rules));

console.log(rulesHash.digest('base64'));
