const express = require('express');
var router = express.Router();

module.exports = (passport) => {
  router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
      if (err) {
        res.send(err);
        return false;
      } else if (!user) {
        res.send('Invalid email or password.');
        return false;
      }
      req.logIn(user, (errr) => {
        if (errr) {
          res.send(errr);
          return false;
        }
        res.send(user);
        return true;
      });
    })(req, res, next);
  });

  return router;
};
