const mongoose = require('mongoose')
const Schema= mongoose.Schema


const WorkoutSchema= Schema({
    name:{
        type:String,
        require:true,
        unique:true
    },
    about:{
        type:String,
        require:true,
    },   
    image:{
        type:String,
        require:true,
    },
    status:{
        type:String,
        default:'active',
        require:true
    },
  
    
})

module.exports = mongoose.model('Workout', WorkoutSchema)