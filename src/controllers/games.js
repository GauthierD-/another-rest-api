'use strict'

const Promise = require('bluebird')
const { ObjectID } = require('mongodb')

const settings = require('../../config')
const { databases } = require('../lib/databases')

/**
 * getGames
 *
 * @returns {Promise<Array|Error>}
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
 * @returns {Promise<Object|Error>}
 */
const getOneGame = Promise.method((id) => {
  const mongoClient = databases.mongodb[settings.get('MONGO_MAIN_NAME')]

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
 * @returns {Promise<Boolean|Error>}
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

/**
 * updateGame
 *
 * @params {Object} data
 * @params {String} data.id
 * @params {Object} data.updateData
 *
 * @returns {Promise<game|Error>}
 */
const updateGame = Promise.method(({ id, updateData }) => {
  const mongoClient = databases.mongodb[settings.get('MONGO_MAIN_NAME')]

  return mongoClient.db().collection('games')
    .findOneAndUpdate(
      { _id: new ObjectID(id) },
      { $set: updateData },
      { returnOriginal: false }
    )
    .then((data) => {
      if (data && data.lastErrorObject && !data.lastErrorObject.updatedExisting) {
        throw new Error('Game does not exist')
      }

      return data.value
    })
})

/**
 * deleteGame
 *
 * @params {Object} data
 * @params {String} data.id
 *
 * @returns {Promise<Game|Error>}
 */
const deleteGame = Promise.method(({ id }) => {
  const mongoClient = databases.mongodb[settings.get('MONGO_MAIN_NAME')]

  return mongoClient.db().collection('games')
    .findOneAndDelete({ _id: new ObjectID(id) })
    .then((data) => {
      if (data && data.lastErrorObject && data.lastErrorObject.n === 0) {
        throw new Error('Game does not exist')
      }

      return data.value
    })
})

module.exports = {
  getGames,
  getOneGame,
  insertGame,
  updateGame,
  deleteGame
}
