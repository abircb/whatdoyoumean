'use strict'

const WDYM = require('./wdym')
const { parse } = require('date-fns')
const IncorrectFormatError = require('../custom/IncorrectFormatError')
const messages = require('../custom/messages')

class WDYM_JSON extends WDYM {
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
   * Parses the CLF logs and converts them to JSON.
   * @param {Array} clf - the CLF Logs
   * @throws {IncorrectFormatError}
   * @returns {Object}
   */
  toJSON(clf) {
    let json = { log: [] }
    clf.forEach((line) => {
      const matches = super.isCLF(line)
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

module.exports = WDYM_JSON
