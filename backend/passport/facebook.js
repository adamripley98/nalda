// Import frameworks
const express = require('express');
const router = express.Router();

/**
 * Backend file for logging in with facebook
 */
module.exports = (passport) => {
  router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email']}));

  router.get('/auth/facebook/callback', (req, res, next) => {
    passport.authenticate('facebook', {scope: ['email']}, (errPassport, user) => {
      console.log('req ses b4', req.session);
      if (errPassport) {
        console.log('it there');
        res.send({
          success: false,
          error: errPassport,
        });
        // TODO redirect to error
      } else {
        // process.nextTick(() => {
        //   // Built in passport login method
        //   console.log('req.user', req.user);
        //   req.logIn(user, function() {
        //   // Manually save session before redirect. See bug https://github.com/expressjs/session/pull/69
        //     console.log('req.user inside login', req.user);
        //     console.log('user', user);
        //     console.log('session beofre', req.session);
        //     req.session.save(function() {
        //       console.log('session after', req.session);
        //       res.redirect('/');
        //     });
        //   });
        req.logIn(user, (loginErr) => {
          // Error logging in
          if (loginErr) {
            console.log('what is loginerr', loginErr);
            // TODO Handle better, redirect somewhere
            res.send({
              success: false,
              error: loginErr,
            });
          } else {
            console.log('req ses after', req.session);
            // Finally, if there is no error, send back user
            res.redirect('/');
          }
        });
        // });
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
