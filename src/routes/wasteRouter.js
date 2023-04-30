const express = require('express')
const router = express.Router()

router.use(express.urlencoded({extended: true}))

router.route('/')
    .get()
    .post()

module.exports = router