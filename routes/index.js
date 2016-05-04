var express = require('express');
var router = express.Router();
var mongoUrl = 'mongodb://localhost:27017/coffee';
var mongoose = require('mongoose');
var Account = require('../models/accounts');
var bcrypt = require('bcrypt-nodejs');

mongoose.connect(mongoUrl);



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function(req,res,next){
	res.render('register', {page: 'register'});
});

router.post('/registerProcessed', function(req,res,next){
	var userName = req.body.userName;
	var password = req.body.password;
	var password2 = req.body.password2;
	var emailAddress = req.body.emailAddress;
	if(password == password2){
		var hashedPass = bcrypt.hashSync(password);
		var newAccount = new Account({
			userName: userName,
			password: hashedPass,
			emailAddress: emailAddress
		});
		newAccount.save();
		req.session.userName = userName;
		res.redirect('/order');
	}else{
		res.redirect('/register?failure=password');
	}
});

router.get('/order', function(req,res,next){
	res.render('order', {userName: req.session.userName, page: 'order'});
});

router.get('/logIn', function(req,res,next){
	res.render('logIn', {page: 'login'});
});
router.post('/logIn', function(req,res,next){
	var userName = req.body.userName;
	var password = req.body.password;
	// var hashedPass = bcrypt.hashSync(password);
	Account.findOne({
		userName: userName,
		function(error, doc){
			var passwordsMatch = bcrypt.compareSync(password, doc.password);
			if(passwordsMatch){
				res.redirect('order');
			}else{
				res.redirect('login');
			}

		}
	})
});

module.exports = router;
