import React, { Component } from 'react';
import CardItem from './CardItem';
import { observer, inject } from 'mobx-react';
import FlexView from 'react-flexview/lib';

@inject('store')
@observer
export default class CardList extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store.appState;
  }

  renderCards() {
    const { data } = this.props;
    console.log('DATA:', data);
    return data.map((item, index) => {
      return <CardItem key={index} data={item} />;
    });
  }
  render() {
    console.log(this.props);
    // return <div>{JSON.stringify(this.props.data)}</div>;
    return <FlexView vAlignContent={'center'}>{this.renderCards()}</FlexView>;
  }
}
