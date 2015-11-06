// load required packages
var Contract = require('../models/contract');
var Ruleset = require('../models/ruleset');
var crypto = require('crypto');

// create endpoint for /contract/123 for all methods
exports.findContract = function(req, res, next) {
	console.log(req.params.id);
	Contract.findById(req.params.id, function(err, contract) {
		if (err) {
			res.send(err);
		} else if (!contract) {
			res.status(404).end()
		} else {
			req.contract = contract;
			next();
		}
	});
};

// create endpoint for /users/123/contracts/abc for HEAD
exports.headContract = function(req, res) {
	// contract earlier retrieved during allContract step
	if (!req.headers['if-modified-since'] || req.contract.lastUpdate > req.headers['if-modified-since']) {
		res.send();
	} else {
		res.status(304).end()
	}
};

// create endpoint for /contract/ for POST
exports.postContract = function(req, res) {
	console.log('http POST for Contract called with ' + JSON.stringify(req.body));
	var contract = new Contract(req.body);
	contract.save(function(err) {
		if (err) {
			res.send(err);
		} else {
			res.json(contract);
		}
	});
};

// create endpoint for /contract/123 for GET
exports.getContract = function(req, res) {
	// return contract if no if-modified-since header, or contract has been modified since
	if (!req.headers['if-modified-since'] || req.contract.updated > req.headers['if-modified-since']) {
		res.json(req.contract);
	} else {
		res.status(304).end()
	}
};

// create endpoint for /contract/123 for GET
exports.listContract = function(req, res) {
	Contract.find({}, function(err, result) {
		if (err) {
			res.send(err);
		} else {
			res.json(result);
		}
	});
};

// create mutation of contract based on transaction invocation
exports.postTransaction = function(req, res) {
	Ruleset.findById(req.contract.payload.rulesetId, function(err, ruleset) {
		// first validate that the ruleset hasn't changed, compared to the current state ruleset hash
		var rulesHash = crypto.createHash('sha1');
		rulesHash.update(JSON.stringify(ruleset));
		var rulesHashCalc = rulesHash.digest('base64');
		console.log(rulesHashCalc);
		if (rulesHashCalc == req.contract.payload.rulesetHash) {
			// build the function to execute
			var transitionFunction = new Function('state', 'params', ruleset.rules[req.params.funcName]);
			var newContract = new Contract({payload: {}});
			// set payload first
			newContract.payload.prevPayloadHash = req.contract.payloadHash;
			newContract.payload.rulesetId = req.contract.payload.rulesetId;
			newContract.payload.rulesetHash = req.contract.payload.rulesetHash;
			// construct the transaction
			newContract.payload.transaction = {
				functionName: req.params.funcName,
				params: req.body,
				txnTimestamp: Date.now()
			};
			// calculate txnHash - in reality this would be done by sender, then signed
			var txnHash = crypto.createHash('sha1');
			txnHash.update(JSON.stringify(newContract.payload.transaction));
			newContract.payload.txnHash = txnHash.digest('base64');
			newContract.payload.txnSig = "";
			newContract.payload.txnPubKey = "";
			// calculate target state
			newContract.payload.state = transitionFunction(req.contract.payload.state, req.body);
			// generate payload hash
			var payloadHash = crypto.createHash('sha1');
			payloadHash.update(JSON.stringify(newContract.payload));
			newContract.payload.payloadHash = payloadHash.digest('base64');
			// signature of notary
			newContract.payloadSig = "";
			newContract.save(function(err) {
				if (err) {
					res.send(err);
				} else {
					res.json(newContract);
				}
			});
		} else {
			res.status(500).end();
		}
	});
};

// create endpoint for /contract/123 for DELETE
exports.deleteContract = function(req, res) {
	req.contract.remove(function(err, contract) {
		res.send();
	});
};

// create endpoint for /users/123/contracts/abc for OPTIONS
exports.optionsContract = function(req, res) {
	res.send();
};
