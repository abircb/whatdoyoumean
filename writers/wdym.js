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
   * https://www.iri.com/blog/migration/data-migration/clf-elf-web-log-formats/
   * @param {String} line - a line of the input stream
   * @returns {Array}
   */
  isCLF(line) {
    return line.match(
      /^(\S+) (\S+) (\S+) \[([^\]]*)\] "([^"]*)" (\d{3}|-) (\d+|-)\s?"?([^"]*)"?\s?"?([^"]*)?"?$/m
    )
  }
}

module.exports = WDYM