import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { TEAMS } from 'game/utils/enums';
import { action } from '@ember/object';

export default class LobbyPlayerComponent extends Component {
  @service user;

  @tracked isEditMode = false;

  TEAMS = TEAMS;

  @action
  async updateUserName(event) {
    event.preventDefault();

    await this.args.onUpdateUser(
      this.args.player,
      {
        name: event.target.children[0].children[0].value,
      },
      true
    );

    this.isEditMode = false;
  }

  @action
  async updateUser(data) {
    await this.args.onUpdateUser(this.args.player, data);
  }
}
