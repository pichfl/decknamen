import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { CARD_STATES, CARD_TYPES } from 'game/utils/enums';
import { action } from '@ember/object';
import styles from './card.css';

export default class GameCardComponent extends Component {
  @service user;
  @service state;

  get state() {
    return this.args.card.state;
  }

  get type() {
    return this.args.card.type;
  }

  get typeClass() {
    switch (this.args.card.type) {
      case CARD_TYPES.TEAM_A:
        return styles['type-team-a'];
      case CARD_TYPES.TEAM_B:
        return styles['type-team-b'];
      case CARD_TYPES.BYSTANDER:
        return styles['type-bystander'];
      case CARD_TYPES.ABORT:
      default:
        return styles['type-abort'];
    }
  }

  get isCovered() {
    return this.args.card.state === CARD_STATES.COVERED;
  }

  get isUncovered() {
    return this.args.card.state === CARD_STATES.UNCOVERED;
  }

  get isDisabled() {
    if (this.user.team !== this.state.turn) {
      return true;
    }

    if (this.user.isLead && this.args.card.selected === false) {
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
    return `${this.typeBackground} ${
      this.args.card.selected ? 'border-white' : this.typeBorder
    }`;
  }

  @action
  onClick(event) {
    event.preventDefault();

    this.args.onChange(this.args.card);
  }
}
