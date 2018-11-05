'use strict'

const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

const toArrayStub = sinon.stub()
const db = {
  collection: sinon.stub().returnsThis(),
  find: sinon.stub().returns({ toArray: toArrayStub })
}

class DatabaseStub {
  constructor () {
    this.client = {
      db: () => db
    }
  }
}

const Games = proxyquire('../../src/controllers/games', {
  '../lib/class_database': DatabaseStub
})

test('GetGames - should throw an Error if mongo fail', (assert) => {
  assert.plan(1)
  toArrayStub.resetHistory()
  toArrayStub.rejects(new Error('TOARRAYERROR'))

  const myGames = new Games()
  myGames.getGames()
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

  const myGames = new Games()
  myGames.getGames()
    .then(() => {
      assert.ok(toArrayStub.called)
    })
    .catch(assert.end)
})
