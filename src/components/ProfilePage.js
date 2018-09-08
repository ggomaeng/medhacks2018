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
      color: white;
      font-family: 'Lato', sans-serif;
    `;
    const P = styled.p`
      color: white;
      font-family: 'Lato', sans-serif;
      margin-right: 8px;
    `;

    const GeicoImg = styled.img`
      width: 200px;
      height: 100px;
      object-fit: contain;
      margin-left: 24px;
    `;

    return (
      <FlexView>
        <Profile src={currentUser.img} />
        <FlexView column style={{ marginLeft: 16 }}>
          <H1>{currentUser.name}</H1>
          <FlexView grow={1}>
            <P>{currentUser.gender}</P>
            <P>{currentUser.DOB}</P>
          </FlexView>
        </FlexView>
        <GeicoImg src={GEICO} />
      </FlexView>
    );
  }
  render() {
    return <FlexView grow={1}>{this.renderProfileImage()}</FlexView>;
  }
}
