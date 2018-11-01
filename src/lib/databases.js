'use strict'

const Promise = require('bluebird')
const { merge, isFunction } = require('lodash')

const globalOptions = {
  promiseLibrary: Promise,
  useNewUrlParser: true
}

const databases = {
  mongodb: {}
  // memcached ?
  // redis ?
}

const mongoConnect = Promise.method((connectionUri, overrideOptions) => {
  const mongo = require('mongodb')
  const options = merge({}, globalOptions, overrideOptions)

  return mongo.MongoClient.connect(connectionUri, options)
    .then((client) => {
      const dbName = client.db().databaseName
      // const log = debug(`database:${dbName}:log`)
      // const error = debug(`database:${dbName}:error`)

      // log('Connected')
      console.log('Connected')
      databases.mongodb[dbName] = client

      client.db().on('close', (mongoError) => {
        // log('Socket closed', mongoError)
        console.log('Socket closed', mongoError)
      })
      client.db().on('error', (mongoError) => {
        // error('Error', mongoError)
        console.log('Error', mongoError)
      })
      client.db().on('parseError', (mongoError) => {
        // error('Parse error', mongoError)
        console.log('Parse error', mongoError)
      })
      client.db().on('reconnect', () => {
        // log('Reconnected')
        console.log('Reconnect')
      })
      client.db().on('timeout', (mongoError) => {
        // error('Timeout', mongoError)
        console.log('Timeout', mongoError)
      })

      return client
    })
})

const disconnect = Promise.method((client) => {
  if (!client) {
    throw new TypeError('client is undefined')
  }
  if (!isFunction(client.db)) {
    throw new TypeError('client.db is not a Function')
  }
  if (!client.db()) {
    throw new TypeError('client.db() is undefined')
  }
  if (!isFunction(client.close)) {
    throw new TypeError('client has no close method. Is it a MongoClient instance?')
  }
  const dbName = client.db().databaseName
  // const log = debug(`database:${dbName}:log`)
  // const error = debug(`database:${dbName}:error`)

  return client.close()
    .then(() => {
      delete databases.mongodb[dbName]
      // log('Connection closed')
      console.log('Connection closed')
    }).catch((err) => {
      // error('Failed to close connection', err)
      console.log('Failed to close connection', err)
      throw err
    })
})

const cleanDatabases = Promise.method(() => {
  const mongoKeys = Object.keys(databases.mongodb)

  return Promise.map(mongoKeys, (dbName) => {
    return disconnect(databases.mongodb[dbName])
  })
})

module.exports = {
  mongoConnect,
  databases,
  cleanDatabases
}
