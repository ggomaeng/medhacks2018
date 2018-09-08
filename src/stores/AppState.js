import { observable, action } from 'mobx';
import axios from 'axios';

const { Wit, log } = require('node-wit');

require('dotenv').config();
const client = new Wit({
  accessToken: 'ISLAJPXHMGA7LNJGYZPPYRKEDM3WEXSX'
  // logger: new log.Logger(log.DEBUG) // optional
});

const INTENT_DESCRIPTION = 'description';
const INTENT_SYMPTOMS = 'symptoms';
const INTENT_DIAGNOSIS = 'diagnosis';
const INTENT_PRESCRIPTION = 'prescription';
const INTENT_PRESCRIPTION_PICK_UP = 'prescription_pickup';
const INTENT_QUERY_HISTORY = 'query_history';
const INTENT_RECALL_HISTORY = 'recall_history';

export default class AppState {
  @observable
  muted;

  @observable
  words;

  @observable
  finalTranscript;

  @observable
  columns;

  constructor() {
    this.muted = false;
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
    if (this.muted) {
      console.log("muted, shouldn't listen");
      return;
    }
    console.log('final transcript', finalTranscript);
    this.finalTranscript = finalTranscript;
    if (finalTranscript.length > 0 && finalTranscript.length < 280) {
      this.sendToWit(finalTranscript);
    }
  }

  @action
  addColumnItem(columnNum, item) {
    this.columns[columnNum].push(item);
  }

  @action
  toggleMic() {
    this.muted = !this.muted;
    console.log('muted', this.muted);
  }

  sendToWit(message) {
    client
      .message(message, {})
      .then(data => {
        const { entities } = data;
        console.log('DATA', data);
        if (entities) {
          const intent_type =
            entities && entities.intent && entities.intent[0].value;
          if (intent_type) {
            switch (intent_type) {
              case INTENT_SYMPTOMS:
                console.log('symptoms!!!');
                break;
            }
          }
        }
      })
      .catch(console.error);
  }
}
