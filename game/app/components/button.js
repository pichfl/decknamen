import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ButtonComponent extends Component {
  @tracked _isLoading = false;

  get isLoading() {
    return this.args.isLoading || this._isLoading;
  }

  @action
  async onClick(event) {
    if (this.args.type === 'submit') {
      return;
    }

    event.preventDefault();

    this._isLoading = true;

    await this.args.onClick?.(event);

    this._isLoading = false;
  }
}
