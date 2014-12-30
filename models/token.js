var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;

var tokenSchema = mongoose.Schema({
  uid       : ObjectId,
  hash      : String,
  expiresOn : Date
});

// methods ======================
// generating a hash
tokenSchema.methods.generateHash = function(token) {
  return bcrypt.hashSync(token, bcrypt.genSaltSync(8), null);
};

// checking if hash is valid
tokenSchema.methods.validToken = function(token) {
  return bcrypt.compareSync(token, this.hash);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Token', tokenSchema);
