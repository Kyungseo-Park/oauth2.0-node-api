'use strict';

const mailWorker = require('..');
const assert = require('assert').strict;

assert.strictEqual(mailWorker(), 'Hello from mailWorker');
console.info('mailWorker tests passed');
