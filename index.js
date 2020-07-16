const wdymJSON = require('./writers/wdymJSON')
const wdymCSV = require('./writers/wdymCSV')

/**
 * What do you mean?
 *
 * A factory for converting CLF to CSV and JSON.
 */

module.exports = {
  json: new wdymJSON(),
  csv: new wdymCSV(),
}
