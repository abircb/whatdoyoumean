'use strict'

const stream = require('stream')
const IncorrectFormatError = require('../custom/IncorrectFormatError')
const ValidationError = require('../custom/ValidationError')

/**
 * What do you mean?
 *
 * A custom (Duplex) Transform stream.
 */
class WDYM extends stream.Transform {
  /**
   * Matches the line to the standardised (ASCII) CLF Log format.
   * https://www.iri.com/blog/migration/data-migration/clf-elf-web-log-formats/
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

  _strictCLF(line) {
    const partialMatch = this.isCLF(line)
    if (partialMatch) {
      if (
        !this.validateIP(partialMatch[1]) ||
        !this.validateHTTPStatusCode(partialMatch[6])
      ) {
        return null
      }
      return partialMatch
    } else {
      return null
    }
  }

  validateIP(IP) {
    return IP.match(
      /^(?=.*[^\.]$)((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.?){4}$/m
    )
  }

  validateHTTPStatusCode(code) {
    return code.match(/[1-5]\d\d/)
  }
}

module.exports = WDYM
