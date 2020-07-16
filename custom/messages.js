const release = require('../package.json').version

const chalk = require('chalk')
const logSymbols = require('log-symbols')

function version() {
  console.log(logSymbols.info, release)
}

function successfulWrite() {
  console.log(
    logSymbols.success,
    chalk.green.bold('SUCCESSFUL'),
    'Written to output file'
  )
}

function argsError() {
  console.error(
    logSymbols.error,
    chalk.bold.red('ERROR'),
    'Unknown or unexpected option(s)'
  )
}

function incorrectFormatError(message) {
  console.error(chalk.red.bold('ERROR'), message)
}

function fatalError() {
  console.error(
    logSymbols.error,
    chalk.bold.red('ERROR'),
    'An error occurred while processing the log file'
  )
  console.error(
    logSymbols.info,
    'If this persists, raise an issue on ',
    chalk.blue.underline('https://github.com/abircb/wdym')
  )
}

function usageInfo() {
  console.log('Usage\n    $ wdym <file> <options>\n')
  console.log(
    'Default behaviour (no options): simply converts log file contents into JSON and writes to the shell (via stdout)\n'
  )
  console.log('Options')
  console.log('        --csv               convert log file into CSV')
  console.log(
    '        --write             write to file (./output.csv or ./output.json)'
  )
  console.log('    -v, --version           output the version number')
  console.log('    -h, --help              usage information\n')
  console.log('Examples')
  console.log(
    '    $ wdym log.txt --write         converts log file into JSON and writes to output.json'
  )
  console.log(
    '    $ wdym log.txt --csv           converts log file contents into CSV and writes to shell'
  )
  console.log(
    '    $ wdym log.txt --csv --write   converts log file contents into CSV and writes to output.csv'
  )
}

module.exports = {
  successfulWrite,
  argsError,
  fatalError,
  incorrectFormatError,
  version,
  usageInfo,
}
