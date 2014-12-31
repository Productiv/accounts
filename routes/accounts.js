var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Token = require('../models/token');

router.post('/signup', function(req, res, next) {
  var user = req.body;
  console.log('user: ', user);
  User.findOne({ email: user.email }, function(err, user) {
    if(err)       res.send({ success: false, message: err });
    else if(user) res.send({ success: false, message: 'Email already in use.' });
    else next();
  });
}, createUser);

router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  console.log('email: ', email);
  console.log('password: ', password);
  User.findOne({ email: email }, function(err, user) {
    console.log('user: ', user);
    if(err)        res.send({ success: false, message: err });
    else if(!user) res.send({ success: false, message: 'Email not registered.' });
    else if(user.validPassword(password)) {
      req.body = user;
      next();
    }
    else res.send({ success: false, message: 'Incorrect password.' });
  });
}, createOrUpdateToken);

router.post('/logout', function(req, res, next) {
  var uid = req.body._id || req.body.uid;
  console.log('logout uid: ', uid);
  User.findOne({ _id: uid }, function(err, user) {
    if(err)        res.send({ success: false, message: err });
    else if(!user) res.send({ success: false, message: 'User not found.' });
    else {
      req.body = user;
      next();
    }
  });
}, deleteToken);

module.exports = router;
