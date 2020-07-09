'use strict'

const stream = require('stream')

/**
 * What do you mean?
 *
 * A custom (Duplex) Transform stream.
 */
class WDYM extends stream.Transform {
  /**
   * Matches the line to the standardised (ASCII) CLF Log format.
   * If in strict mode, performs validation on the log's components.
   * https://httpd.apache.org/docs/1.3/logs.html
   * @param {String} line - a line of the input stream
   * @returns {Array}
   */
  isCLF(line, options = null) {
    if (options && options.strict) {
      return this._strictCLF(line)
    }
    return line.match(
      /^(\S+) (\S+) (\S+) \[([^\]]*)\] "([^"]*)" (\d{3}|-) (\d+|-)\s?"?([^"]*)"?\s?"?([^"]*)?"?$/m
    )
  }

  /**
   * Matches the line to the standardised (ASCII) CLF Log format and also validates its components (such as remote host and HTTP status code)
   * @param {String} line - a line of the input stream
   * @returns {Array}
   */
  _strictCLF(line) {
    const partialMatch = this.isCLF(line)
    if (partialMatch) {
      if (
        !this._validateIP(partialMatch[1]) ||
        !this._validateHTTPStatusCode(partialMatch[6])
      ) {
        return null
      }
      return partialMatch
    } else {
      return null
    }
  }

  _validateIP(IP) {
    return IP.match(
      /^(?=.*[^\.]$)((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.?){4}$/m
    )
  }

  _validateHTTPStatusCode(code) {
    return code.match(/[1-5]\d\d/)
  }
}

module.exports = WDYM
