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

const Publishers = proxyquire('../../src/controllers/publishers', {
  '../lib/class_database': DatabaseStub
})

test('[Publishers] - getPublishers - should throw an Error if mongo fail', (assert) => {
  assert.plan(1)
  toArrayStub.resetHistory()
  toArrayStub.rejects(new Error('TOARRAYERROR'))

  const myPublishers = new Publishers()
  myPublishers.getPublishers()
    .then(() => {
      assert.end('SHOULD NOT RESOLVES')
    })
    .catch((error) => {
      assert.ok(error.message === 'TOARRAYERROR')
    })
})

test('[Publishers] - getPublishers - should works and call find() with toArray()', (assert) => {
  assert.plan(1)

  toArrayStub.resetHistory()
  toArrayStub.resolves()

  const myPublishers = new Publishers()
  myPublishers.getPublishers()
    .then(() => {
      assert.ok(toArrayStub.called)
    })
    .catch(assert.end)
})
