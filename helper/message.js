const message = {
    unauthorizedError: {
        code: '401',
        message: 'Invalid Email or Password',
    },
    accountNotVerified:{
        code: '401',
        message:"your account is not verified"
    },
    notFound:{
        code:'404',
        message:'Request not found'
    },
    authValiationError: {
         code: '422',
         message: 'Invalid Email or Password',
     },
     badRequest: {
        code: '422',
        message: 'Required fields are missing',
        reason: ''
    },
    invalidCode: {
        code: '422',
        message: 'Invalid verification code',
        reason: ''
    },
    internalServerError:{
        code:'500',
        message:'Internal server error'
    },
    requiredFields: {
        code: '501',
        message: 'Required fields are missing',
        reason: ''
    },
    dbError: {
        code: '502',
        message: 'Database Error',
        reason: ''
    },
    cannotDeleteData: {
        code: '503',
        message: 'cannot delete data',
        reason: ''
    },
    dataAlreadyExist: {
        code: '504',
        message: 'Data already exist',
        reason: ''
    },
   
    //success messages
    successData: {
        status:'success',
        data:{}
    }, 



}

module.exports = message