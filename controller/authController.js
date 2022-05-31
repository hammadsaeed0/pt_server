const { isDataExist,create, findAndUpdateData, updateDataByID } = require("../services/dbQueries")
const { otp, redisClient, errorHandler, message, jwt_helper, validationSchema, sendEmail } = require("../helper")
const User = require('../model/user')
const Profile = require('../model/profile')
const config = require("../config")
const { notFound, } = require("../helper/message")
const { verificationCodeTemplate } = require("../emailTemplates/verificationCode")
const mongoose = require('mongoose')
const { resetPasswordVerifcationSchema, updatePasswordVerificationSchema } = require("../helper/validation_schema")

const { dataAlreadyExist,  authValiationError, unauthorizedError, successData, dbError, badRequest, internalServerError, invalidCode, accountNotVerified } = message
const { signAccessToken, signRefreshToken, verifyRefreshToken } = jwt_helper
const { authSchema,registerSchema, emailVerificationSchema } = validationSchema


const signup = async (req, res, next) => {

    console.log(req.body)
    try {
        //validating the field with auth validation Schema using @hapi/joi
        const validData = await registerSchema.validateAsync(req.body)
        // let type= req.body.device
        console.log("TYPE..............",type)

       
        console.log("validata",validData)
       
        isDataExist(User, { email: validData.email }, async (isUserExists) => {
            if (isUserExists) {
                dataAlreadyExist.message = `${validData.email} is already been registered`,
                    errorHandler(dataAlreadyExist, res)
            } else {
                const userObj= new User({
                    email:validData.email,
                    password:validData.password
                })

                const user = new User(userObj)
                user.emailToken = otp
                        
                const savedUser = await user.save()

                if(savedUser.id){
                    let profileObj = {
                        email:validData.email,
                        first_name:validData.first_name,
                        last_name:validData.last_name,
                        phone:validData.phone,
                        userId: savedUser._id
                    }
                    const profileData = new Profile(profileObj)
                    const profile = await profileData.save()
1
                    await  User.findByIdAndUpdate({_id:savedUser.id}, {profile: mongoose.Types.ObjectId(profile._id) })
                    
                    const msg = {
                            from: config.senderEmail,
                            to: savedUser.email,
                            subject: "PT Anywhere- Account Verification Email",
                            text: "Welcome to PT Anywhere. To start exploring your fitness journey. Please enter the verification code.\n Verification code: " + savedUser.emailToken,
                            html: verificationCodeTemplate({
                                mainHeading:'Welcome to PT Anywhere',
                                title:'Account Verification Email',
                                message:"Congrats! You are almost there to complete registration, to start exploring your fitness journey.<br/>Please enter the verification code mentioned below. <br/>",
                                code:savedUser.emailToken
                            })
        
                        }
                        try {
                            const emailResponse = await sendEmail(msg)
                            if(emailResponse.statusCode) throw internalServerError
                            
                            let json = {
                                status: 'success',
                                message: `A verification email has been sent to your email`,
                            }
                            // if( req.body.device && req.body.device==='mobile'){
                            //     json.data = savedUser.emailToken
                            // }
                            console.log(json)
                            res.status(200).json(json)         
                        } catch (error) {
                            console.log('Sendgrid Error', error)
                            errorHandler(error, res)
                        }
                }}
            })
               


    } catch (error) {
        console.log(error)
        if (error.isJoi) {
            authValiationError.message= error.message
            errorHandler(authValiationError, res)
        }
        errorHandler(error, res)
    }


}

const confirmAccountVerification = async (req, res, next) => {
    try {
        const validData = await emailVerificationSchema.validateAsync(req.body)
        let data = { isVerified: true, emailToken: null }
        let successMsg = "Your account has been verified"
        let user = await User.find({ email: validData.email })
        user = user[0] // extract user object from array
        if (!user) throw notFound
        
        if (user.emailToken === validData.code) {
            await updateDataByID(User, user._id, data, res, successMsg)
        } else {
            console.log("not match1231312213", user, user.emailToken ,validData.code)
            throw invalidCode
        }

    } catch (err) {
        console.log(err)
        err.isJoi ? errorHandler(invalidCode, res) : errorHandler(err, res)

    }
}

const login = async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body)
        const user = await User.findOne({ email: result.email })
        if (!user) {
            notFound.message = 'User not found'
            throw notFound
        }
        const isMatch = await user.isValidPassword(result.password)
        if (!isMatch) {
            errorHandler(unauthorizedError, res)
        } else {
            successData.message = 'User Logged In successfully'
            console.log(user._id.toString())
            const accessToken = await signAccessToken(user._id.toString())
            const refreshToken = await signRefreshToken(user._id.toString())
            if (!user.isVerified) {
                throw accountNotVerified
            }
            let profile = await Profile.findById({_id:mongoose.Types.ObjectId(user.profile)})
           
            successData.data = {
                _id: user._id.toString(),
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                profile: profile,
                trainer: user.trainer,
                accessToken,
                refreshToken
            }

            res.status(200).json(successData)
        }

    } catch (error) {
        if (error.isJoi) {
            errorHandler( authValidationError, res)
        } else {
            dbError.message = error
            errorHandler(typeof error === 'object' ? error : dbError, res)
            console.log(error)
        }
    }
}

const logout = async (req, res, next) => {
    try {
        const { token } = req.body
        if (!token) throw badRequest
        const userId = await verifyRefreshToken(token)
        redisClient.DEL(userId, (err, val) => {
            if (err) {
                console.log(err.message)
                throw internalServerError
            }
            console.log("userid of logout person", val)
            // logically we should send status 204 which stays the user not exist
            // and request succeeded and it doesn't send any json but for friendly response
            // we want to send json that's why we set status 200 

            // on redisClient side delete both access and refresh token when the user logout successfully
            res.status(200).json({
                status: "success",
                message: "logout successfully"
            })
        })
    } catch (error) {
        console.log(error)
        errorHandler(error, res)
    }
}

const sendForgotPasswordEmail = async(req, res, next) => {
    try{
    const {email} = req.body
    if(!email){
        badRequest.message="Email field is required"
        throw badRequest
    }
        const code = otp // return a six digit code
       findAndUpdateData(User, {email} ,{resetPasswordToken: otp}, res, null, async (updatedData)=>{
           
            if(!updatedData){
                throw notFound
            }
           //sending  email 
           const msg = {
            from: config.senderEmail,
            to: email,
            subject: "PT Anywhere- Reset Password Email",
            text: "We received a request to reset the password for your account\n Don't worry, Please enter the verification code to reset your password " + code,
            html: verificationCodeTemplate({
                mainHeading:'Reset Password Email',
                title:'Forgot your password?',
                message:"We received a request to reset the password for your account <br/> Don't worry </br>Please enter the verification code to reset your password <br/>",
                code: code
            })
    
        }
        const emailResponse = await sendEmail(msg)
        if(emailResponse.statusCode) throw internalServerError
        let json = {
            status: 'success',
             message:"A verification code has been sent to your email",
        }
        if( req.body.device && req.body.device==='mobile'){
            json.data = code
        }
        res.status(200).json(json)

       })
    }catch(err){
        console.log(err)
        errorHandler(err,res)
    }
}


const resetPassword = async(req, res, next) => {
    try {
        const validData = await resetPasswordVerifcationSchema.validateAsync(req.body)
       
        let successMsg = "Your pasword has updated successfully"
        let user = await User.find({ email: validData.email })
        user = user[0] // extract user object from array
        if (!user) throw notFound
        
        if (user.resetPasswordToken && user.resetPasswordToken === validData.code) {
            let data = { 
                resetPasswordToken:null, 
                password:  await user.encryptPassword(validData.password, res) 
            }
           if(data.password){

            //    await User.findOneAndUpdate({email:validData.email}, data, (err, data)=>{
                findAndUpdateData(User, {email:validData.email} ,data, res, null, async (updatedData)=>{
                //    if(err){
                //        dbError.reason= err
                //        throw dbError
                //    }
                   if(updatedData){
                       res.json({
                           status:"success",
                           message: successMsg
                       })
                   }
               })
           }
            // await updateDataByID(User, user._id, data, res, successMsg)
        } 
        else throw invalidCode
        // res.json({code:user.reserPasswordToken||"", input:validData.code})
    

    } catch (err) {
        console.log(err)
        err.isJoi ? errorHandler(badRequest, res) : errorHandler(err, res)

    }
}

const updatePassword = async(req, res, next) => {
    try{
    const validData = await updatePasswordVerificationSchema.validateAsync(req.body)

    let successMsg = "Your pasword has updated successfully"
    let user = await User.find({ email: validData.email })
    user = user[0] // extract user object from array
  
    if (!user) throw badRequest
    const isMatch = await user.isValidPassword(validData.currentPassword)
  
    if (!isMatch) return errorHandler(unauthorizedError, res)
    let data = { 
        password:  await user.encryptPassword(validData.newPassword, res) 
    }
   
    await updateDataByID(User, user._id, data, res, successMsg)
    }catch(err){
        console.log(err)
        console.log(err)
        err.isJoi ? errorHandler(badRequest, res) : errorHandler(err, res)
    }

}

const adminSignup = async (req, res, next) => {
    try {
        //validating the field with auth validation Schema using @hapi/joi
        const validData = await authSchema.validateAsync(req.body)
        isDataExist(User, { email: validData.email }, async (isUserExists) => {
            if (isUserExists) {
                dataAlreadyExist.message = `${validData.email} is already been registered`,
                    errorHandler(dataAlreadyExist, res)
            } else {
                validData.role = 'admin'
                validData.isVerified= true
                const user = new User(validData)
                const savedUser = await user.save()
                const accessToken = await signAccessToken(savedUser._id.toString())
                const refreshToken = await signRefreshToken(savedUser._id.toString())
                res.status(200).json({
                    status: 'success',
                    message: 'User registered successfully',
                    accessToken,
                    refreshToken
                })

            }
        })


    } catch (error) {
        if (error.isJoi) {
            errorHandler(authValiationError, res)
        }
    }
}

const adminLogin = async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body)
        const user = await User.findOne({ email: result.email, role:'admin' })
        if (!user) {
            notFound.message = 'Invalid Email or Password'
            throw notFound
        }
        const isMatch = await user.isValidPassword(result.password)
        if (!isMatch) {
            errorHandler(unauthorizedError, res)
        } else {
            successData.message = 'User Logged In successfully'
            console.log(user._id.toString())
            const accessToken = await signAccessToken(user._id.toString())
            const refreshToken = await signRefreshToken(user._id.toString())
            if (!user.isVerified) {
                throw accountNotVerified
            }
            successData.data = {
                _id: user._id.toString(),
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                profile: user.profile,
                trainer: user.trainer,
                accessToken,
                refreshToken
            }

            res.status(200).json(successData)
        }

    } catch (error) {
        if (error.isJoi) {
            errorHandler( authValidationError, res)
        } else {
            dbError.message = error
            errorHandler(typeof error === 'object' ? error : dbError, res)
            console.log(error)
        }
    }
}

// we are using the refresh token tok generate the new access token using which the user can login again
const refreshToken = async (req, res, next) => {
    try {
        const { token } = req.body
        if (!token) throw badRequest
        const userId = await verifyRefreshToken(token)
        const accessToken = await signAccessToken(userId)
        const refreshToken = await signRefreshToken(userId)
        res.status(200).json({
            status: 'success',
            accessToken,
            refreshToken
        })
    } catch (error) {
        errorHandler(error, res)
    }



}

module.exports = {
    signup,
    login,
    confirmAccountVerification,
    sendForgotPasswordEmail,
    adminLogin,
    resetPassword,
    updatePassword,
    logout,
    adminSignup,
    refreshToken
}