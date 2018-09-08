import { observable, action } from 'mobx';
import axios from 'axios';

export default class AppState {
  @observable
  words;

  @observable
  finalTranscript;

  @observable
  columns;

  constructor() {
    this.words = [];
    this.finalTranscript = '';
    this.columns = {
      1: [{ id: 'hello', text: 'hello' }],
      2: []
    };
  }

  @action
  addWord(word) {
    console.log('adding word', word);
    this.words.push(word);
  }

  @action
  setFinalTranscript(finalTranscript) {
    this.finalTranscript = finalTranscript;
  }

  @action
  addColumnItem(columnNum, item) {
    this.columns[columnNum].push(item);
  }
}
