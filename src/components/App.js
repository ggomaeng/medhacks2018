import React, { Component } from 'react';
import { Route, Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import LazyRoute from 'lazy-route';
import DevTools from 'mobx-react-devtools';
import styled, { keyframes } from 'styled-components';
import FlexView from 'react-flexview';
import withSizes from 'react-sizes';
import Transition from 'react-transition-group/Transition';
import TopBar from './TopBar';
import Speech from './Speech';
import SoundVisualizer from './SoundVisualizer';
import CardItem from './CardItem';
import CardList from './CardList';
import SideBar from './SideBar';

import mic_on from '../images/icons8-microphone.png';
import mic_off from '../images/icons8-block_microphone.png';
import person from '../images/icons8-user_group_man_woman.png';

import { INTENT_TYPES } from '../stores/AppState';
import ProfilePage from './ProfilePage';
import AppointmentPage from './AppointmentPage';
import SummaryPage from './SummaryPage';
import SymptomsPage from './SymptomsPage';
import MedicationPage from './MedicationPage';

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
    const { currentIndex, pages } = this.store;
    return (
      <FlexView
        grow={1}
        style={{
          backgroundColor: pages[currentIndex].backgroundColor,
          padding: 16
        }}
      >
        {this.renderPage()}
      </FlexView>
    );
  }

  renderPage() {
    const { currentIndex, appointments, pages } = this.store;
    if (currentIndex == 0) {
      return <SymptomsPage />;
    } else if (currentIndex == 1) {
      return <MedicationPage />;
    } else if (currentIndex == 2) {
      return <AppointmentPage />;
    } else if (currentIndex == 3) {
      return <SummaryPage />;
    }
  }

  renderMic() {
    const { muted } = this.store;
    const mutedStyle = muted
      ? { width: 46, height: 46, padding: 8, marginLeft: 6, marginBottom: 4 }
      : { width: 48, height: 48, padding: 8 };
    return (
      <div
        onClick={() => this.store.toggleMic()}
        style={{ position: 'absolute', bottom: 0 }}
      >
        <img src={muted ? mic_off : mic_on} style={mutedStyle} />
      </div>
    );
  }

  renderBottom() {
    if (this.store.columnsHaveItem()) {
      const fadeIn = keyframes`
		0% {
		 opacity: 0;
	   }
	 
	   100% {
		 opacity: 1;
	   }
	 `;
      const AnimatedFlexView = styled.div`
        display: flex;
        flex-grow: 3;
        flex-direction: column;
        ${'' /* animation: ${fadeIn} 1s linear forwards; */};
      `;

      return (
        <AnimatedFlexView>
          {this.renderCardItems()}
          {this.renderFooter()}
        </AnimatedFlexView>
      );
    }
  }

  renderFooter() {
    const { pages, currentIndex } = this.store;
    const Footer = styled.div`
      display: flex;
      flex-direction: 'row';
      align-items: center;
      padding: 16px;
      background: ${pages[currentIndex].backgroundColor};
    `;

    const P = styled.h4`
      color: white;
    `;

    return (
      <Footer style={{ zIndex: 1000 }}>
        {Object.keys(pages).map((i, index) => {
          const Icon = styled.img`
            width: ${index === currentIndex ? '64px' : '48px'};
            height: ${index === currentIndex ? '64px' : '48px'};
            padding: 8px;
            background: white;
            border-radius: 48px;
            margin-right: 16px;
          `;

          return (
            <Icon
              onClick={() => this.store.setIndex(index)}
              key={index}
              src={pages[i].icon}
            />
          );
        })}
        <P>{pages[currentIndex].name}</P>
      </Footer>
    );
  }

  renderSideBar() {
    const { currentIndex } = this.store;
    return <SideBar currentIndex={currentIndex} />;
  }

  render() {
    const { width, height } = this.props;
    const { muted } = this.store;
    return (
      <div className="wrapper">
        <Speech />
        <FlexView style={{ width, height }}>
          <FlexView
            style={{
              width: width / 2,
              backgroundColor: '#f7f7f7'
            }}
          >
            {this.renderSideBar()}
          </FlexView>
          <FlexView column grow={1}>
            <FlexView
              vAlignContent={'center'}
              hAlignContent={'center'}
              style={{
                backgroundColor: 'white',
                position: 'relative',
                height: height / 8,
                width: width / 2,
                overflow: 'hidden'
              }}
            >
              {!muted && <SoundVisualizer />}
              {this.renderWords()}
              {this.renderMic()}
            </FlexView>
            {this.renderBottom()}
          </FlexView>
        </FlexView>
      </div>
    );
  }
}
