const mongoose = require('mongoose')
const Schema= mongoose.Schema


const TimeSlotSchema= Schema({
    day:{
        type:String,
        require:true,
        // unique:true
    },
    timeRange:{
        type:Array,
        require:true,
       
    },
    status:{
        type:String,
        default:'active',
        require:true
    },
  
    
})

module.exports = mongoose.model('Timeslot', TimeSlotSchema)