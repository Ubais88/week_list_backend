const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

// for signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, mobile, gender, age } = req.body;
    const alreadyregister = await User.findOne({ email });

    if (alreadyregister) {
      return res.status(500).json({
        success: false,
        message: "This Email is already registered",
      });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error in hashing password",
      });
    }

    const savedUser = await User.create({
      name,
      email,
      mobile,
      gender,
      age,
      password: hashedPassword,
    });

    if (!savedUser) {
      return res.status(404).json({
        success: false,
        message: "data not saved",
      });
    }
    const token = jwt.sign(savedUser.toJSON() , process.env.JWT_SECRET, {expiresIn:"7d"})
    res.status(200).json({
      success: true,
      token: token,
      savedUser: savedUser,
      message: "User saved successfully and login successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: error.message,
      error: "Error while signing up",
    });
  }
};

// for login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: "Email and password are required",
      });
    }
    const savedUser = await User.findOne({ email });
    if (!savedUser) {
      return res.status(401).json({
        success: false,
        message: "User does not exist",
      });
    }

    if (await bcrypt.compare(password, savedUser.password)) {
      // jwt token creation
      const token = jwt.sign(savedUser.toJSON() , process.env.JWT_SECRET, {expiresIn:"7d"})
      return res.status(200).json({
        success: true,
        message: "User Log in successfully",
        savedUser: savedUser,
        jwtToken: token,
      });
    }

    res.status(401).json({
      success: false,
      message: "Password is incorrect try with valid password",
    }); 

  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: error.message,
      error: "Error while login ",
    });
  }
};
