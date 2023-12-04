const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
require('dotenv').config()


const { signup, login } = require("../controller/auth");
const { auth } = require("../middlewares/auth.js");
const { weeklist } = require("../controller/weeklist.js")
const { createweekTask , updateweekTask , updateActiveStatus ,getAllTask, deleteWeekTask , getTask , feed } = require("../controller/weektask.js")


router.post('/signup', signup);
router.get('/login', login);
router.post('/createweek', auth , weeklist);
router.post('/createtask', auth , createweekTask);
router.put('/update/:taskId', auth , updateweekTask);
router.put('/updatestatus/:taskId', auth , updateActiveStatus);
router.delete('/deletetask/:taskId', auth , deleteWeekTask);
router.get('/alltask', auth , getAllTask);
router.get('/gettask/:taskId', auth , getTask);
router.get('/feed/', auth , feed);

// test
router.get('/test', auth , (req, res , next) => {
    res.json({
        success:true,
        message:'welcome to the test service'
    })
    next();
})


module.exports = router;