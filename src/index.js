'use strict'

const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const express = require('express')
const Promise = require('bluebird')
const bodyParser = require('body-parser')

const log = require('./lib/log')
const settings = require('../config')
const Database = require('./lib/class_database')
const errorHandler = require('./middlewares/error_handler')

const apiV1 = require('./v1')

const myDb = new Database()

const connectDb = {
  MAIN_DB: myDb.connect(settings.get('MONGO_MAIN_URL'))
}

Promise.props(connectDb)
  .then((con) => {
    const port = settings.get('PORT')
    const app = express()

    app.use(helmet())
    app.use('*', morgan(':method :url :status - :remote-user :remote-addr - in :response-time ms'))
    app.use(cors({ maxAge: 10 * 60 }))
    app.use(bodyParser.json())
    app.use(helmet())

    app.use('/health', (req, res) => {
      res.json({ ok: true })
    })

    app.use('/version', (req, res) => {
      res.json({ version: settings.get('COMMIT') || 'unavailable' })
    })

    app.use('/v1', apiV1)

    app.use(errorHandler)

    app.use((req, res) => {
      res.status(404).end('Not found')
    })

    app.listen(port, () => {
      log.info(`Another rest api service started on port ${port}`)
    })
  })
  .catch((err) => {
    gracefullExit(err)
  })

process.on('uncaughtException', (error) => {
  log.error('uncaughtException', { error })
  process.exit(1)
})

process.on('exit', gracefullExit)
process.on('SIGINT', gracefullExit)

function gracefullExit (error) {
  if (error) {
    log.error(error)
  }

  return Promise.all([
    myDb.disconnect()
  ])
    .then(() => process.exit(0))
}
