var fs = require("fs");
var transition = require("transition.js");
var rules = require("auction-rules.js");
var crypto = require('crypto');

var privateKey = '-----BEGIN RSA PRIVATE KEY-----\n'+
'MIICXQIBAAKBgQDCtTEic76GBqUetJ1XXrrWZcxd8vJr2raWRqBjbGpSzLqa3YLv\n'+
'VxVeK49iSlI+5uLX/2WFJdhKAWoqO+03oH4TDSupolzZrwMFSylxGwR5jPmoNHDM\n'+
'S3nnzUkBtdr3NCfq1C34fQV0iUGdlPtJaiiTBQPMt4KUcQ1TaazB8TzhqwIDAQAB\n'+
'AoGAM8WeBP0lwdluelWoKJ0lrPBwgOKilw8W0aqB5y3ir5WEYL1ZnW5YXivS+l2s\n'+
'tNELrEdapSbE9hieNBCvKMViABQXj4DRw5Dgpfz6Hc8XIzoEl68DtxL313EyouZD\n'+
'jOiOGWW5UTBatLh05Fa5rh0FbZn8GsHrA6nhz4Fg2zGzpyECQQDi8rN6qhjEk5If\n'+
'+fOBT+kjHZ/SLrH6OIeAJ+RYstjOfS0bWiM9Wvrhtr7DZkIUA5JNsmeANUGlCrQ2\n'+
'cBJU2cJJAkEA26HyehCmnCkCjit7s8g3MdT0ys5WvrAFO6z3+kCbCAsGS+34EgnF\n'+
'yz8dDdfUYP410R5+9Cs/RkYesqindsvEUwJBALCmQVXFeKnqQ99n60ZIMSwILxKn\n'+
'Dhm6Tp5Obssryt5PSQD1VGC5pHZ0jGAEBIMXlJWtvCprScFxZ3zIFzy8kyECQQDB\n'+
'lUhHVo3DblIWRTVPDNW5Ul5AswW6JSM3qgkXxgHfYPg3zJOuMnbn4cUWAnnq06VT\n'+
'oHF9fPDUW9GK3yRbjNaJAkAB2Al6yY0KUhYLtWoEpQ40HlATbhNel2cn5WNs6Y5F\n'+
'2hedvWdhS/zLzbtbSlOegp00d2/7IBghAfjAc3DE9DZw\n'+
'-----END RSA PRIVATE KEY-----';

var publicKey = '-----BEGIN PUBLIC KEY-----\n'+
'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDCtTEic76GBqUetJ1XXrrWZcxd\n'+
'8vJr2raWRqBjbGpSzLqa3YLvVxVeK49iSlI+5uLX/2WFJdhKAWoqO+03oH4TDSup\n'+
'olzZrwMFSylxGwR5jPmoNHDMS3nnzUkBtdr3NCfq1C34fQV0iUGdlPtJaiiTBQPM\n'+
't4KUcQ1TaazB8TzhqwIDAQAB\n'+
'-----END PUBLIC KEY-----';

// get content from correct state file
var meta = JSON.parse(fs.readFileSync("./auction-meta.json"));
var jws = JSON.parse(fs.readFileSync("./auction-state-" + meta.count + ".json"));
meta.count++;
fs.writeFileSync("./auction-meta.json", JSON.stringify(meta));

// check that the rules match the hash specified in the state
var rulesHash = crypto.createHash('sha1');
var rulesString = JSON.stringify(rules, function(key, value) {
  if (typeof value === 'function') {
    return value.toString();
  } else {
    return value;
  }
})
rulesHash.update(JSON.stringify(rulesString));
if (rulesHash.digest('base64') == jws.payload.rulesHash) {
  // rules are unchanged - continue
  console.log("rules are unchanged - continue processing");
  var sigValid = true;
  // verify previous signature
  if (jws.signature) {
    var verifier = crypto.createVerify('sha256');
    verifier.update(JSON.stringify(jws.payload));
    verifier.verify(publicKey, jws.signature, 'base64');
  }
  // allow transition to next state if signature of previous transition is valid
  if (sigValid) {
    console.log("signature valid");
    // run rules, move state from Sn to Sn+1
    transition.process(rules.registerAuction, jws.payload,
      {
        ownerAddress: "0xabc123",
        auctionName: "Icecream Maker",
        endTime: 123
      }
    );
    // finished processing, write out updated state
    var signer = crypto.createSign('sha256');
    signer.update(JSON.stringify(jws.payload));
    jws.signature = signer.sign(privateKey, 'base64');
    fs.writeFileSync("./auction-state-" + meta.count + ".json", JSON.stringify(jws));
  } else {
    console.log("signature invalid");
  };
} else {
  // rules have been changed
  console.log("rules have changed - don't match hash");
};
