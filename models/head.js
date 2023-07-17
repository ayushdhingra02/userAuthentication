var mongoose = require('mongoose');
var Schema = mongoose.Schema;

headSchema = new Schema( {
	
	unique_id: Number,
	email: String,
	// username: String,
	password: String,
	confirm_password: String
}),
Head = mongoose.model('Head', headSchema);

module.exports = Head;