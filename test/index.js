import { describe, test } from 'node:test'
import assert from 'node:assert/strict'

// sometimes code is running after the test completes so the runner hangs - this timeout hack seems to work!
const timeout = 1
const fail = (expected, value, error, done) => setTimeout(() => done(new Error(`Expected ${expected} but got ${value} ${error}`)), timeout)
const succeed = done => setTimeout(() => done(), timeout)

describe.skip('Creates test server', () => {
  return new Promise((resolve, _reject) => {
    const server = createServer('hello')
    resolve(assert(server instanceof net.Server))
    server.close()
  })
})

test('true is true!', (_t, done) => {
  try {
    assert.equal(true, true, 'tautology')
    succeed(done)
  } catch (error) {
    fail('expected', 'got', 'error', done)
  }
})
