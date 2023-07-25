var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");



var Job = require('../models/job');
var admin= require('../models/head')


router.get('/user', async (req, res) => {
	// var parameters=req.query.user
	// console.log(parameters);
	console.log("hello");
	let results = await User.find({}) 
	console.log(results)
	res.send(results).status(200);
  });
  router.put('/user', async (req, res) => {
	var parameters=req.body.send
	console.log(parameters);
	console.log("hello");
	const filter={unique_id:parameters.unique_id}
	const options = { upsert: true };
	const updateDoc = {
		$set: parameters
	  };
	  const result = await User.updateOne(filter, updateDoc, options);
	  console.log(
		result.matchedCount+ "document(s) matched the filter, updated" +result.modifiedCount+ "document(s)`"
	  );
	  res.send({"Success":"successfull"})
	// let results = await User.find({})
	// console.log(results)
	// res.send(results).status(200);
  });

  router.post('/user', async (req, res) => {
	var personInfo=req.body.params.user
	console.log(personInfo.username);
	console.log("hello");

	User.findOne({email:personInfo.email,userType:personInfo.userType},function(err,data){
			if(!data){
				var c;
				User.findOne({},function(err,data){
					
					if (data) {
						console.log("if");
						c = data.unique_id + 1;
					}else{
						c=1;
					}
					console.log(c)
					var newPerson = new User({
						unique_id:c,
						username:personInfo.username,
						password:personInfo.password,
						confirm_password:personInfo.password,
						user_position:personInfo.user_position,
						user_location:personInfo.user_location,
						company_name:personInfo.company_name
					});
	
					newPerson.save(function(err, Person){
						if(err)
							console.log(err);
						else
							console.log('Success');
					});
	
				}).sort({_id: -1}).limit(1);
				console.log("Success:You are regestered,You can login now.")
				res.send({"Success":"You are regestered,You can login now."});
			}else{
				console.log("Email is already used..")
				res.send({"Success":"Email is already used."});
			}
		})
	// const filter={unique_id:parameters.unique_id}
	// const options = { upsert: true };
	// const updateDoc = {
	// 	$set: parameters
	//   };
	//   const result = await User.updateOne(filter, updateDoc, options);
	//   console.log(
	// 	result.matchedCount+ "document(s) matched the filter, updated" +result.modifiedCount+ "document(s)`"
	//   );
	//   res.send({"Success":"successfull"})
	// let results = await User.find({}) 
	// console.log(results)
	// res.send(results).status(200);
  });

  router.post('/jobcreation', function(req, res, next) {
	// console.log(req.body);
	var jobInfo = req.body.form;
	console.log(jobInfo);
	
	if(!jobInfo.jobTitle || !jobInfo.companyName || !jobInfo.jobLocation){
		res.send({"Success":"fill the required fields"});
	} else {
		Job.findOne({companyName:jobInfo.companyName,jobTitle:jobInfo.jobTitle,jobLocation:jobInfo.jobLocation,jobType:jobInfo.jobType,jobDescription:jobInfo.jobDescription},function(err,data){
			if(!data){
				var c;
				Job.findOne({},function(err,data){
					
					if (data) {
						console.log("if");
						c = data.unique_id + 1;
					}else{
						c=1;
					}

					var newPerson = new Job({
						unique_id:c,
						companyName: jobInfo.companyName,
						jobTitle:jobInfo.jobTitle,
						jobLocation:jobInfo.jobLocation,
						jobType:jobInfo.jobtype,
						jobDescription:jobInfo.jobDescription
					});

					newPerson.save(function(err, Person){
						if(err)
							console.log(err);
						else
							console.log('Success');
					});

				}).sort({_id: -1}).limit(1);
				console.log("Success:Job has been created.")
				res.send({"Success":"Job has been created."});
			}else{
				console.log("Job already exist")
				res.send({"Success":"Job already exist"});
			}
			
		});
	}
});


router.get("/Jobs", async (req, res) => {
	var parameters=req.query.user
	console.log(parameters);
	console.log("hello");
	let results = await Job.find({}) 
	console.log(results)
	res.send(results).status(200);
  });
  router.put("/Jobs", async (req, res) => {
	var parameters=req.body.send
	console.log(req.body.send);
	console.log("hello");
	const filter={unique_id:parameters.unique_id}
	const options = { upsert: true };
	const updateDoc = {
		$set: parameters
	  };
	  const result = await Job.updateOne(filter, updateDoc, options);
	  console.log(
		result.matchedCount+ "document(s) matched the filter, updated" +result.modifiedCount+ "document(s)`"
	  );
	  res.send({"Success":"successfull"})

	// let results = await Job.update({}) 
	// console.log(results)
	// res.send(results).status(200);
  });
  router.delete("/Jobs", async (req, res) => {
	var parameters=req
	console.log(req.query);
	console.log("hello");
	const filter=req.query
	// const options = { upsert: true };
	  const result = await Job.deleteOne(filter);
	//   console.log(
	// 	result.matchedCount+ "document(s) matched the filter, updated" +result.modifiedCount+ "document(s)`"
	//   );
	  res.send({"Success":"successfull"})

	// let results = await Job.update({}) 
	// console.log(results)
	// res.send(results).status(200);
  });

router.get('/profile', async function (req, res, next) {
	console.log("profile");
	await Head.findOne({unique_id:req.query.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.send({"Success":"Profile Not found"})
		}else{
			//console.log("found");
			res.send(data)
		}
	});
});

module.exports = router;