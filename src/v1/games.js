'use strict'

const express = require('express')
const { pick, isString, isNumber, isArray, isDate } = require('lodash')

const router = express.Router()

const {
  getGames,
  getOneGame,
  insertGame
  // updateGame,
  // deleteGame
} = require('../controllers/games')

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

  console.log('>>>', req.body)
  if (!title || !price || !publisher || !tags || !releaseDate) {
    return next(new Error('400 - missing informations'))
  }

  if (
    !isString(title) ||
    !isNumber(price) ||
    !isString(publisher) ||
    !isArray(tags) ||
    !isDate(new Date(releaseDate))
  ) {
    return next(new Error('400 - Bad informations'))
  }

  let game = pick(req.body, ['title', 'price', 'publisher', 'tags', 'releaseDate'])
  game = Object.assign({}, game, { releaseDate: new Date(game.releaseDate) })

  return insertGame(game)
    .then((result) => {
      return res.json({ data: result })
    })
    .catch(next)
})

module.exports = router
