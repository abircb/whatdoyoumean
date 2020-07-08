const chalk = require('chalk')
const logSymbols = require('log-symbols')
const release = require('../package.json').version

function version() {
  console.log(logSymbols.info, release)
}

function successfulWrite() {
  console.log(
    logSymbols.success,
    chalk.green.bold('SUCCESSFUL'),
    'Written to output.json'
  )
}

function argsError() {
  console.error(
    logSymbols.error,
    chalk.bold.red('ERROR'),
    'Unknown or unexpected option(s)'
  )
}

function incorrectFormatError() {
  console.error(
    chalk.red.bold('ERROR'),
    'The log is not in Common Log Format (CLF)'
  )
}

function fatalError() {
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
}

module.exports = {
  successfulWrite,
  argsError,
  fatalError,
  incorrectFormatError,
  version,
}
