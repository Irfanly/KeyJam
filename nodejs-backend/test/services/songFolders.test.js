const assert = require('assert');
const app = require('../../src/app');

describe('\'songFolders\' service', () => {
  it('registered the service', () => {
    const service = app.service('songFolders');

    assert.ok(service, 'Registered the service (songFolders)');
  });
});
