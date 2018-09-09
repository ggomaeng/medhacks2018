import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import styled from 'styled-components';

import moment from 'moment';
import FlexView from 'react-flexview/lib';
import deleteIcon from '../images/icons8-delete_sign.png';
import { Button, PageHeader } from 'react-bootstrap';

@inject('store')
@observer
export default class RealSummaryPage extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store.appState;
  }
  render() {
    const { pages } = this.store;
    if (pages[0].data.length === 0 && pages[1].data.length === 0) {
      return (
        <FlexView
          style={{ width: '100%' }}
          hAlignContent="center"
          vAlignContent="center"
        >
          <p style={{ color: 'white' }}>No data to display</p>
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
      <FlexView column style={{ width: '100%' }}>
        <Button bsStyle="success"> Export to EPIC</Button>
        <PageHeader
          style={{
            fontSize: 12,
            fontWeight: '400',
            color: '#4d4d4d',
            fontFamily: 'Lato'
          }}
        >
          Symptoms
        </PageHeader>
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
        <PageHeader
          style={{
            fontSize: 12,
            fontWeight: '400',
            color: '#4d4d4d',
            fontFamily: 'Lato'
          }}
        >
          Medication
        </PageHeader>
        <ListGroup style={{ width: '100%' }}>
          {pages[1].data.map((d, index) => {
            console.log(JSON.stringify(d));
            const number =
              d.entities.number &&
              d.entities.number.length > 0 &&
              d.entities.number[0].value;
            const unit =
              d.entities.unit &&
              d.entities.unit.length > 0 &&
              d.entities.unit[0].value;
            const medicine =
              d.entities.medicine &&
              d.entities.medicine.length > 0 &&
              d.entities.medicine[0].value;
            if (!number || !unit || !medicine) {
              this.store.deleteItem(1, index);
              return;
            }
            return (
              <CustomListItem className="list-group-item" key={index}>
                <FlexView vAlignContent="center">
                  <img
                    onClick={() => this.store.deleteItem(1, index)}
                    src={deleteIcon}
                    style={{ width: 18, height: 18, marginRight: 8 }}
                  />
                  <h4>{number + unit + ' of ' + medicine}</h4>
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
