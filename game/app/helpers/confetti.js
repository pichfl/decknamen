import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class Confetti extends Helper {
  @service confetti;

  colors;

  compute([colors]) {
    let last = 0;

    this.confetti.running = true;

    const render = (now) => {
      if (!this.confetti.running) {
        return;
      }

      if (now - last >= 2000) {
        last = now;

        this.fire(colors);
      }

      this.token = requestAnimationFrame(render);
    };

    render();
  }

  fire(colors = ['#203864', '#8faadc', '#d1dbed']) {
    this.confetti.fire({
      particleCount: colors.count,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
      disableForReducedMotion: true,
    });

    this.confetti.fire({
      particleCount: colors.count,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
      disableForReducedMotion: true,
    });
  }

  willDestroy() {
    this.confetti.running = false;
    this.confetti.reset();

    if (this.token) {
      window.cancelAnimationFrame(this.token);
    }
  }
}
