var mongoose  = require('mongoose');
var Schema  = mongoose.Schema;
// contract schema
var ContractSchema = new Schema({
	payload: {
    prevPayloadHash: { type: String, unique: true },
		rulesetId: { type: Schema.Types.ObjectId, ref: 'Ruleset' },
		rulesetHash: String,
		transaction: {
			functionName: String,
			params: { type: Schema.Types.Mixed },
			txnTimestamp: Number
		},
		txnHash: String,
		txnSig: String,
		txnPubKey: String,
		state: { type: Schema.Types.Mixed }
  },
	payloadHash: { type: String, unique: true },
	payloadSig: String
}, {
	toJSON: {
		// take the internal _id and represent it externally as "id": left untransformed, mongoose does not ignore _id in PUT body, and mongo complains on save
		transform: function(doc, ret, options) {
			ret.id = ret._id;
			delete ret._id;
		}
	}
});

// exports module for use in Node
module.exports = mongoose.model('Contract', ContractSchema);
