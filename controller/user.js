
const { errorHandler, message } = require('../helper')
const { create, getDataById, getAllData } = require('../services/dbQueries')
const Profile = require('../model/profile')
const User = require('../model/user')
const { dataAlreadyExist, dbError, requiredFields } = message
const mongoose= require('mongoose')
const getUsers = async(req, res) => {
    // getAllData(User, res)
    
  
    try {
        User.find({role:'user'})
        // .select('_id','email','isVerified','role','profile')
        .populate('profile')
        .exec(function (err,data) {
          if (err) return handleError(err);
          if (data) {
              let temp=[]
            data.forEach(element => {
                temp.push({
                 _id: element._id,
                 email:element.email,
                 profile:element.profile,
                 isVerified:element.isVerified,
                 role:element.role,
                 userStatus:element.userStatus
                })
            });
            res.status(200).json({data:temp})
        }
        });
        
       
    } catch (error) {
        console.log('error', error)
        dbError.reason = error
        errorHandler(dbError, res)
    }
}

const getUserbyId = (req, res) => {
    console.log("get user by id================================",req.query.id)
    // getDataById(User, req.query.id, res)
    User.findById({_id:req.query.id})
    .populate('profile')
    .exec(function (err,data) {
      if (err) return handleError(err);
      if (data) {
        res.status(200).json({data})
        }
    });
    
}


const updateUser = (req, res) => {
    let itemId = req.query.id
    let item = req.body
    console.log("update user nbody-----------------------",item)
    
            Profile.findOneAndUpdate({ userId:  new mongoose.Types.ObjectId(itemId) }, item, (err, data) => {
                if (err) {
                    dbError.message= err
                    return errorHandler(dbError, res)
                }
                else if (data) {
                    return res.status(200).json({
                        message: 'User updated successfully',
                    })
                }else{
                    return res.status(200).json({
                        message: 'User not found',
                    })
                }

            })
}



module.exports = {
    getUsers,
    getUserbyId,
    updateUser,
}