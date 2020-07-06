'use strict'

const Transform = require('stream').Transform
const IncorrectFormatError = require('./helpers/IncorrectFormatError')

class WDYM extends Transform {
  /**
   * transforms input stream in Common Log Format into useful JSON
   * @param {Object} chunk - the input stream of data
   * @param {String} encoding - character encoding of the chunk
   * @param {Function} callback - called when processing is complete for the supplied chunk
   */
  _transform(chunk, encoding, callback) {
    const input = chunk.toString()
    input.split(/\n/).forEach((line) => {
      const re = /([^ ]*) ([^ ]*) ([^ ]*) \[([^\]]*)\] "([^"]*)" ([^ ]*) ([^ ]*)/
      const matches = line.match(re)
      if (matches) {
        const log = {
          remoteHost: matches[1],
          remoteLogName: matches[2],
          authUser: matches[3],
          date: !Date.parse(matches[4])
            ? 'indecipherable'
            : new Date(matches[4]),
          request: matches[5],
          status: Number(matches[6]) || 'Invalid Status Code',
          size: Number(matches[7]) || 0,
        }
        this.push(JSON.stringify(log))
      } else {
        throw new IncorrectFormatError('ss')
      }
    })
    callback()
  }
}

module.exports = WDYM
