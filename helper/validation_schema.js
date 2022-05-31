const Joi = require('@hapi/joi')

const authSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required(),
})

const registerSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required(),
    phone:Joi.string().min(10).max(13).required(),
    last_name: Joi.string().min(3).max(15),
    first_name:Joi.string().min(3).max(14),
    device:Joi.string()
})


const emailVerificationSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    code: Joi.string().min(6).max(6)
})

const resetPasswordVerifcationSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    code: Joi.string().min(6).max(6),
    password: Joi.string().min(8).required()
})

const updatePasswordVerificationSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    currentPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required()
})

module.exports = {
    authSchema,
    emailVerificationSchema,
    resetPasswordVerifcationSchema,
    updatePasswordVerificationSchema,
    registerSchema
}