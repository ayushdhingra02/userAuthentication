var mongoose = require('mongoose');
var Schema = mongoose.Schema;

managerSchema = new Schema( {
	
	unique_id: Number,
	recruiter_ids:[]
}),
Manager = mongoose.model('Manager', managerSchema);

module.exports = Manager;