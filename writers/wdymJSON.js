'use strict'

const WDYM = require('./wdym')
const { parse } = require('date-fns')
const IncorrectFormatError = require('../custom/IncorrectFormatError')
const ValidationError = require('../custom/ValidationError')
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
      messages.incorrectFormatError(err.message)
      process.exit()
    }
    callback()
  }

  /**
   * Parses the CLF logs and converts them to a single JavaScript Object.
   * @param {Array} clf - the CLF Logs
   * @throws {IncorrectFormatError} - when one (or more) of the logs is not in CLF
   * @throws {ValidationError} - when one (or more) of the logs' components fail to validate
   * @returns {Object}
   */
  toJSON(clf) {
    let json = { log: [] }
    clf.forEach((line) => {
      const matches = super.isCLF(line)
      if (matches) {
        if (
          !super._validateIP(matches[1]) ||
          !super._validateHTTPStatusCode(matches[6])
        ) {
          throw new ValidationError(
            'One or more of the logs failed to validate'
          )
        }

        const serverLog = {
          remoteHost: matches[1],
          remoteLogName: matches[2],
          authUser: matches[3],
          date:
            Date.parse(matches[4]) || this._parseDate(matches[4])
              ? this._parseDate(matches[4])
              : 'unreadable',
          request: matches[5],
          status: Number(matches[6]),
          size: Number(matches[7]) || 0,
        }

        json.log.push(serverLog)
      } else {
        throw new IncorrectFormatError(
          'The log is not in Common Log Format (CLF)'
        )
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
