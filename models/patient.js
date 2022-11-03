const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
	line1: String,
	line2: String,
	towncity: String,
	postcode: String,
	state: String,
	country: String,
	location: String,
	isactive: Boolean,
});

const PatientSchema = new Schema({
	firstName: String,
	lastName: String,
	avatar: String,
	email: String,
	phone: String,
	allergies: String,
	scannedimages: String,
	payment: String,
	dob: Date,
	gender: String,
	password: String,
	favourites: String,
	address: [addressSchema],
	address1: [addressSchema],
	address2: [addressSchema],
	address3: [addressSchema],
});

module.exports = mongoose.model("Patient_user", PatientSchema);
