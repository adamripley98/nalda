/**
 * Handles all backend routes for contacting though sendgrid
 * NOTE all of these routes are prefixed with "/api"
 * NOTE these routes serve and accept JSON-formatted data
 */

// Import frameworks
const express = require('express');
const router = express.Router();

// Export the following methods for routing
module.exports = () => {
  // Route to send an email to Nalda team
  // TODO: implement
  router.post('/', (req, res) => {
    res.send({
      success: false,
      error: 'This feature has not been connected yet.'
    });
    // const nodemailer = require('nodemailer');
    //
    // // Generate test SMTP service account from ethereal.email
    // // Only needed if you don't have a real mail account for testing
    //   // create reusable transporter object using the default SMTP transport
    // // const transporter = nodemailer.createTransport({
    // //   host: 'smtp.ethereal.email',
    // //   port: 587,
    // //   secure: false, // true for 465, false for other ports
    // //   auth: {
    // //     user: 'username', // generated ethereal user
    // //     pass: 'password'  // generated ethereal password
    // //   }
    // // });
    //
    // const transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
    //
    // // setup email data with unicode symbols
    // const mailOptions = {
    //   from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
    //   to: 'adamripley@gmail.com', // list of receivers
    //   subject: 'Hello ✔', // Subject line
    //   text: 'Hello world?', // plain text body
    //   html: '<b>Hello world?</b>' // html body
    // };
    //
    // // send mail with defined transport object
    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     // return error;
    //     res.send({
    //       error: 'Error sending message' + error
    //     });
    //   } else {
    //     res.send({
    //       data: 'lol it worked',
    //     });
    //   }
    //   // Preview only available when sending through an Ethereal account
    //
    //     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
    //     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    // });
  });
  return router;
};
