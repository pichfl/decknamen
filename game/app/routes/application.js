import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service intl;
  @service user;
  @service words;

  async beforeModel() {
    this.user.restore();

    await this.intl.setLocale('en-us');
    await this.words.load();
  }
}
