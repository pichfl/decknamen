import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { TEAMS } from 'game/utils/enums';
import { action } from '@ember/object';

export default class LobbyPlayerComponent extends Component {
  @service user;
  @service state;
  @service intl;

  @tracked isEditMode = false;
  @tracked isSaving = false;

  TEAMS = TEAMS;

  @action
  async updateUserName(event) {
    event.preventDefault();

    this.isSaving = true;

    await this.args.onUpdateUser(
      this.args.player,
      {
        name: event.target.elements[0].value,
      },
      true
    );

    this.isEditMode = false;
    this.isSaving = false;
  }

  @action
  async updateUser(data) {
    await this.args.onUpdateUser(this.args.player, data);
  }

  @action
  async kickPlayer(id) {
    const confirmed = window.confirm(
      this.intl.t('LobbyPlayer.action.confirmKick', {
        name: this.state.players[id].name,
      })
    );

    if (!confirmed) {
      return;
    }

    await this.state.kickPlayer(id);
  }
}
