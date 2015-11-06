// load required packages
var Ruleset = require('../models/ruleset');

// create endpoint for /ruleset/123 for all methods
exports.findRuleset = function(req, res, next) {
	console.log(req.params.id);
	Ruleset.findById(req.params.id, function(err, ruleset) {
		if (err) {
			res.send(err);
		} else if (!ruleset) {
			res.status(404).end()
		} else {
			req.ruleset = ruleset;
			next();
		}
	});
};

// create endpoint for /ruleset/ for POST
exports.postRuleset = function(req, res) {
	console.log('http POST for Ruleset called with ' + JSON.stringify(req.body));
	var ruleset = new Ruleset(req.body);
	ruleset.save(function(err) {
		if (err) {
			res.send(err);
		} else {
			res.json(ruleset);
		}
	});
};

// create endpoint for /ruleset/123 for GET
exports.getRuleset = function(req, res) {
	res.json(req.ruleset);
};

// create endpoint for /ruleset/123/exec/1 for GET
exports.execRule = function(req, res) {
	res.json(req.ruleset.rules[req.params.idx].func());
};

// create endpoint for /ruleset/123 for GET
exports.listRuleset = function(req, res) {
	Ruleset.find({}, function(err, result) {
		if (err) {
			res.send(err);
		} else {
			res.json(result);
		}
	});
};

// create endpoint for /ruleset/123 for DELETE
exports.deleteRuleset = function(req, res) {
	req.ruleset.remove(function(err, ruleset) {
		res.send();
	});
};

// create endpoint for /users/123/rulesets/abc for OPTIONS
exports.optionsRuleset = function(req, res) {
	res.send();
};
