const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
	line1: String,
	line2: String,
	towncity: String,
	postcode: String,
	state: String,
	country: String,
});
const businessSchema = new Schema({
	btype: String,
	name: String,
	bio: String,
	location: [locationSchema],
	website: String,
	bavatar: String,
	noofemployees: String,
});
const verificationSchema = new Schema({
	idv: Array,
	ml: Array,
	od: Array,
	mi: Array,
	ev: Array,
});
const aeUserSchema = new Schema({
	email: String,
	firstName: String,
	lastName: String,
	title: String,
	primaryTelephone: String,
	countryCode: String,
	clinicname: String,
	business: [businessSchema],
	gender: String,
	avatar: String,
	notifyme: Boolean,
	dob: Date,
	bio1: String,
	bio2: String,
	verification: [verificationSchema],
	payment: String,
	plan: String,
	source: String,
	isadmin: Boolean,
	complete: String,
	step: String,
	currentstep: String,
	prevstep: String,
	createdate: Date,
	updatedate: Date,
	createuser: String,
	updateuser: String,
	password: String,
});

module.exports = mongoose.model("Aesthetik_user", aeUserSchema);
