'use strict'

const { Transform } = require('stream')

class WDYM extends Transform {

    constructor(...args) {
        super(...args)
    }

    /**
     * transforms input stream in Common Log Format into useful JSON
     * @param {Object} chunk - the input stream of data
     * @param {String} encoding - data encoding
     * @param {Function} callback 
     */
    _transform(chunk, encoding, callback) {
        const self = this
        const input = chunk.toString()
        input.split(/\n/).forEach((line) => {
            const re = /([^ ]*) ([^ ]*) ([^ ]*) \[([^\]]*)\] "([^"]*)" ([^ ]*) ([^ ]*)/
            const matches = line.match(re)
            if (matches) {
                const log = {
                    remoteHost: matches[1],
                    remoteLogName: matches[2],
                    authUser: matches[3],
                    date: new Date(matches[4]),
                    request: matches[5],
                    status: Number(matches[6]),
                    bytes: Number(matches[7]) || 0
                }
                self.push(JSON.stringify(log))
            }
        })
        callback()
    }
}

module.exports = WDYM