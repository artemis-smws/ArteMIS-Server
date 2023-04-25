const express = require('express')
const router = express.Router()

router.use(express.urlencoded({extended: true}))

router.route('/')
    .get((req, res) => {
        res.send("Successfully fetched data!")
    })

module.exports = router