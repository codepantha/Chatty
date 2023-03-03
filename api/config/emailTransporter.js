const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASSWORD } = require('./constants');

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
});

module.exports = { transporter }
