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
  User.findOne({ email: email }, function(err, user) {
    // Handle search error
    if (err) { return done(err); }
    // If user not found, return false
    if (!user) { return done(null, false); }

    // Check if request password equals user.password
    user.comparePassword(password, function(err, isMatch) {
    if (err) { return done(err); }
    // If passwords don't match, return done
    if (!isMatch) { return done(null, false); }

    // If they match, return user model
    return done(null, user);
    });
  });
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

// Tell passport to use strategies
passport.use(jwtLogin);
passport.use(localLogin);
