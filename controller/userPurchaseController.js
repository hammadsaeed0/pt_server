const userPurchases = require('../model/userPurchases')
const { getAllData, getDataById, create, isDataExist, findAndUpdateData } = require('../services/dbQueries')
const{ errorHandler , message} = require('../helper')
const { requiredFields, cannotDeleteData } = message

const makePurchase= (req,res)=>{
   try {
    const { 
        email,
       packageId,
       transactionId,
       expireDate,
       purchasedPackageDetails,
       billingDetails,
       userId}=req.body

       if(!email ||!packageId || !transactionId || !expireDate || !purchasedPackageDetails || !billingDetails || !userId){
            
       }       
   } catch (error) {
       
   }
  
}