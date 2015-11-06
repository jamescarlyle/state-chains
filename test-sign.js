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

var signer = crypto.createSign('sha256');
signer.update('hola');
var sign = signer.sign(privateKey,'base64');

var verifier = crypto.createVerify('sha256');
verifier.update('hola');
var ver = verifier.verify(publicKey, sign,'base64');
console.log(ver);
