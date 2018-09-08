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
      2: [{ id: 'hi', text: 'hi'}]
    };
  }

  @action
  addWord(word) {
    console.log('adding word', word);
    this.words.push(word);
  }

  @action
  addWord(columnNum, word) {
    // this.columns[1].text = word;
    this.columns[columnNum].push({text: word});
  }

  @action
  setFinalTranscript(finalTranscript) {
    console.log('final transcript', finalTranscript);
    // this.columns[1].text = finalTranscript;
    this.addWord(1, finalTranscript);
    this.finalTranscript = finalTranscript;
  }

  @action
  addColumnItem(columnNum, item) {
    this.columns[columnNum].push(item);
  }


}
