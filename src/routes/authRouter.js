const express = require('express')
const router = express.Router()

const {AuthController} = require('../controllers/authController')

router.post('/signup', AuthController.signup)
router.post('/signin', AuthController.signin)
router.post('/forget-password', AuthController.forgetPassword)
// test API - this will be handled on frontend
router.post('/signout', AuthController.signout)

module.exports = router