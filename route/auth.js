const express = require('express')
const router = express.Router()
const {
    signup, 
    login,
    confirmAccountVerification,
    sendForgotPasswordEmail,
    resetPassword,
    updatePassword,
    logout,
    adminSignup,
    adminLogin,
    refreshToken
} = require('../controller/authController')

router.post('/signup', signup)
router.post('/login', login)
router.post('/adminLogin', adminLogin )
router.post('/sendForgotPasswordEmail', sendForgotPasswordEmail)
router.post('/confirmAccountVerification',  confirmAccountVerification)
router.post('/resetPassword', resetPassword)
router.post('/updatePassword', updatePassword)
router.post('/logout', logout)
router.post('/adminSignup', adminSignup)
router.post('/refreshToken',refreshToken)

module.exports = router