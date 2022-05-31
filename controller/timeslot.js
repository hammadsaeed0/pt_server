const Timeslot = require('../model/timeslot')
const { getAllData, getDataById, create,  findAndUpdateData } = require('../services/dbQueries')
const{ errorHandler , message} = require('../helper')
const { requiredFields, cannotDeleteData , dbError} = message


const getTimeslot = (req, res) => {
    // getAllData(Timeslot, res)
    try {
        Timeslot.find().sort({day: 1}).exec(function(err, docs) {
                if(err){ throw err}
                if(docs){
                   
                    res.status(200).json({data:docs})
                }
        });
      
    } catch (error) {
        console.log('error', error)
        dbError.reason = error
        errorHandler(dbError, res)
    }
}
const getTimeslotbyId = (req, res) => {
    getDataById(Timeslot, req.query.id, res)
}

const createTimeslot=(req, res) => {
    let { day,timeRange } = req.body
    if (!day|| !timeRange|| !timeRange[0] || !timeRange[1]) {
        requiredFields.message = 'day and timerange is required'
        return errorHandler(requiredFields, res)
    } else {
        let message = 'Work slot created successfully'
        create(Timeslot, req.body, res, message)
    }
}

const updateTimeSlot = async(req, res) => {
    let itemId = req.query.id
    let {day, timeRange, status} = req.body
    let successMsg= "Timeslot updated successfully"
    
    
    if (!day|| !timeRange|| !timeRange[0] || !timeRange[1]) {
        requiredFields.message = 'day and timerange is required'
        return errorHandler(requiredFields, res)
    }
  
    Timeslot.findById({ _id: itemId }, (err, data) => {
        if (err) {
            dbError.reason = err
            return errorHandler(dbError, res)
        }
        if (data) {

            Timeslot.findByIdAndUpdate({ _id: itemId }, req.body, (err, data) => {
                if (err) {
                    return errorHandler(dbError, res)
                }
                if (data) {
                    return res.status(200).json({
                        message: 'Timeslot updated successfully',
                    })
                }
            })

        }
    })
}

module.exports = {
    getTimeslot,
    getTimeslotbyId,
    createTimeslot,
    updateTimeSlot,
}