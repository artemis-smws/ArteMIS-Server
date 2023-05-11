const express = require('express')
const { WasteController } = require('../controllers/wasteController')
const router = express.Router()

router.use(express.urlencoded({extended: true}))

router.route('/')
    .get(WasteController.getAllWaste)
    // testing route - delete at deployment
    .post(WasteController.postWaste)
router.get("/latest", WasteController.getLatest)

router.route('/:id')
    .get(WasteController.getWaste)
    .delete(WasteController.deleteWaste)
    .patch(WasteController.patchWaste)

module.exports = router