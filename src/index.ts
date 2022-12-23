import { Client } from 'callbag-net'
import type { Options as CallbagNetOptions } from 'callbag-net'
import { pipe, map } from 'callbag-basics-esmodules'
import type { SocketConnectOpts } from 'node:net'
import type { AdsbData, PositionTuple } from '../typings/types'
import decoder from 'decoder1090-c'
import assert from 'node:assert'
import Debug from 'debug'
import { checkNumberString, isIntegerString, checkIntegerString, isString } from './util.js'

const log = Debug('callbag-adsb')

const retries = -1 // retry forever
const reconnectOnEnd = true
const defaultSocketOptions = {
  port: Number.parseInt(process.env['dump1090_port'] || '30002', 10),
  host: process.env['dump1090_host'] || 'localhost'
}
const callbagNetOptions: CallbagNetOptions = { retries, reconnectOnEnd }

export default function (socketOptions: SocketConnectOpts = defaultSocketOptions, options: CallbagNetOptions = callbagNetOptions) {
  const messages = pipe(
    Client(socketOptions, options),
    map((chunk: Buffer) => parseData(chunk))
  )
  return messages
}

export function parseData(chunk: Buffer): AdsbData | null {
  const lines = chunk.toString('utf8').split(';').filter(line => line.length > 0)
  for (const msg of lines) {
    const message = `${msg};`
    log('Message received:', message)
    const decoded: string = decoder.decodeMsg(message)
    if (decoded.length > 0) {
      const parsed = parseDecoded(decoded)
      if (parsed) return { message, decoded, parsed }
      else return { message, decoded }
    }
    else return { message }
  }
  return null
}

function split(data: string): string[] | null {
  const looksValid = data[0] === '!'
    && data[data.length - 1] === '*'
    && data.includes(',')
    && [...data].filter(c => c === ',').length === 6
  return looksValid ? data.split(',') : null
}

function assertData(data: string[]): asserts data is string[] {
  assert(data)
  assert(data.length === 7) 
  const [callsign, ...rest] = data
  assert(callsign?.slice(0,1) === '!')
  const floats = rest.slice(0, rest.length - 1)
  assert.doesNotThrow(() => floats.forEach(checkNumberString))
  const timestamp = rest[5]?.substring(0, rest[5].length - 1)
  assert.doesNotThrow(() => checkIntegerString(timestamp)) // timestamp is int
}


function parsePosition(data: string[]): PositionTuple {
  const [callsign, ...rest] = data
  assert(isString(callsign))
  const timeString = rest.at(-1)
  assert(isIntegerString(timeString))
  const timestamp = parseTimestamp(timeString)
  const floats = rest.slice(0, rest.length - 1).map(Number.parseFloat)
  const position = [callsign.slice(1), ...floats, timestamp] // strip leading ! from callsign
  assertPosition(position)
  return position
}

function parseTimestamp(timestamp: string) {
  const time = timestamp.includes('*') && timestamp.split('*')[0]
  assert(time)
  return Number.parseInt(time)
}

function assertPosition(position: string | unknown[]): asserts position is PositionTuple {
  assert(position.length === 7)
  assert(isString(position[0]))
}

/**
 * 
 * @param data dump1090 decodes to shape: "!callsign, lon, lat, altitude, speed, heading, timestamp*"
 * @returns 
 */
function parseDecoded(data: string) {
  log('Decoded from dump1090:', data)
  const rawPosition = split(data)
  try {
    assert(rawPosition)
    assertData(rawPosition)
    const position = parsePosition(rawPosition)
    const [callsign, lon, lat, altitude, speed, heading, timestamp] = position

    return {
      callsign,
      lon, lat, altitude, speed, heading,
      timestamp
    }

  } catch (error) {
    console.error(error)
    log('Error: Bad data:', data, error)
    return null
  }
}
