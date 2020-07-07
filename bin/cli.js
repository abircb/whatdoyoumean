#!/usr/bin/env node

const chalk = require('chalk')
const logSymbols = require('log-symbols')

const wdym = require('../')
const writer = new wdym()
const { pipeline, finished } = require('stream')

pipeline(process.stdin, writer, process.stdout, (err, val) => {
  if (err) {
    console.error(
      logSymbols.error,
      chalk.bold.red('ERROR'),
      'An error occurred while processing the log'
    )
    console.error(
      logSymbols.info,
      'If this persists, raise an issue on ',
      chalk.blue.underline('https://github.com/abircb/wdym')
    )
  } else {
    console.log('%s', chalk.green.bold('SUCCESSFUL'))
  }
})
