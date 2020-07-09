'use strict'

const WDYM = require('./wdym')
const wdymJSON = require('./wdymJSON')
const writer = new wdymJSON()
const createCSVStringifier = require('csv-writer').createObjectCsvStringifier
const messages = require('../custom/messages')

class WDYM_CSV extends WDYM {
  _transform(chunk, encoding, callback) {
    const input = chunk.toString()
    const lines = input.split(/\n/)
    try {
      const json = writer.toJSON(lines)
      const csv = this.toCSV(json.log)
      this.push(csv)
    } catch (err) {
      messages.incorrectFormatError(err.message)
      process.exit()
    }
    callback()
  }

  toCSV(serverLog) {
    const schema = this._getCSVSchema(serverLog)
    const csvStringifier = createCSVStringifier({ header: schema })
    return csvStringifier
      .getHeaderString()
      .concat(csvStringifier.stringifyRecords(serverLog))
  }

  _getCSVSchema(serverLog) {
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
