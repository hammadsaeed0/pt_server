const express = require('express')
const router= express.Router()
const { updateUser,getUserbyId, getUsers}= require('../controller/user')



router.post('/update', updateUser)
router.get('/', getUsers)
// router.post('/userById', getUserbyId)
router.get('/getUserById', getUserbyId)
// router.post('user/deletePackageType/:id', deletePackageType)
// router.post('user/getPackageType/:id', getPackageTypebyId)

module.exports = router