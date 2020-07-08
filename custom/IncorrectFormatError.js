/**
 * A custom Error class thrown when the input data is not in Common Log Format (CLF)
 */

class IncorrectFormatError extends Error {
  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, IncorrectFormatError)
  }
}
