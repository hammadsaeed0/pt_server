const braintree= require("braintree")
const config = require("../config")
const {message, badRequest}= require("./message")
const errorHandler = require('./errorHandler')


const gateway= new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: config.BRAINTREE_MERCHANT_ID ,
    publicKey: config.BRAINTREE_PUBLIC_KEY,
    privateKey: config.BRAINTREE_PRIVATE_KEY
})

exports.generateToken=(req,res)=>{

    gateway.clientToken.generate({}).then(response=>{
        res.status(200).json({
            data:response.clientToken,
            status:"success"
        })
        }).catch(err=>{
        badRequest.reason =err
        errorHandler(badRequest, res)
    });
}

exports.processPayment=(req,res)=>{
    const nonceFromTheClient= req.body.payment_method_nonce;
    const {amount, billing}= req.body;
    gateway.transaction.sale({
        amount:amount,
        paymentMethodNonce:nonceFromTheClient,
        billing:billing,
        options:{
            submitForSettlement:true,
            
        }
    }).then(response=>{
        res.status(200).json({
            data:response,
            status:"success"
        })
    })
    .catch(err=>{
        badRequest.reason =err
        errorHandler(badRequest, res)
    });
}