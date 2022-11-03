const mongoose = require('mongoose');
const Schema = mongoose.Schema

const personSchema = new Schema({
    firstName: String,
	lastName: String
})

module.exports = mongoose.model('Person',personSchema);