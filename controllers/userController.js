const userModel = require("./../models/userModel");
const bcrypt = require("bcrypt");
const jswebtoken = require("jsonwebtoken");

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
    // Return the created user in the response
    res.status(200).json({
      status: "Success",
      message: "You have been successfully registered!",
      payload: {
        username: newUser.username,
        email: newUser.email,
      },
    });
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
      delete userCheck.password;
      if (passwordVerify) {
        return res.status(201).json({
          status: "Success",
          message: "Logged In",
          payload: {
            username: userCheck.username,
            email: userCheck.email,
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
