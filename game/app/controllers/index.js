import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { customAlphabet } from 'nanoid';
import { sample, uniq } from 'lodash-es';

const alphabet = '2346789abcdefghijkmnpqrtwxyz';
const idLong = customAlphabet(alphabet, 12);
const idShort = customAlphabet(alphabet, 4);

export default class IndexController extends Controller {
  @service words;

  get randomToken() {
    const original = this.words.byId?.['english(Original)']?.list ?? [];
    const duet = this.words.byId?.['english(Duet)']?.list ?? [];
    const wordlist = uniq([...original, ...duet]).map((word) =>
      word.replace(/\s/gi, '')
    );

    if (wordlist.length === 0) {
      return idLong();
    }

    return `${sample(wordlist)}-${sample(wordlist)}-${idShort()}`.toLowerCase();
  }

  @action
  startGame(event) {
    event.preventDefault();

    this.transitionToRoute('game');
  }
}
