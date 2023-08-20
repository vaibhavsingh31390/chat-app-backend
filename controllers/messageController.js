const userModel = require("./../models/userModel");
const messageModel = require('./../models/messageModel');
const bcrypt = require("bcrypt");
const jswebtoken = require("jsonwebtoken");
const crypto = require('crypto');

exports.sendMessage = (req, res, next)=>{
    return res.status(201).json({
        status: "Success",
        message: "Users Found",
      });
}