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
        console.log('req.user', req.user);
        req.logIn(user, function() {
        // Manually save session before redirect. See bug https://github.com/expressjs/session/pull/69
          console.log('req.user inside login', req.user);
          console.log('user', user);
          console.log('session beofre', req.session);
          req.session.save(function() {
            console.log('session after', req.session);
            res.redirect('/');
          });
        });
        // req.login(user, (loginErr) => {
        //   // Error logging in
        //   if (Object.keys(loginErr).length) {
        //     console.log('it here');
        //     res.send({
        //       success: false,
        //       error: loginErr,
        //     });
        //     // TODO redirect to error
        //   } else {
        //     // Finally, if there is no error, send back user
        //     // res.send({
        //     //   success: true,
        //     //   error: '',
        //     //   user,
        //     // });
        //     console.log('should log me in', req.session);
        //     res.redirect('/');
        //   }
        // });
      }
    })(req, res, next);
  });

  return router;
};
