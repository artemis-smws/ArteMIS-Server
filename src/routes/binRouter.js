const express = require('express')
const router = express.Router()
const {BinStatusController} = require('../controllers/binStatusController')

router.route('/latest/:trashbin_name')
    .get(BinStatusController.getLatestBinStatus)
router.route('/')
    .get(BinStatusController.getAllBin)
    .post(BinStatusController.addBin)
router.route('/:id')
    .get(BinStatusController.getBin)
    .patch(BinStatusController.patchBin)

    
module.exports = router