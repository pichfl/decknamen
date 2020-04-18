import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';

export default class UiInputComponent extends Component {
  elementId = guidFor(this);

  @action
  onChange(event) {
    this.args.onChange?.(event.target.value);
  }
}
