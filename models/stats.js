var mongoose = require('mongoose');
var Schema = mongoose.Schema;

statsSchema = new Schema( {
	
	_id: Number,
    companyName:String,
    recruited:Number,
    required:Number,
    left:Number
}),
Application = mongoose.model('Application', applicationSchema);

module.exports = Application;