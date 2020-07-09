/**
 * A custom Error class thrown when the input data is (partially) in Common Log Format (CLF),
 * but one (or more) of its standardised components fail to validate
 */

class ValidationError extends Error {
  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, ValidationError)
  }
}

module.exports = ValidationError
