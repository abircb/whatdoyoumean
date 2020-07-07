![npm](https://img.shields.io/npm/v/wdym)
[![Build Status](https://travis-ci.com/abircb/wdym.svg?token=kBvypWapbvpPYcC9Jrdw&branch=master)](https://travis-ci.com/abircb/wdym)

# wdym

Convert [Common Log Format](https://httpd.apache.org/docs/1.3/logs.html#common) to more useful (and human-readable) JSON. Especially handy when analysing server log files for activity and performance.

For example, standard log input such as

```txt
125.0.0.1 identifier tara [Tue, 7 July 2020 16:24:02 GMT] "GET /examp_alt.png HTTP/1.0" 200 10801
```

would be converted to

```json
{
  "log": [
    {
      "remoteHost": "125.0.0.1",
      "remoteLogName": "identifier",
      "authUser": "tara",
      "date": "2020-07-07T16:24:02.000Z",
      "request": "GET /examp_alt.png HTTP/1.0",
      "status": 200,
      "size": 10801
    }
  ]
}
```

## Installation

```cli
$ npm install -g wdym
```

## Usage

### Command Line Executable

```cli
$ wdym web-log.txt --write
```

writes to an output file `output.json`. Remove the `--write` argument to write to `stdout`.

### Piped Input

```cli
$ cat web-log.txt | wdym
```

writes JSON output to `stdout`.

### Node.js Library

```js
const wdym = require('wdym')
const { pipeline } = require('stream') // API: https://nodejs.org/api/stream.html#stream_stream_pipeline_source_transforms_destination_callback

pipeline(source, new wdym(), destination, (err) => {
  if (err) {
    console.error('Pipeline failed.', err)
  } else {
    console.log('Pipeline succeeded.')
  }
}
```