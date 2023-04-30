const express = require('express')
const router = express.Router()
const { TrashbinController } = require('../controllers/trashbinController')

router.route('/')
    .get(TrashbinController.getAllTrashbin)
router.route('/:id')
    .get(TrashbinController.getTrashbin)
    .post(TrashbinController.addTrashbin)
    .delete(TrashbinController.deleteTrashbin)


module.exports = router