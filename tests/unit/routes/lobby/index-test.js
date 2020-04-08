import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | lobby/index', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:lobby/index');
    assert.ok(route);
  });
});
