'use strict'

const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  return res.json({ data: true })
})

module.exports = router
