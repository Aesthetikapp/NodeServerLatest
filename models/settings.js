const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const generalSchema = new Schema({
	language: String,
	country: String,
	dateformat: String,
	timeformat: String,
	timezone: String,
	status: Boolean,
});

const calendarSchema = new Schema({
	sameeveryday: Boolean,
	days: String,
	addlatefee: Boolean,
	latefeesamount: String,
	latefeesfrom: String,
	weekends: Boolean,
	declinedappoinments: Boolean,
	shorterappoinments: Boolean,
	startsweek: String,
	status: Boolean,
});

const appointmentSchema = new Schema({
	radius: String,
	interval: String,
	autoacceptbooking: Boolean,
	autoacceptconsult: Boolean,
	status: Boolean,
});

const notificationSchema = new Schema({
	d_request_approval: Boolean,
	d_apt_activity: Boolean,
	d_conslt_request: Boolean,
	d_new_message: Boolean,
	e_request_approval: Boolean,
	e_apt_activity: Boolean,
	e_conslt_request: Boolean,
	e_new_message: Boolean,
	status: Boolean,
});

const subscriptionSchema = new Schema({
	subscription_id: String,
	date: String,
	enable: Boolean,
	status: Boolean,
});

const SettingsSchema = new Schema({
	userid: String,
	general: [generalSchema],
	calendar: [calendarSchema],
	appointment: [appointmentSchema],
	notification: [notificationSchema],
	subscription: [subscriptionSchema],
});

module.exports = mongoose.model("User_settings", SettingsSchema);
