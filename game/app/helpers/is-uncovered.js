import { helper } from '@ember/component/helper';
import { CARD_STATES } from 'game/utils/enums';

export default helper(function isUncovered([state]) {
  return state === CARD_STATES.UNCOVERED;
});
