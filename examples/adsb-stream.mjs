import adsbSource from '../lib/index.js'
import observe from 'callbag-observe'

const messages = adsbSource({ port: 30002, host: 'localhost' }, { retries: 90 })

observe(console.log)(messages)

/**
 * First plug in your rtl-sdr into usb port.
 * Then run dump1090 in one shell. You can use the docker compose file for this.
 * Finally, run this file in another shell with the DEBUG env var set to see data:
 * 
 * DEBUG=* node adsb-stream.mjs
 */
