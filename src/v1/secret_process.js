'use strict'

const express = require('express')
const router = express.Router()

const { secretProcess } = require('../controllers/secret_process')

router.get('/', (req, res, next) => {
  return res.json({ data: 'the cake is a lie' })
})

router.post('/', (req, res, next) => {
  return secretProcess()
    .then(() => {
      return res.json({ data: 'Well done!' })
    })
    .catch(next)
})

module.exports = router
