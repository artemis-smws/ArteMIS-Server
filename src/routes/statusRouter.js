const express = require('express')
const { statusController } = require('../controllers/statusController')
const { WeeklyRouter } = require('../controllers/weeklyController')
const router = express.Router()

router.route('/')
    .get(statusController.getAllStatus)
    .post(statusController.postData)
router.get('/yearly', statusController.getAllYearly)
router.get('/monthly', statusController.getAllMonthly)
router.get('/weekly', WeeklyRouter.getAll)

module.exports = router