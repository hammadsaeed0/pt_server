const sgMail = require('@sendgrid/mail')
const config = require('../config')
const { internalServerError } = require('./message')

sgMail.setApiKey(config.SENDGRID_API_KEY)
const sendEmail = msg => {
    return new Promise((resolve, reject) => {
        sgMail.send(msg, (err, info) => {
            if(err){
                console.log("Sendgril Email Error:\n Reason: "+ err.message)
                reject(internalServerError)
            }else{
                resolve(info)
            }
        })
    })
}
module.exports = sendEmail