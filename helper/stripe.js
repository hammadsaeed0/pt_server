
const config = require("../config")
const stripe = require("stripe")(config.STRIPE_SECRET_KEY)


const doPayment = (req, res)=>{
    stripe.charges.create({
        amount: req.body.amount, // Unit:cents
        currency:'aed',
        source:req.body.tokenId,
        description:'package purchase payment',
    }).then(result=> res.status(200).json(result))
}