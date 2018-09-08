import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Link, withRouter } from 'react-router-dom';
import _ from 'lodash';

const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';

@inject('store')
@observer
class Speech extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listening: false
    };
    this.toggleListen = this.toggleListen.bind(this);
    this.handleListen = this.handleListen.bind(this);
    this.store = this.props.store.appState;
    this.setFinalTranscript = _.debounce(this.setFinalTranscript, 300);
  }

  componentDidMount() {
    this.setState(
      {
        listening: true
      },
      this.handleListen
    );
  }

  componentWillUnmount() {
    this.setState({ listening: false });
  }

  toggleListen() {
    this.setState(
      {
        listening: !this.state.listening
      },
      this.handleListen
    );
  }

  setFinalTranscript(transcript) {
    this.store.setFinalTranscript(transcript);
  }

  handleListen() {
    console.log('listening?', this.state.listening);

    if (this.state.listening) {
      recognition.start();
      recognition.onend = () => {
        // console.log('...continue listening...');
        recognition.start();
      };
    } else {
      recognition.stop();
      recognition.onend = () => {
        // console.log('Stopped listening per click');
      };
    }

    recognition.onstart = () => {
      console.log('Listening!');
    };

    let finalTranscript = '';
    recognition.onresult = event => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + ' ';
        else interimTranscript += transcript;
      }
      //   document.getElementById('interim').innerHTML = interimTranscript;
      //   document.getElementById('final').innerHTML = finalTranscript;
      this.setFinalTranscript(finalTranscript);
      finalTranscript = '';

      //-------------------------COMMANDS------------------------------------

      const transcriptArr = finalTranscript.split(' ');
      const stopCmd = transcriptArr.slice(-3, -1);
      //   console.log('stopCmd', stopCmd);

      if (stopCmd[0] === 'stop' && stopCmd[1] === 'listening') {
        recognition.stop();
        recognition.onend = () => {
          console.log('Stopped listening per command');
          const finalText = transcriptArr.slice(0, -3).join(' ');
          document.getElementById('final').innerHTML = finalText;
          // make the call here
        };
      }
    };

    //-----------------------------------------------------------------------

    recognition.onerror = event => {
      console.log('Error occurred in recognition: ' + event.error);
    };
  }

  render() {
    return (
      <div>
        {/* <div id="interim" style={interim} /> */}
        {/* <div id="final" style={final} /> */}
      </div>
    );
  }
}

export default Speech;

//-------------------------CSS------------------------------------
