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
    if (pages[0].data.length == 0) {
      return (
        <FlexView
          style={{ width: '100%' }}
          hAlignContent="center"
          vAlignContent="center"
        >
          <p style={{ color: 'white' }}>No new symptoms to display</p>
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
          {pages[0].data.map((d, index) => {
            const symptom =
              d &&
              d.entities &&
              d.entities.diagnosis &&
              d.entities.diagnosis.length > 0 &&
              d.entities.diagnosis[0].value;
            if (!symptom) {
              this.store.deleteItem(0, index);
              return;
            }

            return (
              <CustomListItem className="list-group-item" key={index}>
                <FlexView vAlignContent="center">
                  <img
                    onClick={() => this.store.deleteItem(0, index)}
                    src={deleteIcon}
                    style={{ width: 18, height: 18, marginRight: 8 }}
                  />
                  <h4>{symptom[0].toUpperCase() + symptom.substring(1)}</h4>
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
