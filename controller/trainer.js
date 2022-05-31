const { errorHandler , message } = require('../helper')
const { create, getDataById, getAllData } = require('../services/dbQueries')
const Trainer = require('../model/trainer')
const User= require('../model/user')
const { dataAlreadyExist, dbError, requiredFields } = message

const createTrainer = (req, res) => {
    const itemId= req.query.id //to create user we will use user id
    try {
        
        User.findOne({_id:itemId},async(err,data)=>{
            if(err){
                dbError.reason=err
                errorHandler(dbError,res)
            }else{
               

                if(data.trainer){
                    dataAlreadyExist.message ="Trainer Already Exist"
                    errorHandler(dataAlreadyExist ,res)
                }else{
                    const trainer = new Trainer(req.body)                
                    const savedTrainer = await trainer.save()
                 
                    if(savedTrainer._id){               
                        
                       User.findByIdAndUpdate({_id: itemId}, {trainer: savedTrainer._id ,role:"trainer" }, async (err2, data2)=>{
                            if(err2){
                                dbError.reason= err2
                                errorHandler(dbError,res)
                            }
                            if(data2){

                                    console.log("user 2 res =========================", data2)
                                  
                                res.json({
                                    status: 'success',
                                    message: 'Your trainer profile has been sent for review',
                                    data: savedTrainer
                                })
                            }
                       })
                }
                    
                }
            }

        })
    } catch (error) {   
        errorHandler(error,res)
    }
  
    // Trainer.findOne({ name: req.body.name }, (err, data) => {
    //     if (data) {
    //         dataAlreadyExist.message = "Trainer already exist"
    //         errorHandler(dataAlreadyExist, res)
    //     }
    //     if (err) {
    //         dbError.reason=err
    //         errorHandler(dbError, res)
    //     }
    //     if (!data && !err) {
    //         const newObj = {        
    //             name: req.body.name,
    //             image: req.body.image,
    //             Trainers:req.body.Trainers,
    //             about:req.body.about
    //         }
    //         const success= {
    //             status:'success',
    //             message: 'Trainer  created successfully',
    //             data: data
    //         }
    //           create(Trainer,newObj, res, success)        
    //     }

    // })

}


const getTrainer = (req, res) => {

    User.find({role:"trainer"})
        .populate('profile')
        .populate('trainer')
        .exec(function (err, data) {
            if (err) return handleError(err);
            if (data) {
                let temp=[]
                data.forEach(element => {
                    temp.push({
                    _id: element._id, // userid 
                    email:element.email,
                    profile:element.profile, // in profile you will get user details along with profile id
                    trainer:element.trainer,  // in trainer you will get trainer details along with trainer id
                    isVerified:element.isVerified,
                    role:element.role,
                    userStatus:element.userStatus
                    })
                });
              res.status(200).json({data:temp})
          }
        })
}


const getActiveTrainer = (req, res) => {

    User.find({role:"trainer",})
        .populate('profile')
        .populate('trainer')
        .exec(function (err, data) {
            if (err) return handleError(err);
            if (data) {
                let temp=[]
                data.forEach(element => {
                    if(element.trainer.trainerStatus==="active"){
               
                        temp.push({
                        _id: element._id, // userid 
                        email:element.email,
                        profile:element.profile, // in profile you will get user details along with profile id
                        trainer:element.trainer,  // in trainer you will get trainer details along with trainer id
                        isVerified:element.isVerified,
                        role:element.role,
                        userStatus:element.userStatus
                        })
                    }
                });
              res.status(200).json({data:temp})
          }
        })
}

const updateTrainer = (req, res) => {
    let itemId = req.query.id // to update trainer related data use trainer id
    let item = req.body

    Trainer.findByIdAndUpdate({ _id: itemId }, item, (err, data) => {
        if (err) {
            return errorHandler(dbError, res)
        }
        if (data) {
            return res.status(200).json({
                message: 'Trainer updated successfully',
            })
        }
    })
}

const getTrainerbyId = (req, res) => {
    getDataById(Trainer, req.query.id, res)
}


module.exports = {
    createTrainer,
    updateTrainer,
    getTrainer,
    getActiveTrainer,
    getTrainerbyId
}