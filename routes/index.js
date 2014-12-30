module.exports = function (app) {
  app.use('/', require('./users'));
  app.use('/', require('./accounts'));
};