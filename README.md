[![npm](https://img.shields.io/npm/v/wdym)](https://www.npmjs.com/package/wdym)
[![Build Status](https://travis-ci.com/abircb/wdym.svg?token=kBvypWapbvpPYcC9Jrdw&branch=master)](https://travis-ci.com/abircb/wdym)

# wdym

[API Documentation](https://github.com/abircb/wdym/wiki/API-Documentation)

Convert [Common Log Format](https://httpd.apache.org/docs/1.3/logs.html#common) into more useful (and human-readable) JSON and/or CSV. Especially handy when analysing server log files for activity and performance. 

Can be used both as a command line executable and as a Node.js library.

For example, standard log input such as

```txt
127.0.0.1 tara ss [07/Jul/2020:16:44:36 +0000] "GET /wdym.npm HTTP/1.1" 200 2326
```

would be converted to

```json
{
  "log": [
    {
      "remoteHost": "127.0.0.1",
      "remoteLogName": "tara",
      "authUser": "ss",
      "date": "2020-07-07T16:44:36.000Z",
      "request": "GET /wdym.npm HTTP/1.1",
      "status": 200,
      "size": 2326
    }
  ]
}
```

or

![CSV](github-assets/csv.png)

## Installation

```cli
$ npm install -g wdym
```

## Usage

### Command Line Executable

```cli
$ wdym log.txt --csv --write
```
converts the logs into CSV and writes to an output file `output.csv`. 

Defaults to JSON, remove the `--csv` argument to write to a JSON file. Remove the `--write` argument to write to `stdout`. 

__Example__:
```cli
$ wdym log.txt
```
converts the logs into JSON and prints to `stdout`.

### Piped Input

```cli
$ cat log.txt | wdym --write
```

writes JSON output to `output.json`.

### Node.js Library

```js
const wdymCSV = require('wdym').csv
const { pipeline } = require('stream') // API: https://nodejs.org/api/stream.html#stream_stream_pipeline_source_transforms_destination_callback

pipeline(source, wdymCSV, destination, (err) => {
  if (err) {
    console.error('Pipeline failed.', err)
  } else {
    console.log('Pipeline succeeded.')
  }
}
```

**See also**: [API Documentation](https://github.com/abircb/wdym/wiki/API-Documentation)