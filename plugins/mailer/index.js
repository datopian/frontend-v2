const express = require('express');
const nodemailer = require('nodemailer');
const config = require('../../config');

module.exports = function(app) {

  app.get('/contact', async (req, res, next) => {
    try {
      res.render('contact.html', {
        title: 'How might we help?',
        description: 'CKAN Organizations are used to create, manage and publish collections of datasets. Users can have different roles within an Organization, depending on their level of authorisation to create, edit and publish.',
        slug: 'contact'
      })
    } catch (err) {
      next(err)
    }
  });

  app.post('/contact', express.json({type: '*/*'}), async (req, res, next) => {
    try {
      if (!config.get('EMAIL_SERVICE')    ||
          !config.get('EMAIL_FROM')       ||
          !config.get('EMAIL_PASSWORD')   ||
          !config.get('EMAIL_TO')) {

        res.send({ status: 500, message: "Environment variables not set" });
        return;
      }

      let transporter = nodemailer.createTransport({
        service: config.get('EMAIL_SERVICE'),
        auth: {
          user: config.get('EMAIL_FROM'),
          pass: config.get('EMAIL_PASSWORD')
        }
      });

      let mailSubject = 'Contacting EDS about: ' + req.body.topic;
      let mailBody = 'Name: ' + req.body.name + '\n';
      mailBody += 'Email: ' + req.body.email + '\n\n';
      mailBody += 'Short message: ' + req.body.short_message;

      let mailOptions = {
        from: config.get('EMAIL_FROM'),
        to: config.get('EMAIL_TO'),
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