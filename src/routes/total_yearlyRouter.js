const express = require('express')
const { total_yearlyController } = require('../controllers/total_yearlyController')
const router = express.Router()

router.route('/')
    .get(total_yearlyController.getAll)
    .post(total_yearlyController.postData)

module.exports = router