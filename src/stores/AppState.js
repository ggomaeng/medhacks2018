import { observable, action } from 'mobx';
import axios from 'axios';
import users from './users';

const { Wit, log } = require('node-wit');

require('dotenv').config();
const client = new Wit({
  accessToken: 'ISLAJPXHMGA7LNJGYZPPYRKEDM3WEXSX'
  // logger: new log.Logger(log.DEBUG) // optional
});

export const INTENT_TYPES = {
  INTENT_DESCRIPTION: 'description',
  INTENT_SYMPTOMS: 'symptoms',
  INTENT_DIAGNOSIS: 'diagnosis',
  INTENT_PRESCRIPTION: 'prescription',
  INTENT_PRESCRIPTION_PICK_UP: 'prescription_pickup',
  INTENT_QUERY_HISTORY: 'query_history',
  INTENT_RECALL_HISTORY: 'recall_history'
};

export const PAGE_TYPES = [];

export default class AppState {
  @observable
  currentIndex;

  @observable
  muted;

  @observable
  words;

  @observable
  finalTranscript;

  @observable
  columns;

  @observable
  pages;

  @observable
  currentUser;

  constructor() {
    this.currentIndex = 0;
    this.muted = true;
    this.showPatientHistory = false;
    this.words = [];
    this.finalTranscript = '';
    this.currentUser = users.Jisoo;
    //data
    this.columns = {
      [INTENT_TYPES.INTENT_DESCRIPTION]: [{ id: 'hello', text: 'hello' }],
      [INTENT_TYPES.INTENT_SYMPTOMS]: [{ id: 'hi', text: 'hi' }]
    };

    this.pages = {
      0: {
        page: 0,
        name: 'Profile',
        data: [0, 1, 2, 3],
        backgroundColor: '#008dcd',
        icon: require('../images/icons8-user_group_man_woman.png')
      },
      1: {
        page: 1,
        data: [],
        name: 'Symptoms',
        backgroundColor: '#ef5350',
        icon: require('../images/icons8-bandage.png')
      },
      2: {
        page: 2,
        data: [],
        name: 'Prescription',
        backgroundColor: '#4CAF50',
        icon: require('../images/icons8-pill.png')
      },
      3: {
        page: 3,
        data: [],
        name: 'Appointments',
        backgroundColor: '#7E57C2',
        icon: require('../images/icons8-calendar.png')
      }
    };
  }

  @action
  setIndex(i) {
    this.currentIndex = i;
  }

  columnsHaveItem() {
    let hasItem = false;
    Object.keys(this.columns).map(c => {
      if (this.columns[c].length > 0) {
        hasItem = true;
      }
    });

    return hasItem;
  }

  @action
  addWord(word) {
    console.log('adding word', word);
    this.words.push(word);
  }

  @action
  addWord(columnNum, word) {
    // this.columns[1].text = word;
    this.columns[columnNum].push({ text: word });
  }

  @action
  setFinalTranscript(finalTranscript) {
    if (this.muted) {
      console.log("muted, shouldn't listen");
      return;
    }

    console.log('final transcript', finalTranscript);
    // this.addWord(1, finalTranscript);
    this.finalTranscript = finalTranscript;
    if (finalTranscript.length > 0 && finalTranscript.length < 280) {
      // this.sendToWit(finalTranscript);
    }
  }

  @action
  addColumnItem(columnNum, item) {
    this.columns[columnNum].push(item);
  }

  @action
  toggleMic() {
    this.finalTranscript = '';
    this.muted = !this.muted;
    console.log('muted', this.muted);
  }

  @action
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
              case INTENT_TYPES.INTENT_SYMPTOMS:
                console.log('symptoms!!!');
                console.log(entities.symptom[INTENT_SYMPTOMS].value);
                this.addWord(1, entities.symptom[0].value);
                console.log(JSON.stringify(this.columns[INTENT_SYMPTOMS]));
                break;
            }
          }
        }
      })
      .catch(console.error);
  }
}
