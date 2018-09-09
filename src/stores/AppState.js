import { observable, action } from 'mobx';
import axios from 'axios';
import users from './users';
import scrollToComponent from 'react-scroll-to-component';
import SideBar from '../components/SideBar';
import moment from 'moment';

const { Wit, log } = require('node-wit');

require('dotenv').config();
const client = new Wit({
  accessToken: '54HLNGDHR66JXEQJR2P2V2GQ2WFT3D6S'
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
  INTENT_APPOINTMENTS: 'appointment'
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

  @observable
  appointments;

  sideBarScrollTo;

  lastScrollTo;

  constructor() {
    this.lastScrollTo = null;
    this.sideBarScrollTo = null;
    this.currentIndex = 0;
    this.muted = true;
    this.showPatientHistory = false;
    this.words = [];
    this.finalTranscript = '';
    this.currentUser = users.Jisoo;
    this.appointments = this.currentUser.appointments;
    //data
    this.columns = {
      [INTENT_TYPES.INTENT_DESCRIPTION]: [{ id: 'hello', text: 'hello' }],
      [INTENT_TYPES.INTENT_SYMPTOMS]: [{ id: 'hi', text: 'hi' }],
      [INTENT_TYPES.INTENT_APPOINTMENTS]: [{ id: 'appo', text: 'appo' }],
      [INTENT_TYPES.INTENT_PRESCRIPTION]: [
        { id: 'presc', text: 'medication_dose' }
      ]
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
        data: users.Jisoo.appointments,
        name: 'Appointments',
        // backgroundColor: '#4CAF50',
        backgroundColor: '#7E57C2',
        icon: require('../images/icons8-calendar.png')
      },
      3: {
        page: 3,
        data: [],
        name: 'Assessment',
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
  deleteItem(page, index) {
    this.pages[page].data.splice(index, 1);
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
    this.columns[columnNum].push({ text: medicine + '-' + dose + unit });
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
    if (finalTranscript.length > 15 && finalTranscript.length < 280) {
      if (
        finalTranscript.indexOf('probable') != -1 ||
        finalTranscript.indexOf('diagnosis') != -1 ||
        finalTranscript.indexOf('hypertension') != -1
      ) {
        this.pages[3].data.push(finalTranscript);
      }
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
      this.sideBarScrollTo('allergies');
    } else if (
      keyword.indexOf('prescription') != -1 ||
      keyword.indexOf('medication') != -1
    ) {
      this.currentIndex = 1;
      this.sideBarScrollTo('medication');
    } else if (keyword.indexOf('appointment') != -1) {
      this.currentIndex = 2;
    } else if (keyword.indexOf('probable') != -1) {
      this.currentIndex = 3;
    }

    if (keyword.indexOf('allerg') != -1) {
      this.sideBarScrollTo('allergies');
      this.lastScrollTo = 'allergies';
    } else if (
      keyword.indexOf('surg') != -1 ||
      keyword.indexOf('medical') != -1
    ) {
      this.sideBarScrollTo('surgical');
      this.lastScrollTo = 'surgical';
    } else if (keyword.indexOf('history') != -1) {
      this.sideBarScrollTo('shistory');
      this.lastScrollTo = 'shistory';
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
  addAppointment(date) {
    console.log('adding appointment', date);
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
          const intent_confidence =
            entities && entities.intent && entities.intent[0].confidence;
          if (intent_confidence < 0.9) {
            console.log('confidence too low', intent_confidence);
            return;
          }
          console.log('confidence is good ', intent_confidence);
          if (intent_type) {
            switch (intent_type) {
              case INTENT_TYPES.INTENT_SYMPTOMS:
                console.log('symptoms!!!');
                console.log(JSON.stringify(entities.symptom));
                this.pages[0].data.push({ timestamp: moment(), entities });
                this.currentIndex = 0;
                break;
              case INTENT_TYPES.INTENT_PRESCRIPTION:
                console.log('prescription!!!');
                console.log(JSON.stringify(entities.prescription));
                if (entities.direction) {
                  this.pages[1].data.push({
                    timestamp: moment(),
                    entities: entities.direction[0].entities
                  });
                } else {
                  this.pages[1].data.push({
                    timestamp: moment(),
                    entities
                  });
                }
                this.currentIndex = 1;
                break;
              case INTENT_TYPES.INTENT_APPOINTMENTS:
                console.log('appointments!!!');
                const date =
                  entities.datetime &&
                  entities.datetime[0] &&
                  entities.datetime[0].value;
                const yearstamp = moment(date).format('YYYY-MM-DD');
                const time = moment(date).format('hh:mm a');

                this.pages[2].data.push({ yearstamp, time });

                console.log('added a new appointment');
                this.currentIndex = 2;
                break;
            }
          }
        }
      })
      .catch(console.error);
  }
}
