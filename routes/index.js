var express = require('express');
var Job = require('../models/job');
var User = require('../models/user');
var Application = require('../models/application');
var Manager = require('../models/manager');
var Stats = require('../models/stats');
var router = express.Router();
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

router.get('/applicants', async function(req  , res , next){
	console.log(req.query)

	result=await Application.find({job_id:req.query.job_id,status:"pending"})
	console.log(result)
	res.send(result)

})
router.post('/applicants', async function(req  , res , next){
	console.log(req.body.params)
	var filter= {_id:req.body.params._id}
	var update={ status:req.body.params.status
	}
	result=await Application.updateOne(filter,update)
	console.log(result)
	// res.send(result)

})

router.put('/:userType/profile', async function (req, res, next) {
	console.log("profile");
	var userType=req.params.userType
	
	var parameters=req.body.params
	console.log(req.body.params);
	console.log("hello");
	const filter={unique_id:parameters.unique_id}
	// const options = { upsert: true };
	const updateDoc = {
		$set: parameters
	  };
	const result = await Head.updateOne(filter, updateDoc);
	  console.log(
		result.matchedCount+ "document(s) matched the filter, updated" +result.modifiedCount+ "document(s)`"
	  );
	  res.send({"Success":"successfull"})

	// await Head.findOne({unique_id:req.query.userId},function(err,data){
	// 	console.log("data");
	// 	console.log(data);
	// 	if(!data){
	// 		res.send({"Success":"Profile Not found"})
	// 	}else{
	// 		//console.log("found");
	// 		res.send(data)
	// 	}
	// });
});

router.get('/:userType/user', async (req, res) => {
	var userType=req.params.userType
	// console.log(parameters);
	console.log("hello");
	if(userType==="admin"){
	let results = await User.find({}) 
	console.log(results)
	res.send(results).status(200);
	}
	else if(userType==="recruiter"){
		let results = await User.find({user_position:"candidate"}) 
	console.log(results)
	res.send(results).status(200);
	}
  });
  router.put('/:userType/user', async (req, res) => {
	  var userType=req.params.userType
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

  router.post('/:userType/user', async (req, res) => {
	var userType=req.params.userType
	var personInfo=req.body.params.user
	console.log(personInfo.username);
	console.log("hello");

	User.findOne({email:personInfo.email,userType:personInfo.userType},function(err,data){
			if(!data){
				var c;
				User.findOne({},async function(err,data){
					
					if (data) {
						console.log("if");
						c = data.unique_id + 1;
					}else{
						c=1;
					}
					const encryptedPassword = await bcrypt.hash(personInfo.password, 10);
					console.log(c)
					var newPerson = new User({
						unique_id:c,
						email:personInfo.email,
						username:personInfo.username,
						password:encryptedPassword,
						confirm_password:encryptedPassword,
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


  router.get('/manager/user', async (req, res) => {
	var parameters=req.query
	
	var filter=[]
	filter=await Manager.find({unique_id:1})
	// var filter=[1,2,3]
	filter=filter[0].recruiter_ids
	console.log(filter[0].recruiter_ids)
	// console.log("hello");
	console.log(filter);
	let results = await User.find({ 'unique_id': { $in: filter } }) 
	console.log(results)
	res.send(results).status(200);
  });
  router.put('/manager/user', async (req, res) => {
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

router.post('/:userType/jobcreation', function(req, res, next) {
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
						jobDescription:jobInfo.jobDescription,
						open_positions:jobInfo.open_positions
					});

					newPerson.save(function(err, Person){
						if(err)
							console.log(err);
						else
							console.log('Success');
					});

				}).sort({_id: -1}).limit(1);

				Stats.findOne({companyName:jobInfo.companyName},function(err,data){
					if(!data){
						var c;
						Stats.findOne({},function(err,data){
							
							if (data) {
								console.log("if");
								c = data.unique_id + 1;
							}else{
								c=1;
							}
		
							var newPerson = new Job({
								unique_id:c,
								companyName: jobInfo.companyName,
								recruited:0,
								required:jobInfo.open_positions,
								left:jobInfo.open_positions,
							});
		
							newPerson.save(function(err, Person){
								if(err)
									console.log(err);
								else
									console.log('Success');
							});
		
						}).sort({_id: -1}).limit(1);
						// console.log("Success:Job has been created.")
						// res.send({"Success":"Job has been created."});
					}else{
						Stats.updateOne({companyName:jobInfo.companyName},{$inc:{required:jobInfo.open_positions}})
					}
					
				});
				console.log("Success:Job has been created.")
				res.send({"Success":"Job has been created."});
			}else{
				console.log("Job already exist")
				res.send({"Success":"Job already exist"});
			}
			
		});
	

	
		
	}
});


router.get("/:userType/Jobs", async (req, res) => {
	var userType=req.params.userType
	var parameters=req.query.user
	console.log(parameters);
	console.log("hello");
	let results = await Job.find({}) 
	console.log(results)
	res.send(results).status(200);
  });
  router.put("/:userType/Jobs", async (req, res) => {
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
  router.delete("/:userType/Jobs", async (req, res) => {
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

router.get('/:userType/profile', async function (req, res, next) {
	console.log("profile");
	const userType=req.params.userType
	if(userType==='admin'){
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

	}
	else{
		await User.findOne({unique_id:req.query.userId},function(err,data){
			console.log("data");
			console.log(data);
			if(!data){
				res.send({"Success":"Profile Not found"})
			}else{
				//console.log("found");
				res.send(data)
			}
		});

	}
	
	
});
router.get('/manager/profile', async function (req, res, next) {
	console.log("profile");
	await User.findOne({unique_id:req.query.userId},function(err,data){
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

router.put('/manager/profile', async function (req, res, next) {
	console.log("profile");
	
	var parameters=req.body.params
	console.log(req.body.params);
	console.log("hello");
	const filter={unique_id:parameters.unique_id,user_position:'client' }
	// const options = { upsert: true };
	const updateDoc = {
		$set: parameters
	  };
	const result = await User.updateOne(filter, updateDoc);
	  console.log(
		result.matchedCount+ "document(s) matched the filter, updated" +result.modifiedCount+ "document(s)`"
	  );
	  res.send({"Success":"successfull"})
});
router.get('/client/profile', async function (req, res, next) {
	console.log("profile");
	await User.findOne({unique_id:req.query.userId, user_position:'client'},function(err,data){
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
router.put('/client/profile', async function (req, res, next) {
	console.log("profile");
	
	var parameters=req.body.params
	console.log(req.body.params);
	console.log("hello");
	const filter={unique_id:parameters.unique_id,user_position:'client' }
	// const options = { upsert: true };
	const updateDoc = {
		$set: parameters
	  };
	const result = await User.updateOne(filter, updateDoc);
	  console.log(
		result.matchedCount+ "document(s) matched the filter, updated" +result.modifiedCount+ "document(s)`"
	  );
	  res.send({"Success":"successfull"})

	// await Head.findOne({unique_id:req.query.userId},function(err,data){
	// 	console.log("data");
	// 	console.log(data);
	// 	if(!data){
	// 		res.send({"Success":"Profile Not found"})
	// 	}else{
	// 		//console.log("found");
	// 		res.send(data)
	// 	}
	// });
});


router.post('/client/jobcreation', function(req, res, next) {
	// console.log(req.body);
	var jobInfo = req.body.form;
	console.log(jobInfo);
	
	if(!jobInfo.jobTitle || !jobInfo.companyName || !jobInfo.jobLocation){
		res.send({"Success":"fill the required fields"});
	} else {
		Job.findOne({companyName:jobInfo.companyName,jobTitle:jobInfo.jobTitle,jobLocation:jobInfo.jobLocation,jobType:jobInfo.jobType},function(err,data){
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
router.post("/addApplication", async (req, res) => {
	query=req.body.params
	console.log(query.unique_id)
	job_id=query.job_id.unique_id
	results = await Job.updateOne({unique_id:job_id},{
		$inc: {
			number_of_applicants: 1
		}
	,$push : {
		applicants:query.unique_id
	}
	})
	results=await Job.findOne({unique_id:job_id})
	console.log(results)

	Application.findOne({job_id:job_id,candidate_id:query.unique_id},function(err,data){
		if(!data){
			var c;
			Application.findOne({},function(err,data){
				
				if (data) {
					console.log("if");
					c = data._id + 1;
				}else{
					c=1;
				}
				console.log(c)
				var newPerson = new Application({
					_id:c,
					date:Date.now(),
					job_id:job_id,
					candidate_id:queue.unique_id,
					recruiter_id:results.recruiter_id,
					client_id:results.client_id,
					manager_id:results.manager_id,
				});

				newPerson.save(function(err, Person){
					if(err)
						console.log(err);
					else
						console.log('Success');
				});

			}).sort({_id: -1}).limit(1);
			console.log("Success:Applied Success fully.")
			res.status(200).send({"Success":"Applied succesfull"});
		}else{
			console.log("Error")
			res.status(400).send({"Success":"Error"});
		}
	})

	// res.send("successfully applied").status(200);
  });

router.get("/candidate/getNewJobs", async (req, res) => {

	var parameters=req.query
	console.log(parameters);
	var filter={unique_id:parameters.unique_id, user_position:parameters.user}
	const result = await User.findOne(filter);
	console.log(result)
	const jobs= await Job.find({applicants:{$ne:parameters.unique_id}})
	console.log(jobs)
	res.send(jobs).status(200);
  });
  router.get("/candidate/getApplyJobs", async (req, res) => {

	var parameters=req.query
	console.log(parameters);
	var filter={unique_id:parameters.unique_id, user_position:parameters.user}
	const result = await User.findOne(filter);
	console.log(result)
	const jobs= await Job.find({applicants:parameters.unique_id})
	console.log(jobs)
	res.send(jobs).status(200);
  });

  router.get("/recruiter/getJobs", async (req, res) => {

	var parameters=req.query
	console.log(parameters);
	var filter={recruiter_id:parameters.unique_id,status:'open'}
	const jobs= await Job.find(filter)
	console.log(jobs)
	res.send(jobs).status(200);
  });
  router.get("/recruiter/getClosedJobs", async (req, res) => {

	var parameters=req.query
	console.log(parameters);
	var filter={recruiter_id:parameters.unique_id,status:'close'}
	const jobs= await Job.find(filter)
	console.log(jobs)
	res.send(jobs).status(200);
  });

router.get("/client/getJobs", async (req, res) => {

	var parameters=req.query
	console.log(parameters);
	var filter={unique_id:parameters.unique_id, user_position:parameters.user}
	// const options = { upsert: true };
	// const updateDoc = {
		// 	$set: parameters
		//   };
	const result = await User.findOne(filter);
	console.log(result)

	companyName=result.company_name
	// console.log(filter);
	filter={companyName:companyName,status:'open'}
	const jobs= await Job.find(filter)
	console.log(jobs)
	//   console.log(
	// 	result.matchedCount+ "document(s) matched the filter, updated" +result.modifiedCount+ "document(s)`"
	//   );
	//   res.send({"Success":"successfull"})
	// // filter=
	// // console.log(req.query)
	// let results = await Job.find({})
	// console.log(results)
	res.send(jobs).status(200);
  });
  router.get("/client/getJobs/closed", async (req, res) => {

	var parameters=req.query
	console.log(parameters);
	var filter={unique_id:parameters.unique_id, user_position:parameters.user}
	// const options = { upsert: true };
	// const updateDoc = {
		// 	$set: parameters
		//   };
	const result = await User.findOne(filter);
	console.log(result)

	companyName=result.company_name
	// console.log(filter);
	filter={companyName:companyName,status:'close'}
	const jobs= await Job.find(filter)
	console.log(jobs)
	//   console.log(
	// 	result.matchedCount+ "document(s) matched the filter, updated" +result.modifiedCount+ "document(s)`"
	//   );
	//   res.send({"Success":"successfull"})
	// // filter=
	// // console.log(req.query)
	// let results = await Job.find({})
	// console.log(results)
	res.send(jobs).status(200);
  });

  






// Candidate
var Candidate = require('../models/candidate');

router.get('/candidateReg', function (req, res, next) {
	// return res.render('index.ejs');
	console.log("hello")
});


router.post('/candidateReg', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body.form;
	console.log(personInfo);
	
	if(!personInfo.email || !personInfo.password || !personInfo.confirm_password){
		res.send({"Success":"fill the required fields"});
	} else {
		if (personInfo.password == personInfo.confirm_password) {

			User.findOne({email:personInfo.email,userType:"candidate"},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){
						
						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							email:personInfo.email,userType:"candidate",
							// username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.confirm_password
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
				
			});
		}else{
			console.log("password is not matched")
			res.send({"Success":"password is not matched"});
		}
	}
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/candidateLogin', function (req, res, next) {
	console.log(req.body);
	User.findOne({email:req.body.form.email,userType:"candidate"},function(err,data){
		if(data){
			// console.log(data)
			if(data.password==req.body.form.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":"Login successful"});
				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not regestered!"});
		}
	});
});

router.get('/profile', function (req, res, next) {
	console.log("profile");
	Candidate.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('data.ejs', {"name":data.username,"email":data.email});
		}
	});
});

router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
		// delete session object
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			} else {
    		return res.redirect('/');
    	}
    });
}
});

router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	Candidate.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;
			
			data.save(function(err, Person){
				if(err)
				console.log(err);
				else
				console.log('Success');
				res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
	}
});

});


// client

var Client = require('../models/client');

router.get('/clientReg', function (req, res, next) {
	// return res.render('index.ejs');
	console.log("hello")
});


router.post('/clientReg', async function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body.form;
	console.log(personInfo);
	
	if(!personInfo.email || !personInfo.password || !personInfo.confirm_password){
		res.send({"Success":"fill the required fields"});
	} else {
		if (personInfo.password == personInfo.confirm_password) {
			
			User.findOne({email:personInfo.email,userType:"client"},function(err,data){
				if(!data){
					var c;
					User.findOne({},async function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}
						const encryptedPassword = await bcrypt.hash(personInfo.password, 10);

						var newPerson =await  new User({
							unique_id:c,
							email:personInfo.email,
							
							// username: personInfo.username,
							password: encryptedPassword,
							company_name: personInfo.company_name,
							passwordConf: encryptedPassword,userType:"client"
						});
						// const token = jwt.sign(
						// 	{ user_id: user._id, email },
						// 	process.env.TOKEN_KEY,
						// 	{
						// 	  expiresIn: "2h",
						// 	}
						//   );
						//   // save user token
						//   user.token = token;
					  

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
				
			});
		}else{
			console.log("password is not matched")
			res.send({"Success":"password is not matched"});
		}
	}
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login/:userType', function (req, res, next) {
	console.log(req.body.form);
	console.log(req.params.userType)
	User.findOne({email:req.body.form.email,user_position:req.params.userType},function(err,data){
		if(data){
			console.log(data)
			if((bcrypt.compare(req.body.form.password, data.password))){
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":"Login successful","userID":data.unique_id,"user_position":"client","company_name":data.company_name});
				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not regestered!"});
		}
	});
});

router.get('/profile', function (req, res, next) {
	console.log("profile");
	Client.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('data.ejs', {"name":data.username,"email":data.email});
		}
	});
});

router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	Client.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});

//head

var Head = require('../models/head');

router.get('/headReg', function (req, res, next) {
	// return res.render('index.ejs');
	console.log("hello")
});


router.post('/headReg', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body.form;
	console.log(personInfo);
	
	if(!personInfo.email || !personInfo.password || !personInfo.confirm_password){
		res.send({"Success":"fill the required fields"});
	} else {
		if (personInfo.password == personInfo.confirm_password) {
			
			Head.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					Head.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new Head({
							unique_id:c,
							email:personInfo.email,
							// username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.confirm_password
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
				
			});
		}else{
			console.log("password is not matched")
			res.send({"Success":"password is not matched"});
		}
	}
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/headLogin', function (req, res, next) {
	console.log(req.body);
	Head.findOne({email:req.body.form.email},function(err,data){
		if(data){
			// console.log(data)
			if(data.password==req.body.form.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":"Login successful","userId":data.unique_id});
				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not regestered!"});
		}
	});
});



router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	Client.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});

//management
var Manager = require('../models/manager');

router.get('/managementReg', function (req, res, next) {
	// return res.render('index.ejs');
	console.log("hello")
});


router.post('/managementReg', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body.form;
	console.log(personInfo);
	
	if(!personInfo.email || !personInfo.password || !personInfo.confirm_password){
		res.send({"Success":"fill the required fields"});
	} else {
		if (personInfo.password == personInfo.confirm_password) {
			
			User.findOne({email:personInfo.email,userType:"manager"},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							email:personInfo.email,
							// username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.confirm_password,userType:"manager"
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
				
			});
		}else{
			console.log("password is not matched")
			res.send({"Success":"password is not matched"});
		}
	}
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/managementLogin', function (req, res, next) {
	console.log(req.body);
	User.findOne({email:req.body.form.email,user_position:"manager"},function(err,data){
		if(data){
			// console.log(data)
			if(data.password==req.body.form.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":"Login successful","Username":data.unique_id});
				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not regestered!"});
		}
	});
});

router.get('/profile', function (req, res, next) {
	console.log("profile");
	Manager.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('data.ejs', {"name":data.username,"email":data.email});
		}
	});
});

router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	Manager.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});

//recruiter

var Recruiter = require('../models/recruiter');
const { filter } = require('bluebird');
const { queue } = require('async');

router.get('/recruiterReg', function (req, res, next) {
	// return res.render('index.ejs');
	console.log("hello")
});


router.post('/recruiterReg', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body.form;
	console.log(personInfo);
	
	if(!personInfo.email || !personInfo.password || !personInfo.confirm_password){
		res.send({"Success":"fill the required fields"});
	} else {
		if (personInfo.password == personInfo.confirm_password) {
			
			User.findOne({email:personInfo.email,userType:"recruiter"},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							email:personInfo.email,
							// username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.confirm_password,userType:"recruiter"
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
				
			});
		}else{
			console.log("password is not matched")
			res.send({"Success":"password is not matched"});
		}
	}
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/recruiterLogin', function (req, res, next) {
	console.log(req.body);
	User.findOne({email:req.body.form.email,userType:"recruiter"},function(err,data){
		if(data){
			// console.log(data)
			if(data.password==req.body.form.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":"Login successful","Username":data.unique_id});
				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not regestered!"});
		}
	});
});

router.get('/profile', function (req, res, next) {
	console.log("profile");
	Manager.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('data.ejs', {"name":data.username,"email":data.email});
		}
	});
});

router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	Manager.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});


module.exports = router;