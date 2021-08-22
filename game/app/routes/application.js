import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'game/config/environment';

export default class ApplicationRoute extends Route {
  @service intl;
  @service user;
  @service words;

  async beforeModel() {
    this.user.restore();

    document.querySelector('.ember-load-indicator').remove();

    await this.loadAndSetLanguage();
    await this.words.load();
  }

  async loadAndSetLanguage() {
    let code = `${window.navigator.language}`.toLowerCase().substr(0, 2);

    if (!Intl.RelativeTimeFormat) {
      await import('@formatjs/intl-relativetimeformat/polyfill');
    }

    if (!ENV.APP.locales.includes(code)) {
      code = ENV.APP.locales[0];
    }

    let translationPath = `translations/${code}.json`;

    if (ENV.environment === 'production') {
      const assetMap = await fetch('/assets/assetMap.json');
      const assetMapJSON = await assetMap.json();

      translationPath = assetMapJSON.assets[translationPath];
    }

    const response = await fetch(`/${translationPath}`);
    const language = await response.json();

    this.intl.addTranslations(code, language);

    await this.intl.setLocale(code);
  }
}
