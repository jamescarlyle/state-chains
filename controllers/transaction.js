// load required packages
var Transaction = require('../models/transaction');

// create endpoint for /transaction/123 for all methods
exports.findTransaction = function(req, res, next) {
	console.log(req.params.id);
	Transaction.findById(req.params.id, function(err, transaction) {
		if (err) {
			res.send(err);
		} else if (!transaction) {
			res.status(404).end()
		} else {
			req.transaction = transaction;
			next();
		}
	});
};

// create endpoint for /transaction/ for POST
exports.postTransaction = function(req, res) {
	console.log('http POST for Transaction called with ' + JSON.stringify(req.body));
	var transaction = new Transaction(req.body);
	transaction.save(function(err) {
		if (err) {
			res.send(err);
		} else {
			res.json(transaction);
		}
	});
};

// create endpoint for /transaction/123 for GET
exports.getTransaction = function(req, res) {
	res.json(req.transaction);
};

// create endpoint for /transaction/123/1 for GET
exports.execRule = function(req, res) {
	res.json(req.transaction.rules[req.params.idx].func());
};

// create endpoint for /transaction/123 for GET
exports.listTransaction = function(req, res) {
	Transaction.find({}, function(err, result) {
		if (err) {
			res.send(err);
		} else {
			res.json(result);
		}
	});
};

// create endpoint for /transaction/123 for DELETE
exports.deleteTransaction = function(req, res) {
	req.transaction.remove(function(err, transaction) {
		res.send();
	});
};

// create endpoint for /users/123/transactions/abc for OPTIONS
exports.optionsTransaction = function(req, res) {
	res.send();
};
