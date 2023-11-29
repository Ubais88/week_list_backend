const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
require('dotenv').config()


const { signup, login } = require("../controller/auth");
const { auth } = require("../middlewares/auth.js");


router.post('/signup', signup);
router.get('/login', login);

// test
router.get('/test', auth , (req, res) => {
    res.json({
        success:true,
        message:'welcome to the test service'
    })
})


// Test route that requires JWT token for access
// router.get('/test', authenticateToken, (req, res) => {
//     res.json({ message: 'You have access to this protected route!' });
//   });
  
//   // Middleware to verify JWT token
//   function authenticateToken(req, res, next) {
//     const token = req.body.token
  
//     if (token) {
//       jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//           return res.status(403).json({ message: 'Token verification failed' });
//         }
//         req.userId = decoded.userId;
//         next();
//       });
//     } else {
//       res.status(401).json({ message: 'Token not provided' });
//     }
//   }


module.exports = router;