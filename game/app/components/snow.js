import Component from '@ember/component';
import { action } from '@ember/object';
import { later } from '@ember/runloop';

export default class SnowComponent extends Component {
  get width() {
    return window.innerWidth;
  }

  get height() {
    return window.innerHeight;
  }

  @action
  start(canvas) {
    const maxFlakes = 50;
    const maxRadius = 11;
    const vx = 1.5;
    const vy = 1.5;
    const vXmin = 0;
    const vyMin = 0.5;
    const color = '#fff';
    let snowflakes = [];

    while (snowflakes.length < maxFlakes) {
      snowflakes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 1 + Math.random() * (maxRadius - 1),
        a: 0.1 + Math.random() * 0.9,
        vx: vXmin + (Math.random() - 0.5) * vx,
        vy: vyMin + Math.random() * vy,
      });
    }

    const ctx = canvas.getContext('2d');

    ctx.fillStyle = color;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < snowflakes.length; i++) {
        let { x, y, r, a, vx, vy } = snowflakes[i];

        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.globalAlpha = a;
        ctx.fill();

        snowflakes[i].x = x + vx;
        snowflakes[i].y = y + vy;

        if (snowflakes[i].x > canvas.width + r) {
          snowflakes[i].x = -r;
        }

        if (snowflakes[i].x < -r) {
          snowflakes[i].x = canvas.width + r;
        }

        if (snowflakes[i].y > canvas.height + r) {
          snowflakes[i].y = -r;
        }
      }

      later(() => requestAnimationFrame(render), 10);
    };

    render();
  }
}
