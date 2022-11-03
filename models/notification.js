const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
	status: String,
	patientid: String,
	adminid: String,
	doctorid: String,
	message1: String,
	message2: String,
	message3: String,
	message4: String,
	kind: String,
});

module.exports = mongoose.model("Notification", notificationSchema);
