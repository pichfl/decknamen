import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import { CARD_TYPES, CARD_STATES } from 'game/utils/enums';
import styles from 'game/styles/game/over';

const { TEAM_A, TEAM_B, BYSTANDER, ABORT } = CARD_TYPES;
const { COVERED } = CARD_STATES;

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

  get stats() {
    const { teamA, teamB, fail, bystander } = this.socket.cards.reduce(
      (acc, card) => {
        if (card.type === TEAM_A) {
          acc.teamA.push(card);
        }

        if (card.type === TEAM_B) {
          acc.teamB.push(card);
        }

        if (card.type === BYSTANDER) {
          acc.bystander.push(card);
        }

        if (card.type === ABORT) {
          acc.fail.push(card);
        }

        return acc;
      },
      {
        teamA: [],
        teamB: [],
        fail: [],
        bystander: [],
      }
    );

    return [
      {
        translation: 'gameOver.text.statsTeamA',
        cards: teamA,
        localClass: styles['team-a'],
      },
      {
        translation: 'gameOver.text.statsTeamB',
        cards: teamB,
        localClass: styles['team-b'],
      },
      {
        translation: 'gameOver.text.statsBystander',
        cards: bystander,
        localClass: styles['bystander'],
      },
      {
        translation: 'gameOver.text.statsFail',
        cards: fail,
        localClass: styles['fail'],
      },
    ];
  }

  @action
  doExit() {
    this.socket.exit();
  }

  @action
  doReset() {
    this.socket.reset();
  }

  @action
  undo() {
    const cards = this.socket.cards;
    const abort = cards.find((card) => card.type === 3);

    abort.state = 0;

    cards.forEach((card) => {
      card.state = COVERED;
    });

    this.socket.syncTask.perform({
      cards,
      over: false,
    });
  }
}
