import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';

export default class Confetti extends Helper {
  @service confetti;

  colors;

  compute([colors]) {
    if (this.confetti.running) {
      return;
    }

    this.confetti.running = true;
    this.fire(colors);
  }

  async fire(
    colors = ['#203864', '#8faadc', '#d1dbed'],
    particles = 17 + Math.ceil(Math.random() * 7)
  ) {
    if (!this.confetti.running) {
      return;
    }

    this.confetti.fire({
      particleCount: colors.length * particles,
      angle: 60,
      spread: 60,
      origin: { x: 0 },
      colors: colors,
      startVelocity: 60,
      disableForReducedMotion: true,
    });

    this.confetti.fire({
      particleCount: colors.length * particles,
      angle: 120,
      spread: 60,
      origin: { x: 1 },
      colors: colors,
      startVelocity: 60,
      disableForReducedMotion: true,
    });

    later(() => {
      this.fire(colors);
    }, 2000);
  }

  willDestroy() {
    this.confetti.running = false;
    this.confetti.reset();
    // if (this.token) {
    //   window.cancelAnimationFrame(this.token);
    // }
  }
}
