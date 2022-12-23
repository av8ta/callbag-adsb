/* eslint-disable @typescript-eslint/no-explicit-any */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { AdsbData } from '../typings/types'
import { parseData } from '../src/index.js'
import subscribe from 'callbag-subscribe'
import { pipe, fromIter, map } from 'callbag-basics-esmodules'
import lastCallbag from 'callbag-last'

type Done = (result?: any) => void
type Last = (predicate?: any, resultSelector?: any) => (source: any) => (start: any, slink: any) => void
const last: Last = lastCallbag

// sometimes code is running after the test completes so the runner hangs - this timeout hack seems to work!
const timeout = 1
const succeed = (done: Done) => setTimeout(() => done(), timeout)
const str = (s: any) => JSON.stringify(s)

test('Correctly parses two messages on separate lines', (_t, done) => {

  const expected = { callsign: "", lon: 3.9389, lat: 52.2658, altitude: 38000, speed: 0, heading: 0 }
  const messages = ['*8D40621D58C382D690C8AC2863A7;', '*8D40621D58C386435CC412692AD6;']
  const messages$ = fromIter(messages)

  try {
    /**
     * the decoding function is impure as it uses timestamps for the calculation of latitude and longitude.
     * however the timestamps are not included in the raw data from ads-b so must be supplied by the receiver.
     * we fix the decimal places from 4 down to 1 when testing so that they ought to be the same when tests are run in future.
     */
    pipe(
      messages$,
      map((str: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) => Buffer.from(str)),
      map((chunk: Buffer) => parseData(chunk)),
      last(),
      subscribe({
        next: (result: AdsbData) => {
          assert.ok(result, 'Result is not truthy')
          assert.ok(result.parsed, `Message failed to parse: ${str(result)}`)
          assert(result.parsed?.callsign === expected.callsign, `Callsign value is incorrect: ${str(result)}`)
          assert(result.parsed.lat.toFixed(1) === expected.lat.toFixed(1), `Latitude value is correct: ${str(result)}`)
          assert(result.parsed.lon.toFixed(1) === expected.lon.toFixed(1), `Longitude value is correct: ${str(result)}`)
          assert(result.parsed.altitude === expected.altitude, `Altitude value is correct: ${str(result)}`)
          assert(result.parsed.speed === expected.speed, `Speed value is correct${str(result)}`)
          assert(result.parsed.heading === expected.heading, `Heading value is correct${str(result)}`)
        },
        error: (error: unknown) => { throw new Error(`Error in test: ${error}`) }, // tslint:disable-next-line:no-console
        complete: () => (succeed(done))
      })
    )
  } catch (error) {
    done(error)
  }
})
