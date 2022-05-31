const express = require('express')
const router = express.Router()
const {getTimeslot, getTimeslotbyId, createTimeslot, updateTimeSlot, } = require('../controller/Timeslot')


router.post('/create', createTimeslot)
router.post('/update', updateTimeSlot)
router.get('/', getTimeslot)
router.post('/TimeslotById', getTimeslotbyId)

module.exports = router