'use strict'

const express = require('express')
const router = express.Router()

const gamesRoutes = require('./games')
const publishersRoutes = require('./publishers')
const secretProcessRoutes = require('./secret_process')

router.use('/games', gamesRoutes)
router.use('/publishers', publishersRoutes)
router.use('/secret-process', secretProcessRoutes)

module.exports = router
