const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
	name: String,
	description: String,
	details: String,
	amount: String,
	bottom_line: String,
	active: Boolean,
});

module.exports = mongoose.model("subscriptions", SubscriptionSchema);
