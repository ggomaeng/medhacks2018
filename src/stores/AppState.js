import { observable, action } from 'mobx';
import axios from 'axios';

export default class AppState {
  @observable
  words;

  @observable
  finalTranscript;

  constructor() {
    this.words = [];
    this.finalTranscript = '';
  }

  @action
  addWord(word) {
    console.log('adding word', word);
    this.words = this.words.concat(word);
  }

  @action
  setFinalTranscript(finalTranscript) {
    this.finalTranscript = finalTranscript;
  }
}
