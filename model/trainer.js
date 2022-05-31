const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const trainerSchema = new Schema({
   about:{
        type:String,
        require:true,
    },
    categories:{
        type: Array, // array of workout
    },
    photos:{
        type: Array // array of fileurl
    },
    availability:{
        type:Array  // array of object in which {day, start_time, end_time}
    },    
    cv:{
        type:String  // fileurl, 
    },
    certificates:{
        type:Array
    },
    userId:{
        type:Schema.Types.ObjectId,
        require:true
    },
    trainerStatus:{
        type: String,
        default:"pending"
    },
})

module.exports= mongoose.model('Trainer', trainerSchema)