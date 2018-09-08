import React, { Component } from 'react';
import CardItem from './CardItem';

export default class CardList extends Component {
  renderCards() {
    const {data} = this.props;
    return data.map((item, index) => {
      return (
        <CardItem key={index} text={this.props.data.text}/>

      )
    })
  }
  render() {
    console.log(this.props);
    // return <div>{JSON.stringify(this.props.data)}</div>;
    return (
      <div>
        // <CardItem text={this.props.data.text}/>;
        {this.renderCards()}
      </div>
    )
  }
}
