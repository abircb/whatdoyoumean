#!/usr/bin/env node

const wdym = require('../')
const IncorrectFormatError = require('../helpers/IncorrectFormatError')

try {
  process.stdin.pipe(wdym().pipe(process.stdout))
} catch (exception) {
  if (exception instanceof IncorrectFormatError) console.log('Not in CLF')
  else console.log('an error occurred while parsing the CLF Log')
}
