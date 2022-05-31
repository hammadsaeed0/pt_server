const { errorHandler , message } = require("../helper")
const { notFound } = require("../helper/message")
const { dbError, successData, dataAlreadyExist,invalidCode  } = message

const create = async (model, dataObj, response, successMsg,next) => {
    try {

        const newObj = new model(dataObj)
        let res = await newObj.save()
        if (res && successMsg) {
            successData.message = successMsg
            successData.data = res.data
            response.status(200).json(successData)

            if (res.error) {
                throw res.error
            }
        }
        next && next(res)

    } catch (error) {
        console.log('error', error)
        if (error.code === 11000) {
            dataAlreadyExist.reason = error
            errorHandler(dataAlreadyExist, response)
    
        } else {
            dbError.reason = error
            errorHandler( dbError, response)
        }
    }
}
const getDataById = async (model, id, response) => {
    try {
        let res = await model.findById({_id:id})
        if (res.data) {
            success.data = res.data
            response.status(200).json(success)
            return res.data
        } else if (res.err) {
            dbError.reason = res.err
            errorHandler(dbError, response)
        }

    } catch (error) {
        console.log('error', error)
        dbError.reason = error
        errorHandler(dbError, response)
    }

}
const getAllData = async (model, response) => {
    try {
        let res = await model.find()
        console.log(res)
        if (res) {
            successData.data = res
            response.status(200).json(successData)
        }
    } catch (error) {
        console.log('error', error)
        dbError.reason = error
        errorHandler(dbError, response)
    }
}
const isDataExist = async (model, keyObj, next, response) => {
    try {
        let res = await model.exists(keyObj)
        next(res)
    } catch (error) {
        console.log('error', error)
    }

}

const findAndUpdateData = async (model, query , data, response, successMsg, next) => {
    try {
        // if the user send id it will be of trype string otherwise object of key and value
        let res =  typeof query ==='string'?
          await model.findByIdAndUpdate(query, data):
          await model.findOneAndUpdate(query, data)
          console.log(res)
        
        if (res) {
            if (res.error) {
                throw res.error
            }
           if(successMsg){
            successData.message = successMsg
            delete successData.data
            response.status(200).json(successData)
        }
        if(next) next(res)
        }
         else {
             throw notFound
         }

    } catch (error) {
        console.log('error', error)
        dbError.reason = error
        errorHandler(typeof error==='object'? error: dbError, response)
    }
}

const updateDataByID = async (model, id , data, response, successMsg) => {
    try {
        // if the user send id it will be of trype string otherwise object of key and value
        let res =  await model.findByIdAndUpdate(id, data)
        console.log(res)
        if (res) {
            if (res.error) {
                throw res.error
            }
            if(successMsg){
                successData.message = successMsg
                delete successData.data
                response.status(200).json(successData)
            }else{
                return res
            }
        }
        

    } catch (error) {
        console.log('error', error)
        dbError.reason = error
        errorHandler(typeof error==='object'? error: dbError, response)
    }
}


module.exports = {
    create,
    getDataById,
    getAllData,
    isDataExist,
    findAndUpdateData,
    updateDataByID
}