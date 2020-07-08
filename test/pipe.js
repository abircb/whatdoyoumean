const should = require('should')
const wdym = require('../')

describe('One-line CLF log', () => {
  it('should convert to JSON without error', () => {
    let json = undefined
    const transform = new wdym()
    transform.on('readable', function () {
      while ((data = this.read())) {
        json = JSON.parse(data)
      }
      json.should.be.eql({
        log: [
          {
            remoteHost: '11.11.11.11',
            remoteLogName: '-',
            authUser: '-',
            date: '2000-01-25T13:00:01.000Z',
            request: 'GET /1986.js HTTP/1.1',
            status: 200,
            size: 932,
          },
        ],
      })
    })
    transform.write(
      '11.11.11.11 - - [25/Jan/2000:14:00:01 +0100] "GET /1986.js HTTP/1.1" 200 932 "-" "Mozilla/5.0 (Windows; U; Windows NT 5.1; de; rv:1.9.1.7) Gecko/20091221 Firefox/3.5.7 GTB6"'
    )
  })
})

describe('Multiple-line CLF log', () => {
  it('should convert to JSON without error', () => {
    let json = undefined
    const transform = new wdym()
    transform.on('readable', function () {
      while ((data = this.read())) {
        json = JSON.parse(data)
      }
      json.should.be.eql({
        log: [
          {
            remoteHost: '11.11.11.11',
            remoteLogName: '-',
            authUser: '-',
            date: '2000-01-25T13:00:01.000Z',
            request: 'GET /1986.js HTTP/1.1',
            status: 200,
            size: 932,
          },
          {
            remoteHost: '127.0.0.1',
            remoteLogName: '-',
            authUser: 'g',
            date: '2012-04-27T04:27:36.000Z',
            request: 'GET /ss.html HTTP/1.1',
            status: 200,
            size: 2326,
          },
        ],
      })
    })
    transform.write(
      '11.11.11.11 - - [25/Jan/2000:14:00:01 +0100] "GET /1986.js HTTP/1.1" 200 932 "-" "Mozilla/5.0 (Windows; U; Windows NT 5.1; de; rv:1.9.1.7) Gecko/20091221 Firefox/3.5.7 GTB6"\n127.0.0.1 - g [27/Apr/2012:11:27:36 +0700] "GET /ss.html HTTP/1.1" 200 2326'
    )
  })
})

describe('CLF Log in UTC date format', () => {
  it('should convert to JSON without error and change the size of the object to 0', () => {
    let json = undefined
    const transform = new wdym()
    transform.on('readable', function () {
      while ((data = this.read())) {
        json = JSON.parse(data)
      }
      json.should.be.eql({
        log: [
          {
            remoteHost: '127.0.0.1',
            remoteLogName: '-',
            authUser: '-',
            date: '2020-07-07T16:42:00.000Z',
            request: 'GET /index.html HTTP/1.1',
            status: 200,
            size: 256,
          },
        ],
      })
    })
    transform.write(
      '127.0.0.1 - - [Wed, 07 July 2020 16:42:00 GMT] "GET /index.html HTTP/1.1" 200 256'
    )
  })
})

describe('CLF Log containing an invalid Date', () => {
  it('should not parse the date, but not throw an error', () => {
    let json = undefined
    const transform = new wdym()
    transform.on('readable', function () {
      while ((data = this.read())) {
        json = JSON.parse(data)
      }
      json.should.be.eql({
        log: [
          {
            remoteHost: '127.0.0.1',
            remoteLogName: '-',
            authUser: 'g',
            date: '2020-07-07T16:00:00.000Z',
            request: 'GET /ss.html HTTP/1.1',
            status: 200,
            size: 2326,
          },
        ],
      })
    })
    transform.write(
      '127.0.0.1 - g [Someday July 7, 2020 16:91 GMT] "GET /ss.html HTTP/1.1" 200 2326'
    )
  })
})
