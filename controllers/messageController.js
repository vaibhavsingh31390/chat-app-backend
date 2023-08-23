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
      const { token, recipient_type, from, to, message } = req.body;
      const newMessage = await messageModel.create({
        token: token,
        recipient_type: recipient_type,
        users: [
          {
            sender: from,
            receiver: to,
          },
        ],
        from: from,
        to: to,
        message: { type: "text", text: message.text },
      });

      if (newMessage) {
        return res.status(201).json({
          status: "Success",
          message: "Message Sent",
          payload: {
            message: newMessage,
          },
        });
      } else {
        next(error);
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: "Message Not Sent",
      payload: {
        reqTime: Date.now(),
        error: error,
      },
    });
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const requiredFields = ["token", "from", "to"];
    const fields = req.query;
    const missingFields = requiredFields.filter((field) => !fields[field]);
    // INVALID REQUEST CHECK //
    if (missingFields.length > 0) {
      return res.status(401).json({
        status: "Failed",
        message: "Request data in invalid.",
        payload: null,
      });
    } else {
      const { token, from, to } = req.query;
      const messageList = await messageModel.find({
        $or: [
          { "from._id": from._id,  "to._id": to._id },
          { "from._id": to._id, "to._id": from._id }
        ],
      });

      if (messageList) {
        return res.status(201).json({
          status: "Success",
          message: messageList.length > 0 ? "Messages Found" : "No Messages Found",
          payload: {
            count: messageList.length,
            List: messageList,
          },
        });
      } else {
        next(error);
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: "Message Not Sent",
      payload: {
        reqTime: Date.now(),
        error: error,
      },
    });
  }
};
