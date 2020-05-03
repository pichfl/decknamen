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

    const name = event.target.elements[0].value;

    await this.state.updatePlayer({
      ...this.state.player,
      name,
    });

    this.user.name = name;
    this.isEditMode = false;
    this.isSaving = false;
  }

  @action
  async toggleLead() {
    return this.state.updatePlayer({
      ...this.state.player,
      lead: !this.state.player.lead,
    });
  }

  @action
  async changeTeam(team) {
    return this.state.updatePlayer({
      ...this.state.player,
      team,
    });
  }

  @action
  async updateUser(data) {
    await this.args.onUpdateUser(this.args.player, data);
  }

  @action
  async kickPlayer(id) {
    const confirmed = window.confirm(
      this.intl.t('LobbyPlayer.action.confirmKick', {
        name: this.state.current.getPlayer(id)?.name,
      })
    );

    if (!confirmed) {
      return;
    }

    await this.state.kickPlayer(id);
  }
}
