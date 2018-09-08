import React, { Component } from 'react';
import { Route, Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import LazyRoute from 'lazy-route';
import DevTools from 'mobx-react-devtools';
import styled, { keyframes } from 'styled-components';
import FlexView from 'react-flexview';
import withSizes from 'react-sizes';

import TopBar from './TopBar';
import Speech from './Speech';
import SoundVisualizer from './SoundVisualizer';
import CardItem from './CardItem';
import CardList from './CardList';

import mic_on from '../images/icons8-microphone.png';
import mic_off from '../images/icons8-block_microphone.png';

@withRouter
@withSizes(({ width, height }) => ({ width, height }))
@inject('store')
@observer
export default class App extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store.appState;
  }
  componentDidMount() {
    this.authenticate();
  }
  authenticate(e) {
    if (e) e.preventDefault();
  }
  renderWords() {
    const { finalTranscript, muted } = this.store;
    const fadeInUp = keyframes`
   0% {
	top: 3rem;
    opacity: 0;
  }

  100% {
    opacity: 1;
	top: 0rem;
  }
`;
    const FadeInUp = styled.div`
      height: 48px;
      animation: ${fadeInUp} 1s linear forwards;
      font-size: 1.8rem;
      color: ${muted ? 'gray' : '#008dcd'};
      font-family: 'Lato', sans-serif;
    `;

    let content;

    if (muted) {
      content = 'Muted';
    } else {
      content = finalTranscript
        ? finalTranscript[0].toUpperCase() + finalTranscript.substring(1)
        : '  ';
    }

    return <FadeInUp>{content}</FadeInUp>;
  }

  renderCardItems() {
    const { columns } = this.store;
    return (
      <div>
        <CardList data={columns[1]} />
      </div>
    );
  }

  renderMic() {
    const { muted } = this.store;
    const mutedStyle = muted
      ? { width: 46, height: 46, marginLeft: 6, marginBottom: 4 }
      : { width: 48, height: 48 };
    return (
      <div
        onClick={() => this.store.toggleMic()}
        style={{ position: 'absolute', bottom: 0 }}
      >
        <img src={muted ? mic_off : mic_on} style={mutedStyle} />
      </div>
    );
  }

  render() {
    const { width, height } = this.props;
    const { muted } = this.store;
    return (
      <div className="wrapper">
        <Speech />
        <FlexView column style={{ width, height }}>
          <FlexView
            grow={1}
            vAlignContent={'center'}
            hAlignContent={'center'}
            style={{ backgroundColor: 'white', position: 'relative' }}
          >
            {!muted && <SoundVisualizer />}
            {this.renderWords()}
            {this.renderMic()}
          </FlexView>
          <FlexView grow={3} style={{ backgroundColor: '#008dcd' }}>
            {this.renderCardItems()}
          </FlexView>
        </FlexView>
      </div>
    );
  }
}
