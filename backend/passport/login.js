const express = require('express');
var router = express.Router();

module.exports = (passport) => {
  router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
      if (err) {
        console.log('ERROR logging in', err);
        res.send(err);
        return false;
      } else if (!user) {
        console.log('user doesnt exist');
        res.send('Invalid email or password.');
        return false;
      }
      req.logIn(user, (errr) => {
        if (errr) {
          console.log('err logging in', errr);
          res.send(errr);
          return false;
        }
        console.log('login successful', user);
        res.send(user);
        return true;
      });
    })(req, res, next);
  });

  return router;
};
