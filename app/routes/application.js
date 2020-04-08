import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service intl;
  @service user;

  async beforeModel() {
    super.beforeModel(...arguments);

    this.user.restore();

    await this.intl.setLocale('en-us');
  }

  title(tokens) {
    tokens = Array.isArray(tokens) ? tokens : [tokens];

    tokens.unshift(this.intl.t('application.title'));

    return tokens.reverse().join(' | ');
  }
}
