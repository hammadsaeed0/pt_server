const Workout = require('../model/workout')
const { getAllData, getDataById, create,  findAndUpdateData } = require('../services/dbQueries')
const{ errorHandler , message} = require('../helper')
const { requiredFields, cannotDeleteData } = message


const getWorkout = (req, res) => {
    getAllData(Workout, res)

}
const getWorkoutbyId = (req, res) => {
    getDataById(Workout, req.query.id, res)
}

const createWorkout = async(req, res) => {
    let { name,  image, about } = req.body
    if (!name || !image|| !about) {
        requiredFields.message = 'name , about and image fields are required'
        return errorHandler(requiredFields, res)
    } else {
        let message = 'Workout created successfully'
        create(Workout, req.body, res, message)
    }
}

const updateWorkout = async(req, res) => {
    let itemId = req.query.id
    let {name, status} = req.body
    let successMsg= "Workout updated successfully"
    
    if (!name) {
        requiredFields.message ='name field is required'
        return errorHandler(requiredFields, res)
    }
    // if(status==='disable'){
    //     //check if any package exist in package table for this package type
    //     // isDataExist(Package,{ WorkoutId:itemId}, (packageExist)=>{
    //         console.log(packageExist)
    //         // if(packageExist){
    //         //     cannotDeleteData.message='Cannot delete record , This package type contains packages'
    //         //     cannotDeleteData.reason= cannotDeleteData.message
    //         //     return errorHandler(cannotDeleteData,res)
    //         // }else{
    //         //    return findAndUpdateData(Workout, itemId ,req.body, res, successMsg )
    //         // }
            
    // }  else{
    //     findAndUpdateData(Workout, itemId ,req.body, res, successMsg )
    // }
    Workout.findById({ _id: itemId }, (err, data) => {
        if (err) {
            dbError.reason = err
            return errorHandler(dbError, res)
        }
        if (data) {

            Workout.findByIdAndUpdate({ _id: itemId }, req.body, (err, data) => {
                if (err) {
                    return errorHandler(dbError, res)
                }
                if (data) {
                    return res.status(200).json({
                        message: 'Workout updated successfully',
                    })
                }
            })

        }
    })
}

module.exports = {
    getWorkout,
    getWorkoutbyId,
    createWorkout,
    updateWorkout,
}