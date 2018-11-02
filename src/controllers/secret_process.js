'use strict'

const Promise = require('bluebird')
const subMonths = require('date-fns/sub_months')

const settings = require('../../config')
const { databases } = require('../lib/databases')

/**
 * secretProcess
 *
 * @returns {Promise<>}
 */
const secretProcess = Promise.method(() => {
  const mongoClient = databases.mongodb[settings.get('MONGO_MAIN_NAME')]
  const gamesCollection = mongoClient.db().collection('games')

  const eighteenMonthAgo = subMonths(new Date(), 18)
  const twelveMonthsAgo = subMonths(new Date(), 12)

  return Promise.all([
    gamesCollection.deleteMany({
      releaseDate: { $lt: eighteenMonthAgo }
    }),
    gamesCollection.updateMany(
      { releaseDate: { $gt: eighteenMonthAgo, $lt: twelveMonthsAgo } },
      { $mul: { price: 0.8 } }
    )
  ])
})

module.exports = {
  secretProcess
}
