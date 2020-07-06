'use strict'

class IncorrectFormatError extends Error {
  constructor(...args) {
    super(...args)
    // Error.captureStackTrace(this, GoodError)
  }
}

module.exports = IncorrectFormatError
