'use strict'

const arg = require('arg')
const fs = require('fs')
const { pipeline } = require('stream')

const wdymJSON = require('../').json
const wdymCSV = require('../').csv
const messages = require('../custom/messages')

/**
 * Parses command line arguments
 * @param {Array} rawArgs - raw command line arguments
 */
function parse(rawArgs) {
  let args = undefined
  try {
    args = arg(
      {
        '--write': Boolean,
        '--csv': Boolean,
        '--version': Boolean,
        '-v': '--version',
        '--help': Boolean,
        '-h': '--help',
      },
      {
        argv: rawArgs,
        permissive: false,
      }
    )
  } catch (err) {
    messages.argsError()
    process.exit()
  }

  decipherMeaning(args)
}

/**
 * Uses (parsed) command line arguments to decipher meaning of the command.
 * @param {Object} args
 */
function decipherMeaning(args) {
  if (args['--help']) {
    messages.usageInfo()
  } else if (args['--version']) {
    messages.version()
  } else {
    let writeStream = undefined
    try {
      if (args['--write']) {
        writeStream = args['--csv']
          ? fs.createWriteStream('./output.csv')
          : fs.createWriteStream('./output.json')
      } else {
        writeStream = process.stdout
      }
    } catch (err) {
      messages.fatalError()
      process.exit()
    }

    if (args._.length > 0) {
      transformFile(args, writeStream)
    } else {
      write(process.stdin, writeStream, { default: !args['--csv'] })
    }
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
    write(readStream, writeStream, { default: !args['--csv'] })
  } catch (err) {
    messages.fatalErrorMessage()
    process.exit()
  }
}

/**
 * Pipes between streams — converting CLF to JSON/CSV, catching errors, and properly cleaning up.
 * @param {stream.Readable} source - the source to read CLF data from
 * @param {stream.Writable} destination - the destination for writing data
 */
function write(source, destination, options) {
  const writer = options.default ? wdymJSON : wdymCSV
  pipeline(source, writer, destination, (err) => {
    if (err) {
      messages.fatalError()
      process.exit()
    } else {
      messages.successfulWrite()
    }
  })
}

module.exports = parse
