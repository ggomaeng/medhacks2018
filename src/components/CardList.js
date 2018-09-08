import React, { Component } from 'react';
import CardItem from './CardItem';
import {observer, inject} from 'mobx-react'

@inject('store')
@observer
export default class CardList extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store.appState;
  }

  renderCards() {
    const {column} = this.props;
    const data = this.store.columns[column];
    console.log("DATA:", data);
    return data.map((item, index) => {
      return (
        <CardItem key={index} data={item}/>
      )
    })
  }
  render() {
    console.log(this.props);
    // return <div>{JSON.stringify(this.props.data)}</div>;
    return (
      <div>
        {this.renderCards()}
      </div>
    )
  }
}
