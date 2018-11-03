'use strict'

const Promise = require('bluebird')
const { isString } = require('lodash')
const { ObjectID } = require('mongodb')

const settings = require('../../config')
const { databases } = require('../lib/databases')

/**
 * getPublishers
 *
 * @params {Object} query
 * @params {String} query.name
 *
 * @returns {Promise<Publisher[]|Error>}
 */
const getPublishers = Promise.method(({ name }) => {
  const mongoClient = databases.mongodb[settings.get('MONGO_MAIN_NAME')]

  let query = {}
  if (isString(name)) {
    // regex: contains
    query.name = { $regex: `.*${name}*.`, $options: 'i' }
  }

  return mongoClient.db().collection('publishers')
    .find(query, { limit: settings.get('PUBLISHERS_LIMIT') })
    .toArray()
})

/**
 * insertPublisher
 *
 * @param {Object} publisher
 * @param {String} publisher.name
 * @param {Number} publisher.siret
 * @param {Number} publisher.phone
 *
 * @returns {Promise<Boolean|Error>}
 */
const insertPublisher = Promise.method((publisher) => {
  const mongoClient = databases.mongodb[settings.get('MONGO_MAIN_NAME')]

  return mongoClient.db().collection('publishers')
    .insertOne(publisher)
    .then((data) => {
      if (data && data.result && data.result.n === 1 && data.result.ok === 1) {
        return true
      }

      throw new Error('Cannot insert document')
    })
})

/**
 * getOnePublisher
 *
 * @param {String} id
 *
 * @returns {Promise<Object|Error>}
 */
const getOnePublisher = Promise.method((id) => {
  const mongoClient = databases.mongodb[settings.get('MONGO_MAIN_NAME')]

  return mongoClient.db().collection('publishers')
    .findOne({ _id: new ObjectID(id) })
})

module.exports = {
  getPublishers,
  insertPublisher,
  getOnePublisher
}
