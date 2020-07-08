'use strict'

const WDYM = require('./wdym')
const createCSVWriter = require('csv-writer').createObjectCsvWriter
const createCSVStringifier = require('csv-writer').createObjectCsvStringifier

class WDYM_CSV extends WDYM {
  _transform(chunk, encoding, callback) {
    /* do nothing */
  }

  toCSV(serverLog) {
    const schema = this.getCSVSchema(serverLog)
    const csvStringifier = createCSVStringifier({ header: schema })
    return csvStringifier
      .getHeaderString()
      .concat(csvStringifier.stringifyRecords([serverLog]))
  }

  get _csvWriter() {
    const schema = this.getCSVSchema(serverLog)
    return createCSVWriter({ path: './output.csv', header: schema })
  }

  getCSVSchema(serverLog) {
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
}

module.exports = WDYM_CSV
