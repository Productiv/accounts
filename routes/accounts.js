var express = require('express');
var router = express.Router();

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
  var body = req.body;
  console.log('body: ', body);
  User.findOne({ email: body.email }, function(err, user) {
    if(err)        res.send({ success: false, message: err });
    else if(!user) res.send({ success: false, message: 'Email not registered.' });
    else if(user.validPassword(body.password)) next(user);
    else {
      res.send({ success: false, message: 'Incorrect password.' });
    }
  });
}, createToken);

router.post('/logout', function(req, res, next) {
  var email = req.body.email;
  console.log('email: ', email);
  User.findOne({ email: email }, function(err, user) {
    if(err)        res.send({ success: false, message: err });
    else if(!user) res.send({ success: false, message: 'Email not registered.' });
    else           next({ _id: user._id });
  });
}, deleteToken);

module.exports = router;
