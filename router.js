const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// passport middleware
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function(app) {
  // test route for auth handling
  app.get('/', requireAuth, function(req, res) {
    res.send({ hi: 'authorized!'});
  });
  app.post('/signup', Authentication.signup);
}
