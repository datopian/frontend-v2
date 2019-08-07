const express = require('express')
const nodemailer = require('nodemailer')
const config = require('../../config')

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
  })

  app.post('/contact', express.json({type: '*/*'}), async (req, res, next) => {
    try {
      if ((!config.get('SMTP_SERVICE')    &&
          (!config.get('SMTP_HOST')       ||
            !config.get('SMTP_PORT')))    ||
          !config.get('EMAIL_FROM')       ||
          !config.get('EMAIL_PASSWORD')   ||
          !config.get('EMAIL_TO')) {
        next({status: 500, message: 'One of the environment variables are not set for mailer plugin.'})
        return
      }

      let transporter = nodemailer.createTransport({
        service: config.get('SMTP_SERVICE'),
        host: config.get('SMTP_HOST'),
        port: config.get('SMTP_PORT'),
        auth: {
          user: config.get('EMAIL_FROM'),
          pass: config.get('EMAIL_PASSWORD')
        }
      })

      let mailSubject = 'Contacting about: ' + req.body.topic
      let mailBody = 'Name: ' + req.body.name + '\n'
      mailBody += 'Email: ' + req.body.email + '\n\n'
      mailBody += 'Message: ' + req.body.short_message

      let mailOptions = {
        from: config.get('EMAIL_FROM'),
        to: config.get('EMAIL_TO'),
        subject: mailSubject,
        text: mailBody
      }

      transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
          next({status: 500, message: err})
          return
        } else {
          res.send({status: 200})
        }
      })
    } catch (err) {
      next({ status: 500, message: err })
    }
  })
}
