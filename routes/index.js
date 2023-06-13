var express = require('express');
var router = express.Router();
var User = require('../models/user');


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

			User.findOne({email:personInfo.email},function(err,data){
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
	User.findOne({email:req.body.form.email},function(err,data){
		if(data){
			// console.log(data)
			if(data.password==req.body.form.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":req.session.userId});
				
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
	User.findOne({unique_id:req.session.userId},function(err,data){
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
	User.findOne({email:req.body.email},function(err,data){
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