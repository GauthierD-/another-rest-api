'use strict'

const { isString } = require('lodash')
const { ObjectID } = require('mongodb')

const settings = require('../../config')
const Database = require('../lib/class_database')

const myDb = new Database()

class Publishers {
  constructor () {
    this.collection = () => myDb.client.db().collection('publishers')
  }

  /**
   * getPublishers
   *
   * @params {Object} query
   * @params {String} query.name
   *
   * @returns {Promise<Publisher[]|Error>}
   */
  getPublishers ({ name }) {
    let query = {}
    if (isString(name)) {
      // regex: contains
      query.name = { $regex: `.*${name}*.`, $options: 'i' }
    }

    return this.collection()
      .find(query, { limit: settings.get('PUBLISHERS_LIMIT') })
      .toArray()
  }

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
  insertPublisher (publisher) {
    return this.collection()
      .insertOne(publisher)
      .then((data) => {
        if (data && data.result && data.result.n === 1 && data.result.ok === 1) {
          return data.ops[0]
        }

        throw new Error('Cannot insert document')
      })
  }

  /**
   * getOnePublisher
   *
   * @param {String} id
   *
   * @returns {Promise<Object|Error>}
   */
  getOnePublisher (id) {
    return this.collection()
      .findOne({ _id: new ObjectID(id) })
  }
}

module.exports = Publishers
