const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Allergieschema = new Schema({
	allergyname: String,
	allergyDescription: String,
});

module.exports = mongoose.model("allergies", Allergieschema);
