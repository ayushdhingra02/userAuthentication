var mongoose = require('mongoose');
var Schema = mongoose.Schema;

jobSchema = new Schema( {
	
	unique_id: Number,
	jobTitle: String,
	companyName: String,
	jobDescription: String,
	jobLocation: String,
	jobType: String,
	recruiter_id: Number,
	manager_id: Number,
	client_id: Number,
	open_positions: Number,
	creation_date: {
		type: Date,
		default: Date.now
	},
	closing_date:{
		type:Date
	},
	status: {
		type: String,
		default: 'open'
	}
	// username: String,
	// password: String,
	// confirm_password: String
}),
Job = mongoose.model('Job', jobSchema);

module.exports = Job;