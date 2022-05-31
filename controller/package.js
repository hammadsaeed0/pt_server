const { errorHandler, message } = require('../helper')
const { create, getDataById, getAllData } = require('../services/dbQueries')
const Package = require('../model/package')
const mongoose = require('mongoose')
const { dataAlreadyExist, dbError, requiredFields } = message

const getPackages = (req, res) => {
    //    getAllData(Package,res)
    Package.find()
        .populate('packageTypeId')
        .exec(function (err, data) {
            if (err) return handleError(err);
            if (data) {
                res.status(200).json({ data})
            }
        })
}

const getPackagebyId = (req, res) => {
    getDataById(Package, req.query.id, res)
}

const createPackage = (req, res) => {
    Package.findOne({ name: req.body.name }, (err, data) => {
        if (data) {
            dataAlreadyExist.message = "Package already exist"
            errorHandler(dataAlreadyExist, res)

        }
        if (err) {
            dbError.reason = err
            errorHandler(dbError, res)
        }
        if (!data && !err) {
            // const newObj = {        
            //     name: req.body.name,
            //     image: req.body.image,
            //     packages:req.body.packages,
            //     about:req.body.about
            // }
            const success = {
                status: 'success',
                message: 'Package created successfully',
                data: req.body
            }
            create(Package, req.body, res, success)
        }

    })




}

const updatePackage = (req, res) => {
    let itemId = req.query.id
    let item = req.body

    if (!item.name) {
        requiredFields.reason = 'Package name is required'
        return res.status(requiredFields.code).json(requiredFields)

    }

    Package.findById({ _id: itemId }, (err, data) => {
        if (err) {
            dbError.reason = err
            return errorHandler(dbError, res)
        }
        if (data) {

            Package.findByIdAndUpdate({ _id: itemId }, item, (err, data) => {
                if (err) {
                    return errorHandler(dbError, res)
                }
                if (data) {
                    return res.status(200).json({
                        message: 'Package updated successfully',
                    })
                }
            })

        }
    })
}


const getPackageByPackageTypeId= (req, res) => {
    let itemId = req.query.id
    Package.find({ packageTypeId:new mongoose.Types.ObjectId(itemId) }, (err, data) => {
        if(data){
            res.status(200).json({
                data:data
            })
        }else{
            dbError.reason = err
            return errorHandler(dbError, res)
        }
    })
}

const deletePackage = (req, res) => {
    res.send('delete Package', req.body.params)
}

module.exports = {
    getPackages,
    getPackagebyId,
    createPackage,
    updatePackage,
    deletePackage,
    getPackageByPackageTypeId
}