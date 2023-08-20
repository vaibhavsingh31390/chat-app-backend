const userModel = require("./../models/userModel");
const messageModel = require("./../models/messageModel");
const bcrypt = require("bcrypt");
const jswebtoken = require("jsonwebtoken");
const crypto = require("crypto");

exports.sendMessage = async (req, res, next) => {
  try {
    const requiredFields = ["token", "recipient_type", "from", "to", "message"];
    const fields = req.body;
    const missingFields = requiredFields.filter((field) => !fields[field]);
    // INVALID REQUEST CHECK //
    if (missingFields.length > 0) {
      return res.status(401).json({
        status: "Failed",
        message: "Request data in invalid.",
        payload: null,
      });
    } else {
        const {token, recipient_type, from, to, message} = req.body;
        const newMessage = await messageModel.create({
            recipient_type: recipient_type,
            users: [from, to],
            sender: from,
            message : {text: message.text},
        })

        if(newMessage){
            return res.status(201).json({
                status: "Success",
                message: "Message Sent",
                payload: {
                    sentAt: Date.now()
                }
              });
        }else{
            next(error);
        }
    }
  } catch (error) {
    return res.status(500).json({
        status: "Failed",
        message: "Message Not Sent",
        payload: {
            reqTime: Date.now(),
            error: error
        }
      });
  }

 
};

exports.getMessages = async (req, res, next) => {
    try {
      const requiredFields = ["token", "recipient_type", "from", "to", "message"];
      const fields = req.body;
      const missingFields = requiredFields.filter((field) => !fields[field]);
      // INVALID REQUEST CHECK //
      if (missingFields.length > 0) {
        return res.status(401).json({
          status: "Failed",
          message: "Request data in invalid.",
          payload: null,
        });
      } else {
          const {token, recipient_type, from, to, message} = req.body;
          const newMessage = await messageModel.create({
              recipient_type: recipient_type,
              users: [from, to],
              sender: from,
              message : {text: message.text},
          })
  
          if(newMessage){
              return res.status(201).json({
                  status: "Success",
                  message: "Message Sent",
                  payload: {
                      sentAt: Date.now()
                  }
                });
          }else{
              next(error);
          }
      }
    } catch (error) {
      return res.status(500).json({
          status: "Failed",
          message: "Message Not Sent",
          payload: {
              reqTime: Date.now(),
              error: error
          }
        });
    }
  
   
  };