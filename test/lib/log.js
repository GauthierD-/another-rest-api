'use strict'

const test = require('tape')
const { isFunction } = require('lodash')

const log = require('../../src/lib/log')

test('[LOG] should have basic log function (log/info/debug/warn/error) ', (assert) => {
  assert.ok(isFunction(log.log), 'logger has log function')
  assert.ok(isFunction(log.info), 'logger has info function')
  assert.ok(isFunction(log.debug), 'logger has debug function')
  assert.ok(isFunction(log.warn), 'logger has warn function')
  assert.ok(isFunction(log.error), 'logger has error function')

  assert.end()
})
