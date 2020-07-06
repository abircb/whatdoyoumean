const should = require('should')
const wdym = require('../')
const IncorrectFormatError = require('../helpers/IncorrectFormatError')

describe('CLF Log', () => {
  it('should convert to JSON without error', () => {
    let json = undefined
    const transform = new wdym()
    transform.on('readable', function () {
      while ((data = this.read())) {
        json = JSON.parse(data)
      }
      json.should.be.eql({
        remoteHost: '127.0.0.1',
        remoteLogName: '-',
        authUser: '-',
        date: '2020-07-07T16:42:00.000Z',
        request: 'GET /index.html HTTP/1.1',
        status: 200,
        size: 733,
      })
    })
    transform.write(
      '127.0.0.1 - - [Wed, 07 July 2020 16:42:00 GMT] "GET /index.html HTTP/1.1" 200 733'
    )
  })
})

describe('CLF Log with non-numeric bytes', () => {
  it('should convert to JSON without error and change the size of the object to 0', () => {
    let json = undefined
    const transform = new wdym()
    transform.on('readable', function () {
      while ((data = this.read())) {
        json = JSON.parse(data)
      }
      json.should.be.eql({
        remoteHost: '127.0.0.1',
        remoteLogName: '-',
        authUser: '-',
        date: '2020-07-07T16:42:00.000Z',
        request: 'GET /index.html HTTP/1.1',
        status: 200,
        size: 0,
      })
    })
    transform.write(
      '127.0.0.1 - - [Wed, 07 July 2020 16:42:00 GMT] "GET /index.html HTTP/1.1" 200 "something"'
    )
  })
})

describe('CLF Log containing request with invalid status code', () => {
  it('should convert to JSON without error, but inform about the incorrect status code', () => {
    let json = undefined
    const transform = new wdym()
    transform.on('readable', function () {
      while ((data = this.read())) {
        json = JSON.parse(data)
      }
      json.should.be.eql({
        remoteHost: '127.0.0.1',
        remoteLogName: '-',
        authUser: '-',
        date: '2020-07-07T16:42:00.000Z',
        request: 'GET /index.html HTTP/1.1',
        status: 'Invalid Status Code',
        size: 0,
      })
    })
    transform.write(
      '127.0.0.1 - - [Wed, 07 July 2020 16:42:00 GMT] "GET /index.html HTTP/1.1" an-invalid-status-code "something"'
    )
  })
})

describe('CLF Log with extra information', () => {
  it('should convert to JSON without error and ignore the extra details', () => {
    let json = undefined
    const transform = new wdym()
    transform.on('readable', function () {
      while ((data = this.read())) {
        json = JSON.parse(data)
      }
      json.should.be.eql({
        remoteHost: '127.0.0.1',
        remoteLogName: '-',
        authUser: '-',
        date: '2020-07-07T16:42:00.000Z',
        request: 'GET /index.html HTTP/1.1',
        status: 200,
        size: 0,
      })
    })
    transform.write(
      '127.0.0.1 - - [Wed, 07 July 2020 16:42:00 GMT] "GET /index.html HTTP/1.1" 200 "http://localhost:8000" "userAgent"'
    )
  })
})

describe('not CLF Log', () => {
  it('should throw an error', () => {
    should(() => {
      const transform = new wdym()
      transform.write(
        '2010-05-02 15:42:15 - 40.89.255.10  34.14.255.10 80 GET /default.htm 200 - HTTP/1.0 Mozilla/4.0  (compatible: MSIE+5.5+Windows+2000+Server)'
      )
    }).throw(IncorrectFormatError)
  })
})

describe('invalid Date', () => {
  it('should not parse the date, but not throw an error', () => {
    let json = undefined
    const transform = new wdym()
    transform.on('readable', function () {
      while ((data = this.read())) {
        json = JSON.parse(data)
      }
      json.should.be.eql({
        remoteHost: '127.0.0.1',
        remoteLogName: '-',
        authUser: '-',
        date: 'indecipherable',
        request: 'GET /index.html HTTP/1.1',
        status: 200,
        size: 0,
      })
    })
    transform.write(
      '127.0.0.1 - - [Here is an invalid date] "GET /index.html HTTP/1.1" 200 "http://localhost:8000" "userAgent"'
    )
  })
})
