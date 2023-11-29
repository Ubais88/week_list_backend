const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    const token =
      req.body.token ||
      req.cookies.token ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token || token === undefined) {
      return res.status(404).json({
        success: false,
        message: "Token is missing",
      });
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log(payload)
      req.user = payload;
    } catch (e) {
      return res.status(401).json({
        success: false,
        token:token,
        message: "token is invalid",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message,
        error:"Error while validating token"
    })
  }
};
