var db = require('../db')
const jwt = require('jsonwebtoken');
exports.signin = async function (req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    let user;
    
    user = await db.findUser(email)
    console.log(email);
    if (!user) {
      res.status(401).json({message: "Email not registered", success: false})
    }else{
      if (user.password == password) {
        let token = generateAccessToken({email: user.email, userType: user.userType})
        res.status(401).json({message: "Login SuccessFull", token: token, success: true})
      }else{
        res.status(401).json({message: "Incorrect Password", success: false})
      }
    }
  }

  function generateAccessToken(user) {
    return jwt.sign(user, String(process.env.TOKEN_SECRET), { expiresIn: '1h' });
  }

