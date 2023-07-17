var mongoose = require('mongoose');
var Schema = mongoose.Schema;

clientSchema = new Schema( {
	
	unique_id: Number,
	email: String,
	// username: String,
	password: String,
	confirm_password: String,
	company_name: String,
	token:String
}),
Client = mongoose.model('CLient', clientSchema);

module.exports = Client;