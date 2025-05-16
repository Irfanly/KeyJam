const assert = require('assert');
const app = require('../../src/app');

describe('\'chordSheets\' service', () => {
  it('registered the service', () => {
    const service = app.service('chordSheets');

    assert.ok(service, 'Registered the service (chordSheets)');
  });
});
