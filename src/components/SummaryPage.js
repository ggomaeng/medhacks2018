import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import styled from 'styled-components';

import moment from 'moment';
import FlexView from 'react-flexview/lib';
import deleteIcon from '../images/icons8-delete_sign.png';

@inject('store')
@observer
export default class SymptomsPage extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store.appState;
  }
  render() {
    const { pages } = this.store;
    if (pages[3].data.length == 0) {
      return (
        <FlexView
          style={{ width: '100%' }}
          hAlignContent="center"
          vAlignContent="center"
        >
          <p style={{ color: 'white' }}>No new assessment to display</p>
        </FlexView>
      );
    }

    const CustomListItem = styled.li`
      display: flex;
      flex-grow: 1;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      width: 100%;
    `;

    return (
      <FlexView style={{ width: '100%' }}>
        <ListGroup style={{ width: '100%' }}>
          {pages[3].data.map((d, index) => {
            return (
              <CustomListItem className="list-group-item" key={index}>
                <FlexView vAlignContent="center">
                  <img
                    onClick={() => this.store.deleteItem(3, index)}
                    src={deleteIcon}
                    style={{ width: 18, height: 18, marginRight: 8 }}
                  />
                  <h4>{d}</h4>
                </FlexView>
                <p>{moment(d.timestamp).format('YYYY-MM-DD hh:mm a')}</p>
              </CustomListItem>
            );
          })}
        </ListGroup>
      </FlexView>
    );
  }
}
