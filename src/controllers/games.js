'use strict'

const { ObjectID } = require('mongodb')

const settings = require('../../config')
const Database = require('../lib/class_database')

const myDb = new Database()

class Games {
  constructor () {
    this.collection = () => myDb.client.db().collection('games')
  }

  /**
   * getGames
   *
   * @returns {Promise<Array|Error>}
   */
  getGames () {
    return this.collection()
      .find({}, { limit: settings.get('GAMES_LIMIT') })
      .toArray()
  }

  /**
   * getOneGame
   *
   * @param {String} id
   *
   * @returns {Promise<Object|Error>}
   */
  getOneGame (id) {
    return this.collection()
      .findOne({ _id: new ObjectID(id) })
  }

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
   * @returns {Promise<Game|Error>}
   */
  insertGame (game) {
    return this.collection()
      .insertOne(game)
      .then((data) => {
        if (data && data.result && data.result.n === 1 && data.result.ok === 1) {
          return data.ops[0]
        }

        throw new Error('Cannot insert document')
      })
  }

  /**
   * updateGame
   *
   * @params {Object} data
   * @params {String} data.id
   * @params {Object} data.updateData
   *
   * @returns {Promise<game|Error>}
   */
  updateGame ({ id, updateData }) {
    return this.collection()
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
  }

  /**
   * deleteGame
   *
   * @params {Object} data
   * @params {String} data.id
   *
   * @returns {Promise<Game|Error>}
   */
  deleteGame ({ id }) {
    return this.collection()
      .findOneAndDelete({ _id: new ObjectID(id) })
      .then((data) => {
        if (data && data.lastErrorObject && data.lastErrorObject.n === 0) {
          throw new Error('Game does not exist')
        }

        return data.value
      })
  }
}

module.exports = Games
