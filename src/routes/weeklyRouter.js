const express = require('express')
const { WeeklyRouter } = require('../controllers/weeklyController')
const router = express.Router()


router.route('/')
    .get(WeeklyRouter.getAll)