import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | lobby/game', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:lobby/game');
    assert.ok(route);
  });
});
