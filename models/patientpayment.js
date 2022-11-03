const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientpaymentSchema = new Schema({
	appointmentid: String,
	date: String,
	amount: String,
	kind: String,
	month: String,
	year: String,
	tax: String,
	refund: String,
});

module.exports = mongoose.model("Patientpayment", patientpaymentSchema);
