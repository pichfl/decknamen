import Component from '@glimmer/component';
import { later } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class LayoutConnectionComponent extends Component {
  @tracked showRefresh = false;

  constructor() {
    super(...arguments);

    later(() => {
      this.showRefresh = true;
    }, 15000);
  }

  @action
  forceRefresh() {
    window.location.reload();
  }
}
