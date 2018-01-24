// Import frameworks
const express = require('express');
const router = express.Router();

/**
 * Backend file for logging in with facebook
 */
module.exports = (passport) => {
  router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'], session: false}));

  router.get('/auth/facebook/callback', (req, res, next) => {
    passport.authenticate('facebook', {scope: ['email'], session: false}, (errPassport, user) => {
      if (errPassport) {
        console.log('it there');
        res.send({
          success: false,
          error: errPassport,
        });
        // TODO redirect to error
      } else {
        // Built in passport login method
        req.logIn(user, (loginErr) => {
          // Error logging in
          if (Object.keys(loginErr).length) {
            console.log('it here');
            res.send({
              success: false,
              error: loginErr,
            });
            // TODO redirect to error
          } else {
            // Finally, if there is no error, send back user
            // res.send({
            //   success: true,
            //   error: '',
            //   user,
            // });
            console.log('should log me in', req.session);
            res.redirect('/');
          }
        });
      }
    })(req, res, next);
  });

  return router;
};
