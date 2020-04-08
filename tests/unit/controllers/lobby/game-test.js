import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | lobby/game', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:lobby/game');
    assert.ok(controller);
  });
});
