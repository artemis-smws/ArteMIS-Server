const express = require('express')
const router = express.Router()
const {ReportsController} = require('../controllers/reportsController')

router.route('/')
    .get(ReportsController.getAllReport)
    .post(ReportsController.postReport)
router.route('/:id')
    .get(ReportsController.getReport)

module.exports = router