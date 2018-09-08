import React, { Component } from 'react';
import FlexView from 'react-flexview/lib';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import GEICO from '../images/640px-Geico_logo.svg.png';

@inject('store')
@observer
export default class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store.appState;
  }
  renderProfileImage() {
    const { currentUser } = this.store;
    const Profile = styled.img`
      width: 96px;
      height: 96px;
      border-radius: 48px;
    `;
    const H1 = styled.h1`
      color: black;
      font-family: 'Lato', sans-serif;
    `;
    const P = styled.p`
      font-family: 'Lato', sans-serif;
      margin-right: 4px;
    `;

    const GeicoImg = styled.img`
      width: 160px;
      height: 100px;
      object-fit: contain;
    `;

    return (
      <FlexView column hAlignContent="left" style={{ padding: 16 }}>
        <FlexView column>
          <H1>{currentUser.name}</H1>
          <P>{currentUser.gender}</P>
          <P>DOB: {currentUser.DOB}</P>
        </FlexView>
        <GeicoImg src={GEICO} />
      </FlexView>
    );
  }
  render() {
    return <FlexView grow={1}>{this.renderProfileImage()}</FlexView>;
  }
}
