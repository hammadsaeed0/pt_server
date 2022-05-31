const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const DocsSchema = new Schema({
    _id:Schema.Types.ObjectId,
    title:String,
    description:String,
    user:{
       required:true,
       type: Schema.Types.ObjectId,
       ref:'User'
    },
    
})

module.exports= mongoose.model('Docs', DocsSchema)