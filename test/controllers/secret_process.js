'use strict'

const test = require('tape')
const sinon = require('sinon')
const subMonths = require('date-fns/sub_months')
const isValid = require('date-fns/is_valid')
const differenceInMonths = require('date-fns/difference_in_months')
const proxyquire = require('proxyquire').noCallThru()

const db = {
  collection: sinon.stub().returnsThis(),
  deleteMany: sinon.stub(),
  updateMany: sinon.stub()
}

class DatabaseStub {
  constructor () {
    this.client = {
      db: () => db
    }
  }
}

const { secretProcess } = proxyquire('../../src/controllers/secret_process', {
  '../lib/class_database': DatabaseStub
})

test('[SECRET PROCESS] - should fail if deleteMany throw an Error ', async (assert) => {
  db.updateMany.resetHistory()
  db.updateMany.resolves()

  db.deleteMany.resetHistory()
  db.deleteMany.rejects(new Error('Delete error'))

  try {
    await secretProcess()
    assert.end('SHOULD NOT BE HERE')
  } catch (error) {
    assert.ok(error)
    assert.equal(error.message, 'Delete error')
    assert.end()
  }
})

test('[SECRET PROCESS] - should fail if updateMany throw an Error ', async (assert) => {
  db.updateMany.resetHistory()
  db.updateMany.rejects(new Error('Update error'))

  db.deleteMany.resetHistory()
  db.deleteMany.resolves()

  try {
    await secretProcess()
    assert.end('SHOULD NOT BE HERE')
  } catch (error) {
    assert.ok(error)
    assert.equal(error.message, 'Update error')
    assert.end()
  }
})

test('[SECRET PROCESS] - DeleteMany should remove only games with a releaseDate older than 18 months', async (assert) => {
  db.updateMany.resetHistory()
  db.updateMany.resolves()

  db.deleteMany.resetHistory()
  db.deleteMany.resolves()

  const eighteenMonthAgo = subMonths(new Date(), 18)

  try {
    await secretProcess()
    const args = db.deleteMany.getCall(0).args[0]
    assert.ok(isValid(args.releaseDate.$lt), 'should be a Date')
    assert.equal(differenceInMonths(args.releaseDate.$lt, eighteenMonthAgo), 0)
    assert.end()
  } catch (error) {
    assert.end(error)
  }
})

test('[SECRET PROCESS] - UpdateMany with a releaseDate between 12 and 18 months + discount 20%', async (assert) => {
  db.updateMany.resetHistory()
  db.updateMany.resolves()

  db.deleteMany.resetHistory()
  db.deleteMany.resolves()

  const eighteenMonthAgo = subMonths(new Date(), 18)
  const twelveMonthsAgo = subMonths(new Date(), 12)

  const expectedUpdate = { $mul: { price: 0.8 } }

  try {
    await secretProcess()
    const args = db.updateMany.getCall(0).args[0]
    assert.ok(isValid(args.releaseDate.$lt), 'should be a Date')
    assert.ok(isValid(args.releaseDate.$gt), 'should be a Date')
    assert.equal(differenceInMonths(args.releaseDate.$lt, twelveMonthsAgo), 0)
    assert.equal(differenceInMonths(args.releaseDate.$gt, eighteenMonthAgo), 0)
    assert.same(db.updateMany.getCall(0).args[1], expectedUpdate)
    assert.end()
  } catch (error) {
    assert.end(error)
  }
})

test('[SECRET PROCESS] - Should return an Object with deletedLines and updatedLines', async (assert) => {
  db.updateMany.resetHistory()
  db.updateMany.resolves({})

  db.deleteMany.resetHistory()
  db.deleteMany.resolves({ result: { n: 2 } })

  const expected = { updatedLines: 0, deletedLines: 2 }

  try {
    const result = await secretProcess()
    assert.same(result, expected)
    assert.end()
  } catch (error) {
    assert.end(error)
  }
})
