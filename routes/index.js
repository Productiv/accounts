
module.exports = function (app) {
  app.use('/api', require('./users'));
  app.use('/api', require('./tokens'));
  app.use('/api', require('./accounts'));
};