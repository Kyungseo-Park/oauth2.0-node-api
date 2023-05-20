'use strict';

const resourceServer = require('..');
const assert = require('assert').strict;

assert.strictEqual(resourceServer(), 'Hello from resourceServer');
console.info('resourceServer tests passed');
