'use strict'

const WDYM = require('./wdym')
const wdymJSON = require('./wdymJSON')
const writer = new wdymJSON()
const messages = require('../custom/messages')
const createCSVStringifier = require('csv-writer').createObjectCsvStringifier

class WDYM_CSV extends WDYM {
  /**
   * Transforms input stream in Common Log Format into useful CSV.
   * @param {stream.Readable} chunk - the input stream of data
   * @param {String} encoding - character encoding of the chunk
   * @param {Function} callback - called when processing is complete for the supplied chunk
   */
  _transform(chunk, encoding, callback) {
    const input = chunk.toString()
    const lines = input.split(/\n/)
    try {
      const csv = this.toCSV(lines)
      this.push(csv)
    } catch (err) {
      messages.incorrectFormatError(err.message)
      process.exit()
    }
    callback()
  }

  /**
   * Parses the CLF logs and converts them to CSV.
   * @param {Array} clf - the CLF Logs
   * @throws {IncorrectFormatError}
   * @returns {String} - the logs as a CSV string
   */
  toCSV(clf) {
    const json = writer.toJSON(clf)
    const schema = this._getCSVSchema(json)
    const csvStringifier = createCSVStringifier({ header: schema })
    return csvStringifier
      .getHeaderString()
      .concat(csvStringifier.stringifyRecords(json.log))
  }

  /**
   * @param {Object} - the parsed CLF logs in JSON
   * @returns {Array} - an array of objects defining the schema to be used by the stringifier
   * https://github.com/ryu1kn/csv-writer#createobjectcsvstringifierparams
   */
  _getCSVSchema(json) {
    const serverLog = json.log
    const keys = Object.keys(serverLog[0])
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
}

module.exports = WDYM_CSV
