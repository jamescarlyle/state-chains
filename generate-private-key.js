var jsjws = require('jsjws');
var privateKey = jsjws.generatePrivateKey(2048, 65537);
console.log(privateKey);
