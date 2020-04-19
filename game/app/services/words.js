import Service from '@ember/service';
import { camelize } from '@ember/string';
import { tracked } from '@glimmer/tracking';
import fetch from 'fetch';

export default class WordsService extends Service {
  @tracked list = [];

  async load() {
    const response = await fetch('/words.json');
    const json = await response.json();

    this.list = Object.keys(json).map((title) => ({
      id: camelize(title),
      title,
      list: json[title],
      plain: json[title]
        .map((word) =>
          word
            .toLowerCase()
            .split(' ')
            .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)
            .join()
        )
        .join(', '),
    }));
  }

  get byId() {
    return this.list.reduce(
      (acc, list) => ({
        ...acc,
        [list.id]: {
          ...list,
        },
      }),
      {}
    );
  }
}
