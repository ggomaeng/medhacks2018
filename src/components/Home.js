import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { VoicePlayer, VoiceRecognition } from './react-voice-components/';
import Speech from './Speech';

@inject('store')
@observer
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
  }

  render() {
    const store = this.store;
    return (
      <div className="page home">
        <Speech />
      </div>
    );
  }
}
