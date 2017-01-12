const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

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
