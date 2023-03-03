const { transporter } = require('../../config/emailTransporter');

const sendVerificationEmail = async (options) => {
  const { name, to, token } = options;

  const message = {
    from: 'sender@server.com',
    to,
    subject: 'Verify your account',
    html: `<h1>Email confirmation</h1>
    <h2>Hello ${name}</h2>
        <p>Thank you for Registering. Please Click on the  link to verify your account <a href=http://localhost:5000/api/v1/user/verify/${token}>here</a> </p>
        <p>This link expires in one hour</p>`
  };

  await transporter.sendMail(message);
};

module.exports = sendVerificationEmail;
