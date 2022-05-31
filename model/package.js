const mongoose = require('mongoose')
const Schema= mongoose.Schema


const PackageSchema= Schema({
   
    name:{
        type:String,
        require:true,
        unique:true
    },
    sessions:{
        type:String,
        require:true
    },
    expireDay:{
        type:String,
        require:true
    },
    packageTypeId:{
        type:Schema.Types.ObjectId,
        require:true,
        ref:'PackageType'
    },
    price:{
        type:String,
        require:true
    },
    discount:{
        type:String,
        default:0
    },
    vat:{
        type:String,
        default:0
    },
   currency:{
    type:String,
    default:"AED"
   },
    image:{
        type:String,
        require:true
    },
    status:{
        type:String,
        default:"active"
    },
    recommended:{
        type:Boolean,
        default:false
    }


    
})

module.exports = mongoose.model('Package', PackageSchema)