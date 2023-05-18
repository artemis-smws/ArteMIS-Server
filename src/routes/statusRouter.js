const express = require('express')
const { statusController } = require('../controllers/statusController')
const router = express.Router()

router.route('/')
    .get(statusController.getAllStatus)
    .post(statusController.postData)
router.get('/yearly', statusController.getAllYearly)
router.get('/monthly', statusController.getAllMonthly)

module.exports = router