const mongoose = require('mongoose');
const Schema = mongoose.Schema

const bodymasterSchema = new Schema({
   bodyarea: String,
   bodydexcription: String,
   path: String
}, { collection: 'bodymaster' });

module.exports = mongoose.model('bodymaster', bodymasterSchema);