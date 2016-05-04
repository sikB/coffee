var express = require('express');
var router = express.Router();
var mongoUrl = 'mongodb://localhost:27017/coffee';
var mongoose = require('mongoose');
var Account = require('../models/accounts');
var bcrypt = require('bcrypt-nodejs');

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
			userName: req.body.userName,
			password: hashedPass,
			emailAddress: req.body.emailAddress
		});
		console.log(newAccount);
		newAccount.save();
		req.session.userName = req.body.userName;
		res.json({
			success: 'added'
		})
	}else{
		res.json({failure: 'passwordsMatch'});
	}
});
router.post('/login', function(req,res,next){	// var userName = req.body.userName;
	// var password = req.body.password;
	// var hashedPass = bcrypt.hashSync(password);
	Account.findOne({
		userName: req.body.userName},
		function(error, doc){
			if(doc == null){
				res.json({failure: 'noUser'});
			}else{
				console.log(req.body.password);
				var passwordsMatch = bcrypt.compareSync(req.body.password, doc.password);
				if(passwordsMatch){
					req.session.userName = req.body.userName;
					res.json({
						success: 'found!'
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