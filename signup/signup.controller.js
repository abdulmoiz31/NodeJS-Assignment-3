var db = require('../db')
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb://localhost:27017";

let userAlreadyRegistered = {
  success: false,
  message: "Email already registered with another user"
}

const dotenv = require('dotenv');
const userTypes  = require('../common/ids.constants');

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;

exports.userSignup = async function (req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  let userType = req.body.userType;
  let designation = req.body.designation;

  if (!password || !email || !userType) {
    res.status(400).json("Invalid Data")
  }else{
  var user = {
    email: email,
    password: password,
    userType: userType,
    designation: designation
  }
  var userRetrieved = await db.findUser(email)
  if (userRetrieved) {
    res.status(400).json("User Already Exists")
  } else {
    var response = await db.addUser(user);
    res.status(200).json("User added successfully")
  }
}
}

exports.updateUser = async function (req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  let userType = req.body.userType;
  let designation = req.body.designation;
  if (!password || !email || !userType) {
    res.status(400).json("Invalid Data")
  }else{
  var user = {
    userType: userType,
    designation: designation
  }
  var userRetrieved = await db.findUser(email)
  if (userRetrieved) {
    await db.updateUser(userRetrieved._id, user)
    res.status(200).json("User Record Updated")
  } else {
    res.status(401).json({message: "Email not registered", success: false})
  }
}
}

exports.deleteUser = async function (req, res, next) {
  let email = req.body.email;
  if (email) {
    let count = await db.deleteUser(email);
    
    if (count === 1) {
      res.status(200).json("User deleted successfully")
    } else {
      res.status(400).json("User does not exists")
    }
  }else{
    res.status(400).json("Invalid Data")
  }
}
  
