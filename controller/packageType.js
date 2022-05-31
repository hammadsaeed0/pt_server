const PackageType = require('../model/packageType')
const Package = require('../model/package')
const { getAllData, getDataById, create, isDataExist, findAndUpdateData } = require('../services/dbQueries')
const{ errorHandler , message} = require('../helper')
const { requiredFields, cannotDeleteData } = message
const { upload } = require('../helper/s3Multer')

const getPackageTypes = (req, res) => {
    getAllData(PackageType, res)

}
const getPackageTypebyId = (req, res) => {
    getDataById(PackageType, req.query.id, res)
}

const createPackageType = async(req, res) => {
    let { name,  image } = req.body
    if (!name || !image) {
        requiredFields.reason = 'name , about and image field is required'
        return errorHandler(requiredFields, res)
    } else {
       
        let message = 'Package type created successfully'
        create(PackageType, req.body, res, message)
    }
}

const updatePackageType = async(req, res) => {
    let itemId = req.query.id
    let {name, status} = req.body
    let successMsg= "Package type updated successfully"
    
    if (!name) {
        requiredFields.message ='name field is required'
        return errorHandler(requiredFields, res)
    }
    if(status==='disable'){
        //check if any package exist in package table for this package type
        isDataExist(Package,{ packageTypeId:itemId}, (packageExist)=>{
            console.log(packageExist)
            if(packageExist){
                cannotDeleteData.message='Cannot delete record , This package type contains packages'
                cannotDeleteData.reason= cannotDeleteData.message
                return errorHandler(cannotDeleteData,res)
            }else{
               return findAndUpdateData(PackageType, itemId ,req.body, res, successMsg )
            }
        })    
    }  else{
        findAndUpdateData(PackageType, itemId ,req.body, res, successMsg )
    }
}

module.exports = {
    getPackageTypes,
    getPackageTypebyId,
    createPackageType,
    updatePackageType,
}