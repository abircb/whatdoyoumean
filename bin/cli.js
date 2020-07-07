#!/usr/bin/env node

const arg = require('arg')
const chalk = require('chalk')
const logSymbols = require('log-symbols')
const fs = require('fs')

const wdym = require('../')
const writer = new wdym()
const { pipeline, finished } = require('stream')

parseArgs(process.argv.slice(2))

function parseArgs(rawArgs) {
  const args = arg(
    {
      '--write': Boolean,
      '-h': Boolean,
      '-v': Boolean,
      '--help': '-h',
      '--version': '-v',
    },
    {
      argv: rawArgs,
      permissive: false,
    }
  )

  if (args._.length > 0) {
    transformFile(args)
  } else {
    transformStream(args)
  }
}

function transformFile(args) {
  const path = args['_'][0]
  const readStream = fs.createReadStream(path)
  const writeStream = args['--write']
    ? fs.createWriteStream('./output.json')
    : process.stdout
  write(readStream, writeStream)
}

function transformStream(args) {
  const writeStream = args['--write']
    ? fs.createWriteStream('./output.json')
    : process.stdout
  write(process.stdin, writeStream)
}

function write(source, destination) {
  pipeline(source, writer, destination, (err, val) => {
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
      console.log(
        logSymbols.success,
        chalk.green.bold('SUCCESSFUL'),
        'Written to output.json'
      )
    }
  })
}
