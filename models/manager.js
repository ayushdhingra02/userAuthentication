var mongoose = require('mongoose');
// var Notification= require('./notification');
var Schema = mongoose.Schema;
var Notification = new Schema( {
	
	_id: Number,
    message:String,
});


managerSchema = new Schema( {
	
	unique_id: Number,
	manager_id:Number,
	email: String,
	username: String,
	zone: String,
	state: String,
	notifications: [Notification],
	recruiter_ids:{
		type:Array,
	}
}),
Manager = mongoose.model('Manager', managerSchema);

module.exports = Manager;