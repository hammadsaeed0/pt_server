const express = require('express')
const router = express.Router()
const { createPackageType, updatePackageType, getPackageTypes, getPackageTypebyId } = require('../controller/packageType')


router.post('/create', createPackageType)
router.post('/update', updatePackageType)
router.get('/', getPackageTypes)
router.post('/packageTypeById', getPackageTypebyId)



module.exports = router