import React, { Component } from 'react';
import styled from 'styled-components';

export default class CardItem extends Component {
  render() {
    const { data } = this.props;

    const CardView = styled.div`
      width: 300px;
      height: 300px;
      padding: 24px;
      background: white;
      margin: 16px;
      border-radius: 16px;
    `;

    return (
      <CardView>
        <p>{data.text}</p>
      </CardView>
    );
  }
}
