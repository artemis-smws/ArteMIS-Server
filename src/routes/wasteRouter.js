const express = require('express')
const { WasteController } = require('../controllers/wasteController')
const { collection, setDoc, doc } = require('firebase/firestore')
const db = require('../config/firebase')
const {defaultWasteSchema} = require('../models/defaultWasteSchema')
const { calculateTotalMiddleware } = require('../services/calculateTotal')
const { calculateAverageMiddleware } = require('../services/calculateAverage')
const { calculateMonthlyMiddleware } = require('../services/calculateMonthly')
const createDateId = require('../utils/createDateId')
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
router.post('/add-scheduled', async(req, res) => {
    const data = await defaultWasteSchema()
    const docNames = ['12-6-23', '12-7-23', '12-8-23', '12-9-23', '12-10-23', '12-11-23', '12-12-23', '12-13-23']
    await docNames.forEach(async(docname) => {
        await setDoc(doc(db, 'waste', docname), data)
    })
    res.send({message : data})
})
router.post('/reset-current', WasteController.resetCurrentWaste)

router.route('/:id')
    .get(WasteController.getWaste)
    .delete(WasteController.deleteWaste)
    // .patch(calculateTotalMiddleware, calculateMonthlyMiddleware ,calculateAverageMiddleware, WasteController.patchWaste)
    // .put(calculateTotalMiddleware, calculateMonthlyMiddleware, calculateAverageMiddleware, WasteController.patchWaste)
    .put(calculateTotalMiddleware, WasteController.patchWaste)

module.exports = router