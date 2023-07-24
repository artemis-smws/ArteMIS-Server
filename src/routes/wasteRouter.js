const express = require('express')
const { WasteController } = require('../controllers/wasteController')
const { collection } = require('firebase/firestore')
const db = require('../config/firebase')
const { calculateTotalMiddleware } = require('../services/calculateTotal')
const { calculateAverageMiddleware } = require('../services/calculateAverage')
const { calculateMonthlyMiddleware } = require('../services/calculateMonthly')
const router = express.Router()

const wasteRef = collection(db, 'waste')

router.use(express.urlencoded({extended: true}))

router.route('/')
    .get(WasteController.getAllWaste)
    // testing route - delete at deployment
    .post(WasteController.postWaste)
   
router.get('/highest', WasteController.getHighest)
router.get('/lowest', WasteController.getLowest)
router.get('/latest', WasteController.getLatest)
router.get('/latest/7days', WasteController.getLast7Days)
router.get('/latest/30days', WasteController.getLast30Days)

router.route('/:id')
    .get(WasteController.getWaste)
    .delete(WasteController.deleteWaste)
    .patch(calculateTotalMiddleware, calculateMonthlyMiddleware ,calculateAverageMiddleware, WasteController.patchWaste)
    .put(calculateTotalMiddleware, calculateMonthlyMiddleware, calculateAverageMiddleware, WasteController.patchWaste)

module.exports = router