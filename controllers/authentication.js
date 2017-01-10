const User = require('../models/user');

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password

  // Check if user with email exists
  User.findOne({ email: email}, function(err, existingUser) {
    
  });
  // If user with email already exists, return error

  // If user does not exist, create and save user

  // Respond to request confirming user creation

}
