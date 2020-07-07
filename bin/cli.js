const arg = require('arg')
const chalk = require('chalk')
const logSymbols = require('log-symbols')
const fs = require('fs')

const wdym = require('../')
const release = require('../package.json')
const writer = new wdym()
const { pipeline } = require('stream')

function decipherMeaning(rawArgs) {
  const args = arg(
    {
      '--write': Boolean,
      '--version': Boolean,
    },
    {
      argv: rawArgs,
      permissive: false,
    }
  )

  let writeStream = undefined

  try {
    writeStream = args['--write']
      ? fs.createWriteStream('./output.json')
      : process.stdout
  } catch (err) {
    fatalErrorMessage()
  }

  if (args['--version']) {
    console.log(logSymbols.info, release.version)
  } else if (args._.length > 0) {
    transformFile(args, writeStream)
  } else {
    write(process.stdin, writeStream)
  }
}

function transformFile(args, writeStream) {
  const path = args['_'][0]
  try {
    const readStream = fs.createReadStream(path)
    write(readStream, writeStream)
  } catch (err) {
    fatalErrorMessage()
    process.exit(0)
  }
}

function write(source, destination) {
  pipeline(source, writer, destination, (err, val) => {
    if (err) {
      fatalErrorMessage()
      process.exit(0)
    } else {
      console.log(
        logSymbols.success,
        chalk.green.bold('SUCCESSFUL'),
        'Written to output.json'
      )
    }
  })
}

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
