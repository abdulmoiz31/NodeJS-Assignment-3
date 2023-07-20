var nodemailer = require('nodemailer');

exports.sendMail = async function(email, subject, message){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'yourmail@gmail.com',
          pass: 'XXXXXX'
        }
      });
      
      var mailOptions = {
        from: 'ecommercemail@example.com',
        to: email,
        subject: subject,
        text: message
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}