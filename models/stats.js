var mongoose = require('mongoose');
var Schema = mongoose.Schema;

statsSchema = new mongoose.Schema({

    _id: Number,
    companyName: String,
    recruited: Number,
    required: Number,
    left: Number
}),
Stats = mongoose.model('Stats', statsSchema);

module.exports = Stats;