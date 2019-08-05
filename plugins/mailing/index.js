// First step is to enable less secure app access on gmail account by going to:
// https://myaccount.google.com/lesssecureapps

const express = require('express')
const config = require('../../config');
const nodemailer = require('nodemailer');

module.exports = function(app) {

  app.post('/send_mail', express.json({type: '*/*'}), async (req, res, next) => {
    try {
      let transporter = nodemailer.createTransport({
        service: config.get('EMAIL_SERVICE'),
        auth: {
          user: config.get('EMAIL_FROM_ADDRESS'),
          pass: config.get('EMAIL_FROM_PASSWORD')
        }
      });

      let mailSubject = 'Contacting EDS about: ' + req.body.topic;
      let mailBody = 'Name: ' + req.body.name + '\n';
      mailBody += 'Email: ' + req.body.email + '\n\n';
      mailBody += 'Short message: ' + req.body.short_message;

      let mailOptions = {
        from: config.get('EMAIL_FROM_ADDRESS'),
        to: config.get('EMAIL_TO_ADDRESS'),
        subject: mailSubject,
        text: mailBody
      };

      transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
          res.send({ status: 500 });
        } else {
          res.send({ status: 200 });
        }
      });

      res.send({ status: 200 });
    } catch (err) {
      res.send({ status: 500 });
    }
  });
};