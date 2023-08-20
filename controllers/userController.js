const userModel = require("./../models/userModel");
const bcrypt = require("bcrypt");
const jswebtoken = require("jsonwebtoken");
const crypto = require('crypto');

const assignToken = async (userName) => {
  try {
    const payload = {
      username: userName,
      timestamp: Date.now(),
    };
    const secretKey = crypto.randomBytes(32).toString("hex");
    const token = jswebtoken.sign(payload, secretKey);
    const user = await userModel.findOneAndUpdate(
      { username: userName },
      { token: token },
      { new: true }
    );
    return token;
  } catch (error) {
    throw new Error(error);
  }
};

exports.userRegister = async (req, res, next) => {
  try {
    const requiredFields = ["username", "email", "password", "confirmPassword"];
    const fields = req.body;
    // MISSING FIELD BACKEND VALIDATION.
    const missingFields = requiredFields.filter((field) => !fields[field]);
    if (missingFields.length > 0) {
      return res.status(401).json({
        status: "Failed",
        message: "Please fill in all the required fields.",
        payload: null,
      });
    }

    const { username, email, password, confirmPassword } = req.body;
    const userCheck = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    // CHECK IF USERNAME/EMAIL ALREADY EXISTS.
    if (userCheck) {
      if (userCheck.username === username) {
        return res.status(409).json({
          status: "Failed",
          message: "Username already exists. Please choose another username.",
          payload: null,
        });
      } else if (userCheck.email === email) {
        return res.status(409).json({
          status: "Failed",
          message: "Email already exists. Please choose another email.",
          payload: null,
        });
      }
    }

    // IF VALIDATION PASSED, REGISTER NEW USER
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      username,
      email,
      password: encryptedPassword,
    });
    delete newUser.password;
    const token = await assignToken(newUser.username);
    if(newUser && token){
      res.status(200).json({
        status: "Success",
        message: "You have been successfully registered!",
        payload: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          token: token
        },
      });
    }else{
      next(error);
    }
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Server Error.",
      payload: error.message,
    });
    next(error);
  }
};

exports.userLogin = async (req, res, next) => {
  try {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with your actual frontend URL
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    const requiredFields = ["email", "password"];
    const fields = req.body;
    // MISSING FIELD BACKEND VALIDATION.
    const missingFields = requiredFields.filter((field) => !fields[field]);
    if (missingFields.length > 0) {
      return res.status(401).json({
        status: "Failed",
        message: "Please fill in all the required fields.",
        payload: null,
      });
    }

    const { email, password } = req.body;
    const userCheck = await userModel.findOne({ email });
    // CHECK IF USERNAME/EMAIL ALREADY EXISTS.
    if (userCheck) {
      const passwordVerify = await bcrypt.compare(password, userCheck.password);
      const token = await assignToken(userCheck.username);
      delete userCheck.password;
      if (passwordVerify && token) {
        return res.status(201).json({
          status: "Success",
          message: "Logged In",
          payload: {
            _id: userCheck._id,
            username: userCheck.username,
            email: userCheck.email,
            token: token
          },
        });
      } else {
        return res.status(401).json({
          status: "Failed",
          message: "Password incorrect. Please check your password.",
          payload: null,
        });
      }
    } else {
      return res.status(401).json({
        status: "Failed",
        message: "Email not found. Please check your email.",
        payload: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Server Error.",
      payload: error.message,
    });
    next(error);
  }
};

exports.userSetAvatar = async (req, res, next) => {
  try {
    const requiredFields = ["username","avatar",'token'];
    const fields = req.body;
    // MISSING FIELD BACKEND VALIDATION.
    const missingFields = requiredFields.filter((field) => !fields[field]);
    if (missingFields.length > 0) {
      return res.status(401).json({
        status: "Failed",
        message: "Please fill in all the required fields.",
        payload: null,
      });
    }
    const { username, avatar, isAvatarImageSet = true, token } = req.body;
    const userCheck = await userModel.findOneAndUpdate({token: {$eq:token}}, {
      avatarImage: avatar,
      isAvatarImageSet: true
    }, {
      new: true
    });
    // CHECK IF USERNAME/EMAIL ALREADY EXISTS.
    if (userCheck) {
      return res.status(201).json({
        status: "Success",
        message: "Avatar Updated",
        payload: {
          isAvatarImageSet: userCheck.isAvatarImageSet,
          avatarImage: userCheck.avatarImage,
        },
      });
    } else {
      return res.status(401).json({
        status: "Failed",
        message: "Username not found. Please check your username.",
        payload: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Server Error.",
      payload: error.message,
    });
    next(error);
  }
};


exports.userGetUsers = async (req, res, next) => {
  try {
    const requiredFields = ["username",'token'];
    const fields = req.query;
    // MISSING FIELD BACKEND VALIDATION.
    const missingFields = requiredFields.filter((field) => !fields[field]);
    if (missingFields.length > 0) {
      return res.status(401).json({
        status: "Failed",
        message: "Please fill in all the required fields.",
        payload: null,
      });
    }
    const { username, token } = req.query;
    const userCheck = await userModel.findOne({token});
    // CHECK IF USERNAME/EMAIL ALREADY EXISTS.
    if (userCheck) {
      const usersList = await userModel.find({token: {$ne:token}}).select("username avatarImage _id");
      return res.status(201).json({
        status: "Success",
        message: "Users Found",
        payload: {
          list: usersList
        },
      });
      
    } else {
      return res.status(401).json({
        status: "Failed",
        message: "Username not found. Please check your username.",
        payload: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Server Error.",
      payload: error.message,
    });
    next(error);
  }
};