'use strict'

const stream = require('stream')
const { parse } = require('date-fns')
const createCSVWriter = require('csv-writer').createObjectCsvWriter
const createCSVStringifier = require('csv-writer').createObjectCsvStringifier

const IncorrectFormatError = require('./custom/IncorrectFormatError')
const messages = require('./custom/messages')

/**
 * What do you mean?
 *
 * A custom (Duplex) Transform stream.
 */
class WDYM extends stream.Transform {
  /**
   * Transforms input stream in Common Log Format into useful JSON.
   * @param {stream.Readable} chunk - the input stream of data
   * @param {String} encoding - character encoding of the chunk
   * @param {Function} callback - called when processing is complete for the supplied chunk
   */
  _transform(chunk, encoding, callback) {
    const input = chunk.toString()
    const lines = input.split(/\n/)
    try {
      const json = this.toJSON(lines)
      this.push(JSON.stringify(json))
    } catch (err) {
      messages.incorrectFormatError()
      process.exit()
    }
    callback()
  }

  /**
   * Matches the line to the standardised (ASCII) CLF Log format.
   * https://www.iri.com/blog/migration/data-migration/clf-elf-web-log-formats/
   * @param {String} line - a line of the input stream
   * @returns {Array}
   */
  isCLF(line) {
    return line.match(
      /^(\S+) (\S+) (\S+) \[([^\]]*)\] "([^"]*)" (\d{3}|-) (\d+|-)\s?"?([^"]*)"?\s?"?([^"]*)?"?$/m
    )
  }

  /**
   * Parses the CLF logs and converts them to JSON.
   * @param {Array} clf - the CLF Logs
   * @throws {IncorrectFormatError}
   * @returns {Object}
   */

  toJSON(clf) {
    let json = { log: [] }
    clf.forEach((line) => {
      const matches = this.isCLF(line)
      if (matches) {
        const serverLog = {
          remoteHost: matches[1],
          remoteLogName: matches[2],
          authUser: matches[3],
          date:
            Date.parse(matches[4]) || this._parseDate(matches[4])
              ? this._parseDate(matches[4])
              : 'unreadable',
          request: matches[5],
          status: Number(matches[6]) || 'Invalid Status Code',
          size: Number(matches[7]) || 0,
        }
        json.log.push(serverLog)
      } else {
        throw new IncorrectFormatError()
      }
    })
    return json
  }

  toCSV(serverLog) {
    const schema = this._getCSVSchema(serverLog)
    const csvStringifier = createCSVStringifier({ header: schema })
    return csvStringifier
      .getHeaderString()
      .concat(csvStringifier.stringifyRecords([serverLog]))
  }

  get _csvWriter() {
    const schema = this._getCSVSchema(serverLog)
    return createCSVWriter({ path: './output.csv', header: schema })
  }

  _getCSVSchema(serverLog) {
    const keys = Object.keys(serverLog)
    const titles = [
      'REMOTE HOST',
      'REMOTE LOG NAME',
      'USER ID',
      'DATE',
      'REQUEST',
      'HTTP STATUS CODE',
      'SIZE',
    ]
    let i = 0,
      schema = []

    while (i < keys.length) {
      schema.push({ id: keys[i], title: titles[i] })
      i += 1
    }
    return schema
  }

  /**
   * Parses CLF Standard date ([day/month/year:hour:minute:second zone])
   * @param {String} date
   */
  _parseDate(date) {
    if (Date.parse(date)) return new Date(date)

    const strftime = /([\w:/]+\s[+\-]\d{4})/
    if (date.match(strftime)) {
      const parsed = parse(date, 'd/MMM/yyyy:kk:mm:ss XX', new Date())
      if (!isNaN(parsed)) return parsed
    }

    return null
  }
}

module.exports = WDYM
