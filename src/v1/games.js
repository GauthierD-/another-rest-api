'use strict'

const express = require('express')
const { ObjectID } = require('mongodb')
const isValid = require('date-fns/is_valid')
const { pick, isString, isNumber, isArray } = require('lodash')

const router = express.Router()

const {
  getGames,
  getOneGame,
  insertGame,
  updateGame,
  deleteGame
} = require('../controllers/games')
const { getOnePublisher } = require('../controllers/publishers')

router.get('/', (req, res, next) => {
  return getGames()
    .then((result) => {
      return res.json({ data: result })
    })
    .catch(next)
})

router.get('/:id', (req, res, next) => {
  return getOneGame(req.params.id)
    .then((result) => {
      return res.json({ data: result })
    })
    .catch(next)
})

router.post('/', (req, res, next) => {
  const { title, price, publisher, tags, releaseDate } = req.body

  if (!title || !price || !publisher || !tags || !releaseDate) {
    return next(new Error('400 - missing informations'))
  }

  if (
    !isString(title) ||
    !isNumber(price) ||
    !isString(publisher) ||
    !isArray(tags) ||
    !isValid(new Date(releaseDate))
  ) {
    return next(new Error('400 - Bad informations'))
  }

  let game = pick(req.body, ['title', 'price', 'publisher', 'tags', 'releaseDate'])
  game = Object.assign({}, game, { releaseDate: new Date(game.releaseDate) })

  // create game only if publisher exists
  return getOnePublisher(game.publisher)
    .then((result) => {
      if (!result) {
        throw new Error(`Publisher ${game.publisher} does not exist`)
      }
    })
    .then(() => {
      return insertGame(game)
        .then((result) => {
          return res.json({ data: result })
        })
    })
    .catch(next)
})

router.patch('/:id', (req, res, next) => {
  const { title, price, publisher, tags, releaseDate } = req.body

  if (!isString(req.params.id) || !ObjectID.isValid(req.params.id)) {
    throw new Error('400 - GameID is not correct')
  }
  if (title && !isString(title)) {
    return next(new Error('400 - title is not a String'))
  }
  if (price && !isNumber(price)) {
    return next(new Error('400 - price is not a Number'))
  }
  if (publisher && !ObjectID.isValid(publisher)) {
    return next(new Error('400 - publisher is not correct'))
  }
  if (tags && !isArray(tags)) {
    return next(new Error('400 - tags is not a Array'))
  }
  if (releaseDate && !isValid(new Date(releaseDate))) {
    return next(new Error('400 - releaseDate is not a String date'))
  }

  let waitFor = Promise.resolve()
  if (publisher) {
    waitFor = getOnePublisher(publisher)
      .then((result) => {
        if (!result) {
          throw new Error(`Publisher ${publisher} does not exist`)
        }

        return result
      })
  }

  return waitFor
    .then((result) => {
      let updateData = pick(req.body, ['title', 'price', 'publisher', 'tags', 'releaseDate'])
      if (updateData.releaseDate) {
        updateData = Object.assign({}, updateData, { releaseDate: new Date(updateData.releaseDate) })
      }

      return updateGame({ id: req.params.id, updateData })
    })
    .then((result) => {
      return res.json({ data: result })
    })
    .catch(next)
})

router.delete('/:id', (req, res, next) => {
  if (!isString(req.params.id) || !ObjectID.isValid(req.params.id)) {
    throw new Error('400 - GameID is not correct')
  }

  return deleteGame({ id: req.params.id })
    .then((result) => {
      res.json({ data: result })
    })
    .catch(next)
})

module.exports = router
