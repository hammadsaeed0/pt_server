const JWT = require('jsonwebtoken')
const { internalServerError, unauthorizedError } = require('./message')
const config = require('../config')
const errorHandler = require('./errorHandler')
const client = require('./redis_init')
// we are using promises here as jwt doesn't return promises

module.exports = {
    signAccessToken: (userid) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = config.ACCESS_TOKEN_SECRET
            const option = {
                expiresIn: '1y',
                issuer: 'ptapp.com',
                audience: userid
            }
            JWT.sign(payload, secret, option, (err, token) => {
                if (err) {
                    console.log(err.message)
                    reject(internalServerError)
                }
              
                resolve(token)
            })
        })
    },

    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) {
            unauthorizedError.message = 'Unauthorized error'
            return errorHandler(unauthorizedError, res)
        }
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ') // because the token is seperate with a space key
        const token = bearerToken[1]
        JWT.verify(token, config.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                unauthorizedError.message = err.name === 'JsonWebTokenError' ? 'Unauthorized error' : err.message
                return errorHandler(unauthorizedError, res)
            }

            req.payload = payload
            next()
        })
    },
    signRefreshToken: (userid) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = config.REFRESH_TOKEN_SECRET
            const option = {
                issuer: 'ptapp',
                expiresIn: '1y',
                audience: userid
            }
            JWT.sign(payload, secret, option, (err, token) => {
                if (err) {
                    console.log(err.message)
                    reject(internalServerError)
                } else {
                    let expireTime = 365 * 24 * 60 * 60 //1year 
                    client.SET(userid, token, 'EX', expireTime, (err, reply) => {
                        if (err) {
                            console.log(`Redis Error \n Reason: ${err.message}`)
                            return reject(internalServerError)
                        }
                        resolve(token)
                    })
                }
            })
        })
    },
    verifyRefreshToken: (token) => {
        return new Promise((resolve, reject) => {
            //verify the token with the secret key
            JWT.verify(token, config.REFRESH_TOKEN_SECRET, (err, payload) => {
                if (err) {
                    unauthorizedError.message = err.name === 'JsonWebTokenError' ? 'Unauthorized error' : err.message
                    reject(unauthorizedError)
                }
                 
                // verify if the key is the current redis key store in cache against the usedid 
                // so that the expired keys using this secret key will throw unauthorized error
                
                const userId = payload.aud
              
                client.GET(userId, (err,result) => {
                    if(err){
                        console.log(`Redis Error \n Reason: ${err.message}`)
                        return reject(internalServerError)
                    }
                    if(token === result) return resolve(userId)
                    reject(unauthorizedError)
                })
                
            })
        })
    }
}