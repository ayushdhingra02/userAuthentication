var mongoose = require('mongoose');
var Schema = mongoose.Schema;

candidateSchema = new Schema( {
	
	unique_id: Number,
	email: String,
	// username: String,
	password: String,
	confirm_password: String
}),
Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;