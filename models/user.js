var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Stats = require('./stats');
const Notification = require('./notification');
const notificationSchema = Notification.schema;

const schema = Stats.schema;
const subSchema = new mongoose.Schema({
	application_id:Number,
	job_id:Number,
	company_name:String,
	
  });
  
userSchema = new Schema( {
	
	unique_id: Number,
	email: String,
	username: String,
	password: String,
	confirm_password: String,
	user_position: String,
	user_location: String,
	pincode: Number,
	city:String,
	state:String,
	zone:String,
	company_name: String,
	number: String,
	date_of_joining: String,
	token:String,
	application:{
		type: schema,
		default: {}
	  },
	notifications:[notificationSchema]
}),
User = mongoose.model('User', userSchema);

module.exports = User;	

// unique_id:c,
// username:personInfo.username,
// password:personInfo.password,
// confirm_password:personInfo.password,
// user_position:personInfo.user_position,
// user_location:personInfo.user_location,
// company_name:personInfo.company_nameUser.findOne({email:personInfo.email,userType:"candidate"},function(err,data){
	// 	if(!data){
	// 		var c;
	// 		User.findOne({},function(err,data){
				
	// 			if (data) {
	// 				console.log("if");
	// 				c = data.unique_id + 1;
	// 			}else{
	// 				c=1;
	// 			}
	// 			console.log(c)
	// 			var newPerson = new User({
	// 				unique_id:int(c),
	// 				username:personInfo.username,
	// 				password:personInfo.password,
	// 				confirm_password:personInfo.password,
	// 				user_position:personInfo.user_position,
	// 				user_location:personInfo.user_location,
	// 				company_name:personInfo.company_name
	// 			});

	// 			newPerson.save(function(err, Person){
	// 				if(err)
	// 					console.log(err);
	// 				else
	// 					console.log('Success');
	// 			});

	// 		}).sort({_id: -1}).limit(1);
	// 		console.log("Success:You are regestered,You can login now.")
	// 		res.send({"Success":"You are regestered,You can login now."});
	// 	}else{
	// 		console.log("Email is already used..")
	// 		res.send({"Success":"Email is already used."});
	// 	}
		
	// });