import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class GameTallyComponent extends Component {
  @service user;
  @service socket;
}
