var express = require('express');
var router = express.Router();
var mongoUrl = 'mongodb://localhost:27017/coffee';
var mongoose = require('mongoose');
var Account = require('../models/accounts');
var bcrypt = require('bcrypt-nodejs');
var randToken = require('rand-token');

mongoose.connect(mongoUrl);

router.get('/getUserData', function(req,res,next){
	if(req.query.token == null){
		res.json({failure: "noToken"});
	}else{
		Account.findOne({
			token: req.query.token
		}, function(err, doc){
			if(doc == null){
				res.json({failure: 'badToken'})
			}else{
				res.json(doc);
			}
		})
	}
})

router.post('/delivery', function(req,res,next){
	Account.update(
		{token: req.body.token}, //what its looking for (ID)
		{
			fullName: req.body.fullName,
			address: req.body.address,
			address2: req.body.address2,
			city: req.body.city,
			state: req.body.state,
			zipCode: req.body.zipCode,
			date: req.body.date
		},
		{multi: true},
		function(err, doc){
			if(doc.ok == 1){
				res.json({success: 'updated'});
			}else{
				res.json({failure: 'failedUpdate'});
			}
		}
		);
});

router.post('/order', function(req,res,next){
	var quantity = req.body.quantity;
	console.log(req.body);
	Account.update(
		{token: req.body.token},
		{quantity: quantity,
		flavor: req.body.flavor,
		smokeLength: req.body.smokeLength,
		shape: req.body.shape,
		frequency: req.body.frequency},
		{multi: true}, function(err,doc){
		if(doc.ok == 1){
			res.json({success: 'updated'});
		}else{
			res.json({failure: 'failedUpdate'});
		}
	});
});

router.post('/register', function(req,res,next){
	// res.json(req.body)
	var userName = req.body.userName;
	var password = req.body.password;
	var password2 = req.body.password2;
	var emailAddress = req.body.emailAddress;
	if(password == password2){
		var token = randToken.generate(32);
		var hashedPass = bcrypt.hashSync(password);
		var newAccount = new Account({
			userName: userName,
			password: hashedPass,
			emailAddress: emailAddress,
			token: token
		});
		newAccount.save();
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