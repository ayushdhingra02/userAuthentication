var mongoose = require('mongoose');
var Schema = mongoose.Schema;

applicationSchema = new Schema( {
	
	_id: Number,
    date:Date,
    job_id:Number,
    status:{
        type:String,
        default:"Pending"
    },
    action_data:{
        type:Date,
        default:Date.now()
    },
    candidate_id:Number,
    recruiter_id:Number,
    client_id:Number,
    manager_id:Number
}),
Application = mongoose.model('Application', applicationSchema);

module.exports = Application;