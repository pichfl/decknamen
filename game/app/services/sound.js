import Service from '@ember/service';
import { Howl } from 'howler';
import { action } from '@ember/object';

export default class SoundService extends Service {
  instance = new Howl({
    src: ['assets/sounds.mp3'],
    sprite: {
      fail: [0, 2000],
      success: [2001, 3000],
    },
    volume: 0.5,
  });

  get volume() {
    return this.instance.volume();
  }

  set volume(volume) {
    this.instance.volume(volume);
  }

  @action
  play(sprite) {
    this.instance.play(sprite);
  }
}
