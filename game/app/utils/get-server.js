import ENV from 'game/config/environment';

export default function getServer() {
  if (ENV.APP.server === ':3000') {
    return `${window.location.origin
      .replace(window.location.port, '')
      .replace(/:$/, '')}:3000`;
  }

  return ENV.APP.server;
}
