import React, { Component } from 'react';

export default class CardList extends Component {
  render() {
    console.log(this.props);
    return <div>{JSON.stringify(this.props.data)}</div>;
  }
}
