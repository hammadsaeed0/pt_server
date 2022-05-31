const express = require('express')
const router = express.Router()
const {getTrainer, getTrainerbyId, getActiveTrainer, createTrainer, updateTrainer, } = require('../controller/trainer')


router.post('/create', createTrainer)
router.post('/update', updateTrainer)
router.get('/', getTrainer)
router.get('/active', getActiveTrainer)
router.post('/trainerById', getTrainerbyId)

module.exports = router