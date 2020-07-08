'use strict'

const arg = require('arg')
const fs = require('fs')
const { pipeline } = require('stream')

const wdym = require('../')
const writer = new wdym()
const messages = require('../custom/messages')

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
        '--csv': Boolean,
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

  try {
    writeStream = args['--write']
      ? fs.createWriteStream('./output.json')
      : process.stdout
  } catch (err) {
    messages.fatalErrorMessage()
    process.exit()
  }

  if (args['--version']) {
    messages.version()
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
    if (args['--csv']) {
      writeCSV(readStream, writeStream)
    } else {
      write(readStream, writeStream)
    }
  } catch (err) {
    messages.fatalErrorMessage()
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
      messages.fatalErrorMessage()
      process.exit()
    } else {
      messages.successfulWrite()
    }
  })
}

module.exports = decipherMeaning
