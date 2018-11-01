'use strict'

const Promise = require('bluebird')
const { ObjectID } = require('mongodb')
const { isString, size } = require('lodash')

const settings = require('../../config')
const { databases } = require('../lib/databases')

/**
 * getGames
 *
 * @returns {Promise<Array>}
 */
const getGames = Promise.method(() => {
  const mongoClient = databases.mongodb[settings.get('MONGO_MAIN_NAME')]

  return mongoClient.db().collection('games')
    .find({}, { limit: settings.get('GAMES_LIMIT') })
    .toArray()
})

/**
 * getOneGame
 *
 * @param {String} id
 *
 * @returns {Promise<Object>}
 */
const getOneGame = Promise.method((id) => {
  const mongoClient = databases.mongodb[settings.get('MONGO_MAIN_NAME')]

  if (!isString(id) || size(id) !== 24) {
    throw new Error('wrong id')
  }

  return mongoClient.db().collection('games')
    .findOne({ _id: new ObjectID(id) })
})

/**
 * insertGame
 *
 * @param {Object}    game
 * @param {String}    game.title
 * @param {Number}    game.price
 * @param {Number}    game.publisher
 * @param {String[]}  game.tags
 * @param {Date}      game.releaseDate
 *
 * @returns {Promise<boolean>}
 */
const insertGame = Promise.method((game) => {
  const mongoClient = databases.mongodb[settings.get('MONGO_MAIN_NAME')]

  return mongoClient.db().collection('games')
    .insertOne(game)
    .then((data) => {
      if (data && data.result && data.result.n === 1 && data.result.ok === 1) {
        return true
      }

      throw new Error('Cannot insert document')
    })
})

module.exports = {
  getGames,
  getOneGame,
  insertGame
}
