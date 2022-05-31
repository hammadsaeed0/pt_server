const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userPurchases = new Schema({
    email:{
        type: String,
        required:true,
        lowercase:true,
        unique:true
    },
    packageId:{
        type:Schema.Types.ObjectId,
        require:true,
        ref: 'Package' ,
    },
    transactionId:{
        type:String,
        required:true
    },
    purchasedAt:{
        type:Date,
        default : new Date()
    },

    expireDate:{
        type:Date,
    },
    purchasedPackageDetails:{
        type: Object
    },
    billingDetails:{
        type:Object
    },
   
    userId:{
        type:Schema.Types.ObjectId,
        require:true,
       ref: 'User' ,
    }
})

module.exports= mongoose.model('userPurchases', userPurchases)