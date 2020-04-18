import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';

export default class GameOverController extends Controller {
  @service socket;
  @service user;
  @service intl;

  get documentTitle() {
    if (this.socket.winner !== undefined) {
      return this.intl.t('gameOver.title.winner', {
        team: this.intl.t(
          `Teams.${this.socket.winnerTeamA ? 'teamA' : 'teamB'}`
        ),
      });
    }

    return this.intl.t('gameOver.title.failed');
  }

  get pageTitle() {
    if (this.socket.winner !== undefined) {
      return htmlSafe(
        this.intl.t('gameOver.title.winner', {
          team: `<span>${this.intl.t(
            `Teams.${this.socket.winnerTeamA ? 'teamA' : 'teamB'}`
          )}</span>`,
        })
      );
    }

    return this.intl.t('gameOver.title.failed');
  }

  @action
  undo() {
    const cards = this.socket.cards;
    const abort = cards.find((card) => card.type === 3);

    abort.state = 0;

    this.socket.syncTask.perform({
      cards,
      over: false,
    });
  }
}
