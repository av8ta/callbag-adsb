import assert from "node:assert/strict"

export function isString(str: unknown): str is string {
  return !!(typeof str === 'string' || str instanceof String)
}

export function checkString(str: unknown): asserts str is string {
  assert(isString(str))
}

export function isNumber(num: unknown): num is number {
  return (getType(num) === 'Number' || getType(num) === 'BigInt') && notNaN(num)
}
export function checkNumber(num: unknown): asserts num is number {
  assert(isNumber(num))
}
export function isNumberString(num: unknown): num is string {
  return isString(num) && notNaN(Number.parseFloat(num))
}
export function checkNumberString(num: unknown): asserts num is string {
  assert(isNumberString(num))
}

export function isInteger(num: unknown): num is number {
  return isNumber(num) && num % 1 === 0
}
export function checkInteger(num: unknown): asserts num is number {
  assert(isInteger(num))
}
export function isIntegerString(num: unknown): num is string {
  return isString(num) && notNaN(Number.parseInt(num)) && Number.parseFloat(num) % 1 === 0
}
export function checkIntegerString(num: unknown): asserts num is string {
  assert(isIntegerString(num))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isnan(num: any) {
  if (num === undefined) return false
  if (num === null) return false
  return num.toString() === 'NaN'
}

export function notNaN(num: unknown) {
  return !isnan(num)
}

type RuntimeTypes = 'String' | 'Number' | 'BigInt' | 'Boolean' | 'Undefined' | 'Symbol' | 'Null' | 'Promise' | 'RegExp' | 'Generator' | 'GeneratorFunction' | 'Map' | 'MapIterator' | 'WeakMap' | 'Set' | 'SetIterator' | 'WeakSet' | 'Array' | 'Date' | 'Uint8Array' | 'Uint16Array' | 'Uint32Array' | 'Uint8ClampedArray' | 'Int8Array' | 'Int16Array' | 'Int32Array' | 'ArrayBuffer' | 'SharedArrayBuffer' | 'Float32Array' | 'Float64Array'

const types: { [k: string]: RuntimeTypes } = {
  '[object String]': 'String',
  '[object Number]': 'Number',
  '[object BigInt]': 'BigInt',
  '[object Boolean]': 'Boolean',
  '[object Undefined]': 'Undefined',
  '[object Symbol]': 'Symbol',
  '[object Null]': 'Null',
  '[object Promise]': 'Promise',
  '[object RegExp]': 'RegExp',
  '[object Generator]': 'Generator',
  '[object GeneratorFunction]': 'GeneratorFunction',
  '[object Map]': 'Map',
  '[object Map Iterator]': 'MapIterator',
  '[object WeakMap]': 'WeakMap',
  '[object Set]': 'Set',
  '[object Set Iterator]': 'SetIterator',
  '[object WeakSet]': 'WeakSet',
  '[object Array]': 'Array',
  '[object Date]': 'Date',
  '[object Uint8Array]': 'Uint8Array',
  '[object Uint16Array]': 'Uint16Array',
  '[object Uint32Array]': 'Uint32Array',
  '[object Uint8ClampedArray]': 'Uint8ClampedArray',
  '[object Int8Array]': 'Int8Array',
  '[object Int16Array]': 'Int16Array',
  '[object Int32Array]': 'Int32Array',
  '[object ArrayBuffer]': 'ArrayBuffer',
  '[object SharedArrayBuffer]': 'SharedArrayBuffer',
  '[object Float32Array]': 'Float32Array',
  '[object Float64Array]': 'Float64Array',
}

export function getType(obj: unknown) {
  return types[Object.prototype.toString.call(obj)]
}
