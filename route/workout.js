const express = require('express')
const router = express.Router()
const {getWorkout, getWorkoutbyId, createWorkout, updateWorkout, } = require('../controller/workout')


router.post('/create', createWorkout)
router.post('/update', updateWorkout)
router.get('/', getWorkout)
router.post('/WorkoutById', getWorkoutbyId)

module.exports = router