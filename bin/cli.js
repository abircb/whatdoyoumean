'use strict'

const arg = require('arg')
const chalk = require('chalk')
const logSymbols = require('log-symbols')
const fs = require('fs')

const wdym = require('../')
const release = require('../package.json')
const writer = new wdym()
const { pipeline } = require('stream')

/**
 * Parses command line arguments and deciphers meaning of the command.
 * @param {Array} rawArgs - raw command line arguments
 */
function decipherMeaning(rawArgs) {
  let args,
    writeStream = undefined
  try {
    args = arg(
      {
        '--write': Boolean,
        '--version': Boolean,
      },
      {
        argv: rawArgs,
        permissive: false,
      }
    )
  } catch (err) {
    console.error(
      logSymbols.error,
      chalk.bold.red('ERROR'),
      'Unknown or unexpected option(s)'
    )
    process.exit()
  }

  try {
    writeStream = args['--write']
      ? fs.createWriteStream('./output.json')
      : process.stdout
  } catch (err) {
    fatalErrorMessage()
    process.exit()
  }

  if (args['--version']) {
    console.log(logSymbols.info, release.version)
  } else if (args._.length > 0) {
    transformFile(args, writeStream)
  } else {
    write(process.stdin, writeStream)
  }
}

/**
 * Reads from the source CLF file and writes to the provided destination.
 * @param {Object} args - parsed command line arguments
 * @param {stream.Writable} writeStream - the destination for writing data
 */
function transformFile(args, writeStream) {
  const path = args['_'][0]
  try {
    const readStream = fs.createReadStream(path)
    write(readStream, writeStream)
  } catch (err) {
    fatalErrorMessage()
    process.exit()
  }
}

/**
 * Pipes between streams — converting CLF to JSON, catching errors, and properly cleaning up.
 * @param {stream.Readable} source - the source to read CLF data from
 * @param {stream.Writable} destination - the destination for writing data
 */
function write(source, destination) {
  pipeline(source, writer, destination, (err) => {
    if (err) {
      fatalErrorMessage()
      process.exit()
    } else {
      console.log(
        logSymbols.success,
        chalk.green.bold('SUCCESSFUL'),
        'Written to output.json'
      )
    }
  })
}

/**
 * The standard fatal error message for wdym.
 */
function fatalErrorMessage() {
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

module.exports = decipherMeaning
