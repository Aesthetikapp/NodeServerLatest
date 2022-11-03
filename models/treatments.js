const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const globaltreatmentsSchema = new Schema(
	{
		treatmenttype: String,
		bodyarea: String,
		treatmentname: String,
		syringemin: String,
		syringemax: String,
		duration: String,
		description: String,
		quantitysold: String,
		quantityavailable: String,
		pricepersyring: String,
		sellingprice: String,
		advancedsetting: String,
		defaultdisclosure: String,
		customdisclosure: String,
		photo1: String,
		photo2: String,
		video: String,
		assigneddoctors: Array,
		active: String,
		userid: String,
		createdate: String,
		updatedate: String,
	},
	{ collection: "globaltreatments" }
);

module.exports = mongoose.model("globaltreatments", globaltreatmentsSchema);
