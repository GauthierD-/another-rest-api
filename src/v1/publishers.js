'use strict'

const express = require('express')
const { pick, isString, isNumber } = require('lodash')

const router = express.Router()

const {
  getPublishers,
  insertPublisher,
  getOnePublisher
} = require('../controllers/publishers')

router.get('/', (req, res, next) => {
  return getPublishers(req.query)
    .then((result) => {
      return res.json({ data: result })
    })
    .catch(next)
})

router.get('/:id', (req, res, next) => {
  return getOnePublisher(req.params.id)
    .then((result) => {
      return res.json({ data: result })
    })
    .catch(next)
})

router.post('/', (req, res, next) => {
  const { name, siret, phone } = req.body

  if (!name || !siret || !phone) {
    return next(new Error('400 - missing informations'))
  }

  if (!isString(name) || !isNumber(siret) || !isNumber(phone)) {
    return next(new Error('400 - Bad informations'))
  }

  const publisher = pick(req.body, ['name', 'siret', 'phone'])

  return insertPublisher(publisher)
    .then((result) => {
      return res.json({ data: result })
    })
    .catch(next)
})

module.exports = router
