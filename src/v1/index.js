'use strict'

const express = require('express')
const router = express.Router()

const gamesRoutes = require('./games')
const publishersRoutes = require('./publishers')

router.use('/games', gamesRoutes)
router.use('/publishers', publishersRoutes)

module.exports = router
