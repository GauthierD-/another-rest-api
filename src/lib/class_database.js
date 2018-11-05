'use strict'

const mongo = require('mongodb')
const Promise = require('bluebird')
const { merge, isFunction } = require('lodash')

const log = require('./log')

let instance = null
class Database {
  constructor () {
    if (instance) {
      return instance
    }

    this.client = null
    this.globalOptions = {
      promiseLibrary: Promise,
      useNewUrlParser: true
    }

    instance = this
  }

  connect (connectionUri, overrideOptions) {
    const options = merge({}, this.globalOptions, overrideOptions)
    return mongo.MongoClient.connect(connectionUri, options)
      .then((client) => {
        log.info('Connected')
        this.client = client

        client.db().on('close', (mongoError) => {
          log.info('Socket close', mongoError)
        })
        client.db().on('error', (mongoError) => {
          log.error('Error', mongoError)
        })
        client.db().on('parseError', (mongoError) => {
          log.info('Parse error', mongoError)
        })
        client.db().on('reconnect', () => {
          log.info('Reconnect')
        })
        client.db().on('timeout', (mongoError) => {
          log.info('Timeout', mongoError)
        })

        return client
      })
  }

  disconnect () {
    if (!this.client) {
      throw new TypeError('this.client is undefined')
    }
    if (!isFunction(this.client.db)) {
      throw new TypeError('this.client.db is not a Function')
    }
    if (!this.client.db()) {
      throw new TypeError('this.client.db() is undefined')
    }
    if (!isFunction(this.client.close)) {
      throw new TypeError('this.client.close has no close method. Is it a MongoClient instance?')
    }
    return this.client.close()
      .then(() => {
        log.info('Connection closed')
      })
      .catch((err) => {
        log.error('Failed to close connection', err)
        throw err
      })
  }
}

module.exports = Database
