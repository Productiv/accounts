var express = require('express');
var router = express.Router();
var Token = require('../models/token');

function daysFromNow(days) {
  var date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

function createToken(req, res) {
  var uid = req.body._id || req.body.uid;
  console.log('uid: ', uid);

  // generate a new token
  var token = Math.random().toString(34).substr(2) +
              Math.random().toString(34).substr(2);
  var obj = new Token();
  obj.uid = uid;
  obj.tokenHash = obj.generateHash(token);
  // obj.expiresOn = daysFromNow(14);

  Token.findOneAndUpdate({ uid: uid }, obj, { upsert: true }, function(err) {
    if(err) res.send({ success: false, message: err });
    else {
      res.cookie('token', token);
      res.cookie('uid', uid);
      res.send({ success: true });
    }
  });
};

router.post('/token', createToken);

router.post('/token/validate', function(req, res) {
  var uid = req.body.uid;
  var token = req.body.token;
  console.log('uid: ', uid);
  console.log('token: ', token);
  Token.findOne({ uid: uid }, function(err, obj) {
    if(err) res.send({ success: false, message: err });
    else if(obj.validateHash(token)) res.send({ success: true });
    else {
      res.send({ success: false, message: 'Invalid token.' });
    }
  });
});

function deleteToken(req, res) {
  var uid = req.body._id || req.body.uid;
  console.log('uid: ', uid);
  Token.remove({ uid: uid }, function(err) {
    if(err) res.send({ success: false, message: err });
    else    res.send({ success: true });
  });
};

router.delete('/token', deleteToken);

module.exports = router;
