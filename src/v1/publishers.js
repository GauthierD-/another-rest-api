'use strict'

const express = require('express')
const { ObjectID } = require('mongodb')
const { pick, isString, isNumber } = require('lodash')

const Publishers = require('../controllers/publishers')

const myPublishers = new Publishers()
const router = express.Router()

router.get('/', (req, res, next) => {
  return myPublishers.getPublishers(req.query)
    .then((result) => {
      return res.json({ data: result })
    })
    .catch(next)
})

router.get('/:id', (req, res, next) => {
  if (!isString(req.params.id) || !ObjectID.isValid(req.params.id)) {
    throw new Error('400 - PublisherID is not correct')
  }

  return myPublishers.getOnePublisher(req.params.id)
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

  return myPublishers.insertPublisher(publisher)
    .then((result) => {
      return res.json({ data: result })
    })
    .catch(next)
})

module.exports = router
