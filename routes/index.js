module.exports = function (app) {
  app.use('/', require('./users'));
  app.use('/', require('./accounts'));
  app.use('/', require('./tokens'));
};