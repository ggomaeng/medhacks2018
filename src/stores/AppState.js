import { observable, action } from 'mobx';
import axios from 'axios';
import users from './users';
import scrollToComponent from 'react-scroll-to-component';
import SideBar from '../components/SideBar';

const { Wit, log } = require('node-wit');

require('dotenv').config();
const client = new Wit({
  accessToken: 'S7FKE2WDXYUC64ZGJINH4TSWM2ZGOV5G'
  // logger: new log.Logger(log.DEBUG) // optional
});

export const INTENT_TYPES = {
  INTENT_DESCRIPTION: 'description',
  INTENT_SYMPTOMS: 'symptoms',
  INTENT_DIAGNOSIS: 'diagnosis',
  INTENT_PRESCRIPTION: 'prescription',
  INTENT_PRESCRIPTION_PICK_UP: 'prescription_pickup',
  INTENT_QUERY_HISTORY: 'query_history',
  INTENT_RECALL_HISTORY: 'recall_history',
  INTENT_APPOINTMENTS: 'appointments'
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

  sideBarScrollTo;

  constructor() {
    this.sideBarScrollTo = null;
    this.currentIndex = 0;
    this.muted = true;
    this.showPatientHistory = false;
    this.words = [];
    this.finalTranscript = '';
    this.currentUser = users.Jisoo;
    //data
    this.columns = {
      [INTENT_TYPES.INTENT_DESCRIPTION]: [{ id: 'hello', text: 'hello' }],
      [INTENT_TYPES.INTENT_SYMPTOMS]: [{ id: 'hi', text: 'hi' }],
      [INTENT_TYPES.INTENT_APPOINTMENTS]: [{ id: 'appo', text: 'appo' }],
      [INTENT_TYPES.INTENT_PRESCRIPTION]: [{ id: 'presc', text: 'medication_dose' }]
    };

    this.pages = {
      0: {
        page: 0,
        data: [],
        name: 'Symptoms',
        backgroundColor: '#008dcd',
        icon: require('../images/icons8-bandage.png')
      },
      1: {
        page: 1,
        data: [],
        name: 'Prescription',
        backgroundColor: '#ef5350',
        // backgroundColor: '#4CAF50',
        icon: require('../images/icons8-pill.png')
      },
      2: {
        page: 2,
        data: [],
        name: 'Appointments',
        // backgroundColor: '#4CAF50',
        backgroundColor: '#7E57C2',
        icon: require('../images/icons8-calendar.png')
      },
      3: {
        page: 3,
        data: [],
        name: 'Summary',
        backgroundColor: '#4CAF50',
        // backgroundColor: '#7E57C2',
        icon: require('../images/icons8-test_partial_passed.png')
      }
    };
  }

  setSideBarScrollTo(scrollTo) {
    this.sideBarScrollTo = scrollTo;
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
  addPrescription(columnNum, medicine, dose, unit) {
    this.columns[columnNum].push({ text: medicine + '-' + dose + unit});
  }

  @action
  setFinalTranscript(finalTranscript) {
    if (this.muted) {
      console.log("muted, shouldn't listen");
      return;
    }

    this.changePage(finalTranscript);

    console.log('final transcript', finalTranscript);
    // this.addWord(1, finalTranscript);
    this.finalTranscript = finalTranscript;
    if (finalTranscript.length > 0 && finalTranscript.length < 280) {
      this.sendToWit(finalTranscript);
    }
  }

  @action
  changePage(keyword) {
    if (this.muted) return;
    if (keyword.indexOf('profile') != -1) {
      this.currentIndex = 0;
    } else if (keyword.indexOf('symptoms') != -1) {
      this.currentIndex = 0;
    } else if (
      keyword.indexOf('prescription') != -1 ||
      keyword.indexOf('medication') != -1
    ) {
      this.sideBarScrollTo('medication');
      this.currentIndex = 1;
    } else if (keyword.indexOf('appointment') != -1) {
      this.currentIndex = 2;
    } else if (keyword.indexOf('summary') != -1) {
      this.currentIndex = 3;
    }

    if (keyword.indexOf('allerg') != -1) {
      this.sideBarScrollTo('allergies');
    } else if (keyword.indexOf('surg') != -1 || keyword.indexOf('medi') != -1) {
      this.sideBarScrollTo('surgical');
    } else if (keyword.indexOf('history') != -1) {
      this.sideBarScrollTo('shistory');
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
                console.log(JSON.stringify(entities.symptom));
                let symptoms = entities.diagnosis.map(s => {
                    return this.addWord(INTENT_TYPES.INTENT_SYMPTOMS, s.value);;
                });
                // this.addWord(INTENT_TYPES.INTENT_SYMPTOMS, entities.symptom[0].value);
                console.log(JSON.stringify(this.columns[INTENT_TYPES.INTENT_SYMPTOMS]));
                break;
              case INTENT_TYPES.INTENT_PRESCRIPTION:
                console.log('prescription!!!');
                console.log(JSON.stringify(entities.prescription));
                let prescriptions = entities.direction.map(p => {
                    return this.addPrescription(INTENT_TYPES.INTENT_PRESCRIPTION, p.entities.medicine, p.entities.number, p.entities.unit);
                });
                // this.addWord(INTENT_TYPES.INTENT_SYMPTOMS, entities.symptom[0].value);
                console.log(JSON.stringify(this.columns[INTENT_TYPES.INTENT_PRESCRIPTION]));
                break;
              case INTENT_TYPES.INTENT_APPOINTMENTS:
                console.log('appointments!!!');
                console.log(entities.datetime[0].value);
                this.addWord(INTENT_TYPES.INTENT_APPOINTMENTS, entities.datetime[0].value);
                console.log(JSON.stringify(this.columns[INTENT_TYPES.INTENT_APPOINTMENTS]));
                break;
            }
          }
        }
      })
      .catch(console.error);
  }
}
