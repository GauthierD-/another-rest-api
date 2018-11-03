'use strict'

const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

const TEST_DB = 'testdb'

const toArrayStub = sinon.stub()
const settingsStub = sinon.stub()

const db = {
  collection: sinon.stub().returnsThis(),
  find: sinon.stub().returns({ toArray: toArrayStub })
}
settingsStub.withArgs('MONGO_MAIN_NAME').returns(TEST_DB)

const gamesControllers = proxyquire('../../src/controllers/games', {
  '../../config': {
    get: settingsStub
  },
  '../lib/databases': {
    databases: {
      mongodb: {
        [TEST_DB]: {
          db: () => db
        }
      }
    }
  }
})

test('GetGames - should throw an Error if mongo fail', (assert) => {
  assert.plan(1)
  toArrayStub.resetHistory()
  toArrayStub.rejects(new Error('TOARRAYERROR'))

  gamesControllers
    .getGames()
    .then(() => {
      assert.end('SHOULD NOT RESOLVES')
    })
    .catch((error) => {
      assert.ok(error.message === 'TOARRAYERROR')
    })
})

test('GetGames - should called find with toArray', (assert) => {
  assert.plan(1)

  toArrayStub.resetHistory()
  toArrayStub.resolves()

  gamesControllers
    .getGames()
    .then(() => {
      assert.ok(toArrayStub.called)
    })
    .catch(assert.end)
})
