import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { CARD_STATES, CARD_TYPES } from 'game/utils/enums';
import { action } from '@ember/object';

export default class GameCardComponent extends Component {
  @service player;

  get state() {
    return this.args.card.state;
  }

  get type() {
    return this.args.card.type;
  }

  get isCovered() {
    return this.args.card.state === CARD_STATES.COVERED;
  }

  get isUncovered() {
    return this.args.card.state === CARD_STATES.UNCOVERED;
  }

  get isDisabled() {
    if (this.player.isLead && this.args.card.selected === false) {
      return true;
    }

    if (this.args.card.state === CARD_STATES.UNCOVERED) {
      return true;
    }

    return false;
  }

  get isSelected() {
    return this.args.card.selected;
  }

  get isHighlighted() {
    if (this.args.card.state === CARD_STATES.COVERED) {
      if (this.isSelected) {
        return true;
      }
    }

    return false;
  }

  get typeBackground() {
    switch (this.type) {
      case CARD_TYPES.TEAM_A:
        return 'bg-red-700';
      case CARD_TYPES.TEAM_B:
        return 'bg-blue-700';
      case CARD_TYPES.BYSTANDER:
        return 'bg-gray-700';
      case CARD_TYPES.ABORT:
      default:
        return 'bg-black';
    }
  }

  get typeBorder() {
    switch (this.type) {
      case CARD_TYPES.TEAM_A:
        return 'border-red-600';
      case CARD_TYPES.TEAM_B:
        return 'border-blue-600';
      case CARD_TYPES.BYSTANDER:
        return 'border-gray-600';
      case CARD_TYPES.ABORT:
      default:
        return 'border-black';
    }
  }

  get leadClasses() {
    return `${this.typeBackground} ${this.typeBorder}`;
  }

  @action
  onClick(event) {
    event.preventDefault();

    if (this.player.isLead) {
      this.args.onChange({
        ...this.args.card,
        state: this.args.card.state === CARD_STATES.COVERED ? CARD_STATES.UNCOVERED : CARD_STATES.COVERED,
        selected: false,
      });

      return;
    }

    if (this.args.card.state === CARD_STATES.COVERED) {
      this.args.onChange({
        ...this.args.card,
        selected: !this.isSelected,
      });
    }

    console.log(this.args.card.state);
  }
}
