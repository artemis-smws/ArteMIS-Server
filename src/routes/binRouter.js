const express = require('express')
const router = express.Router()
const {BinController} = require('../controllers/binController')

router.use(express.urlencoded({extended: true}))

router.route('/')
    .get(BinController.getAllBin)
    .post(BinController.addBin)

router.route('/:id')
    .get(BinController.getBin)

    
module.exports = router