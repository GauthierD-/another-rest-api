'use strict'

const path = require('path')
const nconf = require('nconf')

nconf
  .env()
  .file('conf', { file: 'env.json', dir: path.join(__dirname, '../etc/conf'), search: true })
  .file('secret', { file: 'secret.json', dir: path.join(__dirname, '../etc/secret'), search: true })
  .defaults({
    'PORT': 8000,
    'MONGO_MAIN_NAME': 'notsteam',
    'MONGO_MAIN_URL': 'mongodb://mongodb:27017/notsteam',
    'PUBLISHERS_LIMIT': 50,
    'GAMES_LIMIT': 30
  })

module.exports = nconf
