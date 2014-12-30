var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/user/all', function(req, res) {
  User.find({}, function(err, users) {
    if(err) res.error(err);
    else    res.send(users);
  });
});

createUser = function(req, res) {
  var user = req.body;
  console.log('user: ', user);

  var newUser = new User();
  newUser.email = user.email;
  newUser.password = newUser.generateHash(user.password);
  newUser.name = user.name;

  newUser.save(function(err) {
    if(err) res.send({ success: false, error: err });
    else    res.send({ success: true });
  });
};

router.post('/user', createUser);

router.get('/user/:id', function(req, res) {
  var uid = req.params.id;
  console.log('uid: ', uid);
  User.findOne({ _id: uid }, function(err, user) {
    if(err) res.error(err);
    else    res.send(user);
  });
});

router.put('/user/:id', function(req, res) {
  var userId = req.params.id;
  var user = req.body;
  console.log('userId: ', userId);
  console.log('user: ', user);
  User.findOneAndUpdate({ _id: userId }, user, function(err) {
    if(err) res.send({ success: false, error: err });
    else    res.send({ success: true });
  });
});

router.delete('/user/:id', function(req, res) {
  var userId = req.params.id;
  console.log('userId: ', userId);
  User.remove({ _id: userId }, function(err) {
    if(err) res.send({ success: false, error: err });
    else    res.send({ success: true });
  });
});

module.exports = router;
