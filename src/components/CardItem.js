import React, { Component } from 'react';
import styled from 'styled-components';

export default class CardItem extends Component {
  render() {
    const { text } = this.props;

    const CardView = styled.div`
      width: 3100px;
      height: 100px;
      background: white;
      margin: 16px;
      border-radius: 16px;
    `;

    return (
      <CardView>
        <p>{text}</p>
      </CardView>
    );
  }
}
