const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local Strategy
// Specify email property for username
const localOptions = { usernameField: 'email' };
// Pull out username and password
const localLogin = new LocalStrategy({ localOptions }, function(email, password, done) {
  // Check username and password

  // If verified, call done with user

  // If not, call done with false

  
});

// Set options for JWT Strategy
const jwtOptions = {
  // Look for jwt in request header
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  // Specify key location
  secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // Check if user ID exists in db
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false); }

    // Yes, call done with db user object
    if (user) {
      done(null, user);
    // No, call done w/o user object
    } else {
      done(null, false);
    }
  });
});

// Tell passport to use it
passport.use(jwtLogin);
