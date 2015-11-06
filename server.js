var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var mongodb_url = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://127.0.0.1:27017/';

var db_name = 'state-chains';

// load required packages
var express = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var crypto = require("crypto");

var contractCtlr = require('./controllers/contract');
var rulesetCtlr = require('./controllers/ruleset');

// connect to database
mongoose.connect(mongodb_url + db_name);

// create express application
var app = express();
app.use(bodyParser.json());
var router = express.Router();

// get ruleset by ID - GET, DELETE
router.route('/ruleset/:id')
.get(rulesetCtlr.findRuleset, rulesetCtlr.getRuleset)
.delete(rulesetCtlr.findRuleset, rulesetCtlr.deleteRuleset)
;

// create ruleset and list all
router.route('/ruleset/')
.get(rulesetCtlr.listRuleset)
.post(rulesetCtlr.postRuleset)
;

// get contract by ID - GET, DELETE, POST transaction,
router.route('/contract/:id')
.get(contractCtlr.findContract, contractCtlr.getContract)
.delete(contractCtlr.findContract, contractCtlr.deleteContract)
;

// create contract
router.route('/contract/')
.get(contractCtlr.listContract)
.post(contractCtlr.postContract)
;

// get contract and post transaction
router.route('/contract/:id/transaction/:funcName')
.post(contractCtlr.findContract, contractCtlr.postTransaction)
;

app.use('/', router);
app.listen(server_port, server_ip_address, function() {
	console.log("Listening on " + server_ip_address + ", server_port is " + server_port)
});
