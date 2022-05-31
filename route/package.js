const express = require('express')
const router = express.Router()
const { createPackage, getPackageByPackageTypeId,updatePackage, getPackages, deletePackage, getPackagebyId } = require('../controller/package')


router.post('/create', createPackage)
router.post('/update', updatePackage)
router.get('/', getPackages)
router.get('/packageByPackageTypeId',getPackageByPackageTypeId)

router.post('/deletePackage', deletePackage)
router.post('/packageById', getPackagebyId)

module.exports = router