var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
	userName: String,
	password: String,
	emailAddress: String,
	token: String,
	frequency: String,
	quantitiy: String,
	type: String,
	fullName: String,
	address: String,
	address2: String,
	city: String,
	state: String,
	zipCode: Number,
	date: String,
	flavor: String,
	smokeLength: String,
	shape: String,
	singlePlan: String,
	partyPlan: String,
	total: Number,
	quantitiy: Number
});

module.exports = mongoose.model('Account', Account);