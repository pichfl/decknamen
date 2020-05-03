import Service from '@ember/service';

export default class ConfettiService extends Service {
  _promise = null;
  running = false;

  async load() {
    if (!this._promise) {
      this._promise = import('canvas-confetti').then(
        (module) => module.default
      );
    }

    return this._promise;
  }

  async fire(options) {
    let fire = await this.load();

    fire(options);
  }

  async reset() {
    let confetti = await this.load();

    confetti.reset();
  }
}
