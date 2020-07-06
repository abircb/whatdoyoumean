#!/usr/bin/env node

const wdym = require('../')

process.stdin.pipe(wdym().pipe(process.stdout))
