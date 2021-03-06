const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  // std jwt props: sub=subject iat=issuedAtTime
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  // Already verified, give token
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
  // Grab email and password for request
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({error: 'You must provide email and password'});
  }
  // Check if user with email exists
  User.findOne({ email: email}, function(err, existingUser) {
    if (err) { return next(err); }

    // If user with email already exists, return error
    if (existingUser) {
      return res.status(422).send({error: 'Email already in use'});
    }

    // If user does not exist, create and save user
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {
      if (err) { return next(err); }

      // Respond to request confirming user creation
      res.json({ token: tokenForUser(user) });
    });
  });
}
