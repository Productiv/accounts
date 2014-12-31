var express = require('express');
var router = express.Router();
var Token = require('../models/token');

function daysFromNow(days) {
  var date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

createToken = function(req, res) {
  var uid = req.body._id || req.body.uid;
  console.log('uid: ', uid);

  // generate a new token
  var token = Math.random().toString(34).substr(2) +
              Math.random().toString(34).substr(2);
  var obj = new Token();
  obj.uid = uid;
  obj.tokenHash = obj.generateHash(token);
  // obj.expiresOn = daysFromNow(14)
  console.log('token obj: ', obj);

  obj.save(function(err) {
    if(err) res.send({ success: false, message: err });
    else {
      res.cookie.productivToken = token;
      res.cookie.productivUid = uid;
      console.log('out cookie: ', res.cookie);
      res.send({ success: true });
    }
  });
};

updateToken = function(req, res, token) {
  Token.remove({ _id: token._id }, function(err) {
    if(err) res.send({ success: false, message: err });
    else createToken(req, res);
  });
};

createOrUpdateToken = function(req, res) {
  var uid = req.body._id || req.body.uid;
  console.log('uid: ', uid);

  Token.findOne({ uid: uid }, function(err, t) {
    console.log('err: ', err);
    console.log('t: ', t);
    if(err) res.send({ success: false, message: err });
    else if(t) updateToken(req, res, t);
    else createToken(req, res);
  });
};

router.post('/token', createOrUpdateToken);

router.post('/token/validate', function(req, res) {
  var uid = req.body.uid;
  var token = req.body.token;
  console.log('uid: ', uid);
  console.log('token: ', token);
  Token.findOne({ uid: uid }, function(err, obj) {
    if(err) res.send({ success: false, message: err });
    else if(!obj) res.send({ success: false, message: 'No token for given user id.' });
    else if(obj.validToken(token)) res.send({ success: true });
    else {
      res.send({ success: false, message: 'Invalid token.' });
    }
  });
});

deleteToken = function(req, res) {
  var uid = req.body._id || req.body.uid;
  console.log('uid: ', uid);
  Token.remove({ uid: uid }, function(err) {
    if(err) res.send({ success: false, message: err });
    else    res.send({ success: true });
  });
};

router.delete('/token', deleteToken);

module.exports = router;
