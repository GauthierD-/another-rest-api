'use strict'

const Promise = require('bluebird')
const subMonths = require('date-fns/sub_months')

const Database = require('../lib/class_database')

const myDb = new Database()

/**
 * secretProcess
 *
 * @returns {Promise<>}
 */
const secretProcess = Promise.method(() => {
  const gamesCollection = myDb.client.db().collection('games')

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
    .then(([ firstProcess, secondProcess ]) => {
      return {
        deletedLines: (firstProcess && firstProcess.result && firstProcess.result.n) || 0,
        updatedLines: (secondProcess && secondProcess.result && firstProcess.result.nModified) || 0
      }
    })
})

module.exports = {
  secretProcess
}
