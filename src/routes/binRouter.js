const express = require('express')
const router = express.Router()
const {BinStatusController} = require('../controllers/binStatusController')
const { collection, doc, setDoc} = require('firebase/firestore')
const db = require('../config/firebase')
const { CRUD } = require('../utils/crud')
const BinDataModel = require('../models/binWasteSchema')
const createDateId = require('../utils/createDateId')

router.route('/latest/:trashbin_name')
    .get(BinStatusController.getLatestBinStatus)
router.route('/')
    .get(BinStatusController.getAllBin)
    .post(BinStatusController.addBin)
router.route('/add-latest')
    .get(BinStatusController.addLatestBinStatus)
router.route('/:id')
    .get(BinStatusController.getBin)
    .post(BinStatusController.patchBin)
    
module.exports = router