const should = require('should')
const wdym = require('../')

describe('CLF Log', () => {
  it('should convert to JSON without error', () => {
    let literals = undefined
    const transform = new wdym()
    transform.on('readable', function () {
      while ((data = this.read())) {
        literals = JSON.parse(data)
      }
      literals.should.be.eql({
        remoteHost: '127.0.0.1',
        remoteLogName: '-',
        authUser: '-',
        date: '2020-07-07T16:42:00.000Z',
        request: 'GET /index.html HTTP/1.1',
        status: 200,
        bytes: 733,
      })
    })
    transform.write(
      '127.0.0.1 - - [Wed, 07 July 2020 16:42:00 GMT] "GET /index.html HTTP/1.1" 200 733 "http://localhost:8000/" "userAgent"'
    )
  })
})
