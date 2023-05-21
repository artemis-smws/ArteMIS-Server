const express = require('express')
const router = express.Router()

const {BuildingController} = require('../controllers/buildingController')

//set id to campus name
router.route('/:id')
    .put(BuildingController.addBuilding)
    .delete(BuildingController.deleteBuilding)
    .get(BuildingController.getBuilding)
router.get('/', BuildingController.getAllBuilding) 

module.exports = router