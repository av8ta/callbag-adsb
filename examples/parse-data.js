import { parseData } from '../lib/index.js'
import subscribe from 'callbag-subscribe'
import { pipe, map, fromIter } from 'callbag-basics-esmodules'
import last from 'callbag-last'

const messages = ['*8D40621D58C382D690C8AC2863A7;', '*8D40621D58C386435CC412692AD6;']
const messages$ = fromIter(messages)

pipe(
  messages$,
  map(str => Buffer.from(str)),
  map(chunk => parseData(chunk)),
  last(),
  subscribe({
    next: result => console.log(result),
    error: error => { console.log(error) },
    complete: () => (console.log('Complete'))
  })
)

/**
 * {
      message: '*8D40621D58C386435CC412692AD6;',
      decoded: '!,3.9389,52.2658,38000,0,0,1671779677*',
      parsed: {
        callsign: '',
        lon: 3.9389,
        lat: 52.2658,
        altitude: 38000,
        speed: 0,
        heading: 0,
        timestamp: 1671779677 // timestamp will be when message received. ads-b messages don't encode the timestamp
      }
    }
    Complete
 */
