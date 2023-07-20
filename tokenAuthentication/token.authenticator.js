const db = require('../db')
const jwt = require('jsonwebtoken');
const userTypes = require('../common/ids.constants')

function authenticateAdminToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null || token == 'null') return res.sendStatus(401)
  
    jwt.verify(token, String(process.env.TOKEN_SECRET), async function(err, user) {
    console.log("Err:", err)
    
      if (err || (user.userType != userTypes.adminUser)){
        return res.sendStatus(403)
      }else{
        req.user = user
        next()
      }
    })
  }

   function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null || token == 'null') return res.sendStatus(401)
  
    jwt.verify(token, String(process.env.TOKEN_SECRET), async function(err, user) {
    console.log("Err:", err)
    
     if (err || ((user.userType != userTypes.normalUser) && (user.userType != userTypes.adminUser))) return res.sendStatus(403)
        
      req.user = user

      next()
    })
  }

  

  async function checkTokenInDB(token, user) {
    if (user) {
      var snapshot = await db.collection('tokens').doc(user.email).get();
      if(!snapshot.exists){
        return false;
      }
      if (snapshot.data().token == "") {
        return false;
      }
        return true;  
    }else{
      return false;
    }
  }

  function logoutAuthentication(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (token == null || token == 'null') return res.sendStatus(401);
    
  
    jwt.verify(token, String(process.env.TOKEN_SECRET), async function(err, user) {
    console.log("Err:", err)
    req.user = user
    if (err) {
      const payload = jwt.verify(token, String(process.env.TOKEN_SECRET), {ignoreExpiration: true} );
      req.user = payload
    }
    next()
    })
  }

  function authenticateGetUser(req, res, next) {
      if (req.user.userType == userTypes.studentUser && req.user.email != req.body.email) res.sendStatus(401);
      if (req.body.email) {
        next()  
      } else {
        res.sendStatus(400)
      }
      
  }

  exports.authenticateAdmin = authenticateAdminToken
  exports.authenticateUser = authenticateToken
  exports.authenticateLogout = logoutAuthentication
  exports.authenticateGetUser = authenticateGetUser
