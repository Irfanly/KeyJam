const assert = require('assert');
const app = require('../../src/app');

describe('\'lessons\' service', () => {
  it('registered the service', () => {
    const service = app.service('lessons');

    assert.ok(service, 'Registered the service (lessons)');
  });
});
