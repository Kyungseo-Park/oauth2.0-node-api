'use strict';

const authServer = require('..');
const assert = require('assert').strict;

assert.strictEqual(authServer(), 'Hello from authServer');
console.info('authServer tests passed');
