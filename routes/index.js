var express = require('express');
var router = express.Router();
var mongoUrl = 'mongodb://localhost:27017/coffee';
var mongoose = require('mongoose');
var Account = require('../models/accounts');
var bcrypt = require('bcrypt-nodejs');
var randToken = require('rand-token');

mongoose.connect(mongoUrl);

router.post('/register', function(req,res,next){
	// res.json(req.body)
	var userName = req.body.userName;
	var password = req.body.password;
	var password2 = req.body.password2;
	var emailAddress = req.body.emailAddress;
	if(password == password2){
		var hashedPass = bcrypt.hashSync(req.body.password);
		var newAccount = new Account({
			userName: userName,
			password: hashedPass,
			emailAddress: emailAddress,
			token: token
		});
		newAccount.save();
		var token = randToken.generate(32);
		res.json({
			success: 'added',
			token: token
		})
	}else{
		res.json({failure: 'passwordsMatch'});
	}
});
router.post('/login', function(req,res,next){
	Account.findOne({
		userName: req.body.userName},
		function(error, doc){
			if(doc == null){
				res.json({failure: 'noUser'});
			}else{
				console.log(req.body.password);
				var passwordsMatch = bcrypt.compareSync(req.body.password, doc.password);
				if(passwordsMatch){
					// var token = randToken.generate(32);
					res.json({
						success: 'found!',
						token: doc.token
					});
				}else{
					res.json({
						failure: "badPassword"
					});
			}
		}
	});
});
module.exports = router;