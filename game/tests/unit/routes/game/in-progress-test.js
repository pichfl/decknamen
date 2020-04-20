import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | game/in-progress', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:game/in-progress');
    assert.ok(route);
  });
});
