const mongoose = require('mongoose');
const Schema = mongoose.Schema

const treatmenttypeSchema = new Schema({
    treatmenttype: String,
    bodyarea: String,
}, { collection: 'treatmenttype' });

module.exports = mongoose.model('treatmenttype', treatmenttypeSchema);